// Security headers validation and testing utilities

interface SecurityHeaderCheck {
  name: string
  header: string
  expectedValue?: string
  required: boolean
  description: string
}

// Define expected security headers
export const SECURITY_HEADERS: SecurityHeaderCheck[] = [
  {
    name: 'X-Frame-Options',
    header: 'x-frame-options',
    expectedValue: 'DENY',
    required: true,
    description: 'Prevents clickjacking attacks'
  },
  {
    name: 'X-Content-Type-Options',
    header: 'x-content-type-options',
    expectedValue: 'nosniff',
    required: true,
    description: 'Prevents MIME type sniffing'
  },
  {
    name: 'X-XSS-Protection',
    header: 'x-xss-protection',
    expectedValue: '1; mode=block',
    required: true,
    description: 'Enables XSS protection in legacy browsers'
  },
  {
    name: 'Referrer-Policy',
    header: 'referrer-policy',
    expectedValue: 'strict-origin-when-cross-origin',
    required: true,
    description: 'Controls referrer information'
  },
  {
    name: 'Content-Security-Policy',
    header: 'content-security-policy',
    required: true,
    description: 'Prevents XSS and injection attacks'
  },
  {
    name: 'Strict-Transport-Security',
    header: 'strict-transport-security',
    required: false, // Only in production HTTPS
    description: 'Enforces HTTPS connections'
  },
  {
    name: 'Permissions-Policy',
    header: 'permissions-policy',
    required: true,
    description: 'Controls browser feature access'
  },
  {
    name: 'Cross-Origin-Embedder-Policy',
    header: 'cross-origin-embedder-policy',
    expectedValue: 'credentialless',
    required: true,
    description: 'Controls cross-origin resource embedding'
  },
  {
    name: 'Cross-Origin-Opener-Policy',
    header: 'cross-origin-opener-policy',
    expectedValue: 'same-origin',
    required: true,
    description: 'Controls cross-origin window access'
  }
]

// Validate security headers from a response
export function validateSecurityHeaders(headers: Headers): {
  passed: SecurityHeaderCheck[]
  failed: SecurityHeaderCheck[]
  warnings: string[]
} {
  const passed: SecurityHeaderCheck[] = []
  const failed: SecurityHeaderCheck[] = []
  const warnings: string[] = []

  SECURITY_HEADERS.forEach(check => {
    const headerValue = headers.get(check.header)
    
    if (!headerValue) {
      if (check.required) {
        failed.push(check)
      } else {
        warnings.push(`Optional header missing: ${check.name}`)
      }
      return
    }

    if (check.expectedValue) {
      let isValid = false
      
      if (check.expectedValue instanceof RegExp) {
        isValid = check.expectedValue.test(headerValue)
      } else if (typeof check.expectedValue === 'function') {
        isValid = check.expectedValue(headerValue)
      } else if (Array.isArray(check.expectedValue)) {
        isValid = check.expectedValue.includes(headerValue)
      } else if (typeof check.expectedValue === 'string') {
        // For complex headers like HSTS and CSP, implement specific validators
        if (check.header === 'strict-transport-security') {
          isValid = validateHSTS(headerValue)
        } else if (check.header === 'content-security-policy') {
          isValid = validateCSP(headerValue)
        } else {
          isValid = headerValue === check.expectedValue
        }
      }
      
      if (!isValid) {
        failed.push({
          ...check,
          description: `${check.description} (Expected: ${check.expectedValue}, Got: ${headerValue})`
        })
        return
      }
    }

    passed.push(check)
  })

  // Helper function to validate HSTS header
  function validateHSTS(headerValue: string): boolean {
    // HSTS must contain max-age directive
    const hasMaxAge = /max-age=\d+/.test(headerValue)
    return hasMaxAge
  }

  // Helper function to validate CSP header
  function validateCSP(headerValue: string): boolean {
    // CSP should not contain 'unsafe-inline' or 'unsafe-eval' for security
    const hasUnsafeDirectives = /unsafe-inline|unsafe-eval/.test(headerValue)
    return !hasUnsafeDirectives
  }

  return { passed, failed, warnings }
}

// Get security headers summary for monitoring
export function getSecurityHeadersSummary(headers: Headers): {
  score: number
  totalHeaders: number
  presentHeaders: number
  missingHeaders: string[]
} {
  const validation = validateSecurityHeaders(headers)
  const totalHeaders = SECURITY_HEADERS.filter(h => h.required).length
  const presentHeaders = validation.passed.length
  const score = Math.round((presentHeaders / totalHeaders) * 100)

  const missingHeaders = validation.failed
    .filter(h => h.required)
    .map(h => h.name)

  return {
    score,
    totalHeaders,
    presentHeaders,
    missingHeaders
  }
}

// Test function for development
export function testSecurityHeaders(url: string = 'http://localhost:3000'): Promise<{
  success: boolean
  results: ReturnType<typeof validateSecurityHeaders>
  summary: ReturnType<typeof getSecurityHeadersSummary>
}> {
  return fetch(url, { method: 'HEAD' })
    .then(response => {
      const results = validateSecurityHeaders(response.headers)
      const summary = getSecurityHeadersSummary(response.headers)
      
      return {
        success: results.failed.length === 0,
        results,
        summary
      }
    })
    .catch(error => {
      const errorMessage = `Failed to test security headers: ${error.name}: ${error.message}`
      const enhancedError = new Error(errorMessage, { cause: error })
      throw enhancedError
    })
}
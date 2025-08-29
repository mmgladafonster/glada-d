// Environment variable validation and management
import { logger } from "./logger"

interface EnvConfig {
  RESEND_API_KEY?: string
  RECAPTCHA_SECRET_KEY?: string
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string
  NODE_ENV?: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Validate environment variables
export function validateEnvironment(): ValidationResult {
  const env: EnvConfig = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NODE_ENV: process.env.NODE_ENV
  }

  const errors: string[] = []
  const warnings: string[] = []

  // Critical environment variables
  if (!env.RESEND_API_KEY) {
    errors.push("RESEND_API_KEY is required")
  } else if (env.RESEND_API_KEY === 'your_resend_api_key_here') {
    errors.push("RESEND_API_KEY is using placeholder value - update with real key")
  } else if (!env.RESEND_API_KEY.startsWith("re_")) {
    errors.push("RESEND_API_KEY must start with 're_'")
  } else if (env.RESEND_API_KEY.length < 20) {
    errors.push("RESEND_API_KEY appears to be invalid (too short)")
  }

  if (!env.RECAPTCHA_SECRET_KEY) {
    errors.push("RECAPTCHA_SECRET_KEY is required")
  } else if (env.RECAPTCHA_SECRET_KEY === 'your_new_secret_key_here') {
    errors.push("RECAPTCHA_SECRET_KEY is using placeholder value - update with real key")
  } else if (env.RECAPTCHA_SECRET_KEY.length < 30) {
    errors.push("RECAPTCHA_SECRET_KEY appears to be invalid (too short)")
  }

  if (!env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    errors.push("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is required")
  } else if (env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === 'your_new_site_key_here') {
    errors.push("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is using placeholder value - update with real key")
  } else if (env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY.length < 30) {
    errors.push("NEXT_PUBLIC_RECAPTCHA_SITE_KEY appears to be invalid (too short)")
  }

  // Environment-specific checks
  if (env.NODE_ENV === 'production') {
    // Production-specific validations
    if (env.RESEND_API_KEY && env.RESEND_API_KEY.includes('test')) {
      warnings.push("Using test API key in production")
    }
    
    if (env.RECAPTCHA_SECRET_KEY && env.RECAPTCHA_SECRET_KEY.includes('test')) {
      warnings.push("Using test reCAPTCHA key in production")
    }
  }

  // Development warnings
  if (env.NODE_ENV === 'development') {
    if (env.RESEND_API_KEY && !env.RESEND_API_KEY.includes('test')) {
      warnings.push("Using production API key in development")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Log environment validation results
export function logEnvironmentStatus(): void {
  const validation = validateEnvironment()
  
  if (validation.isValid) {
    logger.info("Environment validation passed", "ENV_VALIDATOR", {
      warningCount: validation.warnings.length
    })
  } else {
    logger.error("Environment validation failed", "ENV_VALIDATOR", {
      errorCount: validation.errors.length,
      errors: validation.errors
    })
  }

  // Log warnings
  validation.warnings.forEach(warning => {
    logger.warn(warning, "ENV_VALIDATOR")
  })
}

// Get safe environment info (no sensitive data)
export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'unknown',
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasRecaptchaSecret: !!process.env.RECAPTCHA_SECRET_KEY,
    hasRecaptchaSiteKey: !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    timestamp: new Date().toISOString()
  }
}

// Startup validation - throws error if environment is invalid
export function validateEnvironmentOnStartup(): void {
  const validation = validateEnvironment()
  
  if (!validation.isValid) {
    const errorMessage = `Environment validation failed:\n${validation.errors.join('\n')}`
    logger.error("STARTUP FAILED: Invalid environment configuration", "ENV_VALIDATOR", {
      errors: validation.errors,
      warnings: validation.warnings
    })
    
    // In production, this will cause the deployment to fail
    // In development, this will show clear error messages
    throw new Error(errorMessage)
  }
  
  // Check for environment variable exposure risks
  checkEnvironmentExposure()
  
  // Log successful validation
  logger.info("Environment validation passed on startup", "ENV_VALIDATOR", {
    warningCount: validation.warnings.length
  })
  
  // Log any warnings
  validation.warnings.forEach(warning => {
    logger.warn(`Startup warning: ${warning}`, "ENV_VALIDATOR")
  })
}

// Check for potential environment variable exposure
function checkEnvironmentExposure(): void {
  const exposureRisks: string[] = []
  
  // Check if sensitive variables might be exposed to client-side
  const sensitiveVars = [
    'RESEND_API_KEY',
    'RECAPTCHA_SECRET_KEY',
    'DATABASE_URL',
    'JWT_SECRET',
    'PRIVATE_KEY'
  ]
  
  sensitiveVars.forEach(varName => {
    const value = process.env[varName]
    if (value) {
      // Check if variable name suggests it might be exposed to client
      const publicVarName = `NEXT_PUBLIC_${varName}`
      if (process.env[publicVarName]) {
        exposureRisks.push(`Potential exposure: ${publicVarName} exists alongside ${varName}`)
      }
      
      // Check for common exposure patterns in the value
      if (value.length < 10) {
        exposureRisks.push(`${varName} appears to be too short (possible placeholder)`)
      }
    }
  })
  
  // Log exposure risks
  if (exposureRisks.length > 0) {
    logger.warn("Environment variable exposure risks detected", "ENV_VALIDATOR", {
      risks: exposureRisks
    })
  }
}

// Runtime check for environment variable leakage in objects
export function sanitizeObjectForClient<T extends Record<string, any>>(obj: T): Partial<T> {
  const sensitivePatterns = [
    /api[_\s]*key/i,
    /secret/i,
    /password/i,
    /token/i,
    /private/i,
    /credential/i,
    /auth/i
  ]
  
  const sanitized: Partial<T> = {}
  
  Object.entries(obj).forEach(([key, value]) => {
    const isSensitive = sensitivePatterns.some(pattern => pattern.test(key))
    
    if (!isSensitive) {
      // Additional check for sensitive values
      if (typeof value === 'string') {
        const looksLikeSecret = value.length > 20 && /^[A-Za-z0-9+/=_-]+$/.test(value)
        if (!looksLikeSecret) {
          sanitized[key as keyof T] = value
        }
      } else {
        sanitized[key as keyof T] = value
      }
    }
  })
  
  return sanitized
}

// Check if a string contains potential environment variable values
export function containsSensitiveData(text: string): boolean {
  const sensitivePatterns = [
    /re_[A-Za-z0-9]{20,}/g, // Resend API key pattern
    /6L[A-Za-z0-9_-]{38}/g, // reCAPTCHA site key pattern
    /6L[A-Za-z0-9_-]{38}/g, // reCAPTCHA secret key pattern
    /sk_[A-Za-z0-9]{20,}/g, // Stripe secret key pattern
    /pk_[A-Za-z0-9]{20,}/g, // Stripe public key pattern
    /AIza[A-Za-z0-9_-]{35}/g, // Google API key pattern
    /ya29\.[A-Za-z0-9_-]+/g, // Google OAuth token pattern
    /[A-Za-z0-9+/]{40,}={0,2}/g // Base64 encoded secrets (40+ chars)
  ]
  
  return sensitivePatterns.some(pattern => pattern.test(text))
}

// Safe environment info getter with exposure protection
export function getSafeEnvironmentInfo(): {
  nodeEnv: string
  hasRequiredKeys: boolean
  configurationStatus: 'complete' | 'partial' | 'missing'
  timestamp: string
  exposureRisks: string[]
} {
  const validation = validateEnvironment()
  const exposureRisks: string[] = []
  
  // Check for potential exposure without revealing actual values
  if (process.env.NEXT_PUBLIC_RESEND_API_KEY) {
    exposureRisks.push('RESEND_API_KEY may be exposed via NEXT_PUBLIC variable')
  }
  
  if (process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY) {
    exposureRisks.push('RECAPTCHA_SECRET_KEY may be exposed via NEXT_PUBLIC variable')
  }
  
  let configurationStatus: 'complete' | 'partial' | 'missing' = 'missing'
  if (validation.isValid) {
    configurationStatus = 'complete'
  } else if (validation.errors.length < 3) {
    configurationStatus = 'partial'
  }
  
  return {
    nodeEnv: process.env.NODE_ENV || 'unknown',
    hasRequiredKeys: validation.isValid,
    configurationStatus,
    timestamp: new Date().toISOString(),
    exposureRisks
  }
}
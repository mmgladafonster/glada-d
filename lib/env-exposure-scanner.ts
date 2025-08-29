// Environment variable exposure detection and prevention
import { logger } from "./logger"
import { createCriticalAlert, createHighAlert } from "./security-alerts"

interface ExposureRisk {
  type: 'client_exposure' | 'log_exposure' | 'response_exposure' | 'config_exposure'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  variable?: string
  recommendation: string
}

interface ExposureScanResult {
  timestamp: string
  risksFound: ExposureRisk[]
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
}

class EnvironmentExposureScanner {
  
  // Scan for environment variable exposure risks
  scanForExposureRisks(): ExposureScanResult {
    const risks: ExposureRisk[] = []
    
    // Check for client-side exposure risks
    risks.push(...this.checkClientSideExposure())
    
    // Check for configuration exposure risks
    risks.push(...this.checkConfigurationExposure())
    
    // Check for logging exposure risks
    risks.push(...this.checkLoggingExposure())
    
    // Determine overall risk level
    const overallRisk = this.calculateOverallRisk(risks)
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(risks)
    
    const result: ExposureScanResult = {
      timestamp: new Date().toISOString(),
      risksFound: risks,
      overallRisk,
      recommendations
    }
    
    // Log scan results
    logger.info("Environment exposure scan completed", "ENV_EXPOSURE_SCANNER", {
      risksFound: risks.length,
      overallRisk,
      criticalRisks: risks.filter(r => r.severity === 'critical').length
    })
    
    // Create alerts for critical exposure risks
    const criticalRisks = risks.filter(r => r.severity === 'critical')
    if (criticalRisks.length > 0) {
      await createCriticalAlert(
        'environment',
        'Critical Environment Variable Exposure',
        `${criticalRisks.length} critical environment variable exposure risks detected`,
        { 
          overallRisk,
          criticalRisks: criticalRisks.map(r => ({ type: r.type, variable: r.variable, description: r.description })),
          scanTimestamp: result.timestamp
        }
      )
    }

    // Create alerts for multiple high-severity risks
    const highRisks = risks.filter(r => r.severity === 'high')
    if (highRisks.length >= 2) {
      await createHighAlert(
        'environment',
        'Multiple Environment Exposure Risks',
        `${highRisks.length} high-severity environment exposure risks detected`,
        { 
          overallRisk,
          highRisks: highRisks.map(r => ({ type: r.type, variable: r.variable, description: r.description })),
          scanTimestamp: result.timestamp
        }
      )
    }
    
    return result
  }
  
  private checkClientSideExposure(): ExposureRisk[] {
    const risks: ExposureRisk[] = []
    
    // Check for sensitive variables that might be exposed via NEXT_PUBLIC_
    const sensitiveVars = [
      'RESEND_API_KEY',
      'RECAPTCHA_SECRET_KEY',
      'DATABASE_URL',
      'JWT_SECRET',
      'PRIVATE_KEY',
      'SESSION_SECRET'
    ]
    
    sensitiveVars.forEach(varName => {
      const publicVarName = `NEXT_PUBLIC_${varName}`
      if (process.env[publicVarName]) {
        risks.push({
          type: 'client_exposure',
          severity: 'critical',
          description: `Sensitive variable ${varName} may be exposed via ${publicVarName}`,
          variable: publicVarName,
          recommendation: `Remove ${publicVarName} or ensure it doesn't contain sensitive data`
        })
      }
    })
    
    // Check for variables with suspicious NEXT_PUBLIC_ names
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_') && key.includes('SECRET')) {
        risks.push({
          type: 'client_exposure',
          severity: 'high',
          description: `Public variable ${key} contains 'SECRET' in name`,
          variable: key,
          recommendation: `Review if ${key} should really be public`
        })
      }
    })
    
    return risks
  }
  
  private checkConfigurationExposure(): ExposureRisk[] {
    const risks: ExposureRisk[] = []
    
    // Check for placeholder values in production
    if (process.env.NODE_ENV === 'production') {
      const placeholderPatterns = [
        'your_api_key_here',
        'your_secret_here',
        'placeholder',
        'example',
        'test_key',
        'demo_key'
      ]
      
      Object.entries(process.env).forEach(([key, value]) => {
        if (value && placeholderPatterns.some(pattern => 
          value.toLowerCase().includes(pattern.toLowerCase())
        )) {
          risks.push({
            type: 'config_exposure',
            severity: 'high',
            description: `Variable ${key} appears to contain placeholder value in production`,
            variable: key,
            recommendation: `Update ${key} with actual production value`
          })
        }
      })
    }
    
    // Check for development keys in production
    if (process.env.NODE_ENV === 'production') {
      Object.entries(process.env).forEach(([key, value]) => {
        if (value && (
          value.includes('test') || 
          value.includes('dev') || 
          value.includes('localhost')
        )) {
          risks.push({
            type: 'config_exposure',
            severity: 'medium',
            description: `Variable ${key} may contain development value in production`,
            variable: key,
            recommendation: `Verify ${key} is using production value`
          })
        }
      })
    }
    
    return risks
  }
  
  private checkLoggingExposure(): ExposureRisk[] {
    const risks: ExposureRisk[] = []
    
    // This is a static check - in a real implementation, you might
    // scan log files or check logging configuration
    
    // Check if NODE_ENV allows verbose logging in production
    if (process.env.NODE_ENV === 'production' && process.env.LOG_LEVEL === 'debug') {
      risks.push({
        type: 'log_exposure',
        severity: 'medium',
        description: 'Debug logging enabled in production may expose sensitive data',
        recommendation: 'Set LOG_LEVEL to info or warn in production'
      })
    }
    
    return risks
  }
  
  private calculateOverallRisk(risks: ExposureRisk[]): 'low' | 'medium' | 'high' | 'critical' {
    if (risks.some(r => r.severity === 'critical')) return 'critical'
    if (risks.some(r => r.severity === 'high')) return 'high'
    if (risks.some(r => r.severity === 'medium')) return 'medium'
    return 'low'
  }
  
  private generateRecommendations(risks: ExposureRisk[]): string[] {
    const recommendations = new Set<string>()
    
    risks.forEach(risk => {
      recommendations.add(risk.recommendation)
    })
    
    // Add general recommendations
    if (risks.length > 0) {
      recommendations.add('Review all environment variables for sensitive data exposure')
      recommendations.add('Implement regular environment variable audits')
      recommendations.add('Use proper secret management for production deployments')
    }
    
    return Array.from(recommendations)
  }
}

// Export singleton instance
export const envExposureScanner = new EnvironmentExposureScanner()

// Convenience function for quick scans
export function scanEnvironmentExposure(): ExposureScanResult {
  return envExposureScanner.scanForExposureRisks()
}

// Runtime protection function to sanitize environment data
export function sanitizeEnvironmentForResponse(data: any): any {
  if (typeof data === 'string') {
    // Check if string contains potential secrets
    const secretPatterns = [
      /re_[A-Za-z0-9]{20,}/g,
      /6L[A-Za-z0-9_-]{38}/g,
      /sk_[A-Za-z0-9]{20,}/g,
      /AIza[A-Za-z0-9_-]{35}/g
    ]
    
    let sanitized = data
    secretPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]')
    })
    
    return sanitized
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeEnvironmentForResponse(item))
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {}
    Object.entries(data).forEach(([key, value]) => {
      // Skip keys that might contain sensitive data
      const sensitiveKeys = ['key', 'secret', 'token', 'password', 'credential']
      if (!sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = sanitizeEnvironmentForResponse(value)
      } else {
        sanitized[key] = '[REDACTED]'
      }
    })
    return sanitized
  }
  
  return data
}

// Middleware helper to check responses for environment exposure
export function checkResponseForExposure(response: any): {
  hasExposure: boolean
  exposedPatterns: string[]
} {
  const responseString = JSON.stringify(response)
  const exposedPatterns: string[] = []
  
  const patterns = [
    { name: 'Resend API Key', pattern: /re_[A-Za-z0-9]{20,}/g },
    { name: 'reCAPTCHA Key', pattern: /6L[A-Za-z0-9_-]{38}/g },
    { name: 'Stripe Key', pattern: /sk_[A-Za-z0-9]{20,}/g },
    { name: 'Google API Key', pattern: /AIza[A-Za-z0-9_-]{35}/g },
    { name: 'JWT Token', pattern: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g }
  ]
  
  patterns.forEach(({ name, pattern }) => {
    if (pattern.test(responseString)) {
      exposedPatterns.push(name)
    }
  })
  
  return {
    hasExposure: exposedPatterns.length > 0,
    exposedPatterns
  }
}
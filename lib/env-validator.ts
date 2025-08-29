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
  } else if (!env.RESEND_API_KEY.startsWith("re_")) {
    errors.push("RESEND_API_KEY must start with 're_'")
  } else if (env.RESEND_API_KEY.length < 20) {
    errors.push("RESEND_API_KEY appears to be invalid (too short)")
  }

  if (!env.RECAPTCHA_SECRET_KEY) {
    errors.push("RECAPTCHA_SECRET_KEY is required")
  } else if (env.RECAPTCHA_SECRET_KEY.length < 30) {
    errors.push("RECAPTCHA_SECRET_KEY appears to be invalid (too short)")
  }

  if (!env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    errors.push("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is required")
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
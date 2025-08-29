// Secure error messages - no internal information exposed to users
// All messages are in Swedish and provide helpful guidance without revealing system details
export const ERROR_MESSAGES = {
  // Generic errors (no technical details exposed)
  GENERIC_ERROR: "Ett tekniskt fel uppstod. Försök igen eller ring oss på 072-8512420.",
  SERVICE_UNAVAILABLE: "Tjänsten är tillfälligt otillgänglig. Ring oss direkt på 072-8512420.",
  CONFIGURATION_ERROR: "Tjänsten är inte korrekt konfigurerad. Kontakta administratören.",
  
  // Form validation errors (specific but not revealing internal logic)
  VALIDATION_ERROR: "Kontrollera att alla fält är korrekt ifyllda.",
  INVALID_EMAIL: "Vänligen ange en giltig e-postadress.",
  INVALID_PHONE: "Vänligen ange ett giltigt telefonnummer (t.ex. 070-123 45 67).",
  INVALID_NAME: "Namn får endast innehålla bokstäver, bindestreck och apostrofer.",
  REQUIRED_FIELDS: "Alla obligatoriska fält måste fyllas i.",
  FIELD_TOO_LONG: "Ett eller flera fält innehåller för mycket text.",
  INVALID_CHARACTERS: "Ogiltiga tecken upptäcktes i formuläret.",
  
  // Rate limiting (clear but not revealing exact limits)
  RATE_LIMIT_EXCEEDED: "För många förfrågningar. Vänta 15 minuter innan du försöker igen.",
  IP_RATE_LIMIT_EXCEEDED: "För många förfrågningar från din IP-adress. Försök igen senare.",
  
  // reCAPTCHA (no technical details about verification process)
  RECAPTCHA_MISSING: "Säkerhetsverifiering saknas. Ladda om sidan och försök igen.",
  RECAPTCHA_FAILED: "Säkerhetsverifiering misslyckades. Försök igen.",
  RECAPTCHA_EXPIRED: "Säkerhetsverifiering har gått ut. Ladda om sidan och försök igen.",
  RECAPTCHA_INVALID: "Ogiltig säkerhetsverifiering. Ladda om sidan och försök igen.",
  
  // Email service (no API details or internal errors exposed)
  EMAIL_SERVICE_ERROR: "E-posttjänsten är tillfälligt otillgänglig. Ring oss på 072-8512420.",
  EMAIL_SEND_SUCCESS: "Tack för din förfrågan! Vi återkommer inom 2 timmar.",
  EMAIL_CONFIGURATION_ERROR: "E-postkonfiguration saknas. Kontakta administratören.",
  
  // Success messages
  FORM_SUCCESS: "Tack för din förfrågan! Vi återkommer inom 2 timmar.",
  
  // Security-related errors (generic to prevent information disclosure)
  SECURITY_VIOLATION: "Säkerhetsfel upptäckt. Försöket har loggats.",
  SUSPICIOUS_ACTIVITY: "Misstänkt aktivitet upptäckt. Kontakta support om problemet kvarstår.",
  ACCESS_DENIED: "Åtkomst nekad. Kontakta administratören om du behöver hjälp."
} as const

// Error codes for internal tracking (NEVER exposed to users)
export const ERROR_CODES = {
  // Email service errors
  RESEND_API_ERROR: "EMAIL_001",
  EMAIL_SEND_FAILED: "EMAIL_002", 
  EMAIL_CONFIG_INVALID: "EMAIL_003",
  
  // reCAPTCHA errors
  RECAPTCHA_VERIFICATION_FAILED: "RECAPTCHA_001",
  RECAPTCHA_TOKEN_INVALID: "RECAPTCHA_002",
  RECAPTCHA_TOKEN_EXPIRED: "RECAPTCHA_003",
  RECAPTCHA_SCORE_LOW: "RECAPTCHA_004",
  RECAPTCHA_ACTION_MISMATCH: "RECAPTCHA_005",
  
  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: "RATE_001",
  IP_RATE_LIMIT_EXCEEDED: "RATE_002",
  RATE_LIMIT_CONFIG_ERROR: "RATE_003",
  
  // Validation errors
  VALIDATION_FAILED: "VALIDATION_001",
  FIELD_TOO_LONG: "VALIDATION_002",
  INVALID_CHARACTERS: "VALIDATION_003",
  REQUIRED_FIELD_MISSING: "VALIDATION_004",
  
  // Configuration errors
  MISSING_ENV_VAR: "CONFIG_001",
  INVALID_ENV_VAR: "CONFIG_002",
  SERVICE_CONFIG_ERROR: "CONFIG_003",
  
  // Security errors
  SECURITY_VIOLATION: "SECURITY_001",
  SUSPICIOUS_ACTIVITY: "SECURITY_002",
  IP_SPOOFING_DETECTED: "SECURITY_003",
  MALICIOUS_INPUT_DETECTED: "SECURITY_004",
  
  // System errors
  SYSTEM_ERROR: "SYSTEM_001",
  DATABASE_ERROR: "SYSTEM_002",
  NETWORK_ERROR: "SYSTEM_003"
} as const

import { logger } from "./logger"

// Server-side error logging utility with enhanced security
export function logSecurityError(
  errorCode: string, 
  details: string, 
  userIdentifier?: string,
  ipAddress?: string
) {
  // Sanitize details to prevent log injection
  const sanitizedDetails = sanitizeLogMessage(details)
  logger.security(sanitizedDetails, errorCode, userIdentifier, ipAddress)
}

// Enhanced error response builder
export interface SecureErrorResponse {
  success: false
  message: string
  errorId?: string // For user reference, not internal tracking
}

export function createSecureErrorResponse(
  userMessage: string,
  errorCode?: string,
  logDetails?: string,
  userIdentifier?: string,
  ipAddress?: string
): SecureErrorResponse {
  // Generate a user-friendly error ID (not the internal error code)
  const errorId = generateUserErrorId()
  
  // Log the detailed error internally
  if (errorCode && logDetails) {
    logSecurityError(errorCode, `${logDetails} [UserErrorId: ${errorId}]`, userIdentifier, ipAddress)
  }
  
  return {
    success: false,
    message: userMessage,
    errorId
  }
}

// Sanitize log messages to prevent log injection attacks
function sanitizeLogMessage(message: string): string {
  return message
    .replace(/[\r\n]/g, ' ') // Remove line breaks
    .replace(/\t/g, ' ') // Replace tabs with spaces
    .slice(0, 1000) // Limit length to prevent log bloat
    .trim()
}

// Generate user-friendly error ID (not revealing internal structure)
function generateUserErrorId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `ERR-${timestamp}-${random}`.toUpperCase()
}

// Validate error messages don't contain sensitive information
export function validateErrorMessage(message: string): boolean {
  const sensitivePatterns = [
    /api[_\s]*key/i,
    /secret/i,
    /password/i,
    /token/i,
    /database/i,
    /sql/i,
    /error.*line.*\d+/i, // Stack trace patterns
    /at\s+\w+\.\w+/i, // Function call patterns
    /file.*not.*found/i,
    /permission.*denied/i,
    /access.*denied/i,
    /unauthorized/i,
    /internal.*server.*error/i
  ]
  
  return !sensitivePatterns.some(pattern => pattern.test(message))
}

// Safe error message formatter for production
export function formatSafeErrorMessage(
  baseMessage: string,
  fallbackMessage: string = ERROR_MESSAGES.GENERIC_ERROR
): string {
  // In production, always use safe messages
  if (process.env.NODE_ENV === 'production') {
    return validateErrorMessage(baseMessage) ? baseMessage : fallbackMessage
  }
  
  // In development, allow more detailed messages but still validate
  return validateErrorMessage(baseMessage) ? baseMessage : fallbackMessage
}
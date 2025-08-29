// Secure error messages - no internal information exposed to users
export const ERROR_MESSAGES = {
  // Generic errors
  GENERIC_ERROR: "Ett tekniskt fel uppstod. Försök igen eller ring oss på 072-8512420.",
  SERVICE_UNAVAILABLE: "Tjänsten är tillfälligt otillgänglig. Ring oss direkt på 072-8512420.",
  
  // Form validation errors
  VALIDATION_ERROR: "Kontrollera att alla fält är korrekt ifyllda.",
  INVALID_EMAIL: "Vänligen ange en giltig e-postadress.",
  INVALID_PHONE: "Vänligen ange ett giltigt telefonnummer.",
  INVALID_NAME: "Namn får endast innehålla bokstäver.",
  REQUIRED_FIELDS: "Alla obligatoriska fält måste fyllas i.",
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: "För många förfrågningar. Vänta 15 minuter innan du försöker igen.",
  
  // reCAPTCHA
  RECAPTCHA_MISSING: "Säkerhetsverifiering saknas. Ladda om sidan och försök igen.",
  RECAPTCHA_FAILED: "Säkerhetsverifiering misslyckades. Försök igen.",
  
  // Email service
  EMAIL_SERVICE_ERROR: "E-posttjänsten är tillfälligt otillgänglig. Ring oss på 072-8512420.",
  EMAIL_SEND_SUCCESS: "Tack för din förfrågan! Vi återkommer inom 2 timmar.",
  
  // Success messages
  FORM_SUCCESS: "Tack för din förfrågan! Vi återkommer inom 2 timmar."
} as const

// Error codes for internal tracking (not exposed to users)
export const ERROR_CODES = {
  RESEND_API_ERROR: "RESEND_001",
  RECAPTCHA_VERIFICATION_FAILED: "RECAPTCHA_001", 
  RATE_LIMIT_EXCEEDED: "RATE_001",
  VALIDATION_FAILED: "VALIDATION_001",
  MISSING_ENV_VAR: "CONFIG_001",
  EMAIL_SEND_FAILED: "EMAIL_001"
} as const

import { logger } from "./logger"

// Server-side error logging utility
export function logSecurityError(
  errorCode: string, 
  details: string, 
  userIdentifier?: string,
  ipAddress?: string
) {
  logger.security(details, errorCode, userIdentifier, ipAddress)
}
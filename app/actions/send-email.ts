"use server"

import { resend, EMAIL_CONFIG } from "@/lib/resend"
import { checkMultiLayerRateLimit, getRateLimitStats } from "@/lib/rate-limit"
import { ERROR_MESSAGES, ERROR_CODES, logSecurityError, createSecureErrorResponse, formatSafeErrorMessage } from "@/lib/error-messages"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"
import { recordRateLimitViolation, recordRecaptchaFailure, recordValidationError, recordEmailFailure } from "@/lib/security-monitor"
import { sanitizeInput, isGdprConsentAccepted, normalizePropertyType, normalizeAndValidatePhone } from "@/lib/contact-form-validation"

async function verifyRecaptcha(token: string, ipAddress: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    logSecurityError(ERROR_CODES.MISSING_ENV_VAR, "RECAPTCHA_SECRET_KEY not configured")
    return { success: false, message: "reCAPTCHA configuration error" }
  }

  // Basic token validation
  if (!token || token.length < 20) {
    logSecurityError(ERROR_CODES.RECAPTCHA_TOKEN_INVALID, "Invalid reCAPTCHA token format")
    return { success: false, message: "Invalid reCAPTCHA token" }
  }

  try {
    const verificationResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}&remoteip=${ipAddress}`,
    })

    if (!verificationResponse.ok) {
      logSecurityError(ERROR_CODES.RECAPTCHA_VERIFICATION_FAILED, `reCAPTCHA API returned ${verificationResponse.status}`)
      return { success: false, message: "reCAPTCHA verification failed" }
    }

    const data = await verificationResponse.json()
    
    if (!data.success) {
      const errorCodes = data["error-codes"]?.join(", ") || "unknown"
      logSecurityError(ERROR_CODES.RECAPTCHA_VERIFICATION_FAILED, `reCAPTCHA failed with codes: ${errorCodes}`)
      return { success: false, message: "reCAPTCHA verification failed" }
    }

    // Enhanced validation checks
    const now = new Date()
    const challengeTimestamp = new Date(data.challenge_ts)
    const timeDifference = now.getTime() - challengeTimestamp.getTime()
    const maxAge = 5 * 60 * 1000 // 5 minutes in milliseconds

    // Check if token is too old
    if (timeDifference > maxAge) {
      logSecurityError(ERROR_CODES.RECAPTCHA_TOKEN_EXPIRED, `reCAPTCHA token expired: ${timeDifference}ms old`)
      return { success: false, message: "reCAPTCHA token expired" }
    }

    // Check if token is from the future (clock skew protection)
    if (timeDifference < -60000) { // Allow 1 minute clock skew
      logSecurityError(ERROR_CODES.RECAPTCHA_TOKEN_INVALID, `reCAPTCHA token from future: ${timeDifference}ms`)
      return { success: false, message: "reCAPTCHA token invalid" }
    }

    // Check reCAPTCHA v3 score if available
    if (data.score !== undefined) {
      const minScore = 0.5 // Minimum acceptable score
      if (data.score < minScore) {
        logSecurityError(ERROR_CODES.RECAPTCHA_SCORE_LOW, `reCAPTCHA score too low: ${data.score}`)
        return { success: false, message: "reCAPTCHA verification failed" }
      }
    }

    // Verify the action matches (if using reCAPTCHA v3)
    if (data.action && data.action !== 'contact_form') {
      logSecurityError(ERROR_CODES.RECAPTCHA_ACTION_MISMATCH, `reCAPTCHA action mismatch: ${data.action}`)
      return { success: false, message: "reCAPTCHA verification failed" }
    }

    // Log successful verification with details
    logger.info("reCAPTCHA verification successful", "RECAPTCHA", {
      score: data.score,
      action: data.action,
      hostname: data.hostname,
      tokenAge: timeDifference
    })
    
    return { 
      success: true, 
      message: "reCAPTCHA verified",
      score: data.score,
      action: data.action
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown reCAPTCHA error'
    logSecurityError(ERROR_CODES.RECAPTCHA_VERIFICATION_FAILED, `reCAPTCHA verification error: ${errorMessage}`)
    return { success: false, message: "reCAPTCHA verification failed" }
  }
}

export async function sendContactEmail(_prevState: unknown, formData: FormData) {
  // Security: Minimal logging for production

  // Resolve client IP first so it is available for every early-return path
  const headersList = await headers()

  function getClientIP(): string {
    // On Vercel, x-forwarded-for is the most reliable
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const vercelForwardedFor = headersList.get('x-vercel-forwarded-for')
    
    // Vercel-specific header (most trusted)
    if (vercelForwardedFor) {
      return vercelForwardedFor.split(',')[0].trim()
    }
    
    // Standard forwarded-for header
    if (forwardedFor) {
      const ips = forwardedFor.split(',').map(ip => ip.trim())
      // Take the first IP (original client) but validate it's not private
      const clientIP = ips[0]
      
      // Basic validation - reject obviously invalid IPs
      if (clientIP && 
          clientIP !== 'unknown' && 
          !clientIP.startsWith('127.') && 
          !clientIP.startsWith('10.') && 
          !clientIP.startsWith('192.168.') &&
          !clientIP.startsWith('172.') &&
          clientIP.includes('.')) {
        return clientIP
      }
    }
    
    // Fallback to x-real-ip
    if (realIP && realIP !== 'unknown') {
      return realIP
    }
    
    // Last resort - use a consistent unknown identifier
    return 'unknown-client'
  }
  
  const ipAddress = getClientIP()

  const recaptchaToken = formData.get("recaptchaToken") as string | null
  
  // Get email early for logging purposes
  const email = formData.get("email")?.toString()?.trim() || ""

  if (!recaptchaToken) {
    return createSecureErrorResponse(
      ERROR_MESSAGES.RECAPTCHA_MISSING,
      ERROR_CODES.RECAPTCHA_VERIFICATION_FAILED,
      "reCAPTCHA token missing from form submission",
      email,
      ipAddress
    )
  }

  // Enhanced rate limiting check (email + IP) with spoofing protection
  
  // Log IP detection for security monitoring (development only)
  if (process.env.NODE_ENV === 'development') {
    logger.info("IP detection details", "SECURITY", {
      detectedIP: ipAddress,
      xForwardedFor: headersList.get('x-forwarded-for'),
      xRealIP: headersList.get('x-real-ip'),
      vercelForwardedFor: headersList.get('x-vercel-forwarded-for')
    })
  }

  const rateLimitResult = checkMultiLayerRateLimit(email, ipAddress)
  
  // Log rate limiting stats in development
  if (process.env.NODE_ENV === 'development') {
    const stats = getRateLimitStats()
    logger.info("Rate limiting stats", "RATE_LIMIT", stats)
  }
  
  if (!rateLimitResult.allowed) {
    const reason = rateLimitResult.reason === 'ip_rate_limit' ? 
      `IP rate limit exceeded: ${ipAddress}` : 
      `Email rate limit exceeded: ${email}`
    
    recordRateLimitViolation(ipAddress, email)
    return createSecureErrorResponse(
      ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      reason,
      email,
      ipAddress
    )
  }

  const recaptchaResult = await verifyRecaptcha(recaptchaToken, ipAddress)

  if (!recaptchaResult.success) {
    recordRecaptchaFailure(ipAddress, email)
    return createSecureErrorResponse(
      ERROR_MESSAGES.RECAPTCHA_FAILED,
      ERROR_CODES.RECAPTCHA_VERIFICATION_FAILED,
      `reCAPTCHA verification failed: ${recaptchaResult.message}`,
      email,
      ipAddress
    )
  }

  // Lägg till en liten fördröjning för att förhindra snabba inskick
  await new Promise((resolve) => setTimeout(resolve, 100))

  try {
    // Security: Removed detailed environment logging

    // Validate form data exists
    if (!formData) {
      logSecurityError(ERROR_CODES.VALIDATION_FAILED, "Form data missing", email)
      return {
        success: false,
        message: ERROR_MESSAGES.GENERIC_ERROR,
      }
    }

    // Input validation and sanitization
    const firstName = formData.get("firstName")?.toString()?.trim().slice(0, 50) || ""
    const lastName = formData.get("lastName")?.toString()?.trim().slice(0, 50) || ""
    // Email already extracted above for logging
    const phoneRaw = formData.get("phone")?.toString()?.trim().slice(0, 40) || ""
    const address = formData.get("address")?.toString()?.trim().slice(0, 200) || ""
    const propertyTypeRaw = formData.get("propertyType")?.toString()?.trim().slice(0, 50) || ""
    const description = formData.get("description")?.toString()?.trim().slice(0, 1000) || ""
    const gdprConsentRaw = formData.get("gdpr")

    // Server-side GDPR consent (checkbox name="gdpr"; checked value is typically "on")
    if (!isGdprConsentAccepted(gdprConsentRaw)) {
      logSecurityError(ERROR_CODES.VALIDATION_FAILED, "GDPR consent missing or false", email, ipAddress)
      recordValidationError("GDPR consent missing", email, ipAddress)
      return {
        success: false,
        message: ERROR_MESSAGES.GDPR_CONSENT_REQUIRED,
      }
    }

    const sanitizedFirstName = sanitizeInput(firstName)
    const sanitizedLastName = sanitizeInput(lastName)
    const sanitizedAddress = sanitizeInput(address)
    const sanitizedDescription = sanitizeInput(description)

    // Whitelist propertyType against the contact form <select> options, then sanitize
    const normalizedPropertyType = normalizePropertyType(propertyTypeRaw)
    if (normalizedPropertyType === null) {
      logSecurityError(
        ERROR_CODES.VALIDATION_FAILED,
        `Invalid propertyType rejected: ${sanitizeInput(propertyTypeRaw)}`,
        email,
        ipAddress
      )
      recordValidationError("Invalid propertyType", email, ipAddress)
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_PROPERTY_TYPE,
      }
    }
    const sanitizedPropertyType = normalizedPropertyType
      ? sanitizeInput(normalizedPropertyType)
      : ""

    // Security: Removed detailed form data logging

    // Validate required fields
    if (!sanitizedFirstName || !sanitizedLastName || !email || !phoneRaw) {
      logSecurityError(ERROR_CODES.VALIDATION_FAILED, "Required fields missing", email)
      recordValidationError("Required fields missing", email, ipAddress)
      return {
        success: false,
        message: ERROR_MESSAGES.REQUIRED_FIELDS,
      }
    }

    // Validate email format (more strict)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(email)) {
      logSecurityError(ERROR_CODES.VALIDATION_FAILED, `Invalid email format: ${email}`, email)
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_EMAIL,
      }
    }

    // Validate phone (lenient Swedish + international; shared helper)
    const phoneResult = normalizeAndValidatePhone(phoneRaw)
    if (!phoneResult.ok) {
      logSecurityError(ERROR_CODES.VALIDATION_FAILED, `Invalid phone format: ${phoneRaw}`, email)
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_PHONE,
      }
    }
    const phone = phoneResult.normalized

    // Validate name fields (no numbers or special characters)
    const nameRegex = /^[a-zA-ZåäöÅÄÖ\s\-']{1,50}$/
    if (!nameRegex.test(sanitizedFirstName) || !nameRegex.test(sanitizedLastName)) {
      logSecurityError(ERROR_CODES.VALIDATION_FAILED, `Invalid name format: ${sanitizedFirstName} ${sanitizedLastName}`, email)
      return {
        success: false,
        message: ERROR_MESSAGES.INVALID_NAME,
      }
    }

    // Validate API configuration (secure)
    const apiKey = process.env.RESEND_API_KEY

    // Validate configuration
    if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("re_") || !resend) {
      logSecurityError(ERROR_CODES.MISSING_ENV_VAR, "Email service configuration invalid", email)
      return {
        success: false,
        message: ERROR_MESSAGES.EMAIL_SERVICE_ERROR,
      }
    }

    // Create HTML email template for the initial email to Glada Fönster
    const gladaFonsterEmailHtml = `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ny Offertförfrågan - Glada Fönster</title>
</head>
<body style="background: #f5f6fa; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f5f6fa; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(80,69,229,0.07);">
          <tr>
            <td align="center" style="padding: 32px 24px 0 24px;">
              <img src="https://gladafonster.se/glada-fonster-kungsbacka-happy.png" alt="Glada Fönster Logo" width="48" height="48" style="display:block; margin-bottom: 8px;" />
              <div style="color: #5045e5; font-weight: bold; font-size: 22px; margin-bottom: 8px;">Glada Fönster Städ AB</div>
              <div style="font-size: 15px; color: #444; font-style: italic; margin-bottom: 18px; max-width: 340px;">
                Vi putsar inte bara fönster – vi förvandlar dem till speglar så klara att du kommer att svära på att du kan se <span style="color:#5045e5; font-weight:600;">ABBA</span> sjunga <span style="font-weight:600;">"Dancing Queen"</span> i din trädgård.
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f7f7fc; border-radius: 6px;">
                <tr>
                  <td style="padding: 24px 20px 20px 20px; color: #222; font-size: 16px;">
                    <div style="font-weight:600; margin-bottom: 12px;">Ny offertförfrågan mottagen!</div>
                    <div style="margin-bottom: 24px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #666;">Namn:</strong>
                            <div style="margin-top: 4px;">${sanitizedFirstName} ${sanitizedLastName}</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #666;">E-post:</strong>
                            <div style="margin-top: 4px;"><a href="mailto:${email}" style="color: #5045e5; text-decoration: none;">${email}</a></div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #666;">Telefon:</strong>
                            <div style="margin-top: 4px;"><a href="tel:${phone}" style="color: #5045e5; text-decoration: none;">${phone}</a></div>
                          </td>
                        </tr>
                        ${sanitizedAddress ? `
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #666;">Adress:</strong>
                            <div style="margin-top: 4px;">${sanitizedAddress}</div>
                          </td>
                        </tr>
                        ` : ''}
                        ${sanitizedPropertyType ? `
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #666;">Fastighetstyp:</strong>
                            <div style="margin-top: 4px;">${sanitizedPropertyType}</div>
                          </td>
                        </tr>
                        ` : ''}
                        ${sanitizedDescription ? `
                        <tr>
                          <td style="padding: 8px 0;">
                            <strong style="color: #666;">Beskrivning:</strong>
                            <div style="margin-top: 4px; white-space: pre-wrap;">${sanitizedDescription}</div>
                          </td>
                        </tr>
                        ` : ''}
                      </table>
                    </div>
                    <div style="margin-bottom: 12px;">
                      <div style="margin-bottom: 8px;">För att svara kunden:</div>
                      <div style="margin-bottom: 4px;">• Svara på detta mail</div>
                      <div>• Ring <a href="tel:${phone}" style="color: #5045e5; text-decoration: none;">${phone}</a></div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 24px 32px 24px;">
              <a href="https://gladafonster.se/" style="color: #5045e5; font-size: 18px; font-weight: bold; text-decoration: underline;">https://gladafonster.se/</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    try {
      // Send email to Glada Fönster (both addresses)
      const { error } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.to, // This will send to both info@gladafonster.se and mmgladafonster@gmail.com
        replyTo: email, // Reply to customer's email
        subject: `🏠 Ny offertförfrågan från ${sanitizedFirstName} ${sanitizedLastName} - Glada Fönster`,
        html: gladaFonsterEmailHtml,
        text: `
Ny offertförfrågan från Glada Fönster webbsida

KUNDUPPGIFTER
------------
Namn: ${sanitizedFirstName} ${sanitizedLastName}
E-post: ${email}
Telefon: ${phone}${sanitizedAddress ? `
Adress: ${sanitizedAddress}` : ''}${sanitizedPropertyType ? `
Fastighetstyp: ${sanitizedPropertyType}` : ''}${sanitizedDescription ? `

BESKRIVNING
-----------
${sanitizedDescription}` : ''}

För att svara:
• Svara på detta mail
• Ring kunden på ${phone}

--
Glada Fönster AB
072-8512420 | info@gladafonster.se
https://gladafonster.se/
        `,
      })

      if (error) {
        logSecurityError(ERROR_CODES.EMAIL_SEND_FAILED, `Resend API error: ${error.message}`, email)
        recordEmailFailure(`Resend API error: ${error.message}`, email)
        return {
          success: false,
          message: ERROR_MESSAGES.EMAIL_SERVICE_ERROR,
        }
      }

      // --- Send automatic reply to the customer ---

      const customerReplyHtml = `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Glada Fönster Städ AB - Bekräftelse</title>
</head>
<body style="background: #f5f6fa; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f5f6fa; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 500px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(80,69,229,0.07);">
          <tr>
            <td align="center" style="padding: 32px 24px 0 24px;">
              <img src="https://gladafonster.se/glada-fonster-kungsbacka-happy.png" alt="Glada Fönster Logo" width="48" height="48" style="display:block; margin-bottom: 8px;" />
              <div style="color: #5045e5; font-weight: bold; font-size: 22px; margin-bottom: 8px;">Glada Fönster Städ AB</div>
              <div style="font-size: 15px; color: #444; font-style: italic; margin-bottom: 18px; max-width: 340px;">
                Vi putsar inte bara fönster – vi förvandlar dem till speglar så klara att du kommer att svära på att du kan se <span style="color:#5045e5; font-weight:600;">ABBA</span> sjunga <span style="font-weight:600;">"Dancing Queen"</span> i din trädgård.
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f7f7fc; border-radius: 6px;">
                <tr>
                  <td style="padding: 24px 20px 20px 20px; color: #222; font-size: 16px;">
                    <div style="font-weight:600; margin-bottom: 12px;">Hej ${sanitizedFirstName}${sanitizedLastName ? ' ' + sanitizedLastName : ''},</div>
                    <div style="margin-bottom: 18px;">
                      Vi har mottagit din förfrågan och vill tacka dig för att du kontaktat Glada Fönster.<br><br>
                      Vi kommer att granska dina uppgifter och återkomma till dig med ett svar via e-post inom högst 2 timmar.<br><br>
                      Om du ringer oss <span style="font-weight:600;">svarar vi i genomsnitt inom 5 sekunder.</span>
                    </div>
                    <div style="margin-bottom: 12px;">
                      Vänliga hälsningar,<br>
                      <span style="font-weight:600;">Glada Fönster</span>
                    </div>
                    <div style="color: #5045e5; font-size: 15px; margin-top: 8px;">
                      <span style="font-size:18px; vertical-align:middle;">📞</span>
                      <a href="tel:0728512420" style="color: #5045e5; text-decoration: none;">Telefon: 072-851-2420</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 24px 24px 32px 24px;">
              <a href="https://gladafonster.se/" style="color: #5045e5; font-size: 18px; font-weight: bold; text-decoration: underline;">https://gladafonster.se/</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `

      const { error: replyError } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: email, // Send to the customer's email
        subject: `Tack för din förfrågan till Glada Fönster!`,
        html: customerReplyHtml,
        text: `
Hej ${sanitizedFirstName},

Tack för din förfrågan till Glada Fönster!

Vi har mottagit din förfrågan och kommer att granska dina uppgifter. Vi återkommer till dig med ett svar inom max 2 timmar.

Med vänliga hälsningar,
Teamet på Glada Fönster

---
Glada Fönster AB
Telefon: 072-8512420
E-post: info@gladafonster.se
Webbplats: www.gladafonster.se
    `,
      })

      // Auto-reply errors are logged but don't fail the main process
      if (replyError) {
        logger.warn(`Auto-reply failed: ${replyError.message}`, "EMAIL_SERVICE", { email, ipAddress })
      }

      return {
        success: true,
        message: ERROR_MESSAGES.EMAIL_SEND_SUCCESS,
      }
    } catch (emailError) {
      const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error'
      logSecurityError(ERROR_CODES.EMAIL_SEND_FAILED, `Email sending failed: ${errorMessage}`, email)
      return {
        success: false,
        message: ERROR_MESSAGES.EMAIL_SERVICE_ERROR,
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error'
    logSecurityError(ERROR_CODES.VALIDATION_FAILED, `Server action error: ${errorMessage}`, email)
    return {
      success: false,
      message: ERROR_MESSAGES.GENERIC_ERROR,
    }
  }
}

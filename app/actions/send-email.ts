"use server"

import { resend, EMAIL_CONFIG } from "@/lib/resend"
import { checkRateLimit } from "@/lib/rate-limit"

async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  const verificationResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${secretKey}&response=${token}`,
  })

  if (!verificationResponse.ok) {
    return { success: false, message: "Failed to verify reCAPTCHA." }
  }

  const data = await verificationResponse.json()
  // You can also check data.score here if you want to be more strict
  // e.g., if (data.score < 0.5) { ... }
  return { success: data.success, message: data["error-codes"]?.join(", ") || "reCAPTCHA verification failed." }
}

export async function sendContactEmail(prevState: unknown, formData: FormData) {
  // Security: Minimal logging for production

  const recaptchaToken = formData.get("recaptchaToken") as string | null

  if (!recaptchaToken) {
    return { success: false, message: "reCAPTCHA token missing." }
  }

  // Rate limiting check (using email as identifier)
  const email = formData.get("email")?.toString()?.trim() || ""
  if (email && !checkRateLimit(email, 3, 15 * 60 * 1000)) { // 3 requests per 15 minutes per email
    return {
      success: false,
      message: "För många förfrågningar. Vänta 15 minuter innan du försöker igen."
    }
  }

  const recaptchaResult = await verifyRecaptcha(recaptchaToken)

  if (!recaptchaResult.success) {
    return { success: false, message: recaptchaResult.message }
  }

  // Lägg till en liten fördröjning för att förhindra snabba inskick
  await new Promise((resolve) => setTimeout(resolve, 100))

  try {
    // Security: Removed detailed environment logging

    // Validate form data exists
    if (!formData) {
      return {
        success: false,
        message: "Formulärdata saknas. Försök igen.",
      }
    }

    // Input validation and sanitization
    const firstName = formData.get("firstName")?.toString()?.trim().slice(0, 50) || ""
    const lastName = formData.get("lastName")?.toString()?.trim().slice(0, 50) || ""
    const email = formData.get("email")?.toString()?.trim().slice(0, 100) || ""
    const phone = formData.get("phone")?.toString()?.trim().slice(0, 20) || ""
    const address = formData.get("address")?.toString()?.trim().slice(0, 200) || ""
    const propertyType = formData.get("propertyType")?.toString()?.trim().slice(0, 50) || ""
    const description = formData.get("description")?.toString()?.trim().slice(0, 1000) || ""

    // Sanitize inputs to prevent XSS
    const sanitizeInput = (input: string) => {
      return input
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
    }

    const sanitizedFirstName = sanitizeInput(firstName)
    const sanitizedLastName = sanitizeInput(lastName)
    const sanitizedAddress = sanitizeInput(address)
    const sanitizedDescription = sanitizeInput(description)

    // Security: Removed detailed form data logging

    // Validate required fields
    if (!sanitizedFirstName || !sanitizedLastName || !email || !phone) {
      return {
        success: false,
        message: "Alla obligatoriska fält måste fyllas i.",
      }
    }

    // Validate email format (more strict)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Vänligen ange en giltig e-postadress.",
      }
    }

    // Validate phone format (Swedish phone numbers)
    const phoneRegex = /^(\+46|0)[0-9\s\-]{8,15}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return {
        success: false,
        message: "Vänligen ange ett giltigt telefonnummer.",
      }
    }

    // Validate name fields (no numbers or special characters)
    const nameRegex = /^[a-zA-ZåäöÅÄÖ\s\-']{1,50}$/
    if (!nameRegex.test(sanitizedFirstName) || !nameRegex.test(sanitizedLastName)) {
      return {
        success: false,
        message: "Namn får endast innehålla bokstäver.",
      }
    }

    // Validate API configuration (secure)
    const apiKey = process.env.RESEND_API_KEY

    // Validate configuration
    if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("re_") || !resend) {
      return {
        success: false,
        message: "E-posttjänsten är inte tillgänglig. Ring oss på 072-8512420 så hjälper vi dig direkt.",
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
                        ${propertyType ? `
                        <tr>
                          <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <strong style="color: #666;">Fastighetstyp:</strong>
                            <div style="margin-top: 4px;">${propertyType}</div>
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
      const { data, error } = await resend.emails.send({
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
Adress: ${sanitizedAddress}` : ''}${propertyType ? `
Fastighetstyp: ${propertyType}` : ''}${sanitizedDescription ? `

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
        return {
          success: false,
          message: `E-postfel: ${error.message || "Okänt fel"}. Ring oss på 072-8512420.`,
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

      const { data: replyData, error: replyError } = await resend.emails.send({
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
        console.error("Auto-reply failed:", replyError.message)
      }

      return {
        success: true,
        message: "Tack för din förfrågan! Vi återkommer inom 2 timmar.",
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message)
      return {
        success: false,
        message: `Tekniskt fel: ${emailError.message}. Ring oss direkt på 072-8512420.`,
      }
    }
  } catch (error) {
    console.error("Server action error:", error.message)
    return {
      success: false,
      message: `Systemfel. Ring oss direkt på 072-8512420.`,
    }
  }
}

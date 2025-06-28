"use server"

import { resend, EMAIL_CONFIG } from "@/lib/resend"

export async function sendContactEmail(prevState: any, formData: FormData) {
  console.log("🚀 Serveråtgärd anropad - sendContactEmail")
  console.log("📅 Tidsstämpel:", new Date().toISOString())

  // Lägg till en liten fördröjning för att förhindra snabba inskick
  await new Promise((resolve) => setTimeout(resolve, 100))

  try {
    // Förbättrad miljöfelsökning
    console.log("🔍 Miljöfelsökning:")
    console.log("- NODE_ENV:", process.env.NODE_ENV)
    console.log("- RESEND_API_KEY finns:", !!process.env.RESEND_API_KEY)
    console.log("- RESEND_API_KEY längd:", process.env.RESEND_API_KEY?.length || 0)
    console.log("- RESEND_API_KEY börjar med 're_':", process.env.RESEND_API_KEY?.startsWith("re_") || false)
    console.log("- RESEND_API_KEY första 10 tecken:", process.env.RESEND_API_KEY?.substring(0, 10) || "N/A")

    // Kontrollera om formData finns
    if (!formData) {
      console.error("❌ Ingen formData mottagen")
      return {
        success: false,
        message: "Formulärdata saknas. Försök igen.",
      }
    }

    const firstName = formData.get("firstName")?.toString()?.trim() || ""
    const lastName = formData.get("lastName")?.toString()?.trim() || ""
    const email = formData.get("email")?.toString()?.trim() || ""
    const phone = formData.get("phone")?.toString()?.trim() || ""
    const address = formData.get("address")?.toString()?.trim() || ""
    const propertyType = formData.get("propertyType")?.toString()?.trim() || ""
    const description = formData.get("description")?.toString()?.trim() || ""

    console.log("📝 Formulärdata mottagen:", {
      firstName,
      lastName,
      email,
      phone,
      address,
      propertyType,
      description: description ? "Ja" : "Nej",
    })

    // Validera obligatoriska fält
    if (!firstName || !lastName || !email || !phone) {
      console.error("❌ Obligatoriska fält saknas")
      return {
        success: false,
        message: "Alla obligatoriska fält måste fyllas i.",
      }
    }

    // Validera e-postformat
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error("❌ Ogiltigt e-postformat:", email)
      return {
        success: false,
        message: "Vänligen ange en giltig e-postadress.",
      }
    }

    // Detaljerad Resend konfigurationskontroll
    console.log("🔑 Detaljerad Resend Konfigurationskontroll:")

    const apiKey = process.env.RESEND_API_KEY
    console.log("- Rå API-nyckel finns:", !!apiKey)
    console.log("- API-nyckeltyp:", typeof apiKey)
    console.log("- API-nyckel längd:", apiKey?.length || 0)

    if (apiKey) {
      console.log("- API-nyckel förhandsvisning:", `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`)
      console.log("- Börjar med 're_':", apiKey.startsWith("re_"))
      console.log("- Innehåller endast giltiga tecken:", /^[a-zA-Z0-9_-]+$/.test(apiKey))
    }

    console.log("- Resend-klient initierad:", !!resend)
    console.log("- E-postkonfiguration:", EMAIL_CONFIG)

    // Steg-för-steg validering med specifika felmeddelanden
    if (!apiKey) {
      console.error("❌ STEG 1 MISSLYCKADES: RESEND_API_KEY miljövariabel är inte inställd")
      console.error("💡 Lösning: Lägg till RESEND_API_KEY i dina miljövariabler")
      return {
        success: false,
        message:
          "E-posttjänsten är inte konfigurerad (API-nyckel saknas). Ring oss på 072-8512420 så hjälper vi dig direkt.",
      }
    }

    if (typeof apiKey !== "string") {
      console.error("❌ STEG 2 MISSLYCKADES: RESEND_API_KEY är inte en sträng")
      console.error("💡 Lösning: Se till att RESEND_API_KEY är inställd som ett strängvärde")
      return {
        success: false,
        message: "E-posttjänsten har fel datatyp. Ring oss på 072-8512420 så hjälper vi dig direkt.",
      }
    }

    if (!apiKey.startsWith("re_")) {
      console.error("❌ STEG 3 MISSLYCKADES: RESEND_API_KEY-formatet är ogiltigt - ska börja med 're_'")
      console.error("💡 Lösning: Skaffa en giltig API-nyckel från Resend-instrumentpanelen")
      return {
        success: false,
        message: "E-posttjänsten har en ogiltig API-nyckel. Ring oss på 072-8512420 så hjälper vi dig direkt.",
      }
    }

    if (!resend) {
      console.error("❌ STEG 4 MISSLYCKADES: Resend-klienten inte initierad trots giltig API-nyckel")
      console.error("💡 Detta borde inte hända om tidigare steg klarades")
      return {
        success: false,
        message: "E-posttjänsten kunde inte initialiseras. Ring oss på 072-8512420 så hjälper vi dig direkt.",
      }
    }

    console.log("✅ Alla konfigurationskontroller godkända!")

    // Create HTML email template for the initial email to Glada Fönster
    const gladaFonsterEmailHtml = `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ny Offertförfrågan - Glada Fönster</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">✨ Ny Offertförfrågan</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Glada Fönster AB</p>
    </div>

    <!-- Content -->
    <div style="padding: 30px 20px;">
      <h2 style="color: #1e40af; margin-bottom: 25px; font-size: 22px;">👤 Kunduppgifter</h2>

      <!-- Customer Info Card -->
      <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 140px; color: #374151;">
              👤 Namn:
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">
              ${firstName} ${lastName}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #374151;">
              📧 E-post:
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
              <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                ${email}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #374151;">
              📱 Telefon:
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
              <a href="tel:${phone}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                ${phone}
              </a>
            </td>
          </tr>
          ${
            address
              ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #374151;">
              📍 Adress:
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">
              ${address}
            </td>
          </tr>
          `
              : ""
          }
          <tr>
            <td style="padding: 12px 0; font-weight: bold; color: #374151;">
              🏠 Fastighetstyp:
            </td>
            <td style="padding: 12px 0; color: #1f2937;">
              ${propertyType || "Ej angiven"}
            </td>
          </tr>
        </table>
      </div>

      ${
        description
          ? `
      <!-- Description Card -->
      <div style="background-color: #f0f9ff; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #0c4a6e; margin-top: 0; margin-bottom: 15px; font-size: 18px;">💬 Beskrivning av behov:</h3>
        <p style="line-height: 1.6; color: #374151; margin: 0; font-size: 16px;">${description}</p>
      </div>
      `
          : ""
      }

      <!-- Action Card -->
      <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 25px;">
        <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 18px;">🚀 Nästa steg</h3>
        <p style="margin: 0; color: #1e40af; font-weight: 600; font-size: 16px;">
          📧 Svara direkt på detta mail eller ring kunden på 
          <a href="tel:${phone}" style="color: #1e40af; text-decoration: none;">${phone}</a>
        </p>
      </div>

      <!-- Quick Actions -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="tel:${phone}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0;">
          📞 Ring ${phone}
        </a>
        <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0;">
          📧 Svara via E-post
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #1f2937; color: white; padding: 25px 20px; text-align: center;">
      <h3 style="margin: 0 0 10px 0; font-size: 18px;">Glada Fönster AB</h3>
      <p style="margin: 0; font-size: 14px; opacity: 0.8;">
        📞 072-8512420 | 📧 info@gladafonster.se | 🌐 gladafonster.se
      </p>
      <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.6;">
        Göteborgs mest pålitliga fönsterputsare sedan 2014
      </p>
    </div>
  </div>
</body>
</html>
`

    console.log("📤 Försöker skicka e-post till Glada Fönster...")

    try {
      // Send email to Glada Fönster
      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.to,
        replyTo: email, // Reply to customer's email
        subject: `🏠 Ny offertförfrågan från ${firstName} ${lastName} - Glada Fönster`,
        html: gladaFonsterEmailHtml,
        text: `
Ny offertförfrågan från Glada Fönster webbsida

Kunduppgifter:
Namn: ${firstName} ${lastName}
E-post: ${email}
Telefon: ${phone}
${address ? `Adress: ${address}` : ""}
Fastighetstyp: ${propertyType || "Ej angiven"}
${description ? `Beskrivning: ${description}` : ""}

Ring kunden på ${phone} eller svara på detta mail för att komma i kontakt.

---
Glada Fönster AB
072-8512420 | info@gladafonster.se
    `,
      })

      if (error) {
        console.error("❌ Resend API-fel vid skickande till Glada Fönster:", error)
        console.error("Feldetaljer:", JSON.stringify(error, null, 2))
        return {
          success: false,
          message: `E-postfel: ${error.message || "Okänt fel"}. Ring oss på 072-8512420.`,
        }
      }

      console.log("✅ E-post skickades framgångsrikt till Glada Fönster!")
      console.log("E-postdata (Glada Fönster):", data)

      // --- Send automatic reply to the customer ---
      console.log("📤 Försöker skicka automatiskt svar till kunden...")

      const customerReplyHtml = `
  <!DOCTYPE html>
  <html lang="sv">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tack för din förfrågan - Glada Fönster</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Tack för din förfrågan!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Glada Fönster AB</p>
      </div>

      <!-- Content -->
      <div style="padding: 30px 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Hej ${firstName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Vi har mottagit din förfrågan och vill tacka dig för att du kontaktade Glada Fönster.
          Vi kommer att granska dina uppgifter och återkomma till dig med ett svar inom **max 2 timmar**.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Under tiden kan du besöka vår hemsida för mer information om våra tjänster:
          <br />
          <a href="https://www.gladafonster.se" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
            www.gladafonster.se
          </a>
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Med vänliga hälsningar,
          <br />
          Teamet på Glada Fönster
        </p>

        <!-- Contact Info Card -->
        <div style="background-color: #f0f9ff; padding: 25px; border-radius: 12px; margin-top: 30px; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Kontakta oss direkt:</h3>
          <p style="margin: 0; font-size: 16px; color: #374151;">
            📞 Telefon: <a href="tel:0728512420" style="color: #3b82f6; text-decoration: none; font-weight: 500;">072-8512420</a>
          </p>
          <p style="margin: 10px 0 0 0; font-size: 16px; color: #374151;">
            📧 E-post: <a href="mailto:info@gladafonster.se" style="color: #3b82f6; text-decoration: none; font-weight: 500;">info@gladafonster.se</a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #1f2937; color: white; padding: 25px 20px; text-align: center;">
        <h3 style="margin: 0 0 10px 0; font-size: 18px;">Glada Fönster AB</h3>
        <p style="margin: 0; font-size: 14px; opacity: 0.8;">
          Göteborgs mest pålitliga fönsterputsare sedan 2014
        </p>
      </div>
    </div>
  </body>
  </html>
  `

      const { data: replyData, error: replyError } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: email, // Send to the customer's email
        subject: `Tack för din förfrågan till Glada Fönster!`,
        html: customerReplyHtml,
        text: `
Hej ${firstName},

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

      if (replyError) {
        console.error("❌ Resend API-fel vid skickande av autosvar till kund:", replyError)
        console.error("Feldetaljer (autosvar):", JSON.stringify(replyError, null, 2))
        // Do not return error here, as the primary email to Glada Fönster was successful.
        // Just log the error for the auto-reply.
      } else {
        console.log("✅ Automatiskt svar skickades framgångsrikt till kunden!")
        console.log("E-postdata (Autosvar):", replyData)
      }

      return {
        success: true,
        message: "Tack för din förfrågan! Vi återkommer inom 2 timmar.",
      }
    } catch (emailError: any) {
      console.error("❌ E-postskickning misslyckades (huvudfel):", emailError)
      console.error("E-postfeldetaljer:", {
        message: emailError.message,
        stack: emailError.stack,
        name: emailError.name,
      })
      return {
        success: false,
        message: `Tekniskt fel: ${emailError.message}. Ring oss direkt på 072-8512420.`,
      }
    }
  } catch (error: any) {
    console.error("❌ Serveråtgärdsfel (toppnivå):", error)
    console.error("Åtgärdsfeldetaljer:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return {
      success: false,
      message: `Systemfel: ${error.message}. Ring oss direkt på 072-8512420.`,
    }
  }
}

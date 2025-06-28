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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ny Offertförfrågan - Glada Fönster</title>
</head>
<body style="background: #f5f6fa; margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f5f6fa; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(80,69,229,0.07);">
          <tr>
            <td align="center" style="padding: 32px 24px 0 24px;">
              <img src="https://gladafonster.se/email-drop.png" alt="Glada Fönster Logo" width="48" height="48" style="display:block; margin-bottom: 8px;" />
              <div style="color: #5045e5; font-weight: bold; font-size: 22px; margin-bottom: 8px;">Glada Fönster Städ AB</div>
              <div style="font-size: 15px; color: #444; font-style: italic; margin-bottom: 18px; max-width: 340px;">
                Vi putsar inte bara fönster – vi förvandlar dem till speglar så klara att du kommer att svåra på att du kan se <span style="color:#5045e5; font-weight:600;">ABBA</span> sjunga <span style="font-weight:600;">"Dancing Queen"</span> i din trädgård.
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f7f7fc; border-radius: 6px;">
                <tr>
                  <td style="padding: 24px 20px 20px 20px; color: #222; font-size: 16px;">
                    <div style="font-weight:600; margin-bottom: 12px;">Hej ${firstName}${lastName ? ' ' + lastName : ''},</div>
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

    console.log("📤 Försöker skicka e-post till Glada Fönster...")

    try {
      // Send email to Glada Fönster (both addresses)
      const { data, error } = await resend.emails.send({
        from: EMAIL_CONFIG.from,
        to: EMAIL_CONFIG.to, // This will send to both info@gladafonster.se and mmgladafonster@gmail.com
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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Glada Fönster Städ AB - Bekräftelse</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      min-height: 100vh;
      background: #f5f6fa;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow-x: hidden;
    }
    .bg-geo {
      position: absolute;
      inset: 0;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .geo-shape {
      width: 600px;
      height: 600px;
      background: linear-gradient(135deg, #a18fff 0%, #7c5cff 100%);
      opacity: 0.3;
      transform: rotate(12deg);
      border-radius: 24px;
    }
    .main-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 400px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(80, 69, 229, 0.10);
      overflow: hidden;
      margin: 0 auto;
    }
    .card-header {
      padding: 32px 0 8px 0;
      text-align: center;
      background: #fff;
    }
    .card-header img {
      max-width: 48px;
      margin: 0 auto 8px auto;
      display: block;
    }
    .company-name {
      color: #5045e5;
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 4px;
    }
    .company-desc {
      font-size: 14px;
      color: #555;
      font-style: italic;
      margin-bottom: 16px;
      text-align: center;
      max-width: 260px;
      margin-left: auto;
      margin-right: auto;
    }
    .company-desc .highlight {
      color: #5045e5;
      font-weight: bold;
      font-style: normal;
    }
    .company-desc .song {
      color: #000;
      font-weight: bold;
      font-style: normal;
    }
    .card-content {
      background: #f7f7fb;
      padding: 24px 32px 32px 32px;
      text-align: left;
    }
    .card-content .greeting {
      font-weight: bold;
      font-size: 16px;
      color: #222;
      margin-bottom: 16px;
      display: block;
    }
    .card-content p {
      font-size: 16px;
      color: #222;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }
    .card-content .bold {
      font-weight: bold;
    }
    .card-content .phone {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      font-size: 16px;
    }
    .card-content .phone .phone-number {
      color: #5045e5;
      text-decoration: none;
    }
    .card-footer {
      background: #fff;
      padding: 16px 32px;
      border-top: 1px solid #ececec;
      text-align: center;
    }
    .card-footer a {
      font-size: 20px;
      font-weight: bold;
      color: #5045e5;
      text-decoration: underline;
      display: inline-block;
      margin-top: 8px;
    }
    @media (max-width: 500px) {
      .main-card {
        max-width: 98vw;
        border-radius: 10px;
      }
      .card-content, .card-footer {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="bg-geo">
    <div class="geo-shape"></div>
  </div>
  <div class="main-card">
    <div class="card-header">
      <img src="https://glada-13-14.vercel.app/glada-fonster-kungsbacka-happy.png" alt="Företagslogo" />
      <div class="company-name">Glada Fönster Städ AB</div>
      <div class="company-desc">
        Vi putsar inte bara fönster – vi förvandlar dem till speglar så klara att du kommer att svära på att du kan se
        <span class="highlight">ABBA</span> sjunga <span class="song">"Dancing Queen"</span> i din trädgård.
      </div>
    </div>
    <div class="card-content">
      <span class="greeting">Hej ${firstName},</span>
      <p>Vi har mottagit din förfrågan och vill tacka dig för att du kontaktat Glada Fönster.</p>
      <p>Vi kommer att granska dina uppgifter och återkomma till dig med ett svar via e-post inom högst 2 timmar.</p>
      <p>Om du ringer oss <span class="bold">svarar vi i genomsnitt inom 5 sekunder.</span></p>
      <p class="bold">Vänliga hälsningar,<br />Glada Fönster</p>
      <span class="phone">📞 <a href="tel:072-851-2420" class="phone-number">Telefon: 072-851-2420</a></span>
    </div>
    <div class="card-footer">
      <a href="https://gladafonster.se/">https://gladafonster.se/</a>
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

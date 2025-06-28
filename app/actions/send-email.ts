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
      max-width: 500px;
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
    .notification-badge {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 24px;
      font-weight: bold;
      font-size: 16px;
    }
    .customer-info {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      border-left: 4px solid #5045e5;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .customer-info h3 {
      color: #5045e5;
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: bold;
    }
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    .info-label {
      font-weight: bold;
      color: #555;
      width: 100px;
      flex-shrink: 0;
    }
    .info-value {
      color: #222;
      flex: 1;
    }
    .info-value a {
      color: #5045e5;
      text-decoration: none;
      font-weight: 500;
    }
    .description-card {
      background: #f0f9ff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      border-left: 4px solid #0ea5e9;
    }
    .description-card h4 {
      color: #0c4a6e;
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: bold;
    }
    .description-text {
      color: #374151;
      line-height: 1.6;
      margin: 0;
    }
    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    .action-btn {
      flex: 1;
      min-width: 140px;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      text-align: center;
      font-weight: bold;
      font-size: 14px;
      transition: transform 0.2s;
    }
    .action-btn:hover {
      transform: translateY(-2px);
    }
    .btn-call {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }
    .btn-email {
      background: linear-gradient(135deg, #5045e5 0%, #7c5cff 100%);
      color: white;
    }
    .card-footer {
      background: #fff;
      padding: 16px 32px;
      border-top: 1px solid #ececec;
      text-align: center;
    }
    .card-footer a {
      font-size: 16px;
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
        padding-left: 16px;
        padding-right: 16px;
      }
      .action-buttons {
        flex-direction: column;
      }
      .action-btn {
        min-width: auto;
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
      <div class="notification-badge">
        🎉 Ny offertförfrågan mottagen!
      </div>
      
      <div class="customer-info">
        <h3>👤 Kunduppgifter</h3>
        <div class="info-row">
          <span class="info-label">Namn:</span>
          <span class="info-value">${firstName} ${lastName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">E-post:</span>
          <span class="info-value"><a href="mailto:${email}">${email}</a></span>
        </div>
        <div class="info-row">
          <span class="info-label">Telefon:</span>
          <span class="info-value"><a href="tel:${phone}">${phone}</a></span>
        </div>
        ${address ? `
        <div class="info-row">
          <span class="info-label">Adress:</span>
          <span class="info-value">${address}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Fastighet:</span>
          <span class="info-value">${propertyType || "Ej angiven"}</span>
        </div>
      </div>

      ${description ? `
      <div class="description-card">
        <h4>💬 Kundens beskrivning</h4>
        <p class="description-text">${description}</p>
      </div>
      ` : ''}

      <div class="action-buttons">
        <a href="tel:${phone}" class="action-btn btn-call">📞 Ring ${firstName}</a>
        <a href="mailto:${email}" class="action-btn btn-email">📧 Svara via E-post</a>
      </div>
    </div>
    <div class="card-footer">
      <a href="https://gladafonster.se/">https://gladafonster.se/</a>
    </div>
  </div>
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

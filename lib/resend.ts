import { Resend } from "resend"

// Hämta API-nyckel från miljövariabler
const apiKey = process.env.RESEND_API_KEY

// Förbättrad loggning för felsökning
console.log("🔑 Resend Konfigurationskontroll:")
console.log("- Miljö:", process.env.NODE_ENV || "development")
console.log("- API-nyckel finns:", !!apiKey)
console.log("- API-nyckel längd:", apiKey?.length || 0)
console.log("- API-nyckel format giltigt:", apiKey?.startsWith("re_") || false)

// Validera API-nyckelformat
if (apiKey && !apiKey.startsWith("re_")) {
  console.error("❌ Ogiltigt RESEND_API_KEY-format - ska börja med 're_'")
}

// Initiera Resend-klienten endast om API-nyckeln är giltig
export const resend = apiKey && apiKey.startsWith("re_") ? new Resend(apiKey) : null

// E-postkonfiguration
export const EMAIL_CONFIG = {
  from: "info@gladafonster.se", // Se till att denna domän är verifierad i Resend
  to: ["info@gladafonster.se", "mmgladafonster@gmail.com"], // Båda adresserna får e-post
  replyTo: "info@gladafonster.se",
}

// Logga slutlig konfiguration
console.log("📧 E-postkonfiguration:")
console.log("- Från:", EMAIL_CONFIG.from)
console.log("- Till:", EMAIL_CONFIG.to)
console.log("- Svara till:", EMAIL_CONFIG.replyTo)
console.log("- Resend-klient redo:", !!resend)

// Varning om inte konfigurerad
if (!resend && typeof window === "undefined") {
  console.warn("⚠️ RESEND_API_KEY är inte korrekt konfigurerad. E-postfunktionalitet kommer att vara inaktiverad.")
  console.warn("📝 För att åtgärda detta:")
  console.warn("   1. Lägg till RESEND_API_KEY till dina miljövariabler")
  console.warn("   2. Se till att nyckeln börjar med 're_'")
  console.warn("   3. Verifiera din domän 'gladafonster.se' i Resend-instrumentpanelen")
}

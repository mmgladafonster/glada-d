import { Resend } from "resend"

// Hämta API-nyckel från miljövariabler
const apiKey = process.env.RESEND_API_KEY

// Validate API key format (secure logging)
if (apiKey && !apiKey.startsWith("re_")) {
  console.error("❌ Invalid RESEND_API_KEY format")
}

// Initiera Resend-klienten endast om API-nyckeln är giltig
export const resend = apiKey && apiKey.startsWith("re_") ? new Resend(apiKey) : null

// E-postkonfiguration
export const EMAIL_CONFIG = {
  from: "Glada Fönster <info@gladafonster.se>", // Se till att denna domän är verifierad i Resend
  to: ["info@gladafonster.se", "mmgladafonster@gmail.com"], // Båda adresserna får e-post
  replyTo: "info@gladafonster.se",
}

// Warning if not configured (secure logging)
if (!resend && typeof window === "undefined") {
  console.warn("⚠️ Email service not configured properly")
}

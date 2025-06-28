import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY

  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: "error",
    resend: {
      configured: false,
      apiKeyExists: !!apiKey,
      apiKeyIsValid: false,
      message: "Configuration check failed.",
    },
  }

  if (!apiKey) {
    healthCheck.resend.message =
      "❌ RESEND_API_KEY environment variable is NOT SET. Please add it to your Vercel project settings and redeploy."
  } else if (typeof apiKey !== "string") {
    healthCheck.resend.message = "❌ RESEND_API_KEY is not a string. Check your environment variable configuration."
  } else if (!apiKey.startsWith("re_")) {
    healthCheck.resend.message = '❌ RESEND_API_KEY format is invalid. It must start with "re_".'
  } else {
    healthCheck.status = "ok"
    healthCheck.resend.configured = true
    healthCheck.resend.apiKeyIsValid = true
    healthCheck.resend.message = "✅ Resend API key is configured correctly on the server."
  }

  return NextResponse.json(healthCheck)
}

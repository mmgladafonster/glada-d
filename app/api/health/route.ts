import { NextResponse } from "next/server"
import { checkHealthRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"
import { recordRateLimitViolation } from "@/lib/security-monitor"
import { sanitizeEnvironmentForResponse, checkResponseForExposure } from "@/lib/env-exposure-scanner"

// Simple health check interface - no sensitive information exposed
interface HealthResponse {
  status: "ok" | "error"
  timestamp: string
  service: string
}

export async function GET() {
  // Rate limiting for health endpoint
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                   headersList.get('x-real-ip') || 
                   'unknown'

  if (!checkHealthRateLimit(ipAddress)) {
    logger.rateLimit("Health endpoint rate limit exceeded", `ip:${ipAddress}`, ipAddress)
    recordRateLimitViolation(ipAddress, `health:${ipAddress}`)
    return NextResponse.json(
      { status: "error", timestamp: new Date().toISOString(), service: "Glada Fönster API" },
      { status: 429 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  
  // Perform internal health checks
  let isHealthy = true
  let errorDetails = ""

  // Check email service configuration (log details server-side only)
  if (!apiKey) {
    isHealthy = false
    errorDetails = "RESEND_API_KEY environment variable is not set"
    logger.health("Missing RESEND_API_KEY environment variable", false, { error: errorDetails })
  } else if (typeof apiKey !== "string") {
    isHealthy = false
    errorDetails = "RESEND_API_KEY is not a string"
    logger.health("RESEND_API_KEY is not a string type", false, { error: errorDetails })
  } else if (!apiKey.startsWith("re_")) {
    isHealthy = false
    errorDetails = "RESEND_API_KEY format is invalid"
    logger.health("RESEND_API_KEY format is invalid - must start with 're_'", false, { error: errorDetails })
  } else {
    logger.health("Email service configuration is valid", true)
  }

  // Log overall health status
  if (!isHealthy) {
    logger.health(`Service unhealthy: ${errorDetails}`, false, { ipAddress })
  }

  // Return minimal, safe response to client
  const healthResponse: HealthResponse = {
    status: isHealthy ? "ok" : "error",
    timestamp: new Date().toISOString(),
    service: "Glada Fönster API"
  }

  // Environment exposure protection (development check)
  if (process.env.NODE_ENV === 'development') {
    const exposureCheck = checkResponseForExposure(healthResponse)
    if (exposureCheck.hasExposure) {
      logger.warn("Environment exposure detected in health response", "ENV_EXPOSURE", {
        exposedPatterns: exposureCheck.exposedPatterns,
        ipAddress
      })
    }
  }

  return NextResponse.json(sanitizeEnvironmentForResponse(healthResponse))
}

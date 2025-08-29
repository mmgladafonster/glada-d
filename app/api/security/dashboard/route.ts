import { NextResponse } from "next/server"
import { securityMonitor } from "@/lib/security-monitor"
import { validateEnvironment, getEnvironmentInfo } from "@/lib/env-validator"
import { checkHealthRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"

// Security dashboard endpoint - restricted access
export async function GET() {
  // Rate limiting
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                   headersList.get('x-real-ip') || 
                   'unknown'

  if (!checkHealthRateLimit(ipAddress)) {
    logger.rateLimit("Security dashboard rate limit exceeded", `ip:${ipAddress}`, ipAddress)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    )
  }

  try {
    // Get security summary
    const securitySummary = securityMonitor.getSecuritySummary()
    
    // Get environment validation
    const envValidation = validateEnvironment()
    const envInfo = getEnvironmentInfo()

    // Calculate security score
    const securityScore = calculateSecurityScore(securitySummary, envValidation)

    const dashboardData = {
      status: securitySummary.status,
      securityScore,
      timestamp: new Date().toISOString(),
      
      // Security metrics
      metrics: securitySummary.metrics,
      
      // Recent activity
      recentActivity: {
        totalEvents: securitySummary.recentEvents,
        criticalEvents: securitySummary.criticalEvents,
        highEvents: securitySummary.highEvents
      },
      
      // Environment status
      environment: {
        isValid: envValidation.isValid,
        errorCount: envValidation.errors.length,
        warningCount: envValidation.warnings.length,
        nodeEnv: envInfo.nodeEnv,
        configuredServices: {
          email: envInfo.hasResendKey,
          recaptcha: envInfo.hasRecaptchaSecret && envInfo.hasRecaptchaSiteKey
        }
      },
      
      // System health
      systemHealth: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version
      }
    }

    // Log dashboard access
    logger.info("Security dashboard accessed", "SECURITY_DASHBOARD", { 
      ipAddress,
      securityScore,
      status: securitySummary.status
    })

    return NextResponse.json(dashboardData)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Security dashboard error: ${errorMessage}`, "SECURITY_DASHBOARD", { ipAddress })
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Calculate overall security score
function calculateSecurityScore(securitySummary: any, envValidation: any): number {
  let score = 100

  // Deduct points for environment issues
  score -= envValidation.errors.length * 10
  score -= envValidation.warnings.length * 2

  // Deduct points for security incidents
  if (securitySummary.status === 'critical') score -= 20
  if (securitySummary.status === 'warning') score -= 10

  // Deduct points for high activity
  if (securitySummary.criticalEvents > 0) score -= 15
  if (securitySummary.highEvents > 5) score -= 10
  if (securitySummary.recentEvents > 50) score -= 5

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score))
}
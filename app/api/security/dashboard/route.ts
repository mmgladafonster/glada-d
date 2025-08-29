import { NextResponse } from "next/server"
import { securityMonitor } from "@/lib/security-monitor"
import { validateEnvironment, getEnvironmentInfo } from "@/lib/env-validator"
import { checkHealthRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"
import { securityAlerts } from "@/lib/security-alerts"
import { runDependencyScan } from "@/lib/dependency-scanner"

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

    // Get security alerts
    const recentAlerts = securityAlerts.getRecentAlerts(20)
    const alertStats = securityAlerts.getAlertStats()

    // Get dependency scan results (with timeout)
    let dependencyScan = null
    try {
      const scanPromise = runDependencyScan()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Dependency scan timeout')), 10000)
      )
      dependencyScan = await Promise.race([scanPromise, timeoutPromise]) as any
    } catch (error) {
      logger.warn("Dependency scan failed for dashboard", "SECURITY_DASHBOARD", {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Calculate security score
    const securityScore = calculateSecurityScore(securitySummary, envValidation, alertStats, dependencyScan)

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
      },
      
      // Security alerts
      alerts: {
        recent: recentAlerts.slice(0, 10), // Last 10 alerts
        statistics: alertStats,
        criticalCount: recentAlerts.filter(a => a.severity === 'critical').length,
        highCount: recentAlerts.filter(a => a.severity === 'high').length
      },
      
      // Dependency security
      dependencies: dependencyScan ? {
        vulnerabilities: dependencyScan.summary,
        overallRisk: dependencyScan.overallRisk,
        totalPackages: dependencyScan.dependencies.length,
        outdatedPackages: dependencyScan.dependencies.filter((d: any) => d.outdated).length,
        criticalVulnerabilities: dependencyScan.vulnerabilities.filter((v: any) => v.severity === 'critical'),
        recommendations: dependencyScan.recommendations.slice(0, 3)
      } : {
        status: 'scan_unavailable',
        message: 'Dependency scan not available'
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
function calculateSecurityScore(securitySummary: any, envValidation: any, alertStats: any, dependencyScan: any): number {
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

  // Deduct points for security alerts
  if (alertStats.bySeverity?.critical > 0) score -= 25
  if (alertStats.bySeverity?.high > 2) score -= 15
  if (alertStats.last24Hours > 10) score -= 10

  // Deduct points for dependency vulnerabilities
  if (dependencyScan?.summary) {
    score -= dependencyScan.summary.critical * 20
    score -= dependencyScan.summary.high * 10
    score -= dependencyScan.summary.moderate * 3
    
    // Deduct points for many outdated packages
    const outdatedCount = dependencyScan.dependencies?.filter((d: any) => d.outdated).length || 0
    if (outdatedCount > 10) score -= 5
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score))
}
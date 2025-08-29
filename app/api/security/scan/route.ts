import { NextResponse } from "next/server"
import { runSecurityScan } from "@/lib/security-scanner"
import { checkHealthRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"

// Security scan endpoint - for automated security monitoring
export async function GET() {
  // Rate limiting
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                   headersList.get('x-real-ip') || 
                   'unknown'

  if (!checkHealthRateLimit(ipAddress)) {
    logger.rateLimit("Security scan rate limit exceeded", `ip:${ipAddress}`, ipAddress)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    )
  }

  try {
    logger.info("Security scan requested", "SECURITY_SCAN", { ipAddress })
    
    // Run comprehensive security scan
    const scanResult = await runSecurityScan()
    
    // Log scan completion
    logger.info("Security scan completed", "SECURITY_SCAN", {
      ipAddress,
      overallStatus: scanResult.overallStatus,
      securityScore: scanResult.securityScore,
      totalChecks: scanResult.checks.length,
      failedChecks: scanResult.checks.filter(c => c.status === 'fail').length
    })

    return NextResponse.json(scanResult)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Security scan error: ${errorMessage}`, "SECURITY_SCAN", { ipAddress })
    
    return NextResponse.json(
      { 
        error: "Security scan failed",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST endpoint for triggering manual scans with options
export async function POST(request: Request) {
  // Rate limiting
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                   headersList.get('x-real-ip') || 
                   'unknown'

  if (!checkHealthRateLimit(ipAddress)) {
    logger.rateLimit("Security scan rate limit exceeded", `ip:${ipAddress}`, ipAddress)
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { includeRecommendations = true, detailedOutput = false } = body

    logger.info("Manual security scan requested", "SECURITY_SCAN", { 
      ipAddress,
      includeRecommendations,
      detailedOutput
    })
    
    // Run security scan
    const scanResult = await runSecurityScan()
    
    // Filter output based on options
    let response = scanResult
    if (!includeRecommendations) {
      response = { ...scanResult, recommendations: [] }
    }
    if (!detailedOutput) {
      response = {
        ...response,
        checks: response.checks.map(check => ({
          name: check.name,
          status: check.status,
          severity: check.severity
        }))
      }
    }

    logger.info("Manual security scan completed", "SECURITY_SCAN", {
      ipAddress,
      overallStatus: scanResult.overallStatus,
      securityScore: scanResult.securityScore
    })

    return NextResponse.json(response)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Manual security scan error: ${errorMessage}`, "SECURITY_SCAN", { ipAddress })
    
    return NextResponse.json(
      { 
        error: "Security scan failed",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
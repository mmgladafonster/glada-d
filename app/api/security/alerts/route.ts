import { NextRequest, NextResponse } from 'next/server'
import { securityAlerts } from '@/lib/security-alerts'
import { ERROR_MESSAGES, ERROR_CODES, createSecureErrorResponse } from '@/lib/error-messages'

// Security alerts management endpoint (development and admin only)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'recent':
        const limit = parseInt(searchParams.get('limit') || '50')
        const recentAlerts = securityAlerts.getRecentAlerts(limit)
        
        return NextResponse.json({
          success: true,
          alerts: recentAlerts,
          count: recentAlerts.length,
          timestamp: new Date().toISOString()
        })

      case 'stats':
        const stats = securityAlerts.getAlertStats()
        
        return NextResponse.json({
          success: true,
          statistics: stats,
          timestamp: new Date().toISOString()
        })

      case 'test':
        // Only allow in development
        if (process.env.NODE_ENV !== 'development') {
          return NextResponse.json(
            createSecureErrorResponse(
              ERROR_MESSAGES.ACCESS_DENIED,
              ERROR_CODES.SECURITY_VIOLATION,
              "Attempted access to alert test endpoint in production"
            ),
            { status: 403 }
          )
        }

        const severity = searchParams.get('severity') as 'low' | 'medium' | 'high' | 'critical' || 'medium'
        
        await securityAlerts.createAlert(
          severity,
          'system',
          'Test Security Alert',
          `This is a test ${severity} severity alert generated for testing purposes`,
          { testMode: true, timestamp: new Date().toISOString() },
          '127.0.0.1',
          'test@example.com'
        )

        return NextResponse.json({
          success: true,
          message: `Test ${severity} alert created`,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: true,
          message: "Security alerts management endpoint",
          availableActions: ['recent', 'stats', 'test'],
          usage: "Add ?action=<action-name> to access different features"
        })
    }
  } catch (error) {
    return NextResponse.json(
      createSecureErrorResponse(
        ERROR_MESSAGES.GENERIC_ERROR,
        ERROR_CODES.SYSTEM_ERROR,
        `Security alerts endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`
      ),
      { status: 500 }
    )
  }
}

// Update alert configuration (POST)
export async function POST(request: NextRequest) {
  // Only allow in development or with proper authentication
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      createSecureErrorResponse(
        ERROR_MESSAGES.ACCESS_DENIED,
        ERROR_CODES.SECURITY_VIOLATION,
        "Attempted to modify alert configuration in production"
      ),
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    
    // Validate configuration
    const allowedFields = ['enabled', 'emailAlerts', 'webhookAlerts', 'alertThresholds', 'emailRecipients', 'webhookUrl', 'cooldownPeriod']
    const config: any = {}
    
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        config[key] = body[key]
      }
    })

    securityAlerts.updateConfig(config)

    return NextResponse.json({
      success: true,
      message: "Alert configuration updated",
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      createSecureErrorResponse(
        ERROR_MESSAGES.VALIDATION_ERROR,
        ERROR_CODES.VALIDATION_FAILED,
        `Invalid alert configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      ),
      { status: 400 }
    )
  }
}
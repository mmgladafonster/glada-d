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

        const severityParam = searchParams.get('severity')
        const validSeverities = ['low', 'medium', 'high', 'critical'] as const
        const severity = validSeverities.includes(severityParam as any)
          ? severityParam as typeof validSeverities[number]
          : 'medium'

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

// Define the expected configuration type
interface AlertConfigUpdate {
  enabled?: boolean
  emailAlerts?: boolean
  webhookAlerts?: boolean
  alertThresholds?: {
    critical?: number
    high?: number
    medium?: number
    low?: number
  }
  emailRecipients?: string[]
  webhookUrl?: string
  cooldownPeriod?: number
}

// Type validator functions
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value)
const isString = (value: unknown): value is string => typeof value === 'string'
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === 'string')
const isThresholds = (value: unknown): value is AlertConfigUpdate['alertThresholds'] =>
  typeof value === 'object' && value !== null &&
  Object.entries(value).every(([key, val]) =>
    ['critical', 'high', 'medium', 'low'].includes(key) && isNumber(val)
  )

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

    // Validate configuration with proper type checking
    const allowedFields: (keyof AlertConfigUpdate)[] = [
      'enabled', 'emailAlerts', 'webhookAlerts', 'alertThresholds',
      'emailRecipients', 'webhookUrl', 'cooldownPeriod'
    ]
    const config: AlertConfigUpdate = {}
    const validationErrors: string[] = []

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key as keyof AlertConfigUpdate)) {
        const value = body[key]

        // Validate each field's value type
        switch (key) {
          case 'enabled':
          case 'emailAlerts':
          case 'webhookAlerts':
            if (isBoolean(value)) {
              config[key] = value
            } else {
              validationErrors.push(`${key} must be a boolean`)
            }
            break
          case 'cooldownPeriod':
            if (isNumber(value) && value > 0) {
              config[key] = value
            } else {
              validationErrors.push(`${key} must be a positive number`)
            }
            break
          case 'webhookUrl':
            if (isString(value) && (value === '' || value.startsWith('http'))) {
              config[key] = value
            } else {
              validationErrors.push(`${key} must be a valid URL or empty string`)
            }
            break
          case 'emailRecipients':
            if (isStringArray(value)) {
              config[key] = value
            } else {
              validationErrors.push(`${key} must be an array of strings`)
            }
            break
          case 'alertThresholds':
            if (isThresholds(value)) {
              config[key] = value
            } else {
              validationErrors.push(`${key} must be an object with numeric threshold values`)
            }
            break
        }
      }
    })

    if (validationErrors.length > 0) {
      return NextResponse.json(
        createSecureErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          ERROR_CODES.VALIDATION_FAILED,
          `Configuration validation failed: ${validationErrors.join(', ')}`
        ),
        { status: 400 }
      )
    }

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
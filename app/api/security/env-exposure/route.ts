import { NextRequest, NextResponse } from 'next/server'
import { scanEnvironmentExposure, sanitizeEnvironmentForResponse, checkResponseForExposure } from '@/lib/env-exposure-scanner'
import { getSafeEnvironmentInfo } from '@/lib/env-validator'
import { ERROR_MESSAGES, ERROR_CODES, createSecureErrorResponse } from '@/lib/error-messages'

// Environment exposure scanning endpoint (development only)
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      createSecureErrorResponse(
        ERROR_MESSAGES.ACCESS_DENIED,
        ERROR_CODES.SECURITY_VIOLATION,
        "Attempted access to environment exposure endpoint in production"
      ),
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'scan':
        const scanResult = scanEnvironmentExposure()
        return NextResponse.json({
          success: true,
          scan: scanResult,
          timestamp: new Date().toISOString()
        })

      case 'safe-info':
        const safeInfo = getSafeEnvironmentInfo()
        return NextResponse.json({
          success: true,
          environmentInfo: safeInfo,
          timestamp: new Date().toISOString()
        })

      case 'test-sanitization':
        const testData = {
          apiKey: 're_1234567890abcdefghij',
          recaptchaSecret: '6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          normalData: 'This is safe data',
          userEmail: 'test@example.com'
        }
        
        const sanitized = sanitizeEnvironmentForResponse(testData)
        const exposureCheck = checkResponseForExposure(testData)
        
        return NextResponse.json({
          success: true,
          original: testData,
          sanitized,
          exposureCheck,
          timestamp: new Date().toISOString()
        })

      case 'test-response-check':
        const mockResponse = {
          message: 'API Key: re_1234567890abcdefghij was used',
          data: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature' }
        }
        
        const responseCheck = checkResponseForExposure(mockResponse)
        
        return NextResponse.json({
          success: true,
          testResponse: mockResponse,
          exposureDetected: responseCheck,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: true,
          message: "Environment exposure detection endpoint",
          availableActions: ['scan', 'safe-info', 'test-sanitization', 'test-response-check'],
          usage: "Add ?action=<action-name> to test different features"
        })
    }
  } catch (error) {
    return NextResponse.json(
      createSecureErrorResponse(
        ERROR_MESSAGES.GENERIC_ERROR,
        ERROR_CODES.SYSTEM_ERROR,
        `Environment exposure endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`
      ),
      { status: 500 }
    )
  }
}
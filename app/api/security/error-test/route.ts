import { NextRequest, NextResponse } from 'next/server'
import { ERROR_MESSAGES, ERROR_CODES, createSecureErrorResponse, validateErrorMessage, formatSafeErrorMessage } from '@/lib/error-messages'

// Test endpoint for error message security (development only)
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      createSecureErrorResponse(
        ERROR_MESSAGES.ACCESS_DENIED,
        ERROR_CODES.SECURITY_VIOLATION,
        "Attempted access to error test endpoint in production"
      ),
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const testType = searchParams.get('type')

  switch (testType) {
    case 'safe':
      return NextResponse.json({
        success: true,
        message: "This is a safe error message",
        validation: validateErrorMessage("This is a safe error message")
      })

    case 'unsafe':
      const unsafeMessage = "Database connection failed at line 42 in user.sql with API key abc123"
      return NextResponse.json({
        success: false,
        message: formatSafeErrorMessage(unsafeMessage),
        originalMessage: unsafeMessage,
        validation: validateErrorMessage(unsafeMessage),
        sanitized: true
      })

    case 'secure-response':
      return NextResponse.json(
        createSecureErrorResponse(
          ERROR_MESSAGES.VALIDATION_ERROR,
          ERROR_CODES.VALIDATION_FAILED,
          "Test validation error with sensitive data: password=secret123",
          "test@example.com",
          "127.0.0.1"
        )
      )

    case 'all-messages':
      return NextResponse.json({
        success: true,
        errorMessages: ERROR_MESSAGES,
        errorCodes: Object.keys(ERROR_CODES),
        validation: Object.entries(ERROR_MESSAGES).map(([key, message]) => ({
          key,
          message,
          isSafe: validateErrorMessage(message)
        }))
      })

    default:
      return NextResponse.json({
        success: true,
        message: "Error message security test endpoint",
        availableTests: ['safe', 'unsafe', 'secure-response', 'all-messages'],
        usage: "Add ?type=<test-type> to test different scenarios"
      })
  }
}
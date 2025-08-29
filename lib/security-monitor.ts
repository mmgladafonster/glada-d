// Security monitoring and metrics collection
import { logger } from "./logger"
import { createCriticalAlert, createHighAlert, createMediumAlert } from "./security-alerts"

interface SecurityMetrics {
  rateLimitViolations: number
  recaptchaFailures: number
  validationErrors: number
  emailSendFailures: number
  lastIncident: string | null
  totalRequests: number
  blockedRequests: number
}

interface SecurityEvent {
  type: 'rate_limit' | 'recaptcha_failure' | 'validation_error' | 'email_failure' | 'suspicious_activity'
  timestamp: string
  ipAddress?: string
  userIdentifier?: string
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class SecurityMonitor {
  private metrics: SecurityMetrics = {
    rateLimitViolations: 0,
    recaptchaFailures: 0,
    validationErrors: 0,
    emailSendFailures: 0,
    lastIncident: null,
    totalRequests: 0,
    blockedRequests: 0
  }

  private recentEvents: SecurityEvent[] = []
  private readonly maxEvents = 100 // Keep last 100 events

  // Record security events
  recordEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    }

    this.recentEvents.push(securityEvent)
    
    // Keep only recent events
    if (this.recentEvents.length > this.maxEvents) {
      this.recentEvents = this.recentEvents.slice(-this.maxEvents)
    }

    // Update metrics
    this.updateMetrics(securityEvent)
    
    // Log the event
    logger.security(
      `Security event: ${event.type} - ${event.details}`,
      event.type.toUpperCase(),
      event.userIdentifier,
      event.ipAddress,
      { severity: event.severity }
    )
  }

  private updateMetrics(event: SecurityEvent): void {
    this.metrics.lastIncident = event.timestamp
    this.metrics.totalRequests++

    switch (event.type) {
      case 'rate_limit':
        this.metrics.rateLimitViolations++
        this.metrics.blockedRequests++
        break
      case 'recaptcha_failure':
        this.metrics.recaptchaFailures++
        this.metrics.blockedRequests++
        break
      case 'validation_error':
        this.metrics.validationErrors++
        break
      case 'email_failure':
        this.metrics.emailSendFailures++
        break
    }
  }

  // Get current security metrics
  getMetrics(): SecurityMetrics {
    return { ...this.metrics }
  }

  // Get recent security events
  getRecentEvents(limit = 20): SecurityEvent[] {
    return this.recentEvents.slice(-limit).reverse()
  }

  // Get security summary
  getSecuritySummary() {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    const recentEvents = this.recentEvents.filter(
      event => new Date(event.timestamp) > oneHourAgo
    )

    const criticalEvents = recentEvents.filter(event => event.severity === 'critical')
    const highEvents = recentEvents.filter(event => event.severity === 'high')

    return {
      totalEvents: this.recentEvents.length,
      recentEvents: recentEvents.length,
      criticalEvents: criticalEvents.length,
      highEvents: highEvents.length,
      metrics: this.metrics,
      status: this.getSecurityStatus(),
      lastUpdated: now.toISOString()
    }
  }

  private getSecurityStatus(): 'healthy' | 'warning' | 'critical' {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    const recentEvents = this.recentEvents.filter(
      event => new Date(event.timestamp) > oneHourAgo
    )

    const criticalEvents = recentEvents.filter(event => event.severity === 'critical')
    const highEvents = recentEvents.filter(event => event.severity === 'high')

    if (criticalEvents.length > 0) return 'critical'
    if (highEvents.length > 5 || recentEvents.length > 50) return 'warning'
    return 'healthy'
  }

  // Reset metrics (for testing or maintenance)
  resetMetrics(): void {
    this.metrics = {
      rateLimitViolations: 0,
      recaptchaFailures: 0,
      validationErrors: 0,
      emailSendFailures: 0,
      lastIncident: null,
      totalRequests: 0,
      blockedRequests: 0
    }
    this.recentEvents = []
    
    logger.info("Security metrics reset", "SECURITY_MONITOR")
  }

  // Generate security report
  generateReport(): string {
    const summary = this.getSecuritySummary()
    const recentEvents = this.getRecentEvents(10)

    return `
SECURITY MONITORING REPORT
Generated: ${summary.lastUpdated}
Status: ${summary.status.toUpperCase()}

METRICS:
- Total Requests: ${summary.metrics.totalRequests}
- Blocked Requests: ${summary.metrics.blockedRequests}
- Rate Limit Violations: ${summary.metrics.rateLimitViolations}
- reCAPTCHA Failures: ${summary.metrics.recaptchaFailures}
- Validation Errors: ${summary.metrics.validationErrors}
- Email Send Failures: ${summary.metrics.emailSendFailures}

RECENT ACTIVITY (Last Hour):
- Total Events: ${summary.recentEvents}
- Critical Events: ${summary.criticalEvents}
- High Severity Events: ${summary.highEvents}

LATEST EVENTS:
${recentEvents.map(event => 
  `- ${event.timestamp}: ${event.type} (${event.severity}) - ${event.details}`
).join('\n')}
    `.trim()
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor()

// Convenience functions for common security events
export const recordRateLimitViolation = (ipAddress: string, identifier: string) => {
  securityMonitor.recordEvent({
    type: 'rate_limit',
    ipAddress,
    userIdentifier: identifier,
    details: `Rate limit exceeded for ${identifier}`,
    severity: 'medium'
  })
  
  // Check for repeated violations and create alert
  const recentEvents = securityMonitor.getRecentEvents(50)
  const recentViolations = recentEvents.filter(
    event => event.type === 'rate_limit' && 
    new Date(event.timestamp).getTime() > Date.now() - (15 * 60 * 1000) // Last 15 minutes
  )
  
  if (recentViolations.length >= 5) {
    createHighAlert(
      'rate_limit',
      'Multiple Rate Limit Violations',
      `${recentViolations.length} rate limit violations detected in the last 15 minutes`,
      { identifier, recentViolations: recentViolations.length },
      ipAddress,
      identifier
    )
  }
}

export const recordRecaptchaFailure = (ipAddress?: string, userEmail?: string) => {
  securityMonitor.recordEvent({
    type: 'recaptcha_failure',
    ipAddress,
    userIdentifier: userEmail,
    details: 'reCAPTCHA verification failed',
    severity: 'high'
  })
  
  // Check for repeated reCAPTCHA failures
  const recentEvents = securityMonitor.getRecentEvents(50)
  const recentFailures = recentEvents.filter(
    event => event.type === 'recaptcha_failure' && 
    new Date(event.timestamp).getTime() > Date.now() - (10 * 60 * 1000) // Last 10 minutes
  )
  
  if (recentFailures.length >= 3) {
    createCriticalAlert(
      'recaptcha',
      'Multiple reCAPTCHA Failures',
      `${recentFailures.length} reCAPTCHA verification failures detected in the last 10 minutes`,
      { recentFailures: recentFailures.length },
      ipAddress,
      userEmail
    )
  }
}

export const recordValidationError = (error: string, userEmail?: string, ipAddress?: string) => {
  securityMonitor.recordEvent({
    type: 'validation_error',
    ipAddress,
    userIdentifier: userEmail,
    details: error,
    severity: 'low'
  })
}

export const recordEmailFailure = (error: string, userEmail?: string) => {
  securityMonitor.recordEvent({
    type: 'email_failure',
    userIdentifier: userEmail,
    details: error,
    severity: 'medium'
  })
  
  // Check for email service issues
  const recentEvents = securityMonitor.getRecentEvents(50)
  const recentEmailFailures = recentEvents.filter(
    event => event.type === 'email_failure' && 
    new Date(event.timestamp).getTime() > Date.now() - (30 * 60 * 1000) // Last 30 minutes
  )
  
  if (recentEmailFailures.length >= 3) {
    createHighAlert(
      'system',
      'Email Service Issues',
      `${recentEmailFailures.length} email send failures detected in the last 30 minutes`,
      { error, recentFailures: recentEmailFailures.length },
      undefined,
      userEmail
    )
  }
}
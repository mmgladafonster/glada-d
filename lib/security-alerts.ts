// Security monitoring alerts and notifications
import { logger } from "./logger"
import { resend } from "./resend"

export interface SecurityAlert {
  id: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'rate_limit' | 'recaptcha' | 'validation' | 'environment' | 'system' | 'suspicious_activity'
  title: string
  description: string
  details: Record<string, any>
  ipAddress?: string
  userIdentifier?: string
  actionRequired: boolean
}

export interface AlertConfig {
  enabled: boolean
  emailAlerts: boolean
  webhookAlerts: boolean
  alertThresholds: {
    critical: number // Send alert immediately
    high: number     // Send alert after N events in 5 minutes
    medium: number   // Send alert after N events in 15 minutes
    low: number      // Send alert after N events in 1 hour
  }
  emailRecipients: string[]
  fromEmail?: string
  webhookUrl?: string
  cooldownPeriod: number // Minutes between similar alerts
}

class SecurityAlertManager {
  private alerts: SecurityAlert[] = []
  private alertCounts: Map<string, { count: number; lastAlert: number }> = new Map()
  
  private config: AlertConfig = {
    enabled: process.env.NODE_ENV === 'production',
    emailAlerts: true,
    webhookAlerts: false,
    alertThresholds: {
      critical: 1,  // Immediate
      high: 3,      // After 3 events in 5 minutes
      medium: 5,    // After 5 events in 15 minutes
      low: 10       // After 10 events in 1 hour
    },
    emailRecipients: ['security@gladafonster.se', 'info@gladafonster.se'],
    fromEmail: 'security@gladafonster.se',
    cooldownPeriod: 30 // 30 minutes between similar alerts
  }

  // Create and process a security alert
  async createAlert(
    severity: SecurityAlert['severity'],
    category: SecurityAlert['category'],
    title: string,
    description: string,
    details: Record<string, any> = {},
    ipAddress?: string,
    userIdentifier?: string
  ): Promise<void> {
    const alert: SecurityAlert = {
      id: this.generateAlertId(),
      timestamp: new Date().toISOString(),
      severity,
      category,
      title,
      description,
      details,
      ipAddress,
      userIdentifier,
      actionRequired: severity === 'critical' || severity === 'high'
    }

    // Store alert
    this.alerts.push(alert)
    
    // Keep only last 1000 alerts in memory
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000)
    }

    // Log the alert
    logger.security(`Security Alert: ${title}`, `ALERT_${severity.toUpperCase()}`, userIdentifier, ipAddress, {
      alertId: alert.id,
      category,
      details
    })

    // Process alert for notifications
    await this.processAlert(alert)
  }

  private async processAlert(alert: SecurityAlert): Promise<void> {
    if (!this.config.enabled) {
      return
    }

    const alertKey = `${alert.category}_${alert.severity}`
    const now = Date.now()
    const alertCount = this.alertCounts.get(alertKey) || { count: 0, lastAlert: 0 }

    // Check cooldown period
    const timeSinceLastAlert = now - alertCount.lastAlert
    const cooldownMs = this.config.cooldownPeriod * 60 * 1000

    if (timeSinceLastAlert < cooldownMs && alertCount.count > 0) {
      // Still in cooldown period, just increment count
      alertCount.count++
      this.alertCounts.set(alertKey, alertCount)
      return
    }

    // Check if we should send alert based on thresholds
    const threshold = this.config.alertThresholds[alert.severity]
    alertCount.count++

    if (alertCount.count >= threshold) {
      // Send notifications
      await this.sendNotifications(alert, alertCount.count)
      
      // Reset count and update last alert time
      this.alertCounts.set(alertKey, { count: 0, lastAlert: now })
    } else {
      // Update count without sending alert
      this.alertCounts.set(alertKey, alertCount)
    }
  }

  private async sendNotifications(alert: SecurityAlert, eventCount: number): Promise<void> {
    const promises: Promise<void>[] = []

    if (this.config.emailAlerts) {
      promises.push(this.sendEmailAlert(alert, eventCount))
    }

    if (this.config.webhookAlerts && this.config.webhookUrl) {
      promises.push(this.sendWebhookAlert(alert, eventCount))
    }

    // Send all notifications concurrently
    await Promise.allSettled(promises)
  }

  private async sendEmailAlert(alert: SecurityAlert, eventCount: number): Promise<void> {
    try {
      // Validate and get from email address
      const fromEmail = this.config.fromEmail || 'security@gladafonster.se'
      
      // Basic validation of from email
      if (!fromEmail || !fromEmail.includes('@') || !fromEmail.includes('.')) {
        throw new Error(`Invalid from email address: ${fromEmail}`)
      }
      
      // Validate recipients list
      if (!this.config.emailRecipients || this.config.emailRecipients.length === 0) {
        throw new Error('No email recipients configured for security alerts')
      }
      
      const subject = `🚨 Security Alert: ${alert.title} (${alert.severity.toUpperCase()})`
      
      const emailHtml = this.generateEmailTemplate(alert, eventCount)
      const emailText = this.generateEmailText(alert, eventCount)

      await resend.emails.send({
        from: fromEmail,
        to: this.config.emailRecipients,
        subject,
        html: emailHtml,
        text: emailText
      })

      logger.info("Security alert email sent", "SECURITY_ALERTS", {
        alertId: alert.id,
        recipients: this.config.emailRecipients.length
      })

    } catch (error) {
      logger.error("Failed to send security alert email", "SECURITY_ALERTS", {
        alertId: alert.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private async sendWebhookAlert(alert: SecurityAlert, eventCount: number): Promise<void> {
    try {
      const payload = {
        alert,
        eventCount,
        timestamp: new Date().toISOString(),
        source: 'gladafonster-security'
      }

      const response = await fetch(this.config.webhookUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'GladaFonster-Security/1.0'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`)
      }

      logger.info("Security alert webhook sent", "SECURITY_ALERTS", {
        alertId: alert.id,
        webhookStatus: response.status
      })

    } catch (error) {
      logger.error("Failed to send security alert webhook", "SECURITY_ALERTS", {
        alertId: alert.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private generateEmailTemplate(alert: SecurityAlert, eventCount: number): string {
    const severityColor = {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#d97706',
      low: '#65a30d'
    }[alert.severity]

    const severityEmoji = {
      critical: '🚨',
      high: '⚠️',
      medium: '⚡',
      low: 'ℹ️'
    }[alert.severity]

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Security Alert</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: ${severityColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">
      ${severityEmoji} Security Alert
    </h1>
    <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">
      ${alert.title}
    </p>
  </div>
  
  <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
    <h2 style="color: ${severityColor}; margin-top: 0;">Alert Details</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 120px;">Severity:</td>
        <td style="padding: 8px 0; color: ${severityColor}; text-transform: uppercase; font-weight: bold;">${alert.severity}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Category:</td>
        <td style="padding: 8px 0;">${alert.category.replace('_', ' ')}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Time:</td>
        <td style="padding: 8px 0;">${new Date(alert.timestamp).toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Event Count:</td>
        <td style="padding: 8px 0;">${eventCount} events</td>
      </tr>
      ${alert.ipAddress ? `
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">IP Address:</td>
        <td style="padding: 8px 0;">${alert.ipAddress}</td>
      </tr>
      ` : ''}
      ${alert.userIdentifier ? `
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">User:</td>
        <td style="padding: 8px 0;">${alert.userIdentifier}</td>
      </tr>
      ` : ''}
    </table>
    
    <h3>Description</h3>
    <p>${alert.description}</p>
    
    ${Object.keys(alert.details).length > 0 ? `
    <h3>Additional Details</h3>
    <pre style="background: #f3f4f6; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(alert.details, null, 2)}</pre>
    ` : ''}
    
    ${alert.actionRequired ? `
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 16px; margin-top: 20px;">
      <h3 style="color: #dc2626; margin-top: 0;">Action Required</h3>
      <p style="margin-bottom: 0;">This alert requires immediate attention. Please investigate and take appropriate action.</p>
    </div>
    ` : ''}
  </div>
  
  <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin: 0; font-size: 14px; color: #6b7280;">
      This alert was generated by the Glada Fönster security monitoring system.<br>
      Alert ID: ${alert.id}
    </p>
  </div>
</body>
</html>
    `
  }

  private generateEmailText(alert: SecurityAlert, eventCount: number): string {
    return `
SECURITY ALERT: ${alert.title}

Severity: ${alert.severity.toUpperCase()}
Category: ${alert.category.replace('_', ' ')}
Time: ${new Date(alert.timestamp).toLocaleString()}
Event Count: ${eventCount} events
${alert.ipAddress ? `IP Address: ${alert.ipAddress}` : ''}
${alert.userIdentifier ? `User: ${alert.userIdentifier}` : ''}

Description:
${alert.description}

${Object.keys(alert.details).length > 0 ? `
Additional Details:
${JSON.stringify(alert.details, null, 2)}
` : ''}

${alert.actionRequired ? `
⚠️ ACTION REQUIRED: This alert requires immediate attention.
` : ''}

Alert ID: ${alert.id}
Generated by Glada Fönster Security Monitoring System
    `.trim()
  }

  private generateAlertId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `ALERT-${timestamp}-${random}`.toUpperCase()
  }

  // Get recent alerts for dashboard
  getRecentAlerts(limit: number = 50): SecurityAlert[] {
    return this.alerts.slice(-limit).reverse()
  }

  // Get alert statistics
  getAlertStats(): {
    total: number
    bySeverity: Record<string, number>
    byCategory: Record<string, number>
    last24Hours: number
  } {
    const now = Date.now()
    const last24Hours = now - (24 * 60 * 60 * 1000)

    const bySeverity: Record<string, number> = {}
    const byCategory: Record<string, number> = {}
    let last24HoursCount = 0

    this.alerts.forEach(alert => {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1
      byCategory[alert.category] = (byCategory[alert.category] || 0) + 1
      
      if (new Date(alert.timestamp).getTime() > last24Hours) {
        last24HoursCount++
      }
    })

    return {
      total: this.alerts.length,
      bySeverity,
      byCategory,
      last24Hours: last24HoursCount
    }
  }

  // Update alert configuration
  updateConfig(newConfig: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...newConfig }
    logger.info("Security alert configuration updated", "SECURITY_ALERTS", {
      enabled: this.config.enabled,
      emailAlerts: this.config.emailAlerts,
      webhookAlerts: this.config.webhookAlerts
    })
  }
}

// Export singleton instance
export const securityAlerts = new SecurityAlertManager()

// Convenience functions for creating alerts
export async function createCriticalAlert(
  category: SecurityAlert['category'],
  title: string,
  description: string,
  details: Record<string, any> = {},
  ipAddress?: string,
  userIdentifier?: string
): Promise<void> {
  await securityAlerts.createAlert('critical', category, title, description, details, ipAddress, userIdentifier)
}

export async function createHighAlert(
  category: SecurityAlert['category'],
  title: string,
  description: string,
  details: Record<string, any> = {},
  ipAddress?: string,
  userIdentifier?: string
): Promise<void> {
  await securityAlerts.createAlert('high', category, title, description, details, ipAddress, userIdentifier)
}

export async function createMediumAlert(
  category: SecurityAlert['category'],
  title: string,
  description: string,
  details: Record<string, any> = {},
  ipAddress?: string,
  userIdentifier?: string
): Promise<void> {
  await securityAlerts.createAlert('medium', category, title, description, details, ipAddress, userIdentifier)
}
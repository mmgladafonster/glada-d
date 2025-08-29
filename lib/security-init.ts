// Security initialization - run on application startup
import { logger } from "./logger"
import { logEnvironmentStatus } from "./env-validator"
import { securityMonitor } from "./security-monitor"

// Initialize security monitoring
export function initializeSecurity() {
  logger.info("Initializing security systems", "SECURITY_INIT")
  
  // Validate environment on startup
  logEnvironmentStatus()
  
  // Log security system startup
  logger.info("Security monitoring initialized", "SECURITY_INIT", {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    nodeVersion: process.version
  })
  
  // Record startup event
  securityMonitor.recordEvent('suspicious_activity', 'Application started - security systems initialized', 'low')
}

// Graceful shutdown handler
export function shutdownSecurity() {
  logger.info("Shutting down security systems", "SECURITY_INIT")
  
  // Generate final security report
  const report = securityMonitor.generateReport()
  logger.info("Final security report generated", "SECURITY_INIT", { 
    reportLength: report.length 
  })
}

// Track if handlers have been registered to prevent duplicates
let handlersRegistered = false

// Initialize on module load (server-side only)
if (typeof window === 'undefined') {
  initializeSecurity()
  
  // Register shutdown handlers only once
  if (!handlersRegistered) {
    process.on('SIGTERM', shutdownSecurity)
    process.on('SIGINT', shutdownSecurity)
    handlersRegistered = true
  }
}
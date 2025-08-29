// Production-ready logging system with environment-based levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

interface LogEntry {
  timestamp: string
  level: string
  message: string
  context?: string
  metadata?: Record<string, any>
  userId?: string
  ipAddress?: string
}

class Logger {
  private logLevel: LogLevel
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
  }

  private formatLogEntry(level: LogLevel, message: string, context?: string, metadata?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
      context,
      metadata,
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private outputLog(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Development: Pretty console output
      const contextStr = entry.context ? `[${entry.context}]` : ''
      const metadataStr = entry.metadata ? JSON.stringify(entry.metadata, null, 2) : ''
      
      switch (entry.level) {
        case 'ERROR':
          console.error(`${entry.timestamp} ${contextStr} ${entry.message}`, metadataStr)
          break
        case 'WARN':
          console.warn(`${entry.timestamp} ${contextStr} ${entry.message}`, metadataStr)
          break
        case 'INFO':
          console.info(`${entry.timestamp} ${contextStr} ${entry.message}`, metadataStr)
          break
        case 'DEBUG':
          console.log(`${entry.timestamp} ${contextStr} ${entry.message}`, metadataStr)
          break
      }
    } else {
      // Production: Structured JSON logging
      console.log(JSON.stringify(entry))
    }
  }

  error(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.outputLog(this.formatLogEntry(LogLevel.ERROR, message, context, metadata))
    }
  }

  warn(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.outputLog(this.formatLogEntry(LogLevel.WARN, message, context, metadata))
    }
  }

  info(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.outputLog(this.formatLogEntry(LogLevel.INFO, message, context, metadata))
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.outputLog(this.formatLogEntry(LogLevel.DEBUG, message, context, metadata))
    }
  }

  // Security-specific logging
  security(message: string, errorCode: string, userIdentifier?: string, ipAddress?: string, metadata?: Record<string, any>): void {
    const securityEntry = this.formatLogEntry(LogLevel.ERROR, message, 'SECURITY', {
      errorCode,
      userIdentifier,
      ipAddress,
      severity: 'high',
      ...metadata
    })
    
    this.outputLog(securityEntry)
  }

  // Health check logging
  health(message: string, isHealthy: boolean, metadata?: Record<string, any>): void {
    const level = isHealthy ? LogLevel.INFO : LogLevel.ERROR
    this.outputLog(this.formatLogEntry(level, message, 'HEALTH', {
      healthy: isHealthy,
      ...metadata
    }))
  }

  // Rate limiting logging
  rateLimit(message: string, identifier: string, ipAddress?: string, metadata?: Record<string, any>): void {
    this.outputLog(this.formatLogEntry(LogLevel.WARN, message, 'RATE_LIMIT', {
      identifier,
      ipAddress,
      ...metadata
    }))
  }
}

// Export singleton instance
export const logger = new Logger()

// Convenience functions for backward compatibility
export const logError = (message: string, context?: string, metadata?: Record<string, any>) => 
  logger.error(message, context, metadata)

export const logWarn = (message: string, context?: string, metadata?: Record<string, any>) => 
  logger.warn(message, context, metadata)

export const logInfo = (message: string, context?: string, metadata?: Record<string, any>) => 
  logger.info(message, context, metadata)

export const logDebug = (message: string, context?: string, metadata?: Record<string, any>) => 
  logger.debug(message, context, metadata)
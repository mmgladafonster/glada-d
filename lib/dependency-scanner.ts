// Dependency security scanning and vulnerability detection
import { logger } from "./logger"
import { createCriticalAlert, createHighAlert, createMediumAlert } from "./security-alerts"
import { exec } from "child_process"
import { promisify } from "util"
import * as fs from "fs/promises"
import * as fsSync from "fs"
import * as path from "path"
import * as crypto from "crypto"

const execAsync = promisify(exec)

export interface Vulnerability {
  id: string
  title: string
  severity: 'low' | 'moderate' | 'high' | 'critical'
  package: string
  version: string
  patchedIn?: string
  overview: string
  recommendation: string
  references: string[]
  cwe?: string[]
  cvss?: {
    score: number
    vectorString: string
  }
}

export interface DependencyInfo {
  name: string
  version: string
  description?: string
  license?: string
  dependencies?: string[]
  devDependency: boolean
  outdated: boolean
  latestVersion?: string
}

export interface ScanResult {
  timestamp: string
  scanId: string
  duration: number
  vulnerabilities: Vulnerability[]
  dependencies: DependencyInfo[]
  summary: {
    total: number
    critical: number
    high: number
    moderate: number
    low: number
  }
  recommendations: string[]
  overallRisk: 'low' | 'moderate' | 'high' | 'critical'
  scanStatus: 'complete' | 'partial' | 'failed'
  errors?: ScanError[]
  cacheStatus?: 'hit' | 'miss' | 'expired'
}

export enum ScanErrorType {
  NETWORK_TIMEOUT = 'network_timeout',
  PARSE_ERROR = 'parse_error',
  COMMAND_FAILED = 'command_failed',
  PERMISSION_DENIED = 'permission_denied',
  PACKAGE_NOT_FOUND = 'package_not_found',
  CACHE_ERROR = 'cache_error'
}

export interface ScanError {
  type: ScanErrorType
  message: string
  context?: any
  recoverable: boolean
  fallbackUsed: boolean
}

export interface ScannerConfig {
  // Timeout Configuration
  npmAuditTimeout: number
  npmOutdatedTimeout: number
  overallScanTimeout: number
  
  // Cache Configuration
  enableCaching: boolean
  cacheTimeout: number
  cacheDirectory: string
  
  // Performance Configuration
  enableParallelProcessing: boolean
  maxConcurrentOperations: number
  
  // Error Handling Configuration
  maxRetries: number
  retryDelay: number
  enableFallbackMethods: boolean
  
  // Logging Configuration
  verboseLogging: boolean
}

class DependencySecurityScanner {
  private config: ScannerConfig
  private cache: Map<string, { result: any; timestamp: number }> = new Map()

  constructor(config?: Partial<ScannerConfig>) {
    this.config = {
      // Default timeout configuration (in milliseconds)
      npmAuditTimeout: 60000, // 1 minute
      npmOutdatedTimeout: 45000, // 45 seconds
      overallScanTimeout: 300000, // 5 minutes
      
      // Default cache configuration
      enableCaching: true,
      cacheTimeout: 300000, // 5 minutes
      cacheDirectory: path.join(process.cwd(), '.cache', 'dependency-scanner'),
      
      // Default performance configuration
      enableParallelProcessing: true,
      maxConcurrentOperations: 3,
      
      // Default error handling configuration
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      enableFallbackMethods: true,
      
      // Default logging configuration
      verboseLogging: false,
      
      ...config
    }
  }

  // Run comprehensive dependency security scan with enhanced error handling and performance
  async runScan(forceRefresh: boolean = false): Promise<ScanResult> {
    const scanId = `scan-${Date.now()}-${crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : crypto.randomBytes(4).toString('hex')}`
    const startTime = Date.now()
    
    logger.info("Starting enhanced dependency security scan", "DEPENDENCY_SCANNER", { scanId })
    
    // Check cache first (unless force refresh is requested)
    if (!forceRefresh && this.config.enableCaching) {
      const cachedResult = await this.getCachedResult('full-scan')
      if (cachedResult) {
        logger.info("Returning cached scan result", "DEPENDENCY_SCANNER", { scanId })
        return {
          ...cachedResult,
          scanId,
          cacheStatus: 'hit'
        }
      }
    }

    const vulnerabilities: Vulnerability[] = []
    const dependencies: DependencyInfo[] = []
    const recommendations: string[] = []
    const errors: ScanError[] = []
    let scanStatus: 'complete' | 'partial' | 'failed' = 'complete'

    try {
      // Set overall scan timeout
      const scanPromise = this.performScan(vulnerabilities, dependencies, recommendations, errors)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Overall scan timeout')), this.config.overallScanTimeout)
      })

      await Promise.race([scanPromise, timeoutPromise])

      // Determine scan status based on errors
      if (errors.length > 0) {
        const criticalErrors = errors.filter(e => !e.recoverable)
        scanStatus = criticalErrors.length > 0 ? 'failed' : 'partial'
      }

    } catch (error) {
      logger.error("Critical dependency scan error", "DEPENDENCY_SCANNER", {
        scanId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      scanStatus = 'failed'
      errors.push({
        type: ScanErrorType.COMMAND_FAILED,
        message: error instanceof Error ? error.message : 'Unknown critical error',
        recoverable: false,
        fallbackUsed: false
      })

      // Try fallback methods if enabled
      if (this.config.enableFallbackMethods) {
        try {
          const fallbackVulns = await this.fallbackVulnerabilityCheck()
          vulnerabilities.push(...fallbackVulns)
          errors[errors.length - 1].fallbackUsed = true
          scanStatus = 'partial'
        } catch (fallbackError) {
          logger.error("Fallback methods also failed", "DEPENDENCY_SCANNER", { scanId })
        }
      }
    }

    // Calculate summary and recommendations
    const summary = this.calculateSummary(vulnerabilities)
    const overallRisk = this.calculateOverallRisk(summary)
    recommendations.push(...this.generateRecommendations(vulnerabilities, dependencies))

    const duration = Date.now() - startTime
    const result: ScanResult = {
      timestamp: new Date().toISOString(),
      scanId,
      duration,
      vulnerabilities,
      dependencies,
      summary,
      recommendations,
      overallRisk,
      scanStatus,
      errors: errors.length > 0 ? errors : undefined,
      cacheStatus: 'miss'
    }

    // Cache the result if successful
    if (this.config.enableCaching && scanStatus !== 'failed') {
      await this.cacheResult('full-scan', result)
    }

    // Create alerts for critical vulnerabilities
    await this.createAlertsForVulnerabilities(vulnerabilities)

    logger.info("Enhanced dependency security scan completed", "DEPENDENCY_SCANNER", {
      scanId,
      duration,
      vulnerabilitiesFound: vulnerabilities.length,
      overallRisk,
      scanStatus,
      errorsCount: errors.length,
      criticalVulns: summary.critical,
      highVulns: summary.high
    })

    return result
  }

  private async performScan(
    vulnerabilities: Vulnerability[], 
    dependencies: DependencyInfo[], 
    recommendations: string[], 
    errors: ScanError[]
  ): Promise<void> {
    if (this.config.enableParallelProcessing) {
      // Run operations in parallel for better performance
      const operations = [
        this.runNpmAuditWithRetry().catch(error => ({ error, type: 'audit' })),
        this.getDependencyInfoWithRetry().catch(error => ({ error, type: 'dependencies' })),
        this.checkOutdatedPackagesWithRetry().catch(error => ({ error, type: 'outdated' }))
      ]

      const results = await Promise.allSettled(operations)
      
      // Process audit results
      const auditResult = results[0]
      if (auditResult.status === 'fulfilled' && !('error' in auditResult.value)) {
        vulnerabilities.push(...auditResult.value.vulnerabilities)
      } else {
        const errorValue = auditResult.status === 'rejected' ? auditResult.reason : auditResult.value.error
        errors.push(this.classifyError(errorValue, 'npm audit'))
      }

      // Process dependency info results
      const depResult = results[1]
      if (depResult.status === 'fulfilled' && !('error' in depResult.value)) {
        dependencies.push(...depResult.value)
      } else {
        const errorValue = depResult.status === 'rejected' ? depResult.reason : depResult.value.error
        errors.push(this.classifyError(errorValue, 'dependency info'))
      }

      // Process outdated packages results
      const outdatedResult = results[2]
      if (outdatedResult.status === 'fulfilled' && !('error' in outdatedResult.value)) {
        this.mergeOutdatedInfo(dependencies, outdatedResult.value)
      } else {
        const errorValue = outdatedResult.status === 'rejected' ? outdatedResult.reason : outdatedResult.value.error
        errors.push(this.classifyError(errorValue, 'outdated packages'))
      }

    } else {
      // Run operations sequentially
      try {
        const auditResults = await this.runNpmAuditWithRetry()
        vulnerabilities.push(...auditResults.vulnerabilities)
      } catch (error) {
        errors.push(this.classifyError(error, 'npm audit'))
      }

      try {
        const depInfo = await this.getDependencyInfoWithRetry()
        dependencies.push(...depInfo)
      } catch (error) {
        errors.push(this.classifyError(error, 'dependency info'))
      }

      try {
        const outdatedInfo = await this.checkOutdatedPackagesWithRetry()
        this.mergeOutdatedInfo(dependencies, outdatedInfo)
      } catch (error) {
        errors.push(this.classifyError(error, 'outdated packages'))
      }
    }
  }

  private async runNpmAuditWithRetry(): Promise<{ vulnerabilities: Vulnerability[] }> {
    return await this.withRetry(
      () => this.runNpmAudit(),
      'npm audit',
      this.config.maxRetries
    )
  }

  private async getDependencyInfoWithRetry(): Promise<DependencyInfo[]> {
    return await this.withRetry(
      () => this.getDependencyInfo(),
      'dependency info',
      this.config.maxRetries
    )
  }

  private async checkOutdatedPackagesWithRetry(): Promise<Record<string, { current: string; latest: string }>> {
    return await this.withRetry(
      () => this.checkOutdatedPackages(),
      'outdated packages',
      this.config.maxRetries
    )
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number
  ): Promise<T> {
    let lastError: Error | undefined
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (this.config.verboseLogging) {
          logger.info(`Attempting ${operationName} (attempt ${attempt}/${maxRetries})`, "DEPENDENCY_SCANNER")
        }
        
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        if (attempt < maxRetries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1) // Exponential backoff
          if (this.config.verboseLogging) {
            logger.warn(`${operationName} failed, retrying in ${delay}ms`, "DEPENDENCY_SCANNER", {
              attempt,
              error: lastError.message
            })
          }
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`)
  }

  private classifyError(error: any, context: string): ScanError {
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Classify error type based on error message and context
    let errorType: ScanErrorType = ScanErrorType.COMMAND_FAILED
    let recoverable = true
    
    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      errorType = ScanErrorType.NETWORK_TIMEOUT
      recoverable = true
    } else if (errorMessage.includes('JSON') || errorMessage.includes('parse')) {
      errorType = ScanErrorType.PARSE_ERROR
      recoverable = true
    } else if (errorMessage.includes('EACCES') || errorMessage.includes('permission')) {
      errorType = ScanErrorType.PERMISSION_DENIED
      recoverable = false
    } else if (errorMessage.includes('ENOENT') || errorMessage.includes('not found')) {
      errorType = ScanErrorType.PACKAGE_NOT_FOUND
      recoverable = true
    } else if (context.includes('cache')) {
      errorType = ScanErrorType.CACHE_ERROR
      recoverable = true
    }

    return {
      type: errorType,
      message: errorMessage,
      context: { operation: context, originalError: error },
      recoverable,
      fallbackUsed: false
    }
  }

  private async runNpmAudit(): Promise<{ vulnerabilities: Vulnerability[] }> {
    const vulnerabilities: Vulnerability[] = []
    
    // Check cache first
    if (this.config.enableCaching) {
      const cached = await this.getCachedResult('npm-audit')
      if (cached) {
        if (this.config.verboseLogging) {
          logger.info("Using cached npm audit results", "DEPENDENCY_SCANNER")
        }
        return cached
      }
    }
    
    // Run npm audit with configurable timeout
    const { stdout } = await execAsync('npm audit --json', { 
      cwd: process.cwd(),
      timeout: this.config.npmAuditTimeout
    })
    
    if (!stdout || stdout.trim() === '') {
      throw new Error('npm audit returned empty output')
    }

    let auditData: any
    try {
      auditData = JSON.parse(stdout)
    } catch (parseError) {
      throw new Error(`Failed to parse npm audit JSON output: ${parseError}`)
    }
    
    // Parse npm audit results with enhanced error handling
    if (auditData.vulnerabilities) {
      Object.entries(auditData.vulnerabilities).forEach(([packageName, vulnData]: [string, any]) => {
        try {
          if (vulnData.via && Array.isArray(vulnData.via)) {
            vulnData.via.forEach((via: any) => {
              if (typeof via === 'object' && via.title) {
                vulnerabilities.push({
                  id: via.id?.toString() || `npm-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                  title: via.title,
                  severity: this.mapNpmSeverity(via.severity),
                  package: packageName,
                  version: vulnData.range || 'unknown',
                  patchedIn: vulnData.fixAvailable?.name || undefined,
                  overview: via.overview || via.title,
                  recommendation: vulnData.fixAvailable 
                    ? `Update ${packageName} to ${vulnData.fixAvailable.name}` 
                    : `Update ${packageName} to a patched version`,
                  references: Array.isArray(via.references) ? via.references : [],
                  cwe: Array.isArray(via.cwe) ? via.cwe : [],
                  cvss: via.cvss ? {
                    score: parseFloat(via.cvss.score) || 0,
                    vectorString: via.cvss.vectorString || ''
                  } : undefined
                })
              }
            })
          }
        } catch (parseError) {
          logger.warn("Failed to parse vulnerability data for package", "DEPENDENCY_SCANNER", {
            package: packageName,
            error: parseError instanceof Error ? parseError.message : 'Unknown error'
          })
        }
      })
    }

    const result = { vulnerabilities }
    
    // Cache the result
    if (this.config.enableCaching) {
      await this.cacheResult('npm-audit', result)
    }
    
    return result
  }

  private async getDependencyInfo(): Promise<DependencyInfo[]> {
    const dependencies: DependencyInfo[] = []
    
    try {
      // Read package.json safely
      const packageJsonPath = path.join(process.cwd(), 'package.json')
      const packageJsonContent = fsSync.readFileSync(packageJsonPath, 'utf8')
      const packageJson = JSON.parse(packageJsonContent)
      
      // Process production dependencies
      if (packageJson.dependencies) {
        Object.entries(packageJson.dependencies).forEach(([name, version]: [string, any]) => {
          dependencies.push({
            name,
            version: version.replace(/[\^~]/, ''), // Remove version prefixes
            devDependency: false,
            outdated: false
          })
        })
      }
      
      // Process dev dependencies
      if (packageJson.devDependencies) {
        Object.entries(packageJson.devDependencies).forEach(([name, version]: [string, any]) => {
          dependencies.push({
            name,
            version: version.replace(/[\^~]/, ''), // Remove version prefixes
            devDependency: true,
            outdated: false
          })
        })
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (error instanceof Error && error.message.includes('ENOENT')) {
        throw new Error('package.json file not found in current directory')
      } else if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in package.json: ${errorMessage}`)
      } else {
        logger.warn("Failed to read package.json", "DEPENDENCY_SCANNER", {
          error: errorMessage
        })
      }
    }
    
    return dependencies
  }

  private async checkOutdatedPackages(): Promise<Record<string, { current: string; latest: string }>> {
    // Check cache first
    if (this.config.enableCaching) {
      const cached = await this.getCachedResult('npm-outdated')
      if (cached) {
        if (this.config.verboseLogging) {
          logger.info("Using cached npm outdated results", "DEPENDENCY_SCANNER")
        }
        return cached
      }
    }

    try {
      const { stdout } = await execAsync('npm outdated --json', { 
        cwd: process.cwd(),
        timeout: this.config.npmOutdatedTimeout
      })
      
      const result = JSON.parse(stdout || '{}')
      
      // Cache the result
      if (this.config.enableCaching) {
        await this.cacheResult('npm-outdated', result)
      }
      
      return result
    } catch (error) {
      // npm outdated returns non-zero exit code when packages are outdated
      // Try to parse the output anyway
      if (error instanceof Error && 'stdout' in error && (error as any).stdout) {
        try {
          const stdoutContent = (error as any).stdout
          if (typeof stdoutContent === 'string' && stdoutContent.trim()) {
            const result = JSON.parse(stdoutContent)
            
            // Cache the result even if command "failed"
            if (this.config.enableCaching) {
              await this.cacheResult('npm-outdated', result)
            }
            
            return result
          }
        } catch (parseError) {
          throw new Error(`Failed to parse npm outdated output: ${parseError}. Original stdout: ${(error as any).stdout}`)
        }
      }
      throw error
    }
  }

  private mergeOutdatedInfo(
    dependencies: DependencyInfo[], 
    outdatedInfo: Record<string, { current: string; latest: string }>
  ): void {
    dependencies.forEach(dep => {
      if (outdatedInfo[dep.name]) {
        dep.outdated = true
        dep.latestVersion = outdatedInfo[dep.name].latest
      }
    })
  }

  private async fallbackVulnerabilityCheck(): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = []
    
    // Check for known problematic packages/versions
    const knownVulnerablePackages = [
      { name: 'lodash', versions: ['<4.17.21'], issue: 'Prototype pollution vulnerability' },
      { name: 'axios', versions: ['<0.21.1'], issue: 'SSRF vulnerability' },
      { name: 'node-fetch', versions: ['<2.6.7'], issue: 'Information disclosure vulnerability' },
      { name: 'minimist', versions: ['<1.2.6'], issue: 'Prototype pollution vulnerability' }
    ]
    
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json')
      const packageJsonContent = fsSync.readFileSync(packageJsonPath, 'utf8')
      const packageJson = JSON.parse(packageJsonContent)
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      knownVulnerablePackages.forEach(vuln => {
        if (allDeps[vuln.name]) {
          vulnerabilities.push({
            id: `fallback-${vuln.name}`,
            title: `Known vulnerability in ${vuln.name}`,
            severity: 'high',
            package: vuln.name,
            version: allDeps[vuln.name],
            overview: vuln.issue,
            recommendation: `Update ${vuln.name} to latest version`,
            references: []
          })
        }
      })
      
    } catch (error) {
      logger.warn("Fallback vulnerability check failed", "DEPENDENCY_SCANNER")
    }
    
    return vulnerabilities
  }

  private mapNpmSeverity(npmSeverity: string): 'low' | 'moderate' | 'high' | 'critical' {
    switch (npmSeverity?.toLowerCase()) {
      case 'critical': return 'critical'
      case 'high': return 'high'
      case 'moderate': return 'moderate'
      case 'low': return 'low'
      default: return 'moderate'
    }
  }

  private calculateSummary(vulnerabilities: Vulnerability[]): ScanResult['summary'] {
    const summary = {
      total: vulnerabilities.length,
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0
    }
    
    vulnerabilities.forEach(vuln => {
      summary[vuln.severity]++
    })
    
    return summary
  }

  private calculateOverallRisk(summary: ScanResult['summary']): 'low' | 'moderate' | 'high' | 'critical' {
    if (summary.critical > 0) return 'critical'
    if (summary.high > 2) return 'high'
    if (summary.high > 0 || summary.moderate > 5) return 'moderate'
    return 'low'
  }

  private generateRecommendations(vulnerabilities: Vulnerability[], dependencies: DependencyInfo[]): string[] {
    const recommendations: string[] = []
    
    if (vulnerabilities.length > 0) {
      recommendations.push('Run `npm audit fix` to automatically fix vulnerabilities')
      
      const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical')
      if (criticalVulns.length > 0) {
        recommendations.push(`Address ${criticalVulns.length} critical vulnerabilities immediately`)
      }
      
      const highVulns = vulnerabilities.filter(v => v.severity === 'high')
      if (highVulns.length > 0) {
        recommendations.push(`Address ${highVulns.length} high-severity vulnerabilities within 24 hours`)
      }
    }
    
    const outdatedDeps = dependencies.filter(d => d.outdated)
    if (outdatedDeps.length > 0) {
      recommendations.push(`Update ${outdatedDeps.length} outdated packages`)
      recommendations.push('Run `npm update` to update to latest compatible versions')
    }
    
    // General recommendations
    recommendations.push('Enable automated dependency updates with Dependabot or similar')
    recommendations.push('Regularly run security audits as part of CI/CD pipeline')
    recommendations.push('Consider using `npm ci` in production for reproducible builds')
    
    return recommendations
  }

  // Caching implementation
  private async getCachedResult(key: string): Promise<any | null> {
    if (!this.config.enableCaching) {
      return null
    }

    try {
      // Check in-memory cache first
      const memoryCache = this.cache.get(key)
      if (memoryCache && (Date.now() - memoryCache.timestamp) < this.config.cacheTimeout) {
        return memoryCache.result
      }

      // Check file cache
      const cacheFile = path.join(this.config.cacheDirectory, `${key}.json`)
      
      try {
        const stats = await fs.stat(cacheFile)
        if ((Date.now() - stats.mtime.getTime()) < this.config.cacheTimeout) {
          const cacheData = await fs.readFile(cacheFile, 'utf-8')
          const result = JSON.parse(cacheData)
          
          // Update in-memory cache
          this.cache.set(key, { result, timestamp: stats.mtime.getTime() })
          
          return result
        }
      } catch (fileError) {
        // Cache file doesn't exist or is corrupted, continue without cache
        if (this.config.verboseLogging) {
          logger.debug("Cache file not found or corrupted", "DEPENDENCY_SCANNER", { key })
        }
      }

    } catch (error) {
      logger.warn("Cache retrieval failed", "DEPENDENCY_SCANNER", {
        key,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    return null
  }

  private async cacheResult(key: string, result: any): Promise<void> {
    if (!this.config.enableCaching) {
      return
    }

    try {
      const timestamp = Date.now()
      
      // Update in-memory cache
      this.cache.set(key, { result, timestamp })

      // Update file cache
      await fs.mkdir(this.config.cacheDirectory, { recursive: true })
      const cacheFile = path.join(this.config.cacheDirectory, `${key}.json`)
      await fs.writeFile(cacheFile, JSON.stringify(result, null, 2))

      if (this.config.verboseLogging) {
        logger.debug("Result cached successfully", "DEPENDENCY_SCANNER", { key })
      }

    } catch (error) {
      logger.warn("Cache storage failed", "DEPENDENCY_SCANNER", {
        key,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  private async clearCache(): Promise<void> {
    try {
      // Clear in-memory cache
      this.cache.clear()

      // Clear file cache
      try {
        const files = await fs.readdir(this.config.cacheDirectory)
        await Promise.all(
          files
            .filter(file => file.endsWith('.json'))
            .map(file => fs.unlink(path.join(this.config.cacheDirectory, file)))
        )
      } catch (dirError) {
        // Directory doesn't exist, which is fine
      }

      logger.info("Cache cleared successfully", "DEPENDENCY_SCANNER")
    } catch (error) {
      logger.warn("Cache clearing failed", "DEPENDENCY_SCANNER", {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Public method to update scanner configuration
  public updateConfig(newConfig: Partial<ScannerConfig>): void {
    this.config = { ...this.config, ...newConfig }
    logger.info("Scanner configuration updated", "DEPENDENCY_SCANNER", { 
      updatedFields: Object.keys(newConfig) 
    })
  }

  // Public method to get current configuration
  public getConfig(): ScannerConfig {
    return { ...this.config }
  }

  // Public method to clear cache manually
  public async clearScanCache(): Promise<void> {
    await this.clearCache()
  }

  private async createAlertsForVulnerabilities(vulnerabilities: Vulnerability[]): Promise<void> {
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical')
    const highVulns = vulnerabilities.filter(v => v.severity === 'high')
    
    if (criticalVulns.length > 0) {
      await createCriticalAlert(
        'system',
        'Critical Dependency Vulnerabilities Detected',
        `${criticalVulns.length} critical security vulnerabilities found in dependencies`,
        {
          vulnerabilities: criticalVulns.map(v => ({
            package: v.package,
            title: v.title,
            id: v.id
          })),
          totalVulnerabilities: vulnerabilities.length
        }
      )
    }
    
    if (highVulns.length >= 3) {
      await createHighAlert(
        'system',
        'Multiple High-Severity Dependency Vulnerabilities',
        `${highVulns.length} high-severity security vulnerabilities found in dependencies`,
        {
          vulnerabilities: highVulns.map(v => ({
            package: v.package,
            title: v.title,
            id: v.id
          })),
          totalVulnerabilities: vulnerabilities.length
        }
      )
    }
  }
}

// Export singleton instance with default configuration
export const dependencyScanner = new DependencySecurityScanner()

// Export class for custom configurations
export { DependencySecurityScanner }

// Convenience function for quick scans
export async function runDependencyScan(forceRefresh: boolean = false): Promise<ScanResult> {
  return await dependencyScanner.runScan(forceRefresh)
}

// Convenience function for scans with custom configuration
export async function runDependencyScanWithConfig(
  config: Partial<ScannerConfig>, 
  forceRefresh: boolean = false
): Promise<ScanResult> {
  const customScanner = new DependencySecurityScanner(config)
  return await customScanner.runScan(forceRefresh)
}
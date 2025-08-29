import { NextRequest, NextResponse } from 'next/server'
import { runDependencyScan, runDependencyScanWithConfig, DependencySecurityScanner } from '@/lib/dependency-scanner'
import { ERROR_MESSAGES, ERROR_CODES, createSecureErrorResponse } from '@/lib/error-messages'

// Enhanced dependency security scanning endpoint
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const forceRefresh = searchParams.get('force') === 'true'
  
  // Safely parse and validate timeout parameter
  let timeout: number | undefined
  const timeoutParam = searchParams.get('timeout')
  if (timeoutParam) {
    const parsedTimeout = parseInt(timeoutParam, 10)
    if (!isNaN(parsedTimeout) && parsedTimeout >= 1000 && parsedTimeout <= 600000) {
      timeout = parsedTimeout
    } else if (!isNaN(parsedTimeout)) {
      // Clamp to valid range (1s to 10min)
      timeout = Math.max(1000, Math.min(600000, parsedTimeout))
    }
    // If parsing fails or value is invalid, timeout remains undefined
  }
  
  const enableCache = searchParams.get('cache') !== 'false'
  const parallel = searchParams.get('parallel') !== 'false'

  try {
    // Create custom configuration if parameters provided
    const customConfig = {
      ...(timeout && { npmAuditTimeout: timeout, npmOutdatedTimeout: timeout }),
      enableCaching: enableCache,
      enableParallelProcessing: parallel,
      verboseLogging: searchParams.get('verbose') === 'true'
    }

    // Use custom scanner if configuration provided, otherwise use default
    const scanFunction = Object.keys(customConfig).some(key => customConfig[key as keyof typeof customConfig] !== undefined)
      ? () => runDependencyScanWithConfig(customConfig, forceRefresh)
      : () => runDependencyScan(forceRefresh)

    switch (action) {
      case 'scan':
        const scanResult = await scanFunction()
        
        return NextResponse.json({
          success: true,
          data: scanResult,
          metadata: {
            scanId: scanResult.scanId,
            duration: scanResult.duration,
            cacheStatus: scanResult.cacheStatus,
            scanStatus: scanResult.scanStatus,
            errorsCount: scanResult.errors?.length || 0,
            forceRefresh,
            customConfig: Object.keys(customConfig).length > 0 ? customConfig : undefined
          },
          timestamp: scanResult.timestamp
        })

      case 'vulnerabilities':
        const vulnScan = await scanFunction()
        
        return NextResponse.json({
          success: true,
          data: {
            vulnerabilities: vulnScan.vulnerabilities,
            summary: vulnScan.summary,
            overallRisk: vulnScan.overallRisk,
            scanStatus: vulnScan.scanStatus,
            errors: vulnScan.errors
          },
          metadata: {
            scanId: vulnScan.scanId,
            duration: vulnScan.duration,
            cacheStatus: vulnScan.cacheStatus
          },
          timestamp: vulnScan.timestamp
        })

      case 'outdated':
        const outdatedScan = await scanFunction()
        const outdatedPackages = outdatedScan.dependencies.filter(d => d.outdated)
        
        return NextResponse.json({
          success: true,
          data: {
            outdatedPackages,
            count: outdatedPackages.length,
            scanStatus: outdatedScan.scanStatus
          },
          metadata: {
            scanId: outdatedScan.scanId,
            duration: outdatedScan.duration,
            cacheStatus: outdatedScan.cacheStatus
          },
          timestamp: outdatedScan.timestamp
        })

      case 'summary':
        const summaryScan = await scanFunction()
        
        return NextResponse.json({
          success: true,
          data: {
            summary: {
              totalDependencies: summaryScan.dependencies.length,
              vulnerabilities: summaryScan.summary,
              overallRisk: summaryScan.overallRisk,
              outdatedCount: summaryScan.dependencies.filter(d => d.outdated).length,
              recommendations: summaryScan.recommendations.slice(0, 5), // Top 5 recommendations
              scanStatus: summaryScan.scanStatus,
              errorsCount: summaryScan.errors?.length || 0
            }
          },
          metadata: {
            scanId: summaryScan.scanId,
            duration: summaryScan.duration,
            cacheStatus: summaryScan.cacheStatus
          },
          timestamp: summaryScan.timestamp
        })

      case 'recommendations':
        const recScan = await scanFunction()
        
        return NextResponse.json({
          success: true,
          data: {
            recommendations: recScan.recommendations,
            overallRisk: recScan.overallRisk,
            scanStatus: recScan.scanStatus
          },
          metadata: {
            scanId: recScan.scanId,
            duration: recScan.duration,
            cacheStatus: recScan.cacheStatus
          },
          timestamp: recScan.timestamp
        })

      case 'config':
        // Return current scanner configuration with the parsed config
        const configScanner = new DependencySecurityScanner(customConfig)
        return NextResponse.json({
          success: true,
          data: {
            config: configScanner.getConfig(),
            availableOptions: {
              timeout: 'Set custom timeout in milliseconds (?timeout=30000)',
              cache: 'Enable/disable caching (?cache=true/false)',
              parallel: 'Enable/disable parallel processing (?parallel=true/false)',
              verbose: 'Enable verbose logging (?verbose=true)',
              force: 'Force refresh bypassing cache (?force=true)'
            }
          },
          timestamp: new Date().toISOString()
        })

      case 'clear-cache':
        // Clear scanner cache with the same configuration
        const cacheScanner = new DependencySecurityScanner(customConfig)
        await cacheScanner.clearScanCache()
        return NextResponse.json({
          success: true,
          message: 'Scanner cache cleared successfully',
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: true,
          message: "Enhanced dependency security scanning endpoint",
          availableActions: [
            'scan', 'vulnerabilities', 'outdated', 'summary', 'recommendations', 'config', 'clear-cache'
          ],
          usage: "Add ?action=<action-name> to access different scan results",
          enhancedFeatures: {
            caching: "Use ?cache=false to disable caching",
            forceRefresh: "Use ?force=true to bypass cache",
            customTimeout: "Use ?timeout=30000 to set custom timeout",
            parallelProcessing: "Use ?parallel=false to disable parallel processing",
            verboseLogging: "Use ?verbose=true for detailed logging"
          },
          examples: [
            "/api/security/dependencies?action=scan&force=true",
            "/api/security/dependencies?action=vulnerabilities&timeout=60000",
            "/api/security/dependencies?action=summary&cache=false&verbose=true"
          ]
        })
    }
  } catch (error) {
    return NextResponse.json(
      createSecureErrorResponse(
        ERROR_MESSAGES.GENERIC_ERROR,
        ERROR_CODES.SYSTEM_ERROR,
        `Dependency scan error: ${error instanceof Error ? error.message : 'Unknown error'}`
      ),
      { status: 500 }
    )
  }
}

// Enhanced dependency scan trigger (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      forceRescan = false, 
      config = {},
      action = 'full-scan'
    } = body

    let scanResult

    switch (action) {
      case 'full-scan':
        // Run enhanced dependency scan with custom config
        scanResult = Object.keys(config).length > 0 
          ? await runDependencyScanWithConfig(config, forceRescan)
          : await runDependencyScan(forceRescan)
        break

      case 'clear-cache':
        const clearScanner = new DependencySecurityScanner(config)
        await clearScanner.clearScanCache()
        return NextResponse.json({
          success: true,
          message: "Scanner cache cleared successfully",
          timestamp: new Date().toISOString()
        })

      case 'update-config':
        if (!config || Object.keys(config).length === 0) {
          return NextResponse.json({
            success: false,
            error: "Configuration object required for update-config action"
          }, { status: 400 })
        }
        
        const updateScanner = new DependencySecurityScanner(config)
        updateScanner.updateConfig(config)
        
        return NextResponse.json({
          success: true,
          message: "Scanner configuration updated",
          updatedConfig: updateScanner.getConfig(),
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          availableActions: ['full-scan', 'clear-cache', 'update-config']
        }, { status: 400 })
    }

    // Return comprehensive enhanced results
    return NextResponse.json({
      success: true,
      message: "Enhanced dependency scan completed",
      data: {
        vulnerabilities: scanResult.vulnerabilities,
        summary: scanResult.summary,
        overallRisk: scanResult.overallRisk,
        dependencies: scanResult.dependencies,
        recommendations: scanResult.recommendations,
        scanStatus: scanResult.scanStatus,
        errors: scanResult.errors
      },
      metadata: {
        scanId: scanResult.scanId,
        scanTimestamp: scanResult.timestamp,
        duration: scanResult.duration,
        cacheStatus: scanResult.cacheStatus,
        forceRescan,
        customConfig: Object.keys(config).length > 0 ? config : undefined,
        totalPackages: scanResult.dependencies.length,
        vulnerablePackages: [...new Set(scanResult.vulnerabilities.map(v => v.package))].length,
        errorsCount: scanResult.errors?.length || 0
      }
    })

  } catch (error) {
    return NextResponse.json(
      createSecureErrorResponse(
        ERROR_MESSAGES.GENERIC_ERROR,
        ERROR_CODES.SYSTEM_ERROR,
        `Enhanced dependency scan error: ${error instanceof Error ? error.message : 'Unknown error'}`
      ),
      { status: 500 }
    )
  }
}
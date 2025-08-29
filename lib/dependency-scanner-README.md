# Enhanced Dependency Security Scanner

## Overview

The Enhanced Dependency Security Scanner provides comprehensive vulnerability detection, risk assessment, and automated monitoring for all third-party dependencies. This implementation includes advanced error handling, performance optimizations, and configurable behavior.

## Key Enhancements

### 1. Comprehensive Error Classification and Recovery

- **Error Types**: Classified into specific categories (timeout, parse error, command failed, etc.)
- **Recovery Mechanisms**: Automatic fallback methods when primary scanning fails
- **Graceful Degradation**: Continues operation even when some components fail
- **Error Reporting**: Detailed error information with recovery status

### 2. Configurable Timeout Handling

- **npm Audit Timeout**: Configurable timeout for npm audit operations (default: 60s)
- **npm Outdated Timeout**: Separate timeout for outdated package checks (default: 45s)
- **Overall Scan Timeout**: Maximum time for entire scan operation (default: 5 minutes)
- **Retry Logic**: Exponential backoff retry mechanism with configurable attempts

### 3. Result Caching System

- **Dual-Layer Caching**: In-memory and file-based caching for optimal performance
- **Configurable Cache Timeout**: Customizable cache expiration (default: 5 minutes)
- **Cache Management**: Manual cache clearing and status reporting
- **Force Refresh**: Option to bypass cache when needed

### 4. Parallel Processing

- **Concurrent Operations**: npm audit, dependency info, and outdated checks run in parallel
- **Performance Optimization**: Significantly reduces scan time for large projects
- **Configurable**: Can be disabled for systems with resource constraints
- **Error Isolation**: Failures in one operation don't affect others

## Configuration Options

```typescript
interface ScannerConfig {
  // Timeout Configuration (milliseconds)
  npmAuditTimeout: number        // Default: 60000
  npmOutdatedTimeout: number     // Default: 45000
  overallScanTimeout: number     // Default: 300000
  
  // Cache Configuration
  enableCaching: boolean         // Default: true
  cacheTimeout: number          // Default: 300000
  cacheDirectory: string        // Default: '.cache/dependency-scanner'
  
  // Performance Configuration
  enableParallelProcessing: boolean  // Default: true
  maxConcurrentOperations: number    // Default: 3
  
  // Error Handling Configuration
  maxRetries: number            // Default: 3
  retryDelay: number           // Default: 1000
  enableFallbackMethods: boolean // Default: true
  
  // Logging Configuration
  verboseLogging: boolean       // Default: false
}
```

## Usage Examples

### Basic Usage

```typescript
import { runDependencyScan } from '@/lib/dependency-scanner'

// Basic scan with default configuration
const result = await runDependencyScan()

// Force refresh (bypass cache)
const freshResult = await runDependencyScan(true)
```

### Custom Configuration

```typescript
import { runDependencyScanWithConfig } from '@/lib/dependency-scanner'

const customConfig = {
  npmAuditTimeout: 120000,      // 2 minutes
  enableCaching: false,         // Disable caching
  verboseLogging: true,         // Enable detailed logging
  maxRetries: 5                 // More retry attempts
}

const result = await runDependencyScanWithConfig(customConfig)
```

### Advanced Usage

```typescript
import { DependencySecurityScanner } from '@/lib/dependency-scanner'

const scanner = new DependencySecurityScanner({
  enableParallelProcessing: true,
  cacheTimeout: 600000,  // 10 minutes
  verboseLogging: true
})

// Run scan
const result = await scanner.runScan()

// Update configuration at runtime
scanner.updateConfig({ npmAuditTimeout: 90000 })

// Clear cache
await scanner.clearScanCache()

// Get current configuration
const config = scanner.getConfig()
```

## API Endpoints

### Enhanced GET Endpoints

All endpoints support additional query parameters for configuration:

- `?force=true` - Force refresh, bypass cache
- `?timeout=30000` - Custom timeout in milliseconds
- `?cache=false` - Disable caching for this request
- `?parallel=false` - Disable parallel processing
- `?verbose=true` - Enable verbose logging

#### Available Actions

1. **Full Scan**: `GET /api/security/dependencies?action=scan`
2. **Vulnerabilities Only**: `GET /api/security/dependencies?action=vulnerabilities`
3. **Outdated Packages**: `GET /api/security/dependencies?action=outdated`
4. **Summary**: `GET /api/security/dependencies?action=summary`
5. **Recommendations**: `GET /api/security/dependencies?action=recommendations`
6. **Configuration**: `GET /api/security/dependencies?action=config`
7. **Clear Cache**: `GET /api/security/dependencies?action=clear-cache`

#### Example Requests

```bash
# Basic scan with force refresh
curl "/api/security/dependencies?action=scan&force=true"

# Vulnerabilities with custom timeout and verbose logging
curl "/api/security/dependencies?action=vulnerabilities&timeout=60000&verbose=true"

# Summary without caching
curl "/api/security/dependencies?action=summary&cache=false"
```

### Enhanced POST Endpoints

```bash
# Full scan with custom configuration
curl -X POST "/api/security/dependencies" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "full-scan",
    "forceRescan": true,
    "config": {
      "npmAuditTimeout": 120000,
      "enableParallelProcessing": true,
      "verboseLogging": true
    }
  }'

# Clear cache
curl -X POST "/api/security/dependencies" \
  -H "Content-Type: application/json" \
  -d '{"action": "clear-cache"}'

# Update scanner configuration
curl -X POST "/api/security/dependencies" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update-config",
    "config": {
      "cacheTimeout": 600000,
      "maxRetries": 5
    }
  }'
```

## Enhanced Response Format

```typescript
interface EnhancedScanResult {
  success: boolean
  data: {
    // Core scan data
    vulnerabilities: Vulnerability[]
    dependencies: DependencyInfo[]
    summary: VulnerabilitySummary
    recommendations: string[]
    overallRisk: 'low' | 'moderate' | 'high' | 'critical'
    
    // Enhanced metadata
    scanStatus: 'complete' | 'partial' | 'failed'
    errors?: ScanError[]
  }
  metadata: {
    scanId: string           // Unique scan identifier
    duration: number         // Scan duration in milliseconds
    cacheStatus: 'hit' | 'miss' | 'expired'
    errorsCount: number      // Number of errors encountered
    forceRefresh?: boolean   // Whether cache was bypassed
    customConfig?: object    // Custom configuration used
  }
  timestamp: string          // ISO timestamp
}
```

## Error Handling

### Error Classification

```typescript
enum ScanErrorType {
  NETWORK_TIMEOUT = 'network_timeout',
  PARSE_ERROR = 'parse_error',
  COMMAND_FAILED = 'command_failed',
  PERMISSION_DENIED = 'permission_denied',
  PACKAGE_NOT_FOUND = 'package_not_found',
  CACHE_ERROR = 'cache_error'
}
```

### Error Recovery

- **Automatic Retries**: Failed operations are retried with exponential backoff
- **Fallback Methods**: Known vulnerability database used when npm audit fails
- **Partial Results**: Returns available data even if some operations fail
- **Graceful Degradation**: Continues operation with reduced functionality

## Performance Optimizations

### Caching Strategy

1. **In-Memory Cache**: Fast access for repeated operations within the same process
2. **File Cache**: Persistent cache across application restarts
3. **Cache Invalidation**: Automatic expiration based on configurable timeout
4. **Cache Warming**: Proactive caching of frequently accessed data

### Parallel Processing

1. **Concurrent Operations**: Multiple npm commands run simultaneously
2. **Resource Management**: Configurable limits to prevent system overload
3. **Error Isolation**: Failures in one operation don't block others
4. **Performance Monitoring**: Duration tracking for optimization

## Monitoring and Debugging

### Verbose Logging

Enable detailed logging for troubleshooting:

```typescript
const scanner = new DependencySecurityScanner({
  verboseLogging: true
})
```

### Performance Metrics

Each scan result includes:
- Total scan duration
- Cache hit/miss status
- Error count and types
- Individual operation timings (in verbose mode)

### Health Checks

```bash
# Check scanner configuration
curl "/api/security/dependencies?action=config"

# Test basic functionality
curl "/api/security/dependencies?action=summary&verbose=true"
```

## Best Practices

### Production Configuration

```typescript
const productionConfig = {
  npmAuditTimeout: 120000,      // 2 minutes for large projects
  enableCaching: true,          // Enable for performance
  cacheTimeout: 600000,         // 10 minutes cache
  enableParallelProcessing: true, // Enable for speed
  maxRetries: 3,                // Reasonable retry count
  verboseLogging: false         // Disable in production
}
```

### Development Configuration

```typescript
const developmentConfig = {
  npmAuditTimeout: 60000,       // Shorter timeout for dev
  enableCaching: false,         // Disable for fresh results
  verboseLogging: true,         // Enable for debugging
  maxRetries: 1                 // Fewer retries for faster feedback
}
```

### CI/CD Configuration

```typescript
const ciConfig = {
  npmAuditTimeout: 180000,      // Longer timeout for CI
  enableCaching: false,         // Always fresh in CI
  enableParallelProcessing: true, // Speed up builds
  verboseLogging: true,         // Detailed logs for debugging
  maxRetries: 2                 // Limited retries in CI
}
```

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase timeout values for large projects
2. **Cache Issues**: Clear cache manually or disable caching temporarily
3. **Permission Errors**: Ensure proper file system permissions for cache directory
4. **Network Issues**: Enable retries and check network connectivity

### Debug Commands

```bash
# Clear cache and run fresh scan
curl "/api/security/dependencies?action=clear-cache"
curl "/api/security/dependencies?action=scan&force=true&verbose=true"

# Check configuration
curl "/api/security/dependencies?action=config"

# Test with minimal configuration
curl "/api/security/dependencies?action=scan&cache=false&parallel=false&timeout=30000"
```

## Migration from Basic Scanner

The enhanced scanner is backward compatible. Existing code will continue to work:

```typescript
// Old usage (still works)
import { runDependencyScan } from '@/lib/dependency-scanner'
const result = await runDependencyScan()

// New enhanced usage
import { runDependencyScanWithConfig } from '@/lib/dependency-scanner'
const result = await runDependencyScanWithConfig({
  enableCaching: true,
  verboseLogging: true
})
```

## Requirements Satisfied

This implementation satisfies the following requirements from the specification:

- **Requirement 1.4**: Enhanced error handling with comprehensive classification and recovery
- **Requirement 1.5**: Configurable timeout handling for all npm operations
- **Requirement 2.5**: Result caching system for improved performance on repeated scans

The enhanced scanner provides enterprise-grade reliability, performance, and configurability while maintaining backward compatibility with existing implementations.
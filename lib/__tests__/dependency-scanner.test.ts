import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DependencySecurityScanner, ScanErrorType } from '../dependency-scanner'
import * as fs from 'fs/promises'
import { exec } from 'child_process'

// Mock dependencies
vi.mock('child_process')
vi.mock('fs/promises')
vi.mock('../logger')
vi.mock('../security-alerts')

const mockExec = vi.mocked(exec)
const mockFs = vi.mocked(fs)

describe('Enhanced DependencySecurityScanner', () => {
  let scanner: DependencySecurityScanner

  beforeEach(() => {
    scanner = new DependencySecurityScanner({
      enableCaching: false, // Disable caching for tests
      verboseLogging: true,
      npmAuditTimeout: 5000,
      maxRetries: 2
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Error Handling and Recovery', () => {
    it('should classify timeout errors correctly', async () => {
      const timeoutError = new Error('Command failed: npm audit --json\nETIMEDOUT')
      mockExec.mockImplementation((cmd, options, callback) => {
        if (callback) callback(timeoutError, '', '')
        return {} as any
      })

      const result = await scanner.runScan()
      
      expect(result.scanStatus).toBe('partial')
      expect(result.errors).toBeDefined()
      expect(result.errors![0].type).toBe(ScanErrorType.NETWORK_TIMEOUT)
      expect(result.errors![0].recoverable).toBe(true)
    })

    it('should classify parse errors correctly', async () => {
      mockExec.mockImplementation((cmd, options, callback) => {
        if (callback) callback(null, 'invalid json{', '')
        return {} as any
      })

      const result = await scanner.runScan()
      
      expect(result.scanStatus).toBe('partial')
      expect(result.errors).toBeDefined()
      expect(result.errors![0].type).toBe(ScanErrorType.PARSE_ERROR)
    })

    it('should retry failed operations with exponential backoff', async () => {
      const callOrder: string[] = []
      mockExec.mockImplementation((cmd, options, callback) => {
        callOrder.push(cmd)
        if (callOrder.length < 3) {
          process.nextTick(() => {
            if (callback) callback(new Error('Temporary failure'), '', '')
          })
        } else {
          process.nextTick(() => {
            if (callback) callback(null, '{"vulnerabilities": {}}', '')
          })
        }
        return {} as any
      })

      const result = await scanner.runScan()

      expect(callOrder.length).toBeGreaterThanOrEqual(3) // Should have retried
      expect(result.scanStatus).toBe('complete')
    })

    it('should use fallback methods when primary methods fail', async () => {
      mockExec.mockImplementation((cmd, options, callback) => {
        if (callback) callback(new Error('Command failed'), '', '')
        return {} as any
      })

      // Mock fs.readFileSync for fallback package.json reading
      const mockReadFileSync = vi.spyOn(require('fs'), 'readFileSync')
      mockReadFileSync.mockReturnValue(JSON.stringify({
        dependencies: {
          'lodash': '^4.17.20' // Known vulnerable version
        }
      }))

      const result = await scanner.runScan()
      
      expect(result.scanStatus).toBe('partial')
      expect(result.vulnerabilities.length).toBeGreaterThan(0)
      expect(result.errors![0].fallbackUsed).toBe(true)
    })
  })

  describe('Performance Enhancements', () => {
    it('should support parallel processing when enabled', async () => {
      const parallelScanner = new DependencySecurityScanner({
        enableParallelProcessing: true,
        enableCaching: false
      })

      mockExec.mockImplementation((cmd, options, callback) => {
        // Simulate different response times for different commands
        const delay = cmd.includes('audit') ? 100 : cmd.includes('outdated') ? 50 : 25
        setTimeout(() => {
          if (callback) callback(null, '{}', '')
        }, delay)
        return {} as any
      })

      const startTime = Date.now()
      await parallelScanner.runScan()
      const duration = Date.now() - startTime

      // Parallel execution should be faster than sequential
      expect(duration).toBeLessThan(200) // Should be less than sum of individual delays
    })

    it('should handle configurable timeouts', async () => {
      const shortTimeoutScanner = new DependencySecurityScanner({
        npmAuditTimeout: 100, // Very short timeout
        enableCaching: false
      })

      mockExec.mockImplementation((cmd, options, callback) => {
        // Simulate slow response
        setTimeout(() => {
          if (callback) callback(null, '{"vulnerabilities": {}}', '')
        }, 200)
        return {} as any
      })

      const result = await shortTimeoutScanner.runScan()
      
      expect(result.scanStatus).toBe('partial')
      expect(result.errors).toBeDefined()
    })
  })

  describe('Caching Functionality', () => {
    it('should cache and retrieve results when caching is enabled', async () => {
      const cachingScanner = new DependencySecurityScanner({
        enableCaching: true,
        cacheTimeout: 60000
      })

      mockExec.mockImplementation((cmd, options, callback) => {
        if (callback) callback(null, '{"vulnerabilities": {}}', '')
        return {} as any
      })

      mockFs.stat.mockResolvedValue({ mtime: new Date() } as any)
      mockFs.readFile.mockResolvedValue('{"vulnerabilities": []}')
      mockFs.mkdir.mockResolvedValue(undefined)
      mockFs.writeFile.mockResolvedValue(undefined)

      // First scan should miss cache
      const result1 = await cachingScanner.runScan()
      expect(result1.cacheStatus).toBe('miss')

      // Second scan should hit cache
      const result2 = await cachingScanner.runScan()
      expect(result2.cacheStatus).toBe('hit')
    })

    it('should force refresh when requested', async () => {
      const cachingScanner = new DependencySecurityScanner({
        enableCaching: true
      })

      mockExec.mockImplementation((cmd, options, callback) => {
        if (callback) callback(null, '{"vulnerabilities": {}}', '')
        return {} as any
      })

      mockFs.stat.mockResolvedValue({ mtime: new Date() } as any)
      mockFs.readFile.mockResolvedValue('{"vulnerabilities": []}')

      // Force refresh should bypass cache
      const result = await cachingScanner.runScan(true)
      expect(result.cacheStatus).toBe('miss')
    })
  })

  describe('Configuration Management', () => {
    it('should allow configuration updates', () => {
      const initialConfig = scanner.getConfig()
      
      scanner.updateConfig({
        npmAuditTimeout: 120000,
        enableParallelProcessing: false
      })

      const updatedConfig = scanner.getConfig()
      expect(updatedConfig.npmAuditTimeout).toBe(120000)
      expect(updatedConfig.enableParallelProcessing).toBe(false)
      expect(updatedConfig.maxRetries).toBe(initialConfig.maxRetries) // Should preserve other settings
    })

    it('should provide cache clearing functionality', async () => {
      mockFs.readdir.mockResolvedValue(['test.json', 'other.txt'])
      mockFs.unlink.mockResolvedValue(undefined)

      await scanner.clearScanCache()

      expect(mockFs.unlink).toHaveBeenCalledWith(expect.stringContaining('test.json'))
      expect(mockFs.unlink).not.toHaveBeenCalledWith(expect.stringContaining('other.txt'))
    })
  })

  describe('Enhanced Vulnerability Detection', () => {
    it('should parse npm audit results with enhanced error handling', async () => {
      const mockAuditOutput = {
        vulnerabilities: {
          'test-package': {
            range: '1.0.0 - 1.0.5',
            fixAvailable: { name: '1.0.6' },
            via: [{
              id: 'GHSA-test-123',
              title: 'Test Vulnerability',
              severity: 'high',
              overview: 'Test vulnerability description',
              references: ['https://example.com'],
              cwe: ['CWE-79'],
              cvss: { score: 7.5, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H' }
            }]
          }
        }
      }

      mockExec.mockImplementation((cmd, options, callback) => {
        if (callback) callback(null, JSON.stringify(mockAuditOutput), '')
        return {} as any
      })

      const result = await scanner.runScan()
      
      expect(result.vulnerabilities).toHaveLength(1)
      expect(result.vulnerabilities[0]).toMatchObject({
        title: 'Test Vulnerability',
        severity: 'high',
        package: 'test-package',
        patchedIn: '1.0.6',
        cvss: { score: 7.5 }
      })
    })
  })
})
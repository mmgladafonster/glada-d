#!/usr/bin/env node

// Test script for enhanced dependency scanner
const { DependencySecurityScanner } = require('../lib/dependency-scanner.js')

async function testEnhancedScanner() {
  console.log('🔍 Testing Enhanced Dependency Scanner...\n')

  try {
    // Test 1: Basic scan with default configuration
    console.log('Test 1: Basic scan with default configuration')
    const scanner1 = new DependencySecurityScanner()
    const result1 = await scanner1.runScan()
    
    console.log(`✅ Scan completed in ${result1.duration}ms`)
    console.log(`   Status: ${result1.scanStatus}`)
    console.log(`   Vulnerabilities found: ${result1.vulnerabilities.length}`)
    console.log(`   Cache status: ${result1.cacheStatus}`)
    console.log(`   Errors: ${result1.errors?.length || 0}`)
    console.log()

    // Test 2: Scan with custom configuration
    console.log('Test 2: Scan with custom configuration (shorter timeouts)')
    const scanner2 = new DependencySecurityScanner({
      npmAuditTimeout: 10000,
      enableCaching: true,
      enableParallelProcessing: true,
      verboseLogging: true
    })
    
    const result2 = await scanner2.runScan()
    console.log(`✅ Custom scan completed in ${result2.duration}ms`)
    console.log(`   Status: ${result2.scanStatus}`)
    console.log(`   Cache status: ${result2.cacheStatus}`)
    console.log()

    // Test 3: Test caching by running same scan again
    console.log('Test 3: Testing cache functionality')
    const result3 = await scanner2.runScan()
    console.log(`✅ Cached scan completed in ${result3.duration}ms`)
    console.log(`   Cache status: ${result3.cacheStatus}`)
    console.log()

    // Test 4: Force refresh
    console.log('Test 4: Force refresh (bypass cache)')
    const result4 = await scanner2.runScan(true)
    console.log(`✅ Force refresh completed in ${result4.duration}ms`)
    console.log(`   Cache status: ${result4.cacheStatus}`)
    console.log()

    // Test 5: Configuration management
    console.log('Test 5: Configuration management')
    const originalConfig = scanner2.getConfig()
    console.log(`   Original timeout: ${originalConfig.npmAuditTimeout}ms`)
    
    scanner2.updateConfig({ npmAuditTimeout: 30000 })
    const updatedConfig = scanner2.getConfig()
    console.log(`   Updated timeout: ${updatedConfig.npmAuditTimeout}ms`)
    console.log()

    // Test 6: Cache clearing
    console.log('Test 6: Cache clearing')
    await scanner2.clearScanCache()
    console.log('✅ Cache cleared successfully')
    console.log()

    console.log('🎉 All tests completed successfully!')
    
    // Summary
    console.log('\n📊 Summary:')
    console.log(`   Total vulnerabilities: ${result1.vulnerabilities.length}`)
    console.log(`   Overall risk: ${result1.overallRisk}`)
    console.log(`   Dependencies scanned: ${result1.dependencies.length}`)
    
    if (result1.summary && result1.summary.critical > 0) {
      console.log(`   ⚠️  Critical vulnerabilities: ${result1.summary.critical}`)
    }
    if (result1.summary && result1.summary.high > 0) {
      console.log(`   ⚠️  High vulnerabilities: ${result1.summary.high}`)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  }
}

// Run the test
testEnhancedScanner()
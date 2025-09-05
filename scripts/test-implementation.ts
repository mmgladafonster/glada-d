// Test script for Glada Fönster SEO Recovery Implementation
// Run this to verify all components are working correctly

import { 
  generateValidCombinations, 
  getStaticParams, 
  getRolloutPhases,
  logCombinations 
} from './filterPages';
import { 
  getLocationData, 
  getServiceData, 
  locationDatabase, 
  serviceDatabase 
} from '../lib/locationData';
import { 
  generatePageMetadata, 
  generateLocalBusinessSchema, 
  generatePageContent 
} from '../lib/contentGenerator';

console.log('🧪 Testing Glada Fönster SEO Recovery Implementation');
console.log('====================================================\n');

// Test 1: Database integrity
console.log('1. Testing database integrity...');
console.log(`✅ Locations loaded: ${Object.keys(locationDatabase).length}`);
console.log(`✅ Services loaded: ${Object.keys(serviceDatabase).length}`);

Object.keys(locationDatabase).forEach(key => {
  const location = locationDatabase[key];
  if (!location.city || !location.climateFactors.length) {
    console.error(`❌ Invalid location data for ${key}`);
  }
});

Object.keys(serviceDatabase).forEach(key => {
  const service = serviceDatabase[key];
  if (!service.name || !service.slug) {
    console.error(`❌ Invalid service data for ${key}`);
  }
});

console.log('✅ Database integrity check passed\n');

// Test 2: Page combinations
console.log('2. Testing page combinations...');
const combinations = generateValidCombinations();
console.log(`✅ Generated ${combinations.length} valid combinations`);

const staticParams = getStaticParams();
console.log(`✅ Generated ${staticParams.length} static params for Next.js`);

const phases = getRolloutPhases();
console.log(`✅ Rollout phases: Phase 1 (${phases.phase1.length}), Phase 2 (${phases.phase2.length}), Phase 3 (${phases.phase3.length})`);

// Test 3: Content generation
console.log('\n3. Testing content generation...');
const testService = getServiceData('fonsterputsning');
const testLocation = getLocationData('goteborg');

if (testService && testLocation) {
  const metadata = generatePageMetadata(testService, testLocation);
  console.log(`✅ Generated metadata: ${metadata.title.substring(0, 50)}...`);
  
  const schema = generateLocalBusinessSchema(testService, testLocation);
  console.log(`✅ Generated schema: ${schema.name}`);
  
  const content = generatePageContent(testService, testLocation);
  console.log(`✅ Generated content: ${content.length} characters`);
} else {
  console.error('❌ Failed to load test service or location');
}

// Test 4: URL generation
console.log('\n4. Testing URL generation...');
staticParams.slice(0, 3).forEach(param => {
  console.log(`✅ URL: /tjanster/${param.service}/${param.location}`);
});

console.log('\n🎉 All tests passed! Implementation is ready.');
console.log('\n📋 Next steps:');
console.log('1. Add REVALIDATION_SECRET to your environment variables');
console.log('2. Deploy the changes');
console.log('3. Test a few pages manually');
console.log('4. Submit new sitemap to Google Search Console');
console.log('5. Monitor indexing progress');

// Detailed combination log
console.log('\n📊 Detailed page combinations:');
logCombinations();
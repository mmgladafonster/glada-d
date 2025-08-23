const fs = require('fs');
const path = require('path');

// Test the keywords.json file
function testKeywords() {
  console.log('🧪 Testing Technical Keywords Implementation...\n');
  
  try {
    // Read the keywords.json file
    const keywordsPath = path.join(__dirname, '../lib/keywords.json');
    const keywordsData = fs.readFileSync(keywordsPath, 'utf8');
    const keywords = JSON.parse(keywordsData);
    
    console.log(`✅ Successfully loaded ${keywords.length} keywords from lib/keywords.json`);
    
    // Test 1: Check basic structure
    console.log('\n📊 Basic Structure Test:');
    const sampleKeyword = keywords[0];
    const requiredFields = ['Keyword', 'Service', 'Location', 'Modifier', 'Keyword_Type', 'Search_Intent', 'Estimated_Difficulty', 'Content_Type_Suggestion', 'slug'];
    
    const missingFields = requiredFields.filter(field => !(field in sampleKeyword));
    if (missingFields.length === 0) {
      console.log('✅ All required fields present');
    } else {
      console.log('❌ Missing fields:', missingFields);
    }
    
    // Test 2: Check slug generation
    console.log('\n🔗 Slug Generation Test:');
    const slugs = keywords.map(k => k.slug);
    const uniqueSlugs = new Set(slugs);
    
    console.log(`✅ ${uniqueSlugs.size} unique slugs out of ${slugs.length} keywords`);
    
    if (slugs.length === uniqueSlugs.size) {
      console.log('✅ All slugs are unique');
    } else {
      console.log('❌ Duplicate slugs found');
      const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
      console.log('Duplicate slugs:', [...new Set(duplicates)]);
    }
    
    // Test 3: Check keyword types distribution
    console.log('\n📈 Keyword Types Distribution:');
    const typeCounts = {};
    keywords.forEach(k => {
      typeCounts[k.Keyword_Type] = (typeCounts[k.Keyword_Type] || 0) + 1;
    });
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} keywords`);
    });
    
    // Test 4: Check search intent distribution
    console.log('\n🎯 Search Intent Distribution:');
    const intentCounts = {};
    keywords.forEach(k => {
      intentCounts[k.Search_Intent] = (intentCounts[k.Search_Intent] || 0) + 1;
    });
    
    Object.entries(intentCounts).forEach(([intent, count]) => {
      console.log(`   ${intent}: ${count} keywords`);
    });
    
    // Test 5: Check service distribution
    console.log('\n🛠️ Service Distribution:');
    const serviceCounts = {};
    keywords.forEach(k => {
      serviceCounts[k.Service] = (serviceCounts[k.Service] || 0) + 1;
    });
    
    Object.entries(serviceCounts).forEach(([service, count]) => {
      console.log(`   ${service}: ${count} keywords`);
    });
    
    // Test 6: Check location coverage
    console.log('\n📍 Location Coverage:');
    const locationCounts = {};
    keywords.forEach(k => {
      locationCounts[k.Location] = (locationCounts[k.Location] || 0) + 1;
    });
    
    console.log(`   ${Object.keys(locationCounts).length} unique locations covered`);
    Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([location, count]) => {
        console.log(`   ${location}: ${count} keywords`);
      });
    
    // Test 7: Check difficulty distribution
    console.log('\n📊 Difficulty Distribution:');
    const difficultyCounts = {};
    keywords.forEach(k => {
      difficultyCounts[k.Estimated_Difficulty] = (difficultyCounts[k.Estimated_Difficulty] || 0) + 1;
    });
    
    Object.entries(difficultyCounts).forEach(([difficulty, count]) => {
      console.log(`   ${difficulty}: ${count} keywords`);
    });
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Total Keywords: ${keywords.length}`);
    console.log(`   Unique Services: ${Object.keys(serviceCounts).length}`);
    console.log(`   Unique Locations: ${Object.keys(locationCounts).length}`);
    console.log(`   Keyword Types: ${Object.keys(typeCounts).length}`);
    console.log(`   Search Intents: ${Object.keys(intentCounts).length}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error testing keywords:', error.message);
    return false;
  }
}

// Run the test
if (require.main === module) {
  const success = testKeywords();
  process.exit(success ? 0 : 1);
}

module.exports = { testKeywords };

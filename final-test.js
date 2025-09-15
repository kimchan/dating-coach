// Final verification test
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('=== FINAL VERIFICATION TEST ===');
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

// Test with a simple bio to verify it's working
async function finalTest() {
  try {
    const openrouterModule = await import('./lib/openrouter.ts');
    const { analyzeBio } = openrouterModule;
    
    const testBio = "I enjoy hiking mountains and trying new tacos";
    console.log('\nTest bio:', testBio);
    
    const result = await analyzeBio(testBio);
    
    console.log('\nResult:');
    console.log('- Score:', result.score);
    console.log('- Strengths count:', result.strengths.length);
    console.log('- Improvements count:', result.improvements.length);
    console.log('- Overall length:', result.overall.length, 'characters');
    console.log('- Recommended bio length:', result.recommendedBio.length, 'characters');
    
    // Check if it's mock data
    const isMock = result.score === 45 && 
                   result.strengths.includes("You took the time to write something");
                   
    console.log('\n=== VERDICT ===');
    if (isMock) {
      console.log('❌ USING MOCK DATA');
    } else {
      console.log('✅ USING REAL LLM');
      console.log('   Score:', result.score);
      console.log('   Real LLM response with unique content');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

finalTest();
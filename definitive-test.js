// Definitive test to determine if using mock data or real LLM
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('=== DEFINITIVE MOCK DATA TEST ===');
console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

// Test with a completely unique, nonsensical bio that would never appear in mock data
const uniqueTestBio = "Flurblequixotic snorklemuffin who enjoys quantum cheese dancing and interdimensional pickle juggling. Seeking someone who shares my passion for collecting rainbow socks and debating the philosophical implications of parallel universe toast preferences.";

console.log('\nTesting with completely unique bio:');
console.log('"' + uniqueTestBio + '"');

async function testAnalyzeBio() {
  try {
    // Import the analyzeBio function
    const openrouterModule = await import('./lib/openrouter.ts');
    const { analyzeBio } = openrouterModule;
    
    console.log('\n=== CALLING ANALYZE BIO ===');
    const startTime = Date.now();
    const result = await analyzeBio(uniqueTestBio);
    const endTime = Date.now();
    
    console.log('Time taken:', (endTime - startTime) + 'ms');
    console.log('Response received');
    
    // Log the full result
    console.log('\n=== FULL RESPONSE ===');
    console.log(JSON.stringify(result, null, 2));
    
    // Definitive tests
    console.log('\n=== DEFINITIVE TESTS ===');
    
    // Test 1: Check for mock data score pattern
    const isMockScore = result.score === 45;
    console.log('Score is 45 (mock pattern):', isMockScore);
    
    // Test 2: Check for mock data strength patterns
    const hasMockStrengths = result.strengths.includes("You took the time to write something");
    console.log('Has mock strength pattern:', hasMockStrengths);
    
    // Test 3: Check for mock data improvement patterns
    const hasMockImprovements = result.improvements.some(imp => 
      imp.includes("actual interests and experiences") || 
      imp.includes("genuinely looking for in a match")
    );
    console.log('Has mock improvement patterns:', hasMockImprovements);
    
    // Test 4: Check for mock data overall pattern
    const hasMockOverall = result.overall.includes("generic statements don't help potential matches get to know the real you");
    console.log('Has mock overall pattern:', hasMockOverall);
    
    // Test 5: Check for mock data recommended bio patterns
    const hasMockRecommendedBio = result.recommendedBio.includes("Weekend warrior who once got lost");
    console.log('Has mock recommended bio pattern:', hasMockRecommendedBio);
    
    // Test 6: Check if response contains references to our unique input
    const referencesUniqueInput = 
      result.overall.includes("flurblequixotic") ||
      result.overall.includes("snorklemuffin") ||
      result.overall.includes("quantum cheese") ||
      result.overall.includes("interdimensional pickle") ||
      result.overall.includes("rainbow socks") ||
      result.overall.includes("parallel universe toast");
      
    console.log('References unique input content:', referencesUniqueInput);
    
    // Test 7: Check response length (mock data is typically shorter)
    const responseLength = JSON.stringify(result).length;
    console.log('Response length:', responseLength, 'characters');
    const isLongResponse = responseLength > 1000;
    console.log('Is long response (>1000 chars):', isLongResponse);
    
    // Final determination
    console.log('\n=== FINAL DETERMINATION ===');
    
    const isDefinitelyMockData = 
      isMockScore && 
      hasMockStrengths && 
      hasMockImprovements && 
      hasMockOverall && 
      hasMockRecommendedBio &&
      !referencesUniqueInput &&
      !isLongResponse;
      
    if (isDefinitelyMockData) {
      console.log('❌ DEFINITIVELY USING MOCK DATA');
      console.log('Reasons:');
      if (isMockScore) console.log('  - Score is 45 (mock pattern)');
      if (hasMockStrengths) console.log('  - Contains mock strength patterns');
      if (hasMockImprovements) console.log('  - Contains mock improvement patterns');
      if (hasMockOverall) console.log('  - Contains mock overall pattern');
      if (hasMockRecommendedBio) console.log('  - Contains mock recommended bio pattern');
      if (!referencesUniqueInput) console.log('  - Does not reference unique input content');
      if (!isLongResponse) console.log('  - Response is short (<1000 chars)');
    } else if (referencesUniqueInput) {
      console.log('✅ DEFINITIVELY USING REAL LLM');
      console.log('Reason: Response contains specific references to unique input content');
    } else if (isLongResponse) {
      console.log('✅ LIKELY USING REAL LLM');
      console.log('Reason: Response is long and detailed');
    } else {
      console.log('? UNCLEAR - NEEDS FURTHER INVESTIGATION');
      console.log('Response has mixed characteristics');
    }
    
  } catch (error) {
    console.error('Error testing analyzeBio:', error.message);
    if (error.message.includes('429')) {
      console.log('CONFIRMED: Rate limit error (429) - explains mock data fallback');
    }
  }
}

testAnalyzeBio().catch(console.error);
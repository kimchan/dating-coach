// Robust test to determine if we're using mock data or real LLM
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('=== ROBUST TEST TO DETERMINE MOCK VS REAL LLM ===');
console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

// Create a completely unique test bio that would never appear in mock data
const uniqueTestBio = "Xylophone collector who enjoys underwater basket weaving and quantum physics discussions. Looking for someone who shares my passion for collecting vintage typewriter keys and debating the merits of different pasta shapes. My spirit animal is a caffeinated capybara.";

console.log('\n=== TESTING WITH UNIQUE BIO ===');
console.log('Test bio:', uniqueTestBio);

// Test by directly calling the analyzeBio function
async function testAnalyzeBioFunction() {
  try {
    // Import the function dynamically
    const openrouterModule = await import('./lib/openrouter.ts');
    const { analyzeBio } = openrouterModule;
    
    console.log('\nCalling analyzeBio function...');
    const startTime = Date.now();
    const result = await analyzeBio(uniqueTestBio);
    const endTime = Date.now();
    
    console.log('Time taken:', endTime - startTime, 'ms');
    console.log('Result:');
    console.log(JSON.stringify(result, null, 2));
    
    // Definitive tests to determine if it's mock or real data
    console.log('\n=== ANALYSIS TESTS ===');
    
    // Test 1: Check for specific mock data patterns
    const isGenericMockPattern = result.strengths.some(s => s.includes("took the time to write something"));
    console.log('Contains generic mock pattern:', isGenericMockPattern);
    
    // Test 2: Check for specific mock recommendation patterns
    const isMockRecommendation = result.recommendedBio.includes("Weekend warrior who once got lost");
    console.log('Contains mock recommendation pattern:', isMockRecommendation);
    
    // Test 3: Check for specific mock improvement patterns
    const isMockImprovement = result.improvements.some(i => i.includes("actual interests and experiences"));
    console.log('Contains mock improvement pattern:', isMockImprovement);
    
    // Test 4: Check score (mock data typically returns 45)
    console.log('Score:', result.score);
    const isMockScore = result.score === 45;
    console.log('Is mock score (45):', isMockScore);
    
    // Test 5: Check for unique content matching our input
    const mentionsXylophone = result.overall.includes("xylophone") || result.strengths.some(s => s.includes("xylophone")) || result.recommendedBio.includes("xylophone");
    const mentionsBasketWeaving = result.overall.includes("basket weaving") || result.strengths.some(s => s.includes("basket weaving")) || result.recommendedBio.includes("basket weaving");
    const mentionsQuantumPhysics = result.overall.includes("quantum physics") || result.strengths.some(s => s.includes("quantum physics")) || result.recommendedBio.includes("quantum physics");
    
    console.log('Mentions xylophone:', mentionsXylophone);
    console.log('Mentions basket weaving:', mentionsBasketWeaving);
    console.log('Mentions quantum physics:', mentionsQuantumPhysics);
    
    // Test 6: Check for specific mock data markers
    const hasMockMarkers = result.recommendedBio.includes("Weekend warrior") || 
                           result.recommendedBio.includes("lost for 6 hours") ||
                           result.recommendedBio.includes("sunset photo");
                           
    console.log('Contains mock data markers:', hasMockMarkers);
    
    // Final determination
    console.log('\n=== FINAL DETERMINATION ===');
    
    if (mentionsXylophone || mentionsBasketWeaving || mentionsQuantumPhysics) {
      console.log('✅ RESULT: USING REAL LLM');
      console.log('   Reason: Response contains specific references to unique input content');
    } else if (isGenericMockPattern && isMockRecommendation && isMockImprovement && isMockScore) {
      console.log('❌ RESULT: USING MOCK DATA');
      console.log('   Reason: Response matches known mock data patterns');
    } else if (result.score > 0) {
      console.log('? RESULT: UNCLEAR');
      console.log('   Reason: Has a score but no clear indicators of mock or real data');
      console.log('   Note: Could be real LLM with generic response or partial mock data');
    } else {
      console.log('? RESULT: UNKNOWN');
      console.log('   Reason: Unexpected response pattern');
    }
    
  } catch (error) {
    console.log('\nError calling analyzeBio function:', error.message);
    if (error.message.includes('429')) {
      console.log('CONFIRMED: Getting rate limit error (429)');
      console.log('This explains why mock data is being returned');
    }
  }
}

// Also test the direct API call to see rate limiting
async function testDirectAPICall() {
  console.log('\n=== DIRECT API CALL TEST ===');
  
  if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_MODEL) {
    console.log('Missing environment variables');
    return;
  }
  
  try {
    console.log('Making direct API call...');
    const startTime = Date.now();
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kims-dating-coach.com',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: 'user',
            content: `Analyze this dating app bio: ${uniqueTestBio}\n\nJust respond with "API TEST SUCCESS" to confirm you received this.`
          }
        ],
        temperature: 0.7,
        max_tokens: 20
      })
    });
    
    const endTime = Date.now();
    console.log('API call time:', endTime - startTime, 'ms');
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data.choices[0].message.content);
    } else {
      const errorText = await response.text();
      console.log('API Error:', response.status, errorText);
    }
  } catch (error) {
    console.log('Direct API call error:', error.message);
  }
}

// Run both tests
Promise.all([
  testAnalyzeBioFunction(),
  testDirectAPICall()
]).catch(console.error);
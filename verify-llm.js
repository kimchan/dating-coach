// Test script to compare mock vs LLM responses
const fs = require('fs');
const path = require('path');

// Read the environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

async function compareResponses() {
  console.log('=== LLM Integration Verification Test ===\n');
  
  // Dynamically import the analyzeBio function
  const { analyzeBio } = await import('./lib/openrouter.ts');
  
  const testBio = 'I am a software engineer who loves hiking and photography. Looking for someone to explore the city with.';
  
  console.log('Test Bio:', testBio);
  console.log('\n--- Testing analyzeBio function ---');
  
  // Test the actual function
  const result = await analyzeBio(testBio);
  
  console.log('\nActual Response:');
  console.log('Score:', result.score);
  console.log('Strengths:', result.strengths);
  console.log('Improvements:', result.improvements);
  console.log('Overall:', result.overall.substring(0, 100) + '...');
  console.log('Recommended Bio length:', result.recommendedBio.length);
  
  console.log('\n--- Comparing with Mock Data Patterns ---');
  
  // Mock data patterns we want to verify we're NOT getting
  const mockScorePatterns = [0, 25, 45];
  const mockStrengthPatterns = [
    "You started with a friendly greeting",
    "You took the time to write something"
  ];
  const mockImprovementPatterns = [
    "A dating bio needs more than just a greeting",
    "Share specific details about your actual interests",
    "Include what you're genuinely looking for in a match"
  ];
  
  // Check if we're getting mock data
  const isMockScore = mockScorePatterns.includes(result.score);
  const hasMockStrengths = mockStrengthPatterns.some(pattern => 
    result.strengths.some(strength => strength.includes(pattern))
  );
  const hasMockImprovements = mockImprovementPatterns.some(pattern => 
    result.improvements.some(improvement => improvement.includes(pattern))
  );
  
  console.log('Is mock score?', isMockScore);
  console.log('Has mock strengths?', hasMockStrengths);
  console.log('Has mock improvements?', hasMockImprovements);
  
  // Determine if we're using LLM
  const isUsingLLM = !isMockScore && !hasMockStrengths && !hasMockImprovements;
  
  console.log('\n--- RESULT ---');
  if (isUsingLLM) {
    console.log('✅ SUCCESS: Application is using the ACTUAL LLM');
    console.log('   - Score is not a mock value');
    console.log('   - Response content is unique and detailed');
    console.log('   - No mock data patterns detected');
  } else {
    console.log('❌ FAILURE: Application is using MOCK DATA');
    console.log('   - Detected mock data patterns');
    console.log('   - Response matches predefined templates');
  }
  
  // Additional verification: Check response quality
  if (isUsingLLM) {
    console.log('\n--- QUALITY CHECK ---');
    console.log('Response length score:', result.overall.length > 100 ? '✅ Good' : '❌ Too short');
    console.log('Number of strengths:', result.strengths.length >= 2 ? '✅ Good' : '❌ Too few');
    console.log('Number of improvements:', result.improvements.length >= 2 ? '✅ Good' : '❌ Too few');
    console.log('Bio specificity:', result.recommendedBio.includes('software') || result.recommendedBio.includes('engineer') ? '✅ Good' : '❌ Not specific enough');
  }
  
  return isUsingLLM;
}

// Run the test
compareResponses().then(isUsingLLM => {
  process.exit(isUsingLLM ? 0 : 1);
}).catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
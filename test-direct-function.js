// Test script to directly call the analyzeBio function
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('=== TESTING OPENROUTER INTEGRATION DIRECTLY ===');
console.log('OPENROUTER_API_KEY present:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

// Import and test the analyzeBio function directly
async function testDirectFunctionCall() {
  try {
    // Dynamically import the function
    const { analyzeBio } = await import('./lib/openrouter.ts');
    
    console.log('\n=== TESTING WITH SIMPLE BIO ===');
    const testBio = "I love hiking and tacos";
    console.log('Test bio:', testBio);
    
    const result = await analyzeBio(testBio);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Check if it's mock data by looking for specific patterns
    const isMockData = result.score === 45 && 
                       result.strengths.includes("You took the time to write something") &&
                       result.recommendedBio.includes("Weekend warrior who once got lost");
                       
    console.log('\n=== ANALYSIS ===');
    console.log('Is mock data:', isMockData);
    if (isMockData) {
      console.log('❌ Still using mock data');
    } else {
      console.log('✅ Using actual LLM response');
    }
    
  } catch (error) {
    console.error('Error testing direct function call:', error.message);
    
    // Let's also check what's in the error
    if (error.stack) {
      console.log('Error stack:', error.stack.substring(0, 200) + '...');
    }
  }
}

// Also test with a more complex bio
async function testComplexBio() {
  try {
    const { analyzeBio } = await import('./lib/openrouter.ts');
    
    console.log('\n=== TESTING WITH COMPLEX BIO ===');
    const testBio = `Adventure seeker and food enthusiast here! I'm happiest when exploring new hiking trails with a post-hike taco reward. Looking for someone to share both the simple pleasures and big adventures with. What's your favorite hiking spot or taco topping?`;
    console.log('Test bio:', testBio);
    
    const result = await analyzeBio(testBio);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Check if it's mock data
    const isMockData = result.score === 45 && 
                       result.strengths.includes("You took the time to write something");
                       
    console.log('\n=== ANALYSIS ===');
    console.log('Is mock data:', isMockData);
    if (isMockData) {
      console.log('❌ Still using mock data');
    } else {
      console.log('✅ Using actual LLM response');
    }
  } catch (error) {
    console.error('Error testing complex bio:', error.message);
  }
}

// Run the tests
testDirectFunctionCall().then(() => {
  return testComplexBio();
}).catch(error => {
  console.error('Test failed:', error);
});
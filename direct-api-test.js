// Direct test of the API route
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('=== DIRECT API ROUTE TEST ===');
console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

// Test the actual API route
async function testAPIRoute() {
  try {
    console.log('\nTesting API route directly...');
    
    // Import the route handler
    const routeModule = await import('./app/api/analyze-bio/route.ts');
    
    // Create a mock request object
    const mockRequest = {
      json: async () => ({ bio: "I love hiking mountains and eating tacos" })
    };
    
    console.log('Calling API route with bio: "I love hiking mountains and eating tacos"');
    
    // Call the POST function
    const response = await routeModule.POST(mockRequest);
    
    console.log('API route response received');
    console.log('Response status:', response.status);
    
    // Get the JSON data from the response
    const responseData = await response.json();
    console.log('\nResponse data:');
    console.log(JSON.stringify(responseData, null, 2));
    
    // Check if it's mock data
    const isMock = responseData.score === 45 && 
                   responseData.strengths.includes("You took the time to write something");
                   
    console.log('\nIs mock data:', isMock);
    
    if (isMock) {
      console.log('❌ API route is returning mock data');
    } else {
      console.log('✅ API route is returning real LLM data');
    }
    
  } catch (error) {
    console.error('Error testing API route:', error.message);
    if (error.stack) {
      console.log('Error stack:', error.stack.substring(0, 200) + '...');
    }
  }
}

testAPIRoute();
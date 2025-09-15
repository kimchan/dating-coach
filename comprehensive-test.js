// Comprehensive test to definitively determine if we're using mock data or real LLM
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('=== COMPREHENSIVE LLM INTEGRATION TEST ===');
console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

// Define distinctive test cases that would produce very different responses
// between mock data and real LLM analysis
const testCases = [
  {
    name: 'Empty bio test',
    bio: '',
    expectedMockScore: 0,
    expectedMockStrengths: []
  },
  {
    name: 'Minimal "Hi" bio test',
    bio: 'Hi',
    expectedMockScore: 25,
    expectedMockStrengths: ['You started with a friendly greeting']
  },
  {
    name: 'Generic interests bio test',
    bio: 'I like hiking and reading books.',
    expectedMockScore: 45,
    expectedMockStrengths: ['You took the time to write something']
  },
  {
    name: 'Detailed personal bio test',
    bio: 'Adventure seeker and bookworm here! I spend weekends exploring local hiking trails and weekdays curled up with a good novel. Looking for someone who appreciates both the thrill of discovery and quiet conversations over coffee. What\'s the most memorable place you\'ve visited or book that changed your perspective?',
    expectedMockScore: 45,
    expectedMockStrengths: ['You took the time to write something']
  }
];

// Function to determine if response is mock data
function isMockData(response, testCase) {
  console.log(`\n--- Analyzing response for "${testCase.name}" ---`);
  console.log('Response score:', response.score);
  console.log('Response strengths:', response.strengths);
  console.log('Response improvements length:', response.improvements?.length || 0);
  console.log('Response overall length:', response.overall?.length || 0);
  console.log('Response recommendedBio length:', response.recommendedBio?.length || 0);
  
  // Check for mock data patterns
  const hasMockScore = response.score === testCase.expectedMockScore;
  const hasMockStrengths = testCase.expectedMockStrengths.every(strength => 
    response.strengths.includes(strength));
  
  // Mock data typically has very generic improvements
  const hasGenericImprovements = response.improvements?.some(imp => 
    imp.includes('generic') || imp.includes('specific details'));
  
  // Mock data for empty bio has specific patterns
  if (testCase.bio === '') {
    const isEmptyBioMock = response.score === 0 && 
                           response.strengths.length === 0 &&
                           response.improvements?.some(imp => 
                             imp.includes('completely empty'));
    console.log('Is empty bio mock pattern:', isEmptyBioMock);
    return isEmptyBioMock;
  }
  
  // Mock data for "Hi" bio has specific patterns
  if (testCase.bio === 'Hi') {
    const isHiBioMock = response.score === 25 && 
                        response.strengths.includes('You started with a friendly greeting') &&
                        response.improvements?.some(imp => 
                          imp.includes('much more than just a greeting'));
    console.log('Is "Hi" bio mock pattern:', isHiBioMock);
    return isHiBioMock;
  }
  
  // Generic mock data pattern
  const isGenericMock = hasMockScore && 
                        hasMockStrengths && 
                        hasGenericImprovements;
  
  console.log('Has mock score:', hasMockScore);
  console.log('Has mock strengths:', hasMockStrengths);
  console.log('Has generic improvements:', hasGenericImprovements);
  console.log('Is generic mock pattern:', isGenericMock);
  
  return isGenericMock;
}

// Test the actual API endpoint
async function testAPIEndpoint() {
  console.log('\n=== TESTING VIA API ENDPOINT ===');
  
  for (const testCase of testCases) {
    console.log(`\n--- Testing: ${testCase.name} ---`);
    console.log('Input bio:', JSON.stringify(testCase.bio.substring(0, 50) + (testCase.bio.length > 50 ? '...' : '')));
    
    try {
      const response = await fetch('http://localhost:3000/api/analyze-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio: testCase.bio })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Response received');
        
        const mockCheck = isMockData(result, testCase);
        console.log(`RESULT: ${mockCheck ? '❌ USING MOCK DATA' : '✅ USING REAL LLM'}`);
      } else {
        console.log('API Request failed with status:', response.status);
        const errorText = await response.text();
        console.log('Error details:', errorText);
      }
    } catch (error) {
      console.log('Error testing API:', error.message);
    }
  }
}

// Test direct OpenRouter API call
async function testDirectOpenRouter() {
  console.log('\n=== TESTING DIRECT OPENROUTER CALL ===');
  
  if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_MODEL) {
    console.log('Missing API credentials');
    return;
  }
  
  try {
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
            content: 'Respond with exactly: {"test": "real_llm_response"}'
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });
    
    console.log('Direct API call status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Direct API call successful');
      console.log('Response content preview:', data.choices[0].message.content?.substring(0, 100) + '...');
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('Direct API call failed:', response.status);
      console.log('Error details:', JSON.stringify(errorData, null, 2));
    }
  } catch (error) {
    console.log('Error in direct API call:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testDirectOpenRouter();
  
  // Give the server a moment to start if needed
  setTimeout(async () => {
    await testAPIEndpoint();
    console.log('\n=== TEST COMPLETE ===');
  }, 1000);
}

runAllTests().catch(console.error);
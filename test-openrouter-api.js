// Simple script to test OpenRouter API directly
const fs = require('fs');
const path = require('path');

// Read the environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('=== TESTING OPENROUTER API DIRECTLY ===');
console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_API_KEY length:', process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.length : 0);
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

// Test the fetch API directly
async function testOpenRouterAPI() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.log('No API key found');
    return;
  }
  
  if (!process.env.OPENROUTER_MODEL) {
    console.log('No model specified');
    return;
  }
  
  console.log('Making test request to OpenRouter API...');
  
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
            content: 'Just respond with "TEST SUCCESS: [timestamp]" to confirm the API is working'
          }
        ],
        temperature: 0.7
      })
    });
    
    console.log('API Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response successful:', data.choices[0].message.content);
    } else {
      const errorText = await response.text();
      console.log('API Request failed with status:', response.status);
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.error('Error testing OpenRouter API:', error.message);
  }
}

testOpenRouterAPI();
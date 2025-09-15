// Simple script to test LLM integration directly
const fs = require('fs');
const path = require('path');

// Read the environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('Testing LLM integration...');
console.log('OPENROUTER_API_KEY exists:', !!process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_API_KEY length:', process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.length : 0);

// Test the fetch API directly
async function testLLM() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.log('No API key found, would use mock data');
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
        model: process.env.OPENROUTER_MODEL || 'qwen/qwen3-coder:free',
        messages: [
          {
            role: 'user',
            content: 'Just respond with "TEST SUCCESS" to confirm the API is working'
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
      console.log('API Request failed with status:', response.status);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.error('Error testing LLM:', error);
  }
}

testLLM();
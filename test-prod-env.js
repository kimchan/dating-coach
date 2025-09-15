// Test script to check environment variables in production
console.log('Testing environment variables in production...');
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing');
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL || 'Not set');

if (process.env.OPENROUTER_API_KEY) {
  console.log('API Key length:', process.env.OPENROUTER_API_KEY.length);
}
// Test script to check environment variables in Next.js context
console.log('=== NEXT.JS ENVIRONMENT VARIABLE TEST ===');
console.log('All env vars keys:', Object.keys(process.env));
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Present' : 'Missing');
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL || 'Not set');

if (process.env.OPENROUTER_API_KEY) {
  console.log('API Key length:', process.env.OPENROUTER_API_KEY.length);
  console.log('API Key starts with:', process.env.OPENROUTER_API_KEY.substring(0, 10));
}
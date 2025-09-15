// Simple test to check environment variables
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY);
console.log('OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL);

// Check if variables are available
if (process.env.OPENROUTER_API_KEY) {
  console.log('API Key is available');
} else {
  console.log('API Key is NOT available');
}
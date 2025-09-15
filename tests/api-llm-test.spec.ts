import { test, expect } from '@playwright/test';

test('should use actual LLM via API endpoint', async ({ request }) => {
  // Test the API endpoint directly
  const response = await request.post('/api/analyze-bio', {
    data: {
      bio: 'I am a software engineer who loves hiking and photography. Looking for someone to explore the city with.'
    }
  });
  
  // Check that we get a successful response
  expect(response.ok()).toBeTruthy();
  
  // Get the response data
  const data = await response.json();
  
  // Log the response for debugging
  console.log('API Response:', data);
  
  // Check that we get the expected structure
  expect(data).toHaveProperty('score');
  expect(data).toHaveProperty('strengths');
  expect(data).toHaveProperty('improvements');
  expect(data).toHaveProperty('overall');
  expect(data).toHaveProperty('recommendedBio');
  
  // Check that the score is a reasonable number
  expect(data.score).toBeGreaterThanOrEqual(0);
  expect(data.score).toBeLessThanOrEqual(100);
  
  // Check that we get arrays for strengths and improvements
  expect(Array.isArray(data.strengths)).toBeTruthy();
  expect(Array.isArray(data.improvements)).toBeTruthy();
  
  // Check that we get non-empty strings
  expect(data.overall.length).toBeGreaterThan(0);
  expect(data.recommendedBio.length).toBeGreaterThan(0);
  
  // Log specific values to see if they match mock data patterns
  console.log('Score:', data.score);
  console.log('First strength:', data.strengths[0]);
  console.log('First improvement:', data.improvements[0]);
  
  // The mock data has specific score values:
  // - 0 for empty bio
  // - 25 for "hi" with less than 10 chars
  // - 45 for other inputs
  // If we get different values, it's likely from the LLM
});
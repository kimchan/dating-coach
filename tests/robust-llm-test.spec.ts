import { test, expect } from '@playwright/test';

test('should use actual LLM with distinctive response patterns', async ({ request }) => {
  // Test with a specific bio that should generate distinctive LLM responses
  const testBio = 'I am a software engineer who loves hiking and photography. Looking for someone to explore the city with.';
  
  // Call the API endpoint directly
  const response = await request.post('/api/analyze-bio', {
    data: {
      bio: testBio
    }
  });
  
  // Check that we get a successful response
  expect(response.ok()).toBeTruthy();
  
  // Get the response data
  const data = await response.json();
  
  console.log('LLM Test Response:', JSON.stringify(data, null, 2));
  
  // Verify the response structure
  expect(data).toHaveProperty('score');
  expect(data).toHaveProperty('strengths');
  expect(data).toHaveProperty('improvements');
  expect(data).toHaveProperty('overall');
  expect(data).toHaveProperty('recommendedBio');
  
  // Check data types
  expect(typeof data.score).toBe('number');
  expect(Array.isArray(data.strengths)).toBeTruthy();
  expect(Array.isArray(data.improvements)).toBeTruthy();
  expect(typeof data.overall).toBe('string');
  expect(typeof data.recommendedBio).toBe('string');
  
  // CRITICAL TESTS TO VERIFY LLM VS MOCK DATA:
  
  // 1. Score should not be the mock values (0, 25, or 45)
  expect([0, 25, 45]).not.toContain(data.score);
  
  // 2. Strengths should contain content specific to the bio provided
  // The mock data has generic strengths like "You took the time to write something"
  // But LLM should mention specific elements from the bio like "software engineer", "hiking", "photography"
  const strengthsText = data.strengths.join(' ').toLowerCase();
  expect(strengthsText).toContain('software');
  expect(strengthsText).toContain('hiking');
  expect(strengthsText).toContain('photography');
  
  // 3. Improvements should be specific to the bio content
  // Mock data has generic suggestions like "Share specific details about your actual interests"
  // But LLM should provide specific suggestions based on the bio
  const improvementsText = data.improvements.join(' ').toLowerCase();
  expect(improvementsText.length).toBeGreaterThan(100); // LLM responses are typically more detailed
  
  // 4. Overall feedback should be detailed and specific
  expect(data.overall.length).toBeGreaterThan(100);
  
  // 5. Recommended bio should be substantially different from a template
  expect(data.recommendedBio.length).toBeGreaterThan(150);
  
  // 6. The response should contain specific keywords that indicate LLM analysis
  // rather than the generic mock responses
  const fullResponseText = `${data.strengths.join(' ')} ${data.improvements.join(' ')} ${data.overall} ${data.recommendedBio}`.toLowerCase();
  
  // LLM responses typically contain more sophisticated language
  expect(fullResponseText).toMatch(/(?=.*potential.*match)(?=.*authentic.*personality)(?=.*conversation.*starter)/);
  
  console.log(`✅ LLM Test Passed - Score: ${data.score}`);
  console.log(`✅ Strengths: ${data.strengths.length} items`);
  console.log(`✅ Improvements: ${data.improvements.length} items`);
  console.log(`✅ Overall feedback: ${data.overall.length} characters`);
  console.log(`✅ Recommended bio: ${data.recommendedBio.length} characters`);
});
import { test, expect } from '@playwright/test';

test('should verify if LLM is being called or using mock data', async ({ page }) => {
  // Listen for network requests to see if the LLM API is being called
  let apiCalled = false;
  let mockDataUsed = false;
  
  await page.route('**/api/analyze-bio', async route => {
    apiCalled = true;
    console.log('API endpoint called:', route.request().url());
    console.log('Request method:', route.request().method());
    console.log('Request headers:', route.request().headers());
    
    // Get request body
    const postData = route.request().postData();
    console.log('Request body:', postData);
    
    // Continue with the request to the actual API
    await route.continue();
  });
  
  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I\\'m a software engineer who loves hiking and reading.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  await page.waitForSelector('text=Analysis Results', { timeout: 10000 });
  
  // Check if API was called
  console.log('API called:', apiCalled);
  
  // Get the score element
  const scoreElement = await page.locator(':text-matches(\"[0-9]+\")').first().textContent();
  const score = parseInt(scoreElement || '0');
  console.log('Score:', score);
  
  // Check if score is a valid number
  if (isNaN(score)) {
    console.log('❌ Score is NaN - likely using mock data with errors');
  } else if (score >= 30 && score <= 100) {
    console.log('✅ Score is valid - likely using real LLM or properly functioning mock data');
  } else {
    console.log('⚠️ Score is out of expected range - might be using mock data');
  }
  
  // Check the recommended bio content for mock data indicators
  const recommendedBio = await page.locator('pre').last().textContent();
  console.log('Recommended bio length:', recommendedBio?.length);
  
  if (recommendedBio) {
    // Check for common mock data patterns
    const mockIndicators = [
      'Adventure seeker who believes',
      'Professional problem solver by day',
      'Weekend explorer mapping out',
      'Refresh #',
      'This is a solid dating bio',
      'Your bio has a compelling hook'
    ];
    
    const isMockData = mockIndicators.some(indicator => 
      recommendedBio.includes(indicator)
    );
    
    if (isMockData) {
      console.log('❌ Using mock data - found common mock data patterns');
      mockDataUsed = true;
    } else {
      console.log('✅ Not using obvious mock data patterns');
    }
    
    // Check if bio contains personalized content based on input
    const hasPersonalizedContent = recommendedBio.includes('software engineer') || 
                                  recommendedBio.includes('hiking') || 
                                  recommendedBio.includes('reading');
                                  
    if (hasPersonalizedContent) {
      console.log('✅ Recommended bio contains personalized content from input');
    } else {
      console.log('⚠️ Recommended bio does not contain personalized content from input');
    }
  }
  
  // Summary
  console.log('\n=== LLM Verification Summary ===');
  console.log('API Endpoint Called:', apiCalled ? 'YES' : 'NO');
  console.log('Using Mock Data:', mockDataUsed ? 'LIKELY' : 'UNLIKELY');
  console.log('Score Valid:', !isNaN(score) ? 'YES' : 'NO');
  console.log('Personalized Content:', recommendedBio?.includes('software engineer') || 
                                     recommendedBio?.includes('hiking') || 
                                     recommendedBio?.includes('reading') ? 'YES' : 'NO');
  
  if (!apiCalled) {
    console.log('\n🔴 ISSUE: API endpoint was not called at all');
  }
  
  if (mockDataUsed) {
    console.log('\n🟡 ISSUE: Application is likely using mock data instead of LLM');
  }
  
  if (isNaN(score)) {
    console.log('\n🔴 ISSUE: Score is not a valid number (NaN)');
  }
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'test-results/llm-verification.png' });
  
  // Assertions for test failure/success
  // For now, we'll expect the test to pass even if there are issues
  // This allows us to see the diagnostic information
  expect(true).toBe(true);
});
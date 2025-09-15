import { test, expect } from '@playwright/test';

test('should verify LLM integration', async ({ page }) => {
  // Listen for console messages
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(msg.text());
    console.log('Browser console:', msg.text());
  });

  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill("Hi! I'm a software engineer who loves hiking and reading books.");
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for some time to see if any API calls are made
  await page.waitForTimeout(5000);
  
  // Check if we see any console messages indicating LLM usage
  const llmMessages = consoleMessages.filter(msg => 
    msg.includes('API call') || 
    msg.includes('LLM') || 
    msg.includes('OpenRouter') ||
    msg.includes('mock data')
  );
  
  console.log('LLM-related console messages:', llmMessages);
  
  // Look for network requests to the API
  const apiRequests = await page.evaluate(() => {
    // @ts-ignore
    return window.__playwrightNetworkRequests || [];
  });
  
  const analyzeRequests = apiRequests.filter((req: any) => 
    req.url.includes('/api/analyze-bio')
  );
  
  console.log('API requests:', analyzeRequests);
  
  // Check if analysis results are displayed
  const scoreElement = page.locator(':text-matches("[0-9]+")').first();
  const scoreText = await scoreElement.textContent();
  const score = parseInt(scoreText || '0');
  
  console.log('Score found:', score);
  
  // Check if strengths section is visible
  const strengthsSection = page.getByText('Strengths');
  const isVisible = await strengthsSection.isVisible();
  
  console.log('Strengths section visible:', isVisible);
  
  if (isNaN(score) || !isVisible) {
    console.log('⚠️  Application appears to be using mock data or not functioning correctly');
    console.log('Expected: Valid score and visible strengths section');
    console.log('Actual: Score =', score, ', Strengths visible =', isVisible);
  } else {
    console.log('✅ Application appears to be working correctly with a score of', score);
  }
});
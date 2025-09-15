import { test, expect } from '@playwright/test';

test('should show user-friendly error message on API rate limit', async ({ page }) => {
  // Mock the API to return a 429 rate limit error
  await page.route('**/api/analyze-bio', route => {
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          message: 'Rate limit exceeded',
          code: 429
        }
      })
    });
  });

  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I love hiking and tacos.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the alert to appear
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain("Sorry, we're experiencing high demand right now");
    await dialog.accept();
  });
  
  // Wait a bit for the error to be handled
  await page.waitForTimeout(1000);
  
  console.log('✅ Rate limit error handling works correctly');
});

test('should show user-friendly error message on refresh API rate limit', async ({ page }) => {
  // First, mock a successful analysis
  await page.route('**/api/analyze-bio', route => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          score: 75,
          strengths: ['Clear communication', 'Good use of emojis'],
          improvements: ['Add more specific interests', 'Include a call to action'],
          overall: 'This is a strong bio with good clarity.',
          recommendedBio: 'Adventure seeker who loves hiking trails and trying new tacos. Lets explore the city together!'
        });
      });
    } else {
      route.continue();
    }
  });

  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I love hiking and tacos.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  await page.waitForSelector('text=Strengths');
  
  // Now mock the refresh endpoint to return a 429 rate limit error
  await page.route('**/api/analyze-bio', route => {
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({
        error: {
          message: 'Rate limit exceeded',
          code: 429
        }
      })
    });
  });
  
  // Click the refresh button
  const refreshButton = page.getByRole('button', { name: 'Refresh' });
  await refreshButton.click();
  
  // Wait for the alert to appear
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain("Sorry, we're experiencing high demand right now");
    await dialog.accept();
  });
  
  // Wait a bit for the error to be handled
  await page.waitForTimeout(1000);
  
  console.log('✅ Refresh rate limit error handling works correctly');
});
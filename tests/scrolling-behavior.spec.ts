import { test, expect } from '@playwright/test';

test('should scroll to strengths section on desktop', async ({ page }) => {
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1200, height: 800 });
  
  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I love hiking and tacos. Looking for someone fun to hang out with.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  await page.waitForSelector('text=Strengths');
  
  // Wait a bit more for scrolling to complete
  await page.waitForTimeout(1000);
  
  // Check that the page has scrolled to the strengths section
  const strengthsSection = page.getByText('Strengths');
  const strengthsBox = await strengthsSection.boundingBox();
  
  // The strengths section should be near the top of the viewport (within 300px)
  expect(strengthsBox?.y).toBeLessThan(300);
  
  console.log('✅ Desktop scrolling to strengths section working correctly');
});

test('should scroll to strengths section on mobile', async ({ page }) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I love hiking and tacos. Looking for someone fun to hang out with.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  await page.waitForSelector('text=Strengths');
  
  // Wait a bit more for scrolling to complete
  await page.waitForTimeout(1000);
  
  // Check that the page has scrolled to the strengths section
  const strengthsSection = page.getByText('Strengths');
  const strengthsBox = await strengthsSection.boundingBox();
  const viewportHeight = page.viewportSize()?.height || 667;
  
  // The strengths section should be near the top of the viewport (within 70% of viewport height)
  expect(strengthsBox?.y).toBeLessThan(viewportHeight * 0.7);
  
  console.log('✅ Mobile scrolling to strengths section working correctly');
});
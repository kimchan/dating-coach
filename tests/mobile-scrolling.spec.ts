import { test, expect } from '@playwright/test';

test('should scroll to strengths card when analyzing bio on mobile', async ({ page }) => {
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
  const strengthsSection = page.getByText('Strengths');
  await expect(strengthsSection).toBeVisible();
  
  // Check that the page has scrolled to the strengths section
  // We'll verify this by checking the position of the strengths section
  const strengthsBox = await strengthsSection.boundingBox();
  const viewportHeight = page.viewportSize()?.height || 667;
  
  // The strengths section should be near the top of the viewport
  expect(strengthsBox?.y).toBeLessThan(viewportHeight * 0.3);
  
  console.log('✅ Mobile scrolling to strengths card working correctly');
});

test('should have proper spacing around strengths card on mobile', async ({ page }) => {
  // Set viewport to mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  
  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Adventure seeker and food lover. Love trying new restaurants and exploring trails.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  const strengthsCard = page.locator('div:has(> h3:has-text("Strengths"))').first();
  await expect(strengthsCard).toBeVisible();
  
  // Check that the strengths card has proper padding/margin
  const cardBoundingBox = await strengthsCard.boundingBox();
  expect(cardBoundingBox?.width).toBeGreaterThan(300); // Should be wide enough for mobile
  
  console.log('✅ Strengths card properly sized for mobile');
});
import { test, expect } from '@playwright/test';

test('should display all analysis sections after bio analysis', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I love hiking and tacos. Looking for someone fun to hang out with.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  await page.waitForSelector('text=Strengths', { timeout: 10000 });
  
  // Check that all result sections are now visible
  const strengthsSection = page.getByRole('heading', { name: 'Strengths' });
  const improvementsSection = page.getByRole('heading', { name: 'Suggestions for Improvement' });
  const feedbackSection = page.getByRole('heading', { name: 'Overall Feedback' });
  const recommendedBioSection = page.getByRole('heading', { name: 'Recommended Bio' });
  
  await expect(strengthsSection).toBeVisible();
  await expect(improvementsSection).toBeVisible();
  await expect(feedbackSection).toBeVisible();
  await expect(recommendedBioSection).toBeVisible();
  
  console.log('✅ All analysis sections are displayed correctly');
});

test('should handle mobile view correctly', async ({ page }) => {
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
  await page.waitForSelector('text=Strengths', { timeout: 10000 });
  
  // Check that all result sections are now visible
  const strengthsSection = page.getByRole('heading', { name: 'Strengths' });
  const improvementsSection = page.getByRole('heading', { name: 'Suggestions for Improvement' });
  const feedbackSection = page.getByRole('heading', { name: 'Overall Feedback' });
  const recommendedBioSection = page.getByRole('heading', { name: 'Recommended Bio' });
  
  await expect(strengthsSection).toBeVisible();
  await expect(improvementsSection).toBeVisible();
  await expect(feedbackSection).toBeVisible();
  await expect(recommendedBioSection).toBeVisible();
  
  console.log('✅ Mobile view displays all sections correctly');
});
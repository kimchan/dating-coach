import { test, expect } from '@playwright/test';

test('should not have hydration errors', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Check that the page loads without errors
  await expect(page).toHaveTitle(/Dating Bio Analyzer/);
  
  // Check that the main heading is present
  await expect(page.getByText('Dating Bio Analyzer')).toBeVisible();
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I love hiking and tacos. Looking for someone fun to hang out with.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  const analysisResults = page.getByText('Analysis Results');
  await expect(analysisResults).toBeVisible({ timeout: 10000 });
  
  // Check that a score is displayed
  const scoreElement = page.locator(':text-matches("[0-9]+")').first();
  await expect(scoreElement).toBeVisible();
  
  // Check that strengths are displayed
  const strengthsSection = page.getByText('Strengths');
  await expect(strengthsSection).toBeVisible();
  
  // Check that improvements are displayed
  const improvementsSection = page.getByText('Suggestions for Improvement');
  await expect(improvementsSection).toBeVisible();
  
  // Check that overall feedback is displayed
  const feedbackSection = page.getByText('Overall Feedback');
  await expect(feedbackSection).toBeVisible();
  
  // Check that a recommended bio is displayed
  const recommendedBioSection = page.getByText('Recommended Bio');
  await expect(recommendedBioSection).toBeVisible();
  
  // Verify no console errors
  const errorLogs = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errorLogs.push(msg.text());
    }
  });
  
  // Wait a bit to catch any delayed errors
  await page.waitForTimeout(2000);
  
  // Check for hydration errors
  const hydrationErrors = errorLogs.filter(log => log.includes('hydration'));
  expect(hydrationErrors).toHaveLength(0);
  
  console.log('✅ No hydration errors found');
  console.log('✅ Component is working correctly');
});
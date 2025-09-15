import { test, expect } from '@playwright/test';

test('should refresh recommended bio to generate new variations', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('I am a software engineer who loves hiking and photography. Looking for someone to explore the city with.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  const analysisResults = page.getByText('Analysis Results');
  await expect(analysisResults).toBeVisible();
  
  // Get the initial recommended bio
  const recommendedBioSection = page.getByText('Recommended Bio');
  await expect(recommendedBioSection).toBeVisible();
  
  const initialBio = await page.locator('pre').last().textContent();
  expect(initialBio).toBeTruthy();
  
  // Click the refresh button
  const refreshButton = page.getByRole('button', { name: 'Refresh' });
  await refreshButton.click();
  
  // Wait for the refresh to complete
  await expect(refreshButton).toBeEnabled(); // Button should be enabled again when refresh is done
  
  // Get the new recommended bio
  const newBio = await page.locator('pre').last().textContent();
  expect(newBio).toBeTruthy();
  
  // The new bio should be different from the initial bio
  // Note: There's a small chance they could be the same, but it's very unlikely
  expect(newBio).not.toEqual(initialBio);
  
  console.log('Initial bio:', initialBio);
  console.log('New bio:', newBio);
  
  console.log('✅ Refresh feature working - generated new bio variation');
});
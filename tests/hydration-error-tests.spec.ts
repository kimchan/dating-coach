import { test, expect } from '@playwright/test';

test('should not have hydration errors on initial load', async ({ page }) => {
  // Capture console errors during page load
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Navigate to the home page
  await page.goto('/');
  
  // Check that the page has the correct title
  await expect(page).toHaveTitle(/Dating Bio Analyzer/);
  
  // Verify no hydration errors in console
  const hydrationErrors = consoleErrors.filter(error => 
    error.includes('hydration') || 
    error.includes('mismatch') ||
    error.includes('did not match')
  );
  
  expect(hydrationErrors).toHaveLength(0);
  
  console.log('✅ No hydration errors on initial page load');
});

test('should analyze bio and display results without errors', async ({ page }) => {
  // Capture console errors during analysis
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

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
  const strengthsSection = page.getByText('Strengths');
  const improvementsSection = page.getByText('Suggestions for Improvement');
  const feedbackSection = page.getByText('Overall Feedback');
  const recommendedBioSection = page.getByText('Recommended Bio');
  
  await expect(strengthsSection).toBeVisible();
  await expect(improvementsSection).toBeVisible();
  await expect(feedbackSection).toBeVisible();
  await expect(recommendedBioSection).toBeVisible();
  
  // Verify no errors occurred during analysis
  const analysisErrors = consoleErrors.filter(error => 
    error.includes('hydration') || 
    error.includes('mismatch') ||
    error.includes('did not match') ||
    error.includes('Failed to analyze bio') ||
    error.includes('500')
  );
  
  expect(analysisErrors).toHaveLength(0);
  
  console.log('✅ Bio analysis completes without errors and UI updates correctly');
});

test('should handle client-side state changes without errors', async ({ page }) => {
  // Capture console errors during interactions
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Navigate to the home page
  await page.goto('/');
  
  // Click the scoring info button to toggle visibility
  const infoButton = page.locator('button[aria-label="How we score dating bios"]');
  await infoButton.click();
  
  // Check that the scoring info panel is now visible
  const scoringInfoPanel = page.getByText('How We Score Dating Bios');
  await expect(scoringInfoPanel).toBeVisible();
  
  // Click the close button to hide it
  const closeButton = page.getByRole('button', { name: 'Close' });
  await closeButton.click();
  
  // Check that the scoring info panel is hidden again
  await expect(scoringInfoPanel).not.toBeVisible();
  
  // Verify no errors occurred during these interactions
  const interactionErrors = consoleErrors.filter(error => 
    error.includes('hydration') || 
    error.includes('mismatch') ||
    error.includes('did not match') ||
    error.includes('Cannot read properties') ||
    error.includes('undefined')
  );
  
  expect(interactionErrors).toHaveLength(0);
  
  console.log('✅ Client-side state changes handled without errors');
});

test('should copy recommended bio to clipboard without errors', async ({ page }) => {
  // Capture console errors during copy operation
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I love hiking and tacos. Looking for someone fun to hang out with.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  const analysisResults = page.getByText('Analysis Results');
  await expect(analysisResults).toBeVisible();
  
  // Click the copy to clipboard button
  const copyButton = page.getByRole('button', { name: 'Copy' });
  await copyButton.click();
  
  // Check that the button text changes to "Copied!"
  await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
  
  // Verify no errors occurred during copy operation
  const copyErrors = consoleErrors.filter(error => 
    error.includes('hydration') || 
    error.includes('mismatch') ||
    error.includes('did not match') ||
    error.includes('clipboard') ||
    error.includes('navigator')
  );
  
  expect(copyErrors).toHaveLength(0);
  
  console.log('✅ Copy to clipboard functionality works without errors');
});

test('should refresh recommended bio without errors', async ({ page }) => {
  // Capture console errors during refresh
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

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
  
  // Wait for the refresh to complete (button should be enabled again)
  await expect(refreshButton).toBeEnabled({ timeout: 10000 });
  
  // Get the new recommended bio
  const newBio = await page.locator('pre').last().textContent();
  expect(newBio).toBeTruthy();
  
  // Both bios should exist and be reasonably long
  expect(initialBio?.length).toBeGreaterThan(50);
  expect(newBio?.length).toBeGreaterThan(50);
  
  // Verify no errors occurred during refresh
  const refreshErrors = consoleErrors.filter(error => 
    error.includes('hydration') || 
    error.includes('mismatch') ||
    error.includes('did not match') ||
    error.includes('Failed to refresh bio') ||
    error.includes('500')
  );
  
  expect(refreshErrors).toHaveLength(0);
  
  console.log('✅ Refresh functionality works without errors');
});
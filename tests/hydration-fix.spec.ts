import { test, expect } from '@playwright/test';

test('should not have hydration errors and render correctly', async ({ page }) => {
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
  
  // Check that the main heading is present
  await expect(page.getByText('Dating Bio Analyzer')).toBeVisible();
  
  // Verify no hydration errors in console
  const hydrationErrors = consoleErrors.filter(error => 
    error.includes('hydration') || 
    error.includes('mismatch') ||
    error.includes('did not match')
  );
  
  expect(hydrationErrors).toHaveLength(0);
  
  // Check that the bio textarea is present and interactable
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await expect(bioTextarea).toBeVisible();
  await expect(bioTextarea).toBeEditable();
  
  // Check that the analyze button is present
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await expect(analyzeButton).toBeVisible();
  
  // Verify the initial state of the UI is correct
  // Check that no analysis results are visible initially
  const strengthsSection = page.getByText('Strengths');
  const improvementsSection = page.getByText('Suggestions for Improvement');
  const feedbackSection = page.getByText('Overall Feedback');
  const recommendedBioSection = page.getByText('Recommended Bio');
  
  // These sections should not be visible initially
  await expect(strengthsSection).not.toBeVisible();
  await expect(improvementsSection).not.toBeVisible();
  await expect(feedbackSection).not.toBeVisible();
  await expect(recommendedBioSection).not.toBeVisible();
  
  console.log('✅ No hydration errors found and UI renders correctly');
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

test('should analyze bio and update UI without errors', async ({ page }) => {
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
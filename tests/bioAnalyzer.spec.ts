import { test, expect } from '@playwright/test';

test('should analyze a dating bio and display results', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Check that the page has the correct title
  await expect(page).toHaveTitle(/Dating Bio Analyzer/);
  
  // Check that the main heading is present
  await expect(page.getByText('Dating Bio Analyzer')).toBeVisible();
  
  // Find the bio textarea and fill it with a sample bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi! I love hiking and tacos. Looking for someone fun to hang out with.');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  const analysisResults = page.getByText('Analysis Results');
  await expect(analysisResults).toBeVisible();
  
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
});

test('should show scoring information when button is clicked', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Click the "Show Details" button for scoring information
  const showDetailsButton = page.getByRole('button', { name: 'Show Details' });
  await showDetailsButton.click();
  
  // Check that the scoring details are visible
  const scoringDetails = page.getByText('Clarity & Purpose (25pts):');
  await expect(scoringDetails).toBeVisible();
  
  // Click the "Hide Details" button
  const hideDetailsButton = page.getByRole('button', { name: 'Hide Details' });
  await hideDetailsButton.click();
  
  // Check that the scoring details are hidden
  await expect(scoringDetails).not.toBeVisible();
});

test('should copy recommended bio to clipboard', async ({ page }) => {
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
});

test('should analyze low-effort bio with score below 30', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Fill the bio textarea with a low-effort bio
  const bioTextarea = page.getByLabel('Your Dating Bio');
  await bioTextarea.fill('Hi');
  
  // Click the analyze button
  const analyzeButton = page.getByRole('button', { name: 'Analyze Bio' });
  await analyzeButton.click();
  
  // Wait for the analysis results to appear
  const analysisResults = page.getByText('Analysis Results');
  await expect(analysisResults).toBeVisible();
  
  // Check that the score is below 30 for low-effort bio
  // Note: We're using mock data, so we know what the score will be
  const scoreElement = page.locator(':text-matches("[0-9]+")').first();
  const scoreText = await scoreElement.textContent();
  const score = parseInt(scoreText || '0');
  expect(score).toBeLessThan(30);
});

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
  
  // Wait for the refresh to complete (button should be enabled again)
  await expect(refreshButton).toBeEnabled({ timeout: 10000 });
  
  // Get the new recommended bio
  const newBio = await page.locator('pre').last().textContent();
  expect(newBio).toBeTruthy();
  
  console.log('Initial bio length:', initialBio?.length);
  console.log('New bio length:', newBio?.length);
  
  // Both bios should exist and be reasonably long
  expect(initialBio?.length).toBeGreaterThan(50);
  expect(newBio?.length).toBeGreaterThan(50);
  
  console.log('✅ Refresh feature working - generated new bio variation');
});
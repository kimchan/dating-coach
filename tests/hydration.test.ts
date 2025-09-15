import { test, expect } from '@playwright/test';

test('Bio Analyzer component structure test', async ({ page }) => {
  // Capture console errors
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Navigate to the home page
  await page.goto('http://localhost:3000');
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  
  // Wait for any hydration errors to appear
  await page.waitForTimeout(3000);
  
  // Check for hydration errors
  const hydrationErrors = consoleErrors.filter(error => 
    error.includes('hydration') || 
    error.includes('Hydration') ||
    error.includes('mismatch') ||
    error.includes('did not match')
  );
  
  // Log all console errors for debugging
  console.log('All console errors:', consoleErrors);
  console.log('Hydration errors:', hydrationErrors);
  
  // Report if there are hydration errors
  if (hydrationErrors.length > 0) {
    console.log('Hydration errors found:');
    hydrationErrors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'test-results/homepage.png' });
  
  // Check that the main elements are present
  await expect(page.locator('h1:has-text("Dating Bio Analyzer")')).toBeVisible();
  await expect(page.locator('textarea[placeholder*="dating app bio"]')).toBeVisible();
  await expect(page.locator('button:has-text("Analyze Bio")')).toBeVisible();
  
  // The test will fail if there are hydration errors
  expect(hydrationErrors.length).toBe(0);
});
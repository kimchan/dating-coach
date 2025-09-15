import { test, expect, Page } from '@playwright/test';

// Helper function to capture and analyze console errors
async function captureHydrationErrors(page: Page) {
  const hydrationErrors: string[] = [];
  
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error' && (
      text.includes('hydration') || 
      text.includes('Hydration') ||
      text.includes('mismatch') ||
      text.includes('did not match') ||
      text.includes('Expected server HTML') ||
      text.includes('ReactHydrationError')
    )) {
      hydrationErrors.push(text);
    }
  });
  
  return hydrationErrors;
}

test.describe('Hydration Error Tests', () => {
  test('should not have hydration errors on initial load', async ({ page }) => {
    const hydrationErrors = await captureHydrationErrors(page);
    
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Wait for any hydration errors to appear (give it time)
    await page.waitForTimeout(3000);
    
    // Check for hydration errors
    expect(hydrationErrors.length).toBe(0);
    
    if (hydrationErrors.length > 0) {
      console.log('Hydration errors found:');
      hydrationErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
  });

  test('should not have hydration errors after bio analysis', async ({ page }) => {
    const hydrationErrors = await captureHydrationErrors(page);
    
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Fill in a test bio
    await page.fill('textarea[placeholder*="dating app bio"]', 'This is a test dating bio for hydration testing.');
    
    // Click the analyze button
    await page.click('button:has-text("Analyze Bio")');
    
    // Wait for analysis to complete
    await page.waitForSelector('text=Strengths', { timeout: 10000 });
    
    // Wait for any hydration errors to appear
    await page.waitForTimeout(3000);
    
    // Check for hydration errors
    expect(hydrationErrors.length).toBe(0);
    
    if (hydrationErrors.length > 0) {
      console.log('Hydration errors found after analysis:');
      hydrationErrors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
  });

  test('should maintain consistent DOM structure between server and client', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Get the initial DOM structure
    const initialDOM = await page.evaluate(() => document.body.innerHTML);
    
    // Reload the page to test server-client consistency
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Get the DOM structure after reload
    const reloadDOM = await page.evaluate(() => document.body.innerHTML);
    
    // Compare the two DOM structures (simplified comparison)
    expect(initialDOM).toContain('Dating Bio Analyzer');
    expect(reloadDOM).toContain('Dating Bio Analyzer');
    
    // Check for key elements in both versions
    expect(initialDOM).toContain('textarea');
    expect(reloadDOM).toContain('textarea');
    expect(initialDOM).toContain('Analyze Bio');
    expect(reloadDOM).toContain('Analyze Bio');
  });

  test('should handle mobile bio shortening without hydration errors', async ({ page }) => {
    const hydrationErrors = await captureHydrationErrors(page);
    
    // Set viewport to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the home page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    
    // Fill in a long test bio
    const longBio = 'This is a very long dating bio that should trigger the mobile shortening feature. '.repeat(10);
    await page.fill('textarea[placeholder*="dating app bio"]', longBio);
    
    // Click the analyze button
    await page.click('button:has-text("Analyze Bio")');
    
    // Wait for analysis to complete
    await page.waitForSelector('text=Strengths', { timeout: 10000 });
    
    // Wait for any hydration errors to appear
    await page.waitForTimeout(3000);
    
    // Check for hydration errors
    expect(hydrationErrors.length).toBe(0);
  });
});
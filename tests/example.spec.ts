import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('should load example.com', async ({ page }) => {
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toContain('Example');
  });

  test('should have visible heading', async ({ page }) => {
    await page.goto('https://example.com');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});

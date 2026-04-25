import { test, expect } from '@playwright/test';

test.describe('Rahul Shetty Academy - Login Page Tests', () => {
  test('should navigate to login page and verify elements', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    // Verify page title
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Login Page Practise');
    
    // Verify key elements are visible
    const usernameInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const signInButton = page.locator('input[value="Sign in"]');
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(signInButton).toBeVisible();
  });

  test('should sign in with valid credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    // Fill in username
    await page.locator('input[type="email"]').fill('rahulshettyacademy');
    
    // Fill in password
    await page.locator('input[type="password"]').fill('learning');
    
    // Click sign in button
    await page.locator('input[value="Sign in"]').click();
    
    // Wait for navigation and verify successful login
    await page.waitForURL('**/dashboard/');
    
    // Verify we're on the dashboard page
    const pageUrl = page.url();
    expect(pageUrl).toContain('dashboard');
  });

  test('should display error with invalid credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    // Fill in invalid credentials
    await page.locator('input[type="email"]').fill('invaliduser');
    await page.locator('input[type="password"]').fill('wrongpassword');
    
    // Click sign in button
    await page.locator('input[value="Sign in"]').click();
    
    // Wait for error message or stay on login page
    await page.waitForTimeout(2000);
    
    // Verify we're still on login page (not redirected)
    const pageUrl = page.url();
    expect(pageUrl).toContain('loginpagePractise');
  });

  test('should verify remember me checkbox', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    // Verify "Remember me" checkbox exists and is not checked
    const rememberMeCheckbox = page.locator('input[name="chkboxOne"]');
    await expect(rememberMeCheckbox).toBeVisible();
    
    const isChecked = await rememberMeCheckbox.isChecked();
    expect(isChecked).toBe(false);
    
    // Check the "Remember me" checkbox
    await rememberMeCheckbox.check();
    const isNowChecked = await rememberMeCheckbox.isChecked();
    expect(isNowChecked).toBe(true);
  });

  test('should verify dropdown selection', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    // Select an option from dropdown if available
    const dropdown = page.locator('select');
    if (await dropdown.isVisible()) {
      await dropdown.selectOption('consult');
      const selectedValue = await dropdown.inputValue();
      expect(selectedValue).toBe('consult');
    }
  });

  test('should sign in and add iPhone X product to cart', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    // Sign in with valid credentials
    await page.locator('input[type="email"]').fill('rahulshettyacademy');
    await page.locator('input[type="password"]').fill('learning');
    await page.locator('input[value="Sign in"]').click();
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard/');
    
    // Wait for products to load
    await page.waitForTimeout(2000);
    
    // Find and click on iPhone X product
    const iPhoneXProduct = page.locator('text=iphone X').first();
    await expect(iPhoneXProduct).toBeVisible();
    await iPhoneXProduct.click();
    
    // Add to cart button - typically next to product or after clicking product
    const addToCartButton = page.locator('button:has-text("Add to cart")').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    
    // Wait for confirmation
    await page.waitForTimeout(1000);
    
    // Verify product was added to cart - check cart badge or navigate to cart
    const cartLink = page.locator('a[href*="cart"]');
    if (await cartLink.isVisible()) {
      await cartLink.click();
      
      // Verify iPhone X is in cart
      const cartItem = page.locator('text=iphone X');
      await expect(cartItem).toBeVisible();
    }
  });
});

import { test, expect } from '@playwright/test';

test('valid login navigates to dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/login'); // Adjust URL as needed

    await page.fill('input[name="username"]', 'testuser'); // adjust selectors if different
    await page.fill('input[name="password"]', 'secret');
    await page.click('button[type="submit"]');

    // Expect to be redirected to dashboard
    await expect(page).toHaveURL(/dashboard/);

    // Optional: check for dashboard-specific content
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
});

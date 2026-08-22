import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark'] as const) {
  test(`@visual component baseline in ${theme} theme`, async ({ page }) => {
    await page.goto('/');

    if (theme === 'dark') {
      await page.getByRole('button', { name: 'Use dark theme' }).click();
    }

    await expect(page.locator('main')).toHaveScreenshot(`components-${theme}.png`);
  });
}

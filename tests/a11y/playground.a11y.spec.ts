import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark'] as const) {
  test(`playground has no automated accessibility violations in ${theme} theme`, async ({
    page,
  }) => {
    await page.goto('/');

    const playground = page.locator('main');

    if (theme === 'dark') {
      await page.getByRole('button', { name: 'Use dark theme' }).click();
      await expect(playground).toHaveClass(/fui-theme-dark/);
      await expect(playground).toHaveCSS('background-color', 'rgb(41, 41, 41)');
    }

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });
}

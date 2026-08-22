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

test('ProgressBar fixtures expose determinate, indeterminate, and Field-derived names', async ({
  page,
}) => {
  await page.goto('/');

  const determinate = page.getByRole('progressbar', { name: 'Custom maximum progress' });
  await expect(determinate).toHaveAttribute('aria-valuemin', '0');
  await expect(determinate).toHaveAttribute('aria-valuemax', '100');
  await expect(determinate).toHaveAttribute('aria-valuenow', '36');

  const indeterminate = page.getByRole('progressbar', {
    name: 'Indeterminate progress',
    exact: true,
  });
  await expect(indeterminate).not.toHaveAttribute('aria-valuemin');
  await expect(indeterminate).not.toHaveAttribute('aria-valuemax');
  await expect(indeterminate).not.toHaveAttribute('aria-valuenow');

  await expect(page.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute(
    'aria-describedby',
    /^fui-field-.+__hint$/,
  );
  await expect(page.getByRole('progressbar', { name: 'Profile import' })).toHaveAttribute(
    'aria-describedby',
    /^fui-field-.+__validation-message$/,
  );
});

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

test('SpinButton fixtures expose names, bounds, Field relationships, and states', async ({
  page,
}) => {
  await page.goto('/');

  const bounded = page.getByRole('spinbutton', { name: 'Bounded quantity' });
  await expect(bounded).toHaveAttribute('aria-valuemin', '0');
  await expect(bounded).toHaveAttribute('aria-valuemax', '20');
  await expect(bounded).toHaveAttribute('aria-valuenow', '5');

  const formatted = page.getByRole('spinbutton', { name: 'Formatted price' });
  await expect(formatted).toHaveAttribute('aria-valuetext', '$10.00');

  const fieldInput = page.getByRole('spinbutton', { name: 'Cases' });
  const field = fieldInput.locator('xpath=../..');
  const fieldLabel = field.locator('label');
  const fieldInputId = await fieldInput.getAttribute('id');
  expect(fieldInputId).not.toBeNull();
  await expect(fieldLabel).toHaveAttribute('for', fieldInputId!);
  await expect(fieldInput).toHaveAttribute('required', '');
  await expect(fieldInput).toHaveAttribute('aria-describedby', /^fui-field-.+__hint$/);

  await expect(page.getByRole('spinbutton', { name: 'Disabled SpinButton' })).toBeDisabled();
  await expect(page.getByRole('spinbutton', { name: 'Read-only SpinButton' })).toHaveAttribute(
    'readonly',
    '',
  );
});

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

test('Card fixtures expose group names and native selectable checkbox semantics', async ({
  page,
}) => {
  await page.goto('/');

  const selectable = page.locator('#card .card-selectable');
  const checkbox = selectable.locator('input[type="checkbox"]');
  const header = selectable.locator('.fui-CardHeader__header');
  const headerId = await header.getAttribute('id');
  expect(headerId).not.toBeNull();
  await expect(selectable).toHaveAttribute('role', 'group');
  await expect(checkbox).toHaveAttribute('aria-labelledby', headerId!);
  await expect(checkbox).toHaveAttribute('name', 'selected-report');
  await expect(page.getByRole('group', { name: 'no-tab focus card' })).toHaveAttribute(
    'tabindex',
    '0',
  );
  await expect(page.locator('#card .card-disabled')).toHaveAttribute('aria-disabled', 'true');
});

test('Skeleton fixtures expose default and explicitly overridden loading semantics', async ({
  page,
}) => {
  await page.goto('/');

  const loading = page.getByRole('progressbar', { name: 'Loading wave card' });
  await expect(loading).toHaveAttribute('aria-busy', 'true');

  const status = page.getByRole('status', { name: 'Custom skeleton status' });
  await expect(status).toHaveAttribute('aria-busy', 'false');
  await expect(status).not.toHaveAttribute('tabindex');

  await expect(page.locator('#skeleton .fui-SkeletonItem[role]')).toHaveCount(0);
});

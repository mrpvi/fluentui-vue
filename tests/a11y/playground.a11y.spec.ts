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

test('SearchBox fixtures expose native search semantics, Field naming, and clear controls', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#search-box');
  await expect(section.getByRole('searchbox', { name: 'Search documentation' })).toBeVisible();
  await expect(section.getByRole('searchbox', { name: 'Product search' })).toHaveAttribute(
    'aria-describedby',
    /^fui-field-.+__validation-message fui-field-.+__hint$/,
  );

  const controlled = section.getByRole('searchbox', { name: 'Search documentation' });
  await controlled.focus();
  const dismiss = controlled.locator('xpath=..').getByRole('button', { name: 'clear' });
  await expect(dismiss).toHaveAttribute('tabindex', '-1');
  await expect(dismiss).not.toHaveAttribute('aria-hidden', 'true');

  await expect(section.getByRole('searchbox', { name: 'Disabled search' })).toBeDisabled();
  await expect(section.getByRole('searchbox', { name: 'Read-only search' })).toHaveAttribute(
    'readonly',
    '',
  );
});

test('ToggleButton fixtures expose native pressed, named, and disabled states', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#toggle-button');
  await expect(section.getByRole('button', { name: 'primary pinned' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(section.getByRole('button', { name: 'Small toggle' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(section.getByRole('button', { name: 'Toggle favorite' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(
    section.getByRole('button', { name: 'Disabled toggle', exact: true }),
  ).toBeDisabled();
  await expect(section.getByRole('button', { name: 'Focusable disabled toggle' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(section.getByRole('button', { name: 'Both disabled toggle' })).toBeDisabled();
  await expect(section.getByRole('button', { name: 'Both disabled toggle' })).not.toHaveAttribute(
    'aria-disabled',
  );
});

test('CompoundButton fixtures expose names and native disabled precedence', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#compound-button');
  await expect(
    section.getByRole('button', { name: 'primary action primary details' }),
  ).toBeVisible();
  await expect(section.getByRole('button', { name: 'Open calendar' })).toBeVisible();
  await expect(
    section.getByRole('link', {
      name: 'Go to Textarea examples Uses native anchor navigation',
    }),
  ).toHaveAttribute('href', '#textarea');
  await expect(
    section.getByRole('button', {
      name: 'Focusable disabled action Focus reveals why this is unavailable',
    }),
  ).toHaveAttribute('aria-disabled', 'true');
  const bothDisabled = section.getByRole('button', {
    name: 'Both disabled action Native disabled takes precedence',
  });
  await expect(bothDisabled).toBeDisabled();
  await expect(bothDisabled).not.toHaveAttribute('aria-disabled');
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

test('Rating fixtures expose accessible radio, Field, disabled, read-only, and display semantics', async ({
  page,
}) => {
  await page.goto('/');

  const rating = page.getByRole('radiogroup', { name: 'Product rating' });
  await expect(rating.getByRole('radio')).toHaveCount(5);
  await expect(rating.getByRole('radio').nth(2)).toBeChecked();

  const half = page.getByRole('radiogroup', { name: 'Half-star rating' });
  await expect(half.getByRole('radio')).toHaveCount(10);
  await expect(half.getByRole('radio', { name: '2.5 stars' })).toBeChecked();

  await expect(page.getByRole('radiogroup', { name: 'Disabled rating' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await expect(page.getByRole('radiogroup', { name: 'Read-only rating' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );

  const field = page.locator('.rating-field');
  const fieldRating = field.getByRole('radiogroup', { name: 'Required service rating' });
  await expect(fieldRating).toHaveAttribute('aria-required', 'true');
  await expect(fieldRating).toHaveAttribute('aria-describedby', /^fui-field-.+__hint$/);
  await expect(fieldRating.getByRole('radio').first()).toHaveAttribute('required', '');

  await expect(page.getByRole('img', { name: '4.2 out of 5 from 1,160 ratings' })).toBeVisible();
  await expect(page.getByRole('img', { name: '3.8 out of 5 from 86 ratings' })).toBeVisible();
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

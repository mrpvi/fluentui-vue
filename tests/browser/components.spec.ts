import { expect, test } from '@playwright/test';

test('playground loads without console errors or page failures', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Native Fluent components for Vue 3' }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test('Text renders semantic, truncated, and direction-aware output', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Semantic Fluent heading', level: 2 }),
  ).toBeVisible();

  const truncated = page.locator('.text-truncate-sample');
  await expect(truncated).toHaveCSS('display', 'block');
  await expect(truncated).toHaveCSS('white-space', 'nowrap');
  await expect(truncated).toHaveCSS('overflow', 'hidden');
  await expect(truncated).toHaveCSS('text-overflow', 'ellipsis');

  const aligned = page.locator('.text-align-sample');
  await expect(aligned).toHaveCSS('text-align', 'end');
  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  await expect(aligned).toHaveCSS('text-align', 'end');
});

test('Label focuses its associated required control', async ({ page }) => {
  await page.goto('/');

  const label = page.locator('label[for="label-email"]');
  const input = page.locator('#label-email');

  await label.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('required', '');
  await expect(label.locator('.fui-Label__required')).toHaveAttribute('aria-hidden', 'true');
});

test('Field wires native label, validity, validation, and hint semantics', async ({ page }) => {
  await page.goto('/');

  const field = page.locator('.field-required-email');
  const input = field.getByPlaceholder('team@example.com');
  const label = field.locator('label');

  await label.click();
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('required', '');
  expect(
    await input.evaluate((element) => (element as HTMLInputElement).validity.valueMissing),
  ).toBe(true);
  const hintId = await field.locator('.fui-Field__hint').getAttribute('id');
  expect(hintId).not.toBeNull();
  await expect(input).toHaveAttribute('aria-describedby', hintId!);

  const errorField = page.getByText('This username is already taken.').locator('xpath=..');
  const errorInput = errorField.locator('input');
  const errorMessage = errorField.locator('.fui-Field__validationMessage');

  await expect(errorMessage).toHaveAttribute('role', 'alert');
  await expect(errorInput).toHaveAttribute('aria-invalid', 'true');
  const errorMessageId = await errorMessage.getAttribute('id');
  expect(errorMessageId).not.toBeNull();
  await expect(errorInput).toHaveAttribute('aria-describedby', errorMessageId!);

  const nativeField = page.locator('.field-native-demo');
  const nativeInput = nativeField.getByPlaceholder('Native input');
  const nativeInputId = await nativeInput.getAttribute('id');
  const nativeHintId = await nativeField.locator('.fui-Field__hint').getAttribute('id');
  expect(nativeInputId).not.toBeNull();
  expect(nativeHintId).not.toBeNull();
  await expect(nativeField.locator('label')).toHaveAttribute('for', nativeInputId!);
  await expect(nativeInput).toHaveAttribute('aria-describedby', nativeHintId!);
});

test('Field horizontal layout uses logical spacing in RTL', async ({ page }) => {
  await page.goto('/');

  const field = page.locator('.field-horizontal-demo');
  const label = field.locator('.fui-Field__label');
  const fieldBox = await field.boundingBox();
  const labelBox = await label.boundingBox();
  expect(fieldBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(labelBox!.width).toBeLessThan(fieldBox!.width / 2);
  await expect(label).toHaveCSS('margin-right', '12px');
  await expect(label).toHaveCSS('margin-left', '0px');

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  await expect(label).toHaveCSS('margin-left', '12px');
  await expect(label).toHaveCSS('margin-right', '0px');
});

test('Textarea preserves native Field, resize, and reset behavior', async ({ page }) => {
  await page.goto('/');

  const field = page.locator('.textarea-field-demo');
  const textarea = field.getByPlaceholder('Tell us about yourself');
  const label = field.locator('label');

  await label.click();
  await expect(textarea).toBeFocused();
  await expect(textarea).toHaveAttribute('required', '');
  expect(
    await textarea.evaluate((element) => (element as HTMLTextAreaElement).validity.valueMissing),
  ).toBe(false);
  await textarea.fill('');
  expect(
    await textarea.evaluate((element) => (element as HTMLTextAreaElement).validity.valueMissing),
  ).toBe(true);

  const hintId = await field.locator('.fui-Field__hint').getAttribute('id');
  expect(hintId).not.toBeNull();
  await expect(textarea).toHaveAttribute('aria-describedby', hintId!);
  await expect(textarea).toHaveCSS('resize', 'vertical');

  await expect(page.getByPlaceholder('Medium textarea')).toHaveCSS('resize', 'horizontal');
  await expect(page.getByPlaceholder('Large textarea')).toHaveCSS('resize', 'both');

  const errorField = page.locator('.textarea-error-demo');
  const errorTextarea = errorField.getByPlaceholder('Write a review');
  const errorMessage = errorField.locator('.fui-Field__validationMessage');
  const errorMessageId = await errorMessage.getAttribute('id');
  const errorHintId = await errorField.locator('.fui-Field__hint').getAttribute('id');
  expect(errorMessageId).not.toBeNull();
  expect(errorHintId).not.toBeNull();
  await expect(errorTextarea).toHaveAttribute('aria-invalid', 'true');
  await expect(errorTextarea).toHaveAttribute(
    'aria-describedby',
    `${errorMessageId} ${errorHintId}`,
  );

  const resetForm = page.locator('.textarea-reset-demo');
  const resetTextarea = resetForm.getByLabel('Resettable notes');
  await resetTextarea.fill('Changed textarea value');
  await resetForm.getByRole('button', { name: 'Reset textarea form' }).click();
  await expect(resetTextarea).toHaveValue('Resettable textarea value');
});

test('Link preserves disabled focus, keyboard, and visual behavior', async ({ page }) => {
  await page.goto('/');

  const navigation = page.getByRole('link', { name: 'Go to Textarea examples' });
  const inline = page.getByRole('link', { name: 'an inline underline' });
  const action = page.getByRole('button', { name: 'Toggle theme action' });
  const spanAction = page.getByRole('button', { name: 'Span theme action' });
  const disabledLink = page.getByRole('link', { name: 'Disabled link', exact: true });
  const focusableDisabledLink = page.getByRole('link', {
    name: 'Focusable disabled link',
  });
  const disabledAction = page.getByRole('button', { name: 'Disabled action', exact: true });
  const focusableDisabledAction = page.getByRole('button', {
    name: 'Focusable disabled action',
  });

  await expect(inline).toHaveCSS('text-decoration-line', 'underline');
  await expect(navigation).toHaveCSS('text-decoration-line', 'none');
  await navigation.hover();
  await expect(navigation).toHaveCSS('text-decoration-line', 'underline');

  await navigation.focus();
  await expect(navigation).toBeFocused();
  await expect(navigation).toHaveCSS('text-decoration-style', 'double');

  const focusColor = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = getComputedStyle(document.documentElement)
      .getPropertyValue('--fui-color-stroke-focus-2')
      .trim();
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  await expect(navigation).toHaveCSS('text-decoration-color', focusColor);

  await inline.focus();
  await page.keyboard.press('Tab');
  await expect(focusableDisabledLink).toBeFocused();
  const beforeFocusableLink = await page.evaluate(() => location.hash);
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => location.hash)).toBe(beforeFocusableLink);

  await focusableDisabledAction.focus();
  await expect(focusableDisabledAction).toBeFocused();
  const themeBeforeDisabledAction = await page.locator('main').getAttribute('class');
  await page.keyboard.press('Enter');
  expect(await page.locator('main').getAttribute('class')).toBe(themeBeforeDisabledAction);

  await expect(disabledLink).toHaveAttribute('aria-disabled', 'true');
  await expect(disabledLink).not.toHaveAttribute('href');
  expect(await disabledAction.evaluate((element) => (element as HTMLButtonElement).disabled)).toBe(
    true,
  );

  const actionTheme = await page.locator('main').getAttribute('class');
  await action.focus();
  await page.keyboard.press('Enter');
  expect(await page.locator('main').getAttribute('class')).not.toBe(actionTheme);

  const spanTheme = await page.locator('main').getAttribute('class');
  await spanAction.focus();
  await page.keyboard.press('Enter');
  expect(await page.locator('main').getAttribute('class')).not.toBe(spanTheme);

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  await expect(spanAction).toHaveCSS('text-align', 'start');
});

test('native form reset restores uncontrolled Input and Checkbox defaults', async ({ page }) => {
  await page.goto('/');

  const form = page.locator('.reset-demo');
  const input = form.getByLabel('Resettable input');
  const checkbox = form.getByLabel('Resettable checkbox');

  await input.fill('Changed');
  await checkbox.uncheck();
  await form.getByRole('button', { name: 'Reset native form' }).click();

  await expect(input).toHaveValue('Reset me');
  await expect(checkbox).toBeChecked();
  await expect(form.locator('.fui-Checkbox')).toHaveClass(/fui-Checkbox--checked/);
});

test('RTL uses logical spacing and positioning', async ({ page }) => {
  await page.goto('/');
  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));

  const createButton = page.getByRole('button', { name: 'Create' });
  const buttonIcon = createButton.locator('.fui-Button__icon');
  const checkbox = page.getByLabel('Accept terms');
  const checkboxInput = checkbox;

  await expect(buttonIcon).toHaveCSS('margin-left', '6px');
  await expect(buttonIcon).toHaveCSS('margin-right', '0px');

  const checkboxBox = await checkboxInput.boundingBox();
  const rootBox = await checkboxInput.locator('xpath=..').boundingBox();
  expect(checkboxBox).not.toBeNull();
  expect(rootBox).not.toBeNull();
  expect(checkboxBox!.x + checkboxBox!.width).toBeGreaterThan(rootBox!.x + rootBox!.width / 2);
});

test('custom Input adornments remain interactive and exposed', async ({ page }) => {
  await page.goto('/');

  const amount = page.getByPlaceholder('Amount');
  await amount.fill('125');
  await page.getByRole('button', { name: 'Clear' }).click();

  await expect(amount).toHaveValue('');
  await expect(amount).toBeFocused();
  await expect(page.getByRole('button', { name: 'Clear' })).not.toHaveAttribute(
    'aria-hidden',
    'true',
  );
});

test('forced-color styles retain system-color state rules', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Forced-colors emulation is Chromium-only.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');

  const checked = page.getByLabel('Accept terms').locator('xpath=..');
  const indicator = checked.locator('.fui-Checkbox__indicator');
  const invalidInput = page.locator('.fui-Input--invalid').first();
  const primary = page.getByRole('button', { name: 'Primary' });
  const invalidTextarea = page.locator('.fui-Textarea--invalid').first();
  const disabledTextarea = page.getByPlaceholder('Disabled textarea');
  const disabledLink = page.getByRole('link', { name: 'Disabled link', exact: true });
  const disabledLabel = page.locator('label[for="label-disabled"]');
  const errorMessage = page.getByText('This username is already taken.');
  const warningIcon = page
    .getByText('Your storage is almost full.')
    .locator('.fui-Field__validationMessageIcon');

  await expect(indicator).toHaveCSS('border-color', 'rgb(0, 0, 0)');
  await expect(invalidInput).toHaveCSS('forced-color-adjust', 'none');
  await expect(invalidTextarea).toHaveCSS('forced-color-adjust', 'none');
  await expect(primary).toHaveCSS('forced-color-adjust', 'none');

  const grayText = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'GrayText';
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });

  await expect(disabledLabel).toHaveCSS('color', grayText);
  await expect(disabledTextarea).toHaveCSS('-webkit-text-fill-color', grayText);
  await expect(disabledLink).toHaveCSS('color', grayText);

  const linkText = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'LinkText';
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });

  await expect(errorMessage).toHaveCSS('color', linkText);
  await expect(warningIcon).toHaveCSS('color', linkText);
});

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

test('Divider exposes real-browser semantics and representative layout', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#divider');
  const unnamed = section.getByRole('separator', { name: 'Unlabeled section boundary' });
  const planning = section.getByRole('separator', { name: 'Planning' });
  const complete = section.getByRole('separator', { name: 'Complete' });
  const pageBoundary = section.getByRole('separator', { name: 'Page boundary' });
  const verticalContent = section.getByRole('separator', { name: 'OR' });

  await expect(unnamed).toHaveAttribute('aria-orientation', 'horizontal');
  const planningContentId = await planning.locator('.fui-Divider__wrapper').getAttribute('id');
  expect(planningContentId).not.toBeNull();
  await expect(planning).toHaveAttribute('aria-labelledby', planningContentId!);
  await expect(planning).toHaveCSS('text-align', 'start');
  await expect(complete).toHaveCSS('padding-left', '12px');
  await expect(complete).toHaveCSS('padding-right', '12px');

  const planningPseudo = await planning.evaluate((element) => {
    const before = getComputedStyle(element, '::before');
    const after = getComputedStyle(element, '::after');

    return {
      beforeContent: before.content,
      beforeMaxWidth: before.maxWidth,
      beforeMarginInlineEnd: before.marginInlineEnd,
      afterContent: after.content,
      afterMaxWidth: after.maxWidth,
      afterMarginInlineStart: after.marginInlineStart,
    };
  });
  expect(planningPseudo).toEqual({
    beforeContent: 'none',
    beforeMaxWidth: '8px',
    beforeMarginInlineEnd: '12px',
    afterContent: '""',
    afterMaxWidth: 'none',
    afterMarginInlineStart: '12px',
  });

  await expect(pageBoundary).toHaveAttribute('aria-orientation', 'vertical');
  await expect(verticalContent).toHaveAttribute('aria-orientation', 'vertical');
  await expect(pageBoundary).toHaveCSS('height', '48px');
  await expect(verticalContent).toHaveCSS('height', '112px');

  const verticalPseudo = await verticalContent.evaluate((element) => {
    const before = getComputedStyle(element, '::before');

    return {
      borderInlineEndStyle: before.borderInlineEndStyle,
      borderInlineEndWidth: before.borderInlineEndWidth,
      minHeight: before.minHeight,
    };
  });
  expect(verticalPseudo).toEqual({
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: '1px',
    minHeight: '8px',
  });
});

test('Divider start and end alignment follow RTL logical layout', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#divider');
  const planning = section.getByRole('separator', { name: 'Planning' });
  const complete = section.getByRole('separator', { name: 'Complete' });

  const ltrPlanningContent = await planning.locator('.fui-Divider__wrapper').boundingBox();
  const ltrCompleteContent = await complete.locator('.fui-Divider__wrapper').boundingBox();
  const ltrPlanningRoot = await planning.boundingBox();
  const ltrCompleteRoot = await complete.boundingBox();
  expect(ltrPlanningContent).not.toBeNull();
  expect(ltrCompleteContent).not.toBeNull();
  expect(ltrPlanningRoot).not.toBeNull();
  expect(ltrCompleteRoot).not.toBeNull();
  expect(ltrPlanningContent!.x).toBeLessThan(ltrPlanningRoot!.x + ltrPlanningRoot!.width / 2);
  expect(ltrCompleteContent!.x).toBeGreaterThan(ltrCompleteRoot!.x + ltrCompleteRoot!.width / 2);

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));

  const rtlPlanningContent = await planning.locator('.fui-Divider__wrapper').boundingBox();
  const rtlCompleteContent = await complete.locator('.fui-Divider__wrapper').boundingBox();
  const rtlPlanningRoot = await planning.boundingBox();
  const rtlCompleteRoot = await complete.boundingBox();
  expect(rtlPlanningContent).not.toBeNull();
  expect(rtlCompleteContent).not.toBeNull();
  expect(rtlPlanningRoot).not.toBeNull();
  expect(rtlCompleteRoot).not.toBeNull();
  expect(rtlPlanningContent!.x).toBeGreaterThan(rtlPlanningRoot!.x + rtlPlanningRoot!.width / 2);
  expect(rtlCompleteContent!.x).toBeLessThan(rtlCompleteRoot!.x + rtlCompleteRoot!.width / 2);
  await expect(planning).toHaveCSS('text-align', 'start');
  await expect(complete).toHaveCSS('text-align', 'end');
});

test('Image applies native fit, dimension, shape, border, shadow, and block behavior', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#image');
  const none = section.getByRole('img', { name: 'Abstract landscape using none image fit' });
  const center = section.getByRole('img', {
    name: 'Abstract landscape using center image fit',
  });
  const contain = section.getByRole('img', {
    name: 'Abstract landscape using contain image fit',
  });
  const cover = section.getByRole('img', { name: 'Abstract landscape using cover image fit' });
  const fill = section.getByRole('img', {
    name: 'Abstract landscape filling inferred dimensions',
  });
  const square = section.locator('.image-square');
  const rounded = section.locator('.image-rounded');
  const circular = section.locator('.image-circular');
  const decorated = section.locator('.image-decorated');
  const block = section.getByRole('img', {
    name: 'Wide abstract landscape filling its container',
  });

  await expect(none).toHaveCSS('object-fit', 'none');
  await expect(none).toHaveCSS('object-position', '0% 0%');
  await expect(center).toHaveCSS('object-fit', 'none');
  await expect(center).toHaveCSS('object-position', '50% 50%');
  await expect(contain).toHaveCSS('object-fit', 'contain');
  await expect(contain).toHaveCSS('object-position', '50% 50%');
  await expect(cover).toHaveCSS('object-fit', 'cover');
  await expect(cover).toHaveCSS('object-position', '50% 50%');

  const fillFrame = section.locator('.image-fit-fill-frame');
  const fillBox = await fill.boundingBox();
  const fillFrameBox = await fillFrame.boundingBox();
  expect(fillBox).not.toBeNull();
  expect(fillFrameBox).not.toBeNull();
  expect(fillBox!.width).toBe(fillFrameBox!.width - 2);
  expect(fillBox!.height).toBe(fillFrameBox!.height - 2);

  await expect(square).toHaveCSS('border-radius', '0px');
  await expect(rounded).toHaveCSS('border-radius', '4px');
  await expect(circular).toHaveCSS('border-radius', '10000px');
  await expect(decorated).toHaveCSS('border-style', 'solid');
  await expect(decorated).toHaveCSS('border-width', '1px');
  expect(await decorated.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
    'none',
  );

  const blockFrame = section.locator('.image-block-frame');
  const blockBox = await block.boundingBox();
  const blockFrameBox = await blockFrame.boundingBox();
  expect(blockBox).not.toBeNull();
  expect(blockFrameBox).not.toBeNull();
  expect(blockBox!.width).toBe(blockFrameBox!.width - 26);

  await expect(section.locator('.image-decorated')).toHaveAttribute('alt', '');
});

test('Image preserves deterministic native failure behavior', async ({ page }) => {
  await page.goto('/');

  const failed = page.locator('#image .image-native-failure');
  await expect(failed).toHaveAttribute('alt', 'Unavailable image example');
  await expect
    .poll(() => failed.evaluate((element) => (element as HTMLImageElement).complete))
    .toBe(true);
  expect(
    await failed.evaluate((element) => ({
      naturalWidth: (element as HTMLImageElement).naturalWidth,
      childCount: element.childElementCount,
      className: element.className,
    })),
  ).toEqual({
    naturalWidth: 0,
    childCount: 0,
    className: expect.not.stringContaining('fui-Image--error'),
  });
});

test('Badge family preserves dimensions, icon order, tokens, and nonfocusability', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#badge');
  const expectedBadgeSizes = {
    tiny: 6,
    'extra-small': 10,
    small: 16,
    medium: 20,
    large: 24,
    'extra-large': 32,
  } as const;

  for (const [size, dimension] of Object.entries(expectedBadgeSizes)) {
    const badge = section.locator(`.badge-size-${size}`);
    const box = await badge.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBe(dimension);
    expect(box!.width).toBeGreaterThanOrEqual(dimension);
  }

  const before = section.locator('.badge-icon-before');
  const after = section.locator('.badge-icon-after');
  await expect(before.locator('.fui-Badge__icon')).toHaveCSS('font-size', '12px');
  await expect(section.locator('.badge-icon-only .fui-Badge__icon')).toHaveCSS('font-size', '16px');
  expect(
    await before.evaluate((element) =>
      element.firstElementChild?.classList.contains('fui-Badge__icon'),
    ),
  ).toBe(true);
  expect(
    await after.evaluate((element) =>
      element.lastElementChild?.classList.contains('fui-Badge__icon'),
    ),
  ).toBe(true);

  const focusableRoots = await section
    .locator('.fui-Badge, .fui-PresenceBadge')
    .evaluateAll(
      (roots) =>
        roots.filter((root) => root.matches('a, button, input, select, textarea, [tabindex]'))
          .length,
    );
  expect(focusableRoots).toBe(0);

  const tokenOverride = section.locator('.badge-token-override');
  await expect(tokenOverride).toHaveCSS('background-color', 'rgb(92, 45, 145)');
  await expect(section.locator('.counter-token-override')).toHaveCSS(
    'background-color',
    'rgb(92, 45, 145)',
  );

  const brandBeforeDark = await section
    .getByText('Filled', { exact: true })
    .evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      color: getComputedStyle(element).color,
    }));
  await page.getByRole('button', { name: 'Use dark theme' }).click();
  const brandAfterDark = await section.getByText('Filled', { exact: true }).evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }));
  expect(brandAfterDark.background).not.toBe(brandBeforeDark.background);
  expect(brandAfterDark.color).not.toBe('rgba(0, 0, 0, 0)');
});

test('CounterBadge preserves zero, overflow, dot, and custom-content behavior', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#badge');
  const hiddenZero = section.locator('.counter-hidden-zero');
  const showZero = section.locator('.counter-show-zero');
  const dot = section.locator('.counter-dot');

  await expect(hiddenZero).toBeHidden();
  await expect(hiddenZero).toHaveCSS('display', 'none');
  await expect(showZero).toHaveText('0');
  await expect(showZero).toBeVisible();
  await expect(section.locator('.counter-overflow')).toHaveText('99+');
  await expect(section.locator('.counter-custom')).toHaveText('Custom');

  const dotBox = await dot.boundingBox();
  expect(dotBox).not.toBeNull();
  expect(dotBox!.width).toBe(6);
  expect(dotBox!.height).toBe(6);
  await expect(dot).toHaveText('');
});

test('PresenceBadge preserves status labels, OOO, sizes, and icon accessibility', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#badge');
  await expect(section.getByRole('img', { name: 'available', exact: true })).toBeVisible();
  await expect(section.getByRole('img', { name: 'away out of office' })).toBeVisible();
  await expect(section.getByRole('img', { name: 'do not disturb out of office' })).toBeVisible();
  await expect(section.getByRole('img', { name: 'Available for pair programming' })).toBeVisible();
  await expect(section.getByRole('img', { name: 'Custom online status' })).toBeVisible();

  const expectedPresenceSizes = {
    tiny: 6,
    'extra-small': 10,
    small: 12,
    medium: 16,
    large: 20,
    'extra-large': 28,
  } as const;

  for (const [size, dimension] of Object.entries(expectedPresenceSizes)) {
    const presence = section.locator(`.presence-size-${size}`);
    const svg = presence.locator('svg');
    const box = await svg.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBe(dimension);
    expect(box!.height).toBe(dimension);
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
    await expect(svg).toHaveAttribute('focusable', 'false');
  }

  const customIcon = section.locator('.presence-custom-icon svg');
  await expect(customIcon).toHaveAttribute('aria-hidden', 'true');
  await expect(customIcon).toHaveAttribute('focusable', 'false');
  await expect(section.locator('.presence-custom-label')).toHaveAttribute('role', 'img');
  await expect(section.locator('.presence-custom-label')).toHaveAttribute(
    'aria-label',
    'Available for pair programming',
  );
});

test('Spinner preserves dimensions, layout, labels, roots, delay, and nonfocusability', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#spinner');
  const expectedSizes = {
    'extra-tiny': 16,
    tiny: 20,
    'extra-small': 24,
    small: 28,
    medium: 32,
    large: 36,
    'extra-large': 40,
    huge: 44,
  } as const;

  for (const [size, dimension] of Object.entries(expectedSizes)) {
    const root = section.locator(`.spinner-size-${size}`);
    const indicator = root.locator('.fui-Spinner__spinner');
    await expect(indicator).toHaveCSS('width', `${dimension}px`);
    await expect(indicator).toHaveCSS('height', `${dimension}px`);
    expect(
      await indicator.evaluate((element) => ({
        width: (element as HTMLElement).offsetWidth,
        height: (element as HTMLElement).offsetHeight,
      })),
    ).toEqual({ width: dimension, height: dimension });
    const sizeLabelId = await root.locator('.fui-Spinner__label').getAttribute('id');
    expect(sizeLabelId).not.toBeNull();
    await expect(root).toHaveAttribute('aria-labelledby', sizeLabelId!);
  }

  for (const position of ['above', 'below', 'before', 'after'] as const) {
    const root = section.locator(`.spinner-position-${position}`);
    const rootBox = await root.boundingBox();
    const indicatorBox = await root.locator('.fui-Spinner__spinner').boundingBox();
    const label = root.locator('.fui-Spinner__label');
    const labelBox = await label.boundingBox();
    const labelId = await label.getAttribute('id');
    expect(rootBox).not.toBeNull();
    expect(indicatorBox).not.toBeNull();
    expect(labelBox).not.toBeNull();
    expect(labelId).not.toBeNull();
    await expect(root).toHaveAttribute('aria-labelledby', labelId!);
    await expect(root).toHaveCSS(
      'flex-direction',
      position === 'above' || position === 'below' ? 'column' : 'row',
    );

    if (position === 'above') {
      expect(labelBox!.y).toBeLessThan(indicatorBox!.y);
    } else if (position === 'below') {
      expect(labelBox!.y).toBeGreaterThan(indicatorBox!.y);
    } else if (position === 'before') {
      expect(labelBox!.x).toBeLessThan(indicatorBox!.x);
    } else {
      expect(labelBox!.x).toBeGreaterThan(indicatorBox!.x);
    }
  }

  await expect(section.locator('.spinner-primary .fui-Spinner__spinner')).toHaveCSS(
    'animation-duration',
    '1.5s',
  );
  expect(await section.locator('.spinner-span-root').evaluate((element) => element.tagName)).toBe(
    'SPAN',
  );
  await expect(section.locator('.spinner-custom-indicator .fui-Spinner__spinnerTail')).toHaveCount(
    0,
  );
  await expect(
    section.locator('.spinner-custom-indicator .spinner-custom-indicator-shape'),
  ).toBeVisible();

  const delayed = section.locator('.spinner-delayed');
  await expect(delayed).toHaveAttribute('role', 'progressbar');
  await expect(delayed).toHaveAttribute('aria-label', 'Delayed spinner');
  await expect(delayed.locator('.fui-Spinner__spinner')).toHaveCount(0);
  await expect(delayed.locator('.fui-Spinner__label')).toHaveCount(0);
  await expect(delayed).toHaveAttribute('aria-labelledby', /^fui-spinner-.+__label$/);
  await expect(delayed.locator('.fui-Spinner__spinner')).toBeVisible({ timeout: 2_000 });
  const delayedLabel = delayed.locator('.fui-Spinner__label');
  await expect(delayedLabel).toHaveText('Delayed spinner');
  const delayedLabelId = await delayedLabel.getAttribute('id');
  expect(delayedLabelId).not.toBeNull();
  await expect(delayed).toHaveAttribute('aria-labelledby', delayedLabelId!);

  const focusableRoots = await section
    .locator('.fui-Spinner')
    .evaluateAll(
      (roots) =>
        roots.filter((root) => root.matches('a, button, input, select, textarea, [tabindex]'))
          .length,
    );
  expect(focusableRoots).toBe(0);
});

test('Spinner RTL reverses horizontal label placement and tail styles where exposed', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('#spinner');
  const before = section.locator('.spinner-position-before');
  const label = before.locator('.fui-Spinner__label');
  const indicator = before.locator('.fui-Spinner__spinner');
  const ltrLabel = await label.boundingBox();
  const ltrIndicator = await indicator.boundingBox();
  expect(ltrLabel).not.toBeNull();
  expect(ltrIndicator).not.toBeNull();
  expect(ltrLabel!.x).toBeLessThan(ltrIndicator!.x);

  const ltrTail = await before.locator('.fui-Spinner__spinnerTail').evaluate((element) => ({
    maskImage: getComputedStyle(element).maskImage,
    animationName: getComputedStyle(element).animationName,
  }));

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  const rtlLabel = await label.boundingBox();
  const rtlIndicator = await indicator.boundingBox();
  expect(rtlLabel).not.toBeNull();
  expect(rtlIndicator).not.toBeNull();
  expect(rtlLabel!.x).toBeGreaterThan(rtlIndicator!.x);

  const rtlTail = await before.locator('.fui-Spinner__spinnerTail').evaluate((element) => ({
    maskImage: getComputedStyle(element).maskImage,
    animationName: getComputedStyle(element).animationName,
  }));
  if (ltrTail.maskImage !== 'none' && rtlTail.maskImage !== 'none') {
    expect(rtlTail.maskImage).not.toBe(ltrTail.maskImage);
  }
  if (ltrTail.animationName !== 'none' && rtlTail.animationName !== 'none') {
    expect(rtlTail.animationName).not.toBe(ltrTail.animationName);
  }
});

test('Spinner reduced motion simplifies the animated tail', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const spinner = page.locator('#spinner .spinner-primary .fui-Spinner__spinner');
  const tail = page.locator('#spinner .spinner-primary .fui-Spinner__spinnerTail');
  await expect(spinner).toHaveCSS('animation-duration', '1.8s');
  await expect(tail).toHaveCSS('animation-name', 'none');
  await expect(tail).toHaveCSS(
    'background-image',
    'conic-gradient(rgba(0, 0, 0, 0) 120deg, rgb(15, 108, 189) 360deg)',
  );
  expect(await tail.evaluate((element) => getComputedStyle(element, '::before').content)).toBe(
    'none',
  );
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
  const outlinedBadge = page.locator('#badge').getByText('Outline', { exact: true });
  const filledBadge = page.locator('#badge').getByText('Filled', { exact: true });
  const spinnerIndicator = page.locator('#spinner .spinner-primary .fui-Spinner__spinner');

  await expect(indicator).toHaveCSS('border-color', 'rgb(0, 0, 0)');
  await expect(invalidInput).toHaveCSS('forced-color-adjust', 'none');
  await expect(invalidTextarea).toHaveCSS('forced-color-adjust', 'none');
  await expect(primary).toHaveCSS('forced-color-adjust', 'none');
  await expect(outlinedBadge).toHaveCSS('border-color', 'rgb(0, 0, 0)');
  await expect(filledBadge).toHaveCSS('border-color', 'rgb(0, 0, 0)');
  await expect(spinnerIndicator).toHaveCSS('forced-color-adjust', 'none');
  const spinnerSystemColors = await spinnerIndicator.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }));
  expect(spinnerSystemColors.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(spinnerSystemColors.color).not.toBe('rgba(0, 0, 0, 0)');
  expect(spinnerSystemColors.background).not.toBe(spinnerSystemColors.color);

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

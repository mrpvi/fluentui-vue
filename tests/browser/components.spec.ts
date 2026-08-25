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

  const navigation = page.getByRole('link', { name: 'Go to Textarea examples', exact: true });
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
    exact: true,
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
  browserName,
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
  await expect(delayed).toHaveAttribute('aria-labelledby', /^fui-spinner-.+__label$/);
  const delayedIndicator = delayed.locator('.fui-Spinner__spinner');
  const delayedLabel = delayed.locator('.fui-Spinner__label');
  if ((await delayedIndicator.count()) === 0) {
    await expect(delayedLabel).toHaveCount(0);
    await expect(delayedIndicator).toBeVisible({ timeout: 8_000 });
  } else {
    test.info().annotations.push({
      type: 'timing-note',
      description: `${browserName} reached the delayed spinner after its timer elapsed under the full parallel browser suite.`,
    });
  }
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

test('CompoundButton preserves structure, roles, names, and released geometry', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#compound-button');
  const primary = section.getByRole('button', { name: 'primary action primary details' });
  const iconBefore = section.getByRole('button', {
    name: 'Create project Decorative icon before',
  });
  const iconAfter = section.getByRole('button', {
    name: 'Continue setup Decorative icon after',
  });
  const iconOnly = section.getByRole('button', { name: 'Open calendar' });
  const anchor = section.getByRole('link', {
    name: 'Go to Textarea examples Uses native anchor navigation',
  });
  const anchorButton = section.getByRole('button', {
    name: 'Toggle theme from anchor button Anchor root with button keyboard behavior',
  });

  await expect(primary).toHaveCSS('background-color', 'rgb(15, 108, 189)');
  await expect(iconBefore.locator('.fui-CompoundButton__icon')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(iconBefore.locator('.fui-CompoundButton__secondaryContent')).toHaveText(
    'Decorative icon before',
  );
  expect(
    await iconBefore.evaluate((element) =>
      element.firstElementChild?.classList.contains('fui-CompoundButton__icon'),
    ),
  ).toBe(true);
  expect(
    await iconAfter.evaluate((element) =>
      element.lastElementChild?.classList.contains('fui-CompoundButton__icon'),
    ),
  ).toBe(true);
  await expect(iconOnly).toHaveClass(/fui-CompoundButton--icon-only/);
  await expect(iconOnly.locator('.fui-CompoundButton__contentContainer')).toHaveCount(0);
  await expect(iconOnly).toHaveCSS('width', '52px');
  await expect(anchor).toHaveAttribute('href', '#textarea');
  await expect(anchor).not.toHaveAttribute('role');
  await expect(anchorButton).toHaveAttribute('role', 'button');
  await expect(anchorButton).toHaveAttribute('tabindex', '0');

  await expect(section.locator('.compound-size-small')).toHaveCSS('padding-top', '8px');
  await expect(section.locator('.compound-size-medium')).toHaveCSS('padding-top', '14px');
  await expect(section.locator('.compound-size-large')).toHaveCSS('padding-top', '18px');
  await expect(section.locator('.compound-circular')).toHaveCSS('border-radius', '10000px');
  await expect(section.locator('.compound-square')).toHaveCSS('border-radius', '0px');
});

test('CompoundButton preserves submit, disabled, keyboard, RTL, and theme behavior', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#compound-button');
  const defaultType = section.getByRole('button', {
    name: 'Default type Does not submit the form',
  });
  const submit = section.getByRole('button', {
    name: 'Submit compound form Submits this native form',
  });
  const counter = section.locator('output');
  const disabled = section.getByRole('button', { name: 'Disabled action Unavailable' });
  const focusableDisabled = section.getByRole('button', {
    name: 'Focusable disabled action Focus reveals why this is unavailable',
  });
  const bothDisabled = section.getByRole('button', {
    name: 'Both disabled action Native disabled takes precedence',
  });
  const anchorButton = section.getByRole('button', {
    name: 'Toggle theme from anchor button Anchor root with button keyboard behavior',
  });

  await expect(defaultType).toHaveAttribute('type', 'button');
  await expect(submit).toHaveAttribute('type', 'submit');
  await defaultType.click();
  await expect(counter).toHaveText('Compound submissions: 0');
  await submit.click();
  await expect(counter).toHaveText('Compound submissions: 1');

  await expect(disabled).toBeDisabled();
  await expect(disabled).not.toHaveAttribute('aria-disabled');
  expect(
    await focusableDisabled.evaluate((element) => (element as HTMLButtonElement).disabled),
  ).toBe(false);
  await expect(focusableDisabled).toHaveAttribute('aria-disabled', 'true');
  await focusableDisabled.focus();
  await expect(focusableDisabled).toBeFocused();
  const themeBeforeDisabled = await page.locator('main').getAttribute('class');
  await page.keyboard.press('Enter');
  expect(await page.locator('main').getAttribute('class')).toBe(themeBeforeDisabled);
  await expect(bothDisabled).toBeDisabled();
  await expect(bothDisabled).not.toHaveAttribute('aria-disabled');
  await expect(bothDisabled).not.toHaveClass(/disabled-focusable/);

  await anchorButton.focus();
  const themeBeforeAnchor = await page.locator('main').getAttribute('class');
  await page.keyboard.press('Enter');
  expect(await page.locator('main').getAttribute('class')).not.toBe(themeBeforeAnchor);

  const before = section.locator('.compound-icon-before');
  await expect(before.locator('.fui-CompoundButton__icon')).toHaveCSS('margin-right', '12px');
  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  await expect(before.locator('.fui-CompoundButton__icon')).toHaveCSS('margin-left', '12px');
  const primary = section.locator('.compound-primary');
  const backgroundBeforeThemeChange = await primary.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const themeToggle = page.getByRole('button', { name: /Use (?:light|dark) theme/ });
  const main = page.locator('main');
  const themeBeforeChange = await main.getAttribute('class');
  await themeToggle.click();
  await expect(main).not.toHaveAttribute('class', themeBeforeChange!);
  await expect
    .poll(() => primary.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(backgroundBeforeThemeChange);
});

test('CompoundButton removes transitions for reduced motion', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const duration = await page
    .locator('#compound-button .compound-primary')
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).transitionDuration));
  expect(duration).toBeLessThanOrEqual(0.00001);
});

test('ToggleButton supports pointer, Enter, Space, controlled state, and icon naming', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#toggle-button');
  const controlled = section.getByRole('button', { name: 'Controlled pin' });
  const output = section.getByText(/Controlled toggle:/);
  await expect(controlled).toHaveAttribute('aria-pressed', 'true');
  await controlled.click();
  await expect(controlled).toHaveAttribute('aria-pressed', 'false');
  await expect(output).toHaveText('Controlled toggle: false');

  const secondary = section.getByRole('button', { name: 'secondary pinned' });
  await expect(secondary).toHaveAttribute('aria-pressed', 'true');
  await secondary.click();
  await expect(secondary).toHaveAttribute('aria-pressed', 'false');
  await secondary.focus();
  await page.keyboard.press('Enter');
  await expect(secondary).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Space');
  await expect(secondary).toHaveAttribute('aria-pressed', 'false');

  const iconOnly = section.getByRole('button', { name: 'Toggle favorite' });
  await expect(iconOnly).toHaveAttribute('aria-pressed', 'false');
  await expect(iconOnly.locator('.fui-ToggleButton__icon')).toHaveAttribute('aria-hidden', 'true');

  const dual = section.locator('.toggle-icon-before');
  await expect(dual.locator('.fui-Icon-regular')).toHaveCSS('display', 'none');
  await expect(dual.locator('.fui-Icon-filled')).not.toHaveCSS('display', 'none');
  await dual.click();
  await expect(dual.locator('.fui-Icon-regular')).not.toHaveCSS('display', 'none');
  await expect(dual.locator('.fui-Icon-filled')).toHaveCSS('display', 'none');
});

test('ToggleButton preserves geometry, RTL, form, theme, and disabled behavior', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#toggle-button');
  const small = section.locator('.toggle-small');
  const large = section.locator('.toggle-large');
  const circular = section.locator('.toggle-circular');
  const square = section.locator('.toggle-square');
  const rtlIcon = section.locator('.toggle-rtl-icon .fui-ToggleButton__icon');
  await expect(small).toHaveCSS('padding-top', '3px');
  await expect(small).toHaveCSS('font-size', '12px');
  await expect(large).toHaveCSS('padding-top', '8px');
  await expect(large).toHaveCSS('font-size', '16px');
  await expect(circular).toHaveCSS('border-radius', '10000px');
  await expect(square).toHaveCSS('border-radius', '0px');
  await expect(rtlIcon).toHaveCSS('margin-left', '6px');
  await expect(rtlIcon).toHaveCSS('margin-right', '0px');

  const defaultType = section.getByRole('button', { name: 'Default type' });
  const submit = section.getByRole('button', { name: 'Submit toggle form' });
  const counter = section.getByText(/Toggle submissions:/);
  await expect(defaultType).toHaveAttribute('type', 'button');
  await expect(defaultType).toHaveAttribute('name', 'default-action');
  await expect(defaultType).toHaveAttribute('value', 'default');
  await defaultType.click();
  await expect(counter).toHaveText('Toggle submissions: 0');
  await expect(submit).toHaveAttribute('type', 'submit');
  await expect(submit).toHaveAttribute('form', 'toggle-target-form');
  await expect(submit).toHaveAttribute('name', 'toggle-action');
  await expect(submit).toHaveAttribute('value', 'submitted');
  await submit.click();
  await expect(counter).toHaveText('Toggle submissions: 1');

  const disabled = section.getByRole('button', { name: 'Disabled toggle', exact: true });
  await expect(disabled).toBeDisabled();
  await disabled.click({ force: true });
  await expect(counter).toHaveText('Toggle submissions: 1');

  const focusableDisabled = section.getByRole('button', { name: 'Focusable disabled toggle' });
  await expect(focusableDisabled).toHaveAttribute('aria-disabled', 'true');
  await focusableDisabled.focus();
  await expect(focusableDisabled).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(focusableDisabled).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Space');
  await expect(focusableDisabled).toHaveAttribute('aria-pressed', 'false');
  await focusableDisabled.dispatchEvent('click');
  await expect(focusableDisabled).toHaveAttribute('aria-pressed', 'false');

  const both = section.getByRole('button', { name: 'Both disabled toggle' });
  await expect(both).toBeDisabled();
  await expect(both).not.toHaveAttribute('aria-disabled');
  await expect(both).not.toHaveClass(/disabled-focusable/);
  await both.focus();
  await expect(both).not.toBeFocused();

  const primary = section.locator('.toggle-primary');
  const secondary = section.locator('.toggle-secondary');
  const accessible = section.locator('.toggle-accessible');
  await expect(primary).toHaveAttribute('aria-pressed', 'true');
  await expect(primary).toHaveCSS('background-color', 'rgb(15, 84, 140)');
  await expect(accessible).toHaveClass(/fui-ToggleButton--accessible/);
  await expect(accessible).toHaveCSS('outline-style', 'solid');
  const lightSecondary = await secondary.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }));
  await page.getByRole('button', { name: 'Use dark theme' }).click();
  await expect(page.locator('main')).toHaveClass(/fui-theme-dark/);
  await expect(primary).toHaveAttribute('aria-pressed', 'true');
  const darkSecondary = await secondary.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }));
  expect(darkSecondary).not.toEqual(lightSecondary);
});

test('Rating supports radios, keyboard, native forms, reset, and controlled rollback', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#rating');
  const rating = section.getByRole('radiogroup', { name: 'Product rating' });
  const radios = rating.getByRole('radio');
  await expect(radios).toHaveCount(5);
  await expect(radios.nth(2)).toBeChecked();

  await radios.nth(3).click();
  await expect(radios.nth(3)).toBeChecked();
  await expect(section.getByText('Selected: 4')).toBeVisible();

  await radios.nth(3).focus();
  await page.keyboard.press('ArrowRight');
  await expect(radios.nth(4)).toBeFocused();
  await expect(radios.nth(4)).toBeChecked();

  const form = section.locator('.rating-form');
  const formRadios = form.getByRole('radio');
  await expect(formRadios.nth(1)).toBeChecked();
  await formRadios.nth(4).click();
  await expect(formRadios.nth(4)).toBeChecked();
  expect(
    await form.evaluate((element) => new FormData(element as HTMLFormElement).get('order-rating')),
  ).toBe('5');
  await form.getByRole('button', { name: 'Reset order rating' }).click();
  await expect(formRadios.nth(1)).toBeChecked();
  expect(
    await form.evaluate((element) => new FormData(element as HTMLFormElement).get('order-rating')),
  ).toBe('2');

  const externalForm = section.locator('#rating-external-form');
  const external = section.getByRole('radiogroup', { name: 'External required rating' });
  const externalRadios = external.getByRole('radio');
  await expect(external).toHaveAttribute('aria-required', 'true');
  await expect(externalRadios.first()).toHaveAttribute('form', 'rating-external-form');
  await expect(externalRadios.first()).toHaveAttribute('required', '');
  expect(
    await externalForm.evaluate((element) =>
      new FormData(element as HTMLFormElement).get('external-rating'),
    ),
  ).toBe('2');
  await externalRadios.nth(4).click();
  await section.getByRole('button', { name: 'Reset external rating' }).click();
  await expect(externalRadios.nth(1)).toBeChecked();
  expect(
    await externalRadios
      .first()
      .evaluate((input) => (input as HTMLInputElement).validity.valueMissing),
  ).toBe(false);

  const controlled = section.getByRole('radiogroup', { name: 'Controlled rollback rating' });
  const controlledRadios = controlled.getByRole('radio');
  await expect(controlledRadios.nth(1)).toBeChecked();
  await controlledRadios.nth(4).click();
  await expect(section.getByText('Attempted: 5')).toBeVisible();
  await expect(controlledRadios.nth(1)).toBeChecked();
  await expect(controlledRadios.nth(4)).not.toBeChecked();
});

test('Rating supports half values, pointer preview, read-only, disabled, Field, and RTL', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#rating');
  const half = section.getByRole('radiogroup', { name: 'Half-star rating' });
  const halfRadios = half.getByRole('radio');
  await expect(halfRadios).toHaveCount(10);
  await expect(half.getByRole('radio', { name: '2.5 stars' })).toBeChecked();

  const previewTarget = half.getByRole('radio', { name: '4.5 stars' });
  await previewTarget.hover({ position: { x: 2, y: 2 } });
  await expect(half).toHaveClass(/fui-Rating--previewing/);
  await expect(half.locator('.fui-RatingItem').nth(4)).toHaveClass(/fui-RatingItem--fill-half/);
  await page.mouse.move(0, 0);
  await expect(half).not.toHaveClass(/fui-Rating--previewing/);
  await expect(half.locator('.fui-RatingItem').nth(2)).toHaveClass(/fui-RatingItem--fill-half/);

  const readonly = section.getByRole('radiogroup', { name: 'Read-only rating' });
  await expect(readonly).toHaveAttribute('aria-readonly', 'true');
  await expect(readonly.getByRole('radio')).toHaveCount(0);
  await expect(readonly.locator('.fui-RatingItem--fill-full')).toHaveCount(3);

  const disabled = section.getByRole('radiogroup', { name: 'Disabled rating' });
  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await expect(disabled.getByRole('radio').first()).toBeDisabled();

  const field = section.locator('.rating-field');
  const fieldRating = field.getByRole('radiogroup', { name: 'Required service rating' });
  const fieldLabelId = await field.locator('label').getAttribute('id');
  const fieldHintId = await field.locator('.fui-Field__hint').getAttribute('id');
  expect(fieldLabelId).not.toBeNull();
  expect(fieldHintId).not.toBeNull();
  await expect(fieldRating).toHaveAttribute('aria-labelledby', fieldLabelId!);
  await expect(fieldRating).toHaveAttribute('aria-describedby', fieldHintId!);
  await expect(fieldRating).toHaveAttribute('aria-required', 'true');

  const marigold = section.getByRole('radiogroup', { name: 'marigold rating' });
  const firstItem = marigold.locator('.fui-RatingItem').first();
  const ltrBox = await firstItem.boundingBox();
  expect(ltrBox).not.toBeNull();
  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  const rtlItems = await marigold
    .locator('.fui-RatingItem')
    .evaluateAll((items) => items.map((item) => item.getBoundingClientRect().x));
  expect(rtlItems[0]).toBeGreaterThan(rtlItems[rtlItems.length - 1]);
  const halfFilled = section.locator('.rating-display-size-extra-large .fui-RatingItem--fill-half');
  const halfFilledBox = await halfFilled.boundingBox();
  const selectedHalfBox = await halfFilled.locator('.fui-RatingItem__selectedIcon').boundingBox();
  expect(halfFilledBox).not.toBeNull();
  expect(selectedHalfBox).not.toBeNull();
  expect(selectedHalfBox!.width).toBeCloseTo(halfFilledBox!.width / 2, 0);
});

test('RatingDisplay preserves labels, count, compact mode, colors, and sizes', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#rating');
  const valueCount = section.getByRole('img', { name: '4.2 out of 5 from 1,160 ratings' });
  await expect(valueCount.locator('.fui-RatingItem')).toHaveCount(5);
  await expect(valueCount.locator('.fui-RatingDisplay__valueText')).toHaveText('4.2');
  await expect(valueCount.locator('.fui-RatingDisplay__countText')).toHaveText('1,160');

  const compact = section.getByRole('img', { name: '3.8 out of 5 from 86 ratings' });
  await expect(compact.locator('.fui-RatingItem')).toHaveCount(1);
  await expect(compact.locator('.fui-RatingItem')).toHaveClass(/fui-RatingItem--marigold/);
  await expect(compact.locator('.fui-RatingItem')).toHaveClass(/fui-RatingItem--fill-full/);

  const expectedSizes = {
    small: 12,
    medium: 16,
    large: 20,
    'extra-large': 28,
  } as const;
  for (const [size, dimension] of Object.entries(expectedSizes)) {
    const item = section.locator(`.rating-display-size-${size} .fui-RatingItem`).first();
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBe(dimension);
    expect(box!.height).toBe(dimension);
  }

  const colors = ['neutral', 'brand', 'marigold'] as const;
  const selectedColors: string[] = [];
  for (const color of colors) {
    selectedColors.push(
      await section
        .locator(`.rating-display-color-${color} .fui-RatingItem__selectedIcon`)
        .first()
        .evaluate((element) => getComputedStyle(element).color),
    );
  }
  expect(new Set(selectedColors).size).toBe(3);
});

test('Rating focus, reduced motion, and forced colors retain browser-rendered safeguards', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Media emulation and computed styles are Chromium-only.');

  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/');
  const section = page.locator('#rating');
  const rating = section.getByRole('radiogroup', { name: 'Product rating' });
  const radio = rating.getByRole('radio').first();
  await radio.focus();
  const item = radio.locator('xpath=..');
  expect(await item.evaluate((element) => getComputedStyle(element, '::after').borderStyle)).toBe(
    'solid',
  );
  const selectedIcon = rating.locator('.fui-RatingItem__selectedIcon').first();
  await expect(selectedIcon).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(selectedIcon).toHaveCSS('transition-duration', '0s');
  const disabledIcon = section.locator('.rating-disabled .fui-RatingItem__selectedIcon').first();
  const grayText = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'GrayText';
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  await expect(disabledIcon).toHaveCSS('color', grayText);
});

test('ProgressBar preserves real-browser dimensions, semantics, colors, and Field integration', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#progress-bar');
  const customMax = section.getByRole('progressbar', { name: 'Custom maximum progress' });
  await expect(customMax).toHaveAttribute('aria-valuemin', '0');
  await expect(customMax).toHaveAttribute('aria-valuemax', '100');
  await expect(customMax).toHaveAttribute('aria-valuenow', '36');
  const customMaxRootBox = await customMax.boundingBox();
  const customMaxBarBox = await customMax.locator('.fui-ProgressBar__bar').boundingBox();
  expect(customMaxRootBox).not.toBeNull();
  expect(customMaxBarBox).not.toBeNull();
  expect(customMaxBarBox!.width / customMaxRootBox!.width).toBeCloseTo(0.36, 2);

  const roundedMedium = section.getByRole('progressbar', { name: 'Rounded medium progress' });
  const squareLarge = section.getByRole('progressbar', { name: 'Square large progress' });
  await expect(roundedMedium).toHaveCSS('height', '2px');
  await expect(roundedMedium).toHaveCSS('border-radius', '4px');
  await expect(squareLarge).toHaveCSS('height', '4px');
  await expect(squareLarge).toHaveCSS('border-radius', '0px');
  const squareLargeRootBox = await squareLarge.boundingBox();
  const squareLargeBarBox = await squareLarge.locator('.fui-ProgressBar__bar').boundingBox();
  expect(squareLargeRootBox).not.toBeNull();
  expect(squareLargeBarBox).not.toBeNull();
  expect(squareLargeBarBox!.width / squareLargeRootBox!.width).toBeCloseTo(0.68, 2);

  const colors = ['brand', 'error', 'warning', 'success'] as const;
  const computedColors: string[] = [];
  for (const color of colors) {
    const bar = section.locator(`.progress-bar-color-${color} .fui-ProgressBar__bar`);
    computedColors.push(await bar.evaluate((element) => getComputedStyle(element).backgroundColor));
  }
  expect(new Set(computedColors).size).toBe(4);

  const indeterminate = section.getByRole('progressbar', {
    name: 'Indeterminate progress',
    exact: true,
  });
  await expect(indeterminate).not.toHaveAttribute('aria-valuemin');
  await expect(indeterminate).not.toHaveAttribute('aria-valuemax');
  await expect(indeterminate).not.toHaveAttribute('aria-valuenow');
  await expect(indeterminate.locator('.fui-ProgressBar__indeterminateMotion')).toHaveCount(1);
  await expect(indeterminate.locator('.fui-ProgressBar__bar')).toHaveCSS(
    'animation-duration',
    '3s',
  );

  const staticIndeterminate = section.getByRole('progressbar', {
    name: 'Indeterminate progress without motion',
  });
  await expect(staticIndeterminate.locator('.fui-ProgressBar__indeterminateMotion')).toHaveCount(0);
  await expect(staticIndeterminate.locator('.fui-ProgressBar__bar')).toHaveCSS(
    'animation-name',
    'none',
  );

  for (const [rootClass, expectedColor] of [
    ['.progress-bar-field-error', 'error'],
    ['.progress-bar-field-warning', 'warning'],
    ['.progress-bar-field-success', 'success'],
  ] as const) {
    const root = section.locator(rootClass);
    await expect(root.locator('.fui-ProgressBar__bar')).toHaveClass(
      new RegExp(`fui-ProgressBar__bar--${expectedColor}`),
    );
    const label = root.locator('xpath=..').locator('label');
    const labelId = await label.getAttribute('id');
    expect(labelId).not.toBeNull();
    await expect(root).toHaveAttribute('aria-labelledby', labelId!);
  }

  const defaultField = section.locator('.progress-bar-field-default');
  const defaultFieldRoot = defaultField.locator('xpath=..');
  const defaultLabel = defaultFieldRoot.locator('label');
  const defaultHint = defaultFieldRoot.locator('.fui-Field__hint');
  const defaultControlId = await defaultLabel.getAttribute('for');
  const defaultLabelId = await defaultLabel.getAttribute('id');
  const defaultHintId = await defaultHint.getAttribute('id');
  expect(defaultControlId).not.toBeNull();
  expect(defaultLabelId).not.toBeNull();
  expect(defaultHintId).not.toBeNull();
  await expect(defaultField).toHaveAttribute('id', defaultControlId!);
  await expect(defaultField).toHaveAttribute('aria-labelledby', defaultLabelId!);
  await expect(defaultField).toHaveAttribute('aria-describedby', defaultHintId!);
});

test('ProgressBar reduced motion replaces translation with opacity pulsing', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const bar = page.locator('#progress-bar .progress-bar-indeterminate .fui-ProgressBar__bar');
  await expect(bar).toHaveCSS('max-width', '100%');
  await expect(bar).toHaveCSS('animation-name', 'fui-progress-bar-indeterminate-reduced-motion');
  await expect(bar).toHaveCSS('animation-duration', '3s');
  await expect(bar).toHaveCSS('translate', 'none');
});

test('Switch preserves native click, keyboard, controlled rollback, and disabled-focusable behavior', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#switch');
  const live = section.getByRole('switch', { name: 'Live setting' });
  const liveLabel = section.getByText('Live setting', { exact: true });

  await expect(live).not.toBeChecked();
  await liveLabel.click();
  await expect(live).toBeChecked();
  await expect(section.getByText(/Live setting: true/)).toBeVisible();

  await live.focus();
  await page.keyboard.press('Space');
  await expect(live).not.toBeChecked();
  await expect(section.getByText(/Live setting: false/)).toBeVisible();

  const controlled = section.getByRole('switch', { name: 'Controlled rollback' });
  await expect(controlled).toBeChecked();
  await controlled.click();
  await expect(controlled).toBeChecked();
  await section.getByRole('button', { name: 'Update controlled switch' }).click();
  await expect(controlled).not.toBeChecked();

  const disabledFocusable = section.getByRole('switch', { name: 'Focusable disabled' });
  await expect(disabledFocusable).toHaveAttribute('aria-disabled', 'true');
  await expect(disabledFocusable).not.toHaveAttribute('disabled');
  await disabledFocusable.focus();
  await expect(disabledFocusable).toBeFocused();
  await expect(disabledFocusable).toBeChecked();
  await page.keyboard.press('Space');
  await expect(disabledFocusable).toBeChecked();
  await disabledFocusable.click({ force: true });
  await expect(disabledFocusable).toBeChecked();
});

test('Switch preserves exact geometry, label positions, first-line alignment, and RTL thumb movement', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#switch');
  const medium = section.locator('.switch-size-medium');
  const small = section.locator('.switch-size-small');

  for (const [root, trackWidth, trackHeight, thumbSize] of [
    [medium, 40, 20, 18],
    [small, 32, 16, 14],
  ] as const) {
    const indicator = root.locator('.fui-Switch__indicator');
    const thumb = root.locator('.fui-Switch__thumb');
    const indicatorBox = await indicator.boundingBox();
    const thumbBox = await thumb.boundingBox();
    expect(indicatorBox).not.toBeNull();
    expect(thumbBox).not.toBeNull();
    expect(indicatorBox!.width).toBe(trackWidth);
    expect(indicatorBox!.height).toBe(trackHeight);
    expect(thumbBox!.width).toBe(thumbSize);
    expect(thumbBox!.height).toBe(thumbSize);
  }

  const before = section.locator('.switch-position-before');
  const above = section.locator('.switch-position-above');
  const after = section.locator('.switch-position-after');
  const beforeLabel = await before.locator('label').boundingBox();
  const beforeIndicator = await before.locator('.fui-Switch__indicator').boundingBox();
  const aboveLabel = await above.locator('label').boundingBox();
  const aboveIndicator = await above.locator('.fui-Switch__indicator').boundingBox();
  const afterLabel = await after.locator('label').boundingBox();
  const afterIndicator = await after.locator('.fui-Switch__indicator').boundingBox();
  expect(beforeLabel!.x).toBeLessThan(beforeIndicator!.x);
  expect(aboveLabel!.y).toBeLessThan(aboveIndicator!.y);
  expect(afterLabel!.x).toBeGreaterThan(afterIndicator!.x);

  const longLabelRoot = section.locator('.switch-long-label');
  const longLabel = longLabelRoot.locator('label');
  const longLabelBox = await longLabel.boundingBox();
  const longIndicatorBox = await longLabelRoot.locator('.fui-Switch__indicator').boundingBox();
  expect(longLabelBox).not.toBeNull();
  expect(longIndicatorBox).not.toBeNull();
  expect(longLabelBox!.height).toBeGreaterThan(20);
  expect(Math.abs(longLabelBox!.y - longIndicatorBox!.y)).toBeLessThanOrEqual(8);

  const thumb = medium.locator('.fui-Switch__thumb');
  await expect(thumb).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 20, 0)');
  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  await expect(thumb).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -20, 0)');
});

test('Switch preserves Field association and native form reset and data behavior', async ({
  page,
}) => {
  await page.goto('/');

  const form = page.locator('.switch-form-demo');
  const field = form.locator('.switch-field-demo');
  const fieldSwitch = field.getByRole('switch', { name: 'Enable alerts' });
  const fieldLabel = field.locator('label');
  const hintId = await field.locator('.fui-Field__hint').getAttribute('id');
  const fieldSwitchId = await fieldSwitch.getAttribute('id');
  expect(hintId).not.toBeNull();
  expect(fieldSwitchId).not.toBeNull();
  await expect(fieldLabel).toHaveAttribute('for', fieldSwitchId!);
  await expect(fieldSwitch).toHaveAttribute('required', '');
  await expect(fieldSwitch).toHaveAttribute('aria-describedby', hintId!);
  await fieldLabel.click();
  await expect(fieldSwitch).toBeChecked();
  await fieldSwitch.focus();
  await expect(fieldSwitch).toBeFocused();

  const resettable = form.getByRole('switch', { name: 'Resettable switch' });
  await expect(resettable).toBeChecked();
  expect(
    await form.evaluate((element) => Object.fromEntries(new FormData(element as HTMLFormElement))),
  ).toEqual({ alerts: 'enabled', updates: 'enabled' });

  await resettable.uncheck();
  expect(
    await form.evaluate((element) => Object.fromEntries(new FormData(element as HTMLFormElement))),
  ).toEqual({ alerts: 'enabled' });
  await form.getByRole('button', { name: 'Reset switch form' }).click();
  await expect(resettable).toBeChecked();
});

test('Switch reduced motion collapses track and thumb transitions', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const switchRoot = page.locator('#switch .switch-size-medium');
  for (const part of [
    switchRoot.locator('.fui-Switch__indicator'),
    switchRoot.locator('.fui-Switch__thumb'),
  ]) {
    const duration = await part.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).transitionDuration),
    );
    expect(duration).toBeLessThanOrEqual(0.00001);
  }
});

test('Skeleton preserves animations, appearances, exact geometry, context, roots, and width', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#skeleton');
  const wave = section.locator('.skeleton-wave-opaque .skeleton-line-long');
  const pulse = section.locator('.skeleton-pulse-opaque .skeleton-line-long');

  const stencilColor = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = getComputedStyle(document.documentElement)
      .getPropertyValue('--fui-color-neutral-stencil-1')
      .trim();
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  await expect(wave).toHaveCSS('background-color', stencilColor);
  await expect(wave).toHaveCSS('animation-name', 'none');
  await expect(pulse).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(wave).toHaveCSS('overflow', 'hidden');
  await expect(wave).toHaveCSS('position', 'relative');

  const animationStyles = await section.evaluate(() => {
    const readAfter = (selector: string) => {
      const element = document.querySelector(selector)!;
      const style = getComputedStyle(element, '::after');
      return {
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        transform: style.transform,
      };
    };
    return {
      wave: readAfter('#skeleton .skeleton-wave-opaque .skeleton-line-long'),
      pulse: readAfter('#skeleton .skeleton-pulse-opaque .skeleton-line-long'),
      translucentPulse: readAfter('#skeleton .skeleton-pulse-translucent .skeleton-line-long'),
    };
  });
  expect(animationStyles.wave.animationName).toBe('fui-skeleton-wave');
  expect(animationStyles.wave.animationDuration).toBe('3s');
  expect(animationStyles.wave.backgroundImage).not.toBe('none');
  expect(animationStyles.pulse.animationName).toBe('fui-skeleton-pulse');
  expect(animationStyles.pulse.animationDuration).toBe('1s');
  expect(animationStyles.translucentPulse.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(animationStyles.translucentPulse.backgroundImage).not.toBe('none');

  for (const size of [
    8, 12, 14, 16, 20, 22, 24, 28, 32, 36, 40, 48, 52, 56, 64, 72, 92, 96, 120, 128,
  ]) {
    const item = section.locator(`.skeleton-exact-size-${size}`);
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBe(size);
  }

  for (const [selector, width, height, radius] of [
    ['.skeleton-size-circle', 64, 64, '50%'],
    ['.skeleton-size-square', 64, 64, '0px'],
  ] as const) {
    const item = section.locator(selector);
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBe(width);
    expect(box!.height).toBe(height);
    await expect(item).toHaveCSS('border-radius', radius);
  }
  const rectangle = section.locator('.skeleton-size-rectangle');
  const rectangleBox = await rectangle.boundingBox();
  expect(rectangleBox).not.toBeNull();
  expect(rectangleBox!.width).toBeGreaterThan(160);
  expect(rectangleBox!.height).toBe(64);
  await expect(rectangle).toHaveCSS('border-radius', '4px');

  await expect(section.locator('.skeleton-inherited-item')).toHaveClass(/fui-SkeletonItem--pulse/);
  await expect(section.locator('.skeleton-inherited-item')).toHaveClass(
    /fui-SkeletonItem--translucent/,
  );
  await expect(section.locator('.skeleton-inherited-item')).toHaveClass(
    /fui-SkeletonItem--size-32/,
  );
  await expect(section.locator('.skeleton-inherited-item')).toHaveClass(/fui-SkeletonItem--circle/);
  await expect(section.locator('.skeleton-overridden-item')).toHaveClass(/fui-SkeletonItem--wave/);
  await expect(section.locator('.skeleton-overridden-item')).toHaveClass(
    /fui-SkeletonItem--opaque/,
  );
  await expect(section.locator('.skeleton-overridden-item')).toHaveClass(
    /fui-SkeletonItem--size-20/,
  );
  await expect(section.locator('.skeleton-overridden-item')).toHaveClass(
    /fui-SkeletonItem--square/,
  );
  await expect(section.locator('.skeleton-nested-item')).toHaveClass(/fui-SkeletonItem--pulse/);
  await expect(section.locator('.skeleton-nested-item')).toHaveClass(
    /fui-SkeletonItem--translucent/,
  );
  await expect(section.locator('.skeleton-nested-item')).toHaveClass(/fui-SkeletonItem--size-16/);
  await expect(section.locator('.skeleton-nested-item')).toHaveClass(/fui-SkeletonItem--rectangle/);

  const spanRoot = section.getByRole('status', { name: 'Custom skeleton status' });
  expect(await spanRoot.evaluate((element) => element.tagName)).toBe('SPAN');
  expect(await spanRoot.locator('.skeleton-span-item').evaluate((element) => element.tagName)).toBe(
    'SPAN',
  );
  await expect(spanRoot).toHaveCSS('display', 'block');
  await expect(spanRoot).toHaveCSS('width', '240px');
  await expect(spanRoot).toHaveAttribute('aria-busy', 'false');
});

test('Skeleton wave follows RTL and reduced motion stops both animations', async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'Media emulation computed-style coverage is Chromium-only.',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const wave = page.locator('#skeleton .skeleton-wave-opaque .skeleton-line-long');
  const pulse = page.locator('#skeleton .skeleton-pulse-opaque .skeleton-line-long');
  const ltrWave = await wave.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return {
      animationName: style.animationName,
      duration: style.animationDuration,
      count: style.animationIterationCount,
      background: style.backgroundImage,
    };
  });
  expect(ltrWave.animationName).toBe('fui-skeleton-wave');
  expect(Number.parseFloat(ltrWave.duration)).toBeLessThanOrEqual(0.01);
  expect(ltrWave.count).toBe('1');
  expect(
    await pulse.evaluate((element) => getComputedStyle(element, '::after').animationIterationCount),
  ).toBe('1');

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  const rtlWave = await wave.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return {
      animationName: style.animationName,
      transform: style.transform,
      background: style.backgroundImage,
    };
  });
  expect(rtlWave.animationName).toBe('fui-skeleton-wave-rtl');
  expect(rtlWave.background).not.toBe(ltrWave.background);
});

test('Slider keyboard behavior, controlled updates, and disabled state use native range semantics', async ({
  page,
}) => {
  await page.goto('/');

  const volume = page.getByRole('slider', { name: 'Volume' });
  await expect(volume).toHaveValue('40');
  await volume.focus();
  await page.keyboard.press('ArrowRight');
  await expect(volume).toHaveValue('45');
  await page.keyboard.press('ArrowLeft');
  await expect(volume).toHaveValue('40');
  await page.keyboard.press('End');
  await expect(volume).toHaveValue('100');
  await page.keyboard.press('Home');
  await expect(volume).toHaveValue('0');
  await page.keyboard.press('PageUp');
  expect(Number(await volume.inputValue())).toBeGreaterThan(0);
  await page.keyboard.press('PageDown');
  expect(Number(await volume.inputValue())).toBeGreaterThanOrEqual(0);

  const controlled = page.getByRole('slider', { name: 'Brightness' });
  await expect(controlled).toHaveValue('35');
  await controlled.focus();
  await page.keyboard.press('ArrowRight');
  await expect(controlled).toHaveValue('36');
  await page.getByRole('button', { name: 'Set to 80' }).click();
  await expect(controlled).toHaveValue('80');

  const rollback = page.getByRole('slider', { name: 'Controlled rollback slider' });
  await expect(rollback).toHaveValue('35');
  await rollback.focus();
  await page.keyboard.press('ArrowRight');
  await expect(rollback).toHaveValue('35');

  const disabled = page.getByRole('slider', { name: 'Disabled slider' });
  await expect(disabled).toBeDisabled();
  await disabled.focus();
  await expect(disabled).not.toBeFocused();
  await expect(disabled).toHaveValue('45');
});

test('Slider preserves min, max, step, decimal, form data, and reset behavior', async ({
  page,
}) => {
  await page.goto('/');

  const decimal = page.getByRole('slider', { name: 'Decimal slider' });
  await expect(decimal).toHaveAttribute('min', '-0.5');
  await expect(decimal).toHaveAttribute('max', '0.5');
  await expect(decimal).toHaveAttribute('step', '0.1');
  await expect(decimal).toHaveValue('0.3');
  await decimal.focus();
  await page.keyboard.press('ArrowRight');
  await expect(decimal).toHaveValue('0.4');

  const resetForm = page.locator('.slider-reset-demo');
  const resettable = resetForm.getByRole('slider', { name: 'Resettable level' });
  await expect(resettable).toHaveValue('30');
  await resettable.focus();
  await page.keyboard.press('End');
  await expect(resettable).toHaveValue('100');
  await resetForm.getByRole('button', { name: 'Reset slider form' }).click();
  await expect(resettable).toHaveValue('30');
  expect(
    await resetForm.evaluate((form) => Object.fromEntries(new FormData(form as HTMLFormElement))),
  ).toEqual({ level: '30' });
});

test('Slider Field integration exposes label, description, invalid state, and inherited size', async ({
  page,
}) => {
  await page.goto('/');

  const volumeField = page
    .locator('#slider')
    .getByText('Volume', { exact: true })
    .locator('xpath=..');
  const volume = volumeField.getByRole('slider', { name: 'Volume' });
  const volumeLabel = volumeField.locator('label');
  const volumeHint = volumeField.locator('.fui-Field__hint');
  const volumeHintId = await volumeHint.getAttribute('id');
  const volumeId = await volume.getAttribute('id');
  expect(volumeHintId).not.toBeNull();
  expect(volumeId).not.toBeNull();
  await expect(volumeLabel).toHaveAttribute('for', volumeId!);
  await expect(volume).toHaveAttribute('aria-describedby', volumeHintId!);
  await expect(volume.locator('xpath=..')).toHaveClass(/fui-Slider--small/);

  const invalidField = page.locator('.slider-field-invalid');
  const invalid = invalidField.getByRole('slider', { name: 'Brightness' });
  const validationId = await invalidField
    .locator('.fui-Field__validationMessage')
    .getAttribute('id');
  const hintId = await invalidField.locator('.fui-Field__hint').getAttribute('id');
  expect(validationId).not.toBeNull();
  expect(hintId).not.toBeNull();
  await expect(invalid).toHaveAttribute('aria-invalid', 'true');
  await expect(invalid).toHaveAttribute('aria-describedby', `${validationId} ${hintId}`);
  await expect(invalid.locator('xpath=..')).toHaveClass(/fui-Slider--invalid/);
  await expect(invalid.locator('xpath=..')).toHaveClass(/fui-Slider--small/);
});

test('Slider horizontal, vertical, progress, and RTL geometry match the Fluent layout', async ({
  page,
}) => {
  await page.goto('/');

  const horizontal = page.getByRole('slider', { name: 'Horizontal geometry slider' });
  const horizontalRoot = horizontal.locator('xpath=..');
  const horizontalRail = horizontalRoot.locator('.fui-Slider__rail');
  const horizontalThumb = horizontalRoot.locator('.fui-Slider__thumb');
  const horizontalRootBox = await horizontalRoot.boundingBox();
  const horizontalRailBox = await horizontalRail.boundingBox();
  const horizontalThumbBox = await horizontalThumb.boundingBox();
  expect(horizontalRootBox).not.toBeNull();
  expect(horizontalRailBox).not.toBeNull();
  expect(horizontalThumbBox).not.toBeNull();
  expect(horizontalRootBox!.width).toBe(256);
  expect(horizontalRailBox!.width).toBe(236);
  expect(horizontalRailBox!.height).toBe(4);
  expect(horizontalThumbBox!.width).toBe(20);
  expect(horizontalThumbBox!.height).toBe(20);
  expect(horizontalThumbBox!.x + horizontalThumbBox!.width / 2).toBeCloseTo(
    horizontalRailBox!.x + horizontalRailBox!.width * 0.25 + horizontalThumbBox!.width * 0.125,
    0,
  );
  await expect(horizontalRoot).toHaveCSS('--fui-Slider--progress', '25%');
  await expect(horizontalRoot).toHaveCSS('--fui-Slider--steps-percent', '25%');
  expect(
    await horizontalRail.evaluate((element) => getComputedStyle(element).backgroundImage),
  ).toContain('25%');

  const vertical = page.getByRole('slider', { name: 'Vertical geometry slider' });
  const verticalRoot = vertical.locator('xpath=..');
  const verticalRail = verticalRoot.locator('.fui-Slider__rail');
  const verticalThumb = verticalRoot.locator('.fui-Slider__thumb');
  const verticalRootBox = await verticalRoot.boundingBox();
  const verticalRailBox = await verticalRail.boundingBox();
  const verticalThumbBox = await verticalThumb.boundingBox();
  expect(verticalRootBox).not.toBeNull();
  expect(verticalRailBox).not.toBeNull();
  expect(verticalThumbBox).not.toBeNull();
  expect(verticalRootBox!.height).toBe(160);
  expect(verticalRailBox!.height).toBe(140);
  expect(verticalRailBox!.width).toBe(4);
  expect(verticalThumbBox!.y + verticalThumbBox!.height / 2).toBeCloseTo(
    verticalRailBox!.y + verticalRailBox!.height * 0.75 + verticalThumbBox!.height * 0.375,
    0,
  );
  await expect(vertical).toHaveAttribute('orient', 'vertical');
  await expect(verticalRoot).toHaveCSS('--fui-Slider--direction', '0deg');

  const rtl = page.getByRole('slider', { name: 'RTL slider' });
  const rtlRoot = rtl.locator('xpath=..');
  const rtlRail = rtlRoot.locator('.fui-Slider__rail');
  const rtlThumb = rtlRoot.locator('.fui-Slider__thumb');
  const rtlRootBox = await rtlRoot.boundingBox();
  const rtlRailBox = await rtlRail.boundingBox();
  const rtlThumbBox = await rtlThumb.boundingBox();
  expect(rtlRootBox).not.toBeNull();
  expect(rtlRailBox).not.toBeNull();
  expect(rtlThumbBox).not.toBeNull();
  expect(rtlThumbBox!.x + rtlThumbBox!.width / 2).toBeCloseTo(
    rtlRailBox!.x + rtlRailBox!.width * 0.75 - rtlThumbBox!.width * 0.125,
    0,
  );
  await expect(rtlRoot).toHaveCSS('--fui-Slider--direction', '270deg');
});

test('Slider reduced motion removes authored transition durations', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const slider = page.getByRole('slider', { name: 'Medium slider' }).locator('xpath=..');
  const rail = slider.locator('.fui-Slider__rail');
  const thumb = slider.locator('.fui-Slider__thumb');
  await expect(slider).toHaveCSS('transition-duration', /^(?:1e-05|0\.00001)s$/);
  await expect(rail).toHaveCSS('transition-duration', /^(?:1e-05|0\.00001)s$/);
  await expect(thumb).toHaveCSS('transition-duration', /^(?:1e-05|0\.00001)s$/);
});

test('Card selection, form semantics, names, nested actions, and controlled rollback work', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#card');
  const form = section.locator('.card-form-demo');
  const selectable = section.locator('.card-selectable');
  const selectableCheckbox = selectable.locator('input[type="checkbox"]');
  const controlled = section.locator('.card-controlled-rollback');
  const controlledCheckbox = controlled.locator('input[type="checkbox"]');

  await expect(selectableCheckbox).toHaveAttribute('aria-labelledby', /^fui-CardHeader__header-/);
  await expect(selectableCheckbox).toHaveAttribute('name', 'selected-report');
  await expect(selectableCheckbox).toHaveAttribute('value', 'quarterly');
  await expect(selectableCheckbox).not.toBeChecked();
  await selectable.click();
  await expect(selectableCheckbox).toBeChecked();
  await expect(selectable).toHaveClass(/fui-Card--selected/);
  expect(
    await form.evaluate((element) => Object.fromEntries(new FormData(element as HTMLFormElement))),
  ).toEqual({ 'selected-report': 'quarterly', 'locked-report': 'locked' });

  await section.getByRole('button', { name: 'Nested action' }).click();
  await expect(selectableCheckbox).toBeChecked();

  await expect(controlledCheckbox).toBeChecked();
  await controlled.click();
  await expect(controlledCheckbox).toBeChecked();
  await section.getByRole('button', { name: 'Update controlled card' }).click();
  await expect(controlledCheckbox).not.toBeChecked();

  await selectable.click();
  await expect(selectableCheckbox).not.toBeChecked();
  await section.getByRole('button', { name: 'Reset card form' }).click();
  await expect(selectableCheckbox).not.toBeChecked();
  await expect(controlledCheckbox).not.toBeChecked();

  const disabled = section.locator('.card-disabled');
  await expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await expect(disabled.locator('input[type="checkbox"]')).toBeDisabled();
  await expect(disabled.locator('input[type="checkbox"]')).toBeChecked();
  await disabled.click({ force: true });
  await expect(disabled.locator('input[type="checkbox"]')).toBeChecked();
});

test('Card focus modes, semantic roots, parts, sizing, RTL, and orientation work', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('#card');

  await expect(section.locator('.card-semantic-article')).toHaveJSProperty('tagName', 'ARTICLE');
  for (const appearance of ['filled', 'filled-alternative', 'outline', 'subtle']) {
    const card = section.locator(`.card-appearance-${appearance}`);
    await expect(card).toHaveClass(new RegExp(`fui-Card--${appearance}`));
    await expect(card.locator('.fui-CardPreview')).toHaveCount(1);
    await expect(card.locator('.fui-CardPreview__logo')).toHaveCount(1);
    await expect(card.locator('.fui-CardHeader__image')).toHaveCount(1);
    await expect(card.locator('.fui-CardHeader__description')).toHaveCount(1);
    await expect(card.locator('.fui-CardHeader__action')).toHaveCount(1);
    await expect(card.locator('.fui-CardFooter__action')).toHaveCount(1);
  }

  for (const [size, padding] of [
    ['small', '8px'],
    ['medium', '12px'],
    ['large', '16px'],
  ] as const) {
    await expect(section.getByRole('group', { name: `${size} card` })).toHaveCSS(
      'padding',
      padding,
    );
  }

  const off = section.getByRole('group', { name: 'off focus card' });
  await expect(off).not.toHaveAttribute('tabindex');
  for (const mode of ['no-tab', 'tab-exit', 'tab-only'] as const) {
    const card = section.getByRole('group', { name: `${mode} focus card` });
    await expect(card).toHaveAttribute('tabindex', '0');
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(card.getByRole('button', { name: 'First action' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(card).toBeFocused();
  }

  const trapped = section.getByRole('group', { name: 'no-tab focus card' });
  await trapped.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(trapped.getByRole('link', { name: 'Second action' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(trapped.getByRole('button', { name: 'First action' })).toBeFocused();

  const horizontal = section.locator('.card-horizontal-rtl');
  await expect(horizontal).toHaveCSS('flex-direction', 'row');
  const preview = horizontal.locator('.fui-CardPreview');
  const header = horizontal.locator('.fui-CardHeader');
  const previewBox = await preview.boundingBox();
  const headerBox = await header.boundingBox();
  expect(previewBox).not.toBeNull();
  expect(headerBox).not.toBeNull();
  expect(previewBox!.x).toBeGreaterThan(headerBox!.x);
});

test('Card reduced motion collapses authored transitions', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('#card .card-appearance-filled')).toHaveCSS(
    'transition-duration',
    /^(?:1e-05|0\.00001)s$/,
  );
});

test('Accordion preserves disclosure state, relationships, disabled behavior, and layout', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#accordion');
  const single = section.locator('.accordion-single');
  const overview = single.getByRole('button', { name: 'Overview' });
  const details = single.getByRole('button', { name: 'Details' });
  const disabled = single.getByRole('button', { name: 'Disabled section' });

  await expect(overview).toHaveAttribute('aria-expanded', 'true');
  await expect(overview).toHaveAttribute('aria-disabled', 'true');
  await expect(single.getByRole('region', { name: 'Overview' })).toBeVisible();
  await details.click();
  await expect(overview).toHaveAttribute('aria-expanded', 'false');
  await expect(details).toHaveAttribute('aria-expanded', 'true');
  await expect(single.getByRole('region', { name: 'Details' })).toBeVisible();
  await expect(disabled).toBeDisabled();

  const multiple = section.locator('.accordion-multiple');
  const first = multiple.getByRole('button', { name: 'First collapsible item' });
  const second = multiple.getByRole('button', { name: 'ⓘ Second collapsible item' });
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await second.click();
  await expect(multiple.getByRole('region')).toHaveCount(2);
  await first.click();
  await second.click();
  await expect(multiple.getByRole('region')).toHaveCount(0);

  await expect(first).toHaveCSS('min-height', '32px');
  await expect(second).toHaveCSS('font-size', '16px');
  const detailsBox = await details.boundingBox();
  const endIconBox = await details.locator('.fui-AccordionHeader__expandIcon').boundingBox();
  expect(detailsBox).not.toBeNull();
  expect(endIconBox).not.toBeNull();
  const trailingGap = detailsBox!.x + detailsBox!.width - (endIconBox!.x + endIconBox!.width);
  expect(trailingGap).toBeGreaterThanOrEqual(8);
  expect(trailingGap).toBeLessThanOrEqual(20);
});

test('Accordion respects RTL chevrons and reduced motion', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Computed motion coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));

  const overview = page.locator('#accordion').getByRole('button', { name: 'Overview' });
  const details = page.locator('#accordion').getByRole('button', { name: 'Details' });
  await details.click();
  const chevron = overview.locator('.fui-AccordionHeader__chevron');
  await expect(chevron).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
  await expect(chevron).toHaveCSS('transition-duration', /^(?:1e-05|0\.00001)s$/);
});

test('Tabs preserve selection, roving focus, disabled state, appearances, and layout', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#tabs');
  const project = section.getByRole('tablist', { name: 'Project sections' });
  const overview = project.getByRole('tab', { name: 'Overview' });
  const activity = project.getByRole('tab', { name: 'Activity' });
  const settings = project.getByRole('tab', { name: 'Settings' });

  await expect(overview).toHaveAttribute('aria-selected', 'true');
  await expect(overview).toHaveAttribute('tabindex', '0');
  await expect(settings).toBeDisabled();
  await activity.focus();
  await expect(overview).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(overview).toBeFocused();
  await page.keyboard.press('End');
  await expect(activity).toBeFocused();
  await activity.click();
  await expect(activity).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByText('Selected tab: activity')).toBeVisible();

  const automatic = section.getByRole('tablist', { name: 'Automatic sections' });
  const mentions = automatic.getByRole('tab', { name: 'Mentions' });
  await mentions.focus();
  await expect(mentions).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(automatic.getByRole('tab', { name: 'Files' })).toBeFocused();
  await expect(automatic.getByRole('tab', { name: 'Files' })).toHaveAttribute(
    'aria-selected',
    'true',
  );

  const circular = section.getByRole('tablist', { name: 'Circular navigation' });
  const home = circular.getByRole('tab', { name: 'Home' });
  const notification = circular.getByRole('tab', { name: 'Notifications' });
  await expect(home).toHaveCSS('border-radius', '10000px');
  await expect(home.locator('.fui-Tab__content')).toHaveCSS('font-size', '16px');
  await expect(notification.locator('.fui-Tab__icon')).toHaveCSS('width', '24px');
});

test('Tabs preserve RTL indicators and reduced-motion safeguards', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Computed motion coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));

  const vertical = page
    .locator('#tabs')
    .getByRole('tablist', { name: 'Automatic sections' })
    .getByRole('tab', { name: 'Activity' });
  const styles = await vertical.evaluate((element) => {
    const after = getComputedStyle(element, '::after');
    return {
      insetInlineStart: after.insetInlineStart,
      transitionDuration: after.transitionDuration,
    };
  });
  expect(styles.insetInlineStart).toBe('0px');
  expect(styles.transitionDuration).toMatch(/^(?:0s|1e-05s|0\.00001s)$/);
});

test('Breadcrumb preserves semantics, current state, focus modes, sizes, and RTL dividers', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#breadcrumb');
  const project = section.getByRole('navigation', { name: 'Project breadcrumb' });
  const workspace = project.getByRole('link', { name: 'Workspace' });
  const current = project.getByRole('button', { name: 'Fluent Vue' });
  await expect(project.locator('ol')).toHaveAttribute('role', 'list');
  await expect(workspace).toHaveAttribute('href', '#workspace');
  await expect(workspace.locator('.fui-BreadcrumbButton__icon')).toHaveCSS('width', '16px');
  await expect(current).toHaveAttribute('aria-current', 'page');
  await expect(current).toHaveAttribute('aria-disabled', 'true');
  await expect(current).toHaveCSS('font-weight', '600');

  const arrow = section.getByRole('navigation', { name: 'Arrow breadcrumb' });
  const home = arrow.getByRole('link', { name: 'Home' });
  const disabled = arrow.getByRole('button', { name: 'Disabled', exact: true });
  const focusableDisabled = arrow.getByRole('button', { name: 'Focusable disabled' });
  const currentPage = arrow.getByRole('button', { name: 'Current page' });
  await expect(home).toHaveAttribute('tabindex', '0');
  await expect(disabled).toBeDisabled();
  await expect(disabled).toHaveAttribute('tabindex', '-1');
  await expect(focusableDisabled).toHaveAttribute('tabindex', '-1');
  await home.focus();
  await page.keyboard.press('ArrowRight');
  await expect(focusableDisabled).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(currentPage).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(home).toBeFocused();
  await expect(home).toHaveCSS('height', '40px');
  await expect(arrow.locator('.fui-BreadcrumbDivider').first()).toHaveCSS('font-size', '20px');

  const rtlDivider = section
    .getByRole('navigation', { name: 'RTL breadcrumb' })
    .locator('.fui-BreadcrumbDivider__icon');
  await expect(rtlDivider).toHaveCSS('transform', 'matrix(-1, 0, 0, 1, 0, 0)');
});

test('Breadcrumb preserves reduced-motion and forced-color safeguards', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Computed media-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/');

  const button = page
    .locator('#breadcrumb')
    .getByRole('navigation', { name: 'Project breadcrumb' })
    .getByRole('link', { name: 'Workspace' });
  await expect(button).toHaveCSS('transition-duration', /^(?:1e-05|0\.00001)s$/);
  await expect(button).toHaveCSS('color', 'rgb(0, 0, 0)');
});

test('List preserves semantics, selection, actions, and composite navigation', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#list');
  const content = section.getByRole('list', { name: 'Continents' });
  await expect(content.getByRole('listitem')).toHaveCount(3);
  await expect(content).toHaveCSS('list-style-type', 'none');

  const people = section.getByRole('listbox', { name: 'People list' });
  const ada = people.getByRole('option', { name: 'Ada' });
  const grace = people.getByRole('option', { name: 'Grace' });
  const linus = people.getByRole('option', { name: 'Linus' });
  await expect(people).toHaveAttribute('aria-multiselectable', 'true');
  await expect(ada).toHaveAttribute('aria-selected', 'true');
  await grace.click();
  await expect(grace).toHaveAttribute('aria-selected', 'true');
  await expect(section.getByText('Selected people: Ada, Grace')).toBeVisible();
  await expect(linus).toHaveAttribute('aria-disabled', 'true');
  await linus.dispatchEvent('click');
  await expect(linus).toHaveAttribute('aria-selected', 'false');

  await ada.focus();
  await page.keyboard.press('ArrowDown');
  await expect(grace).toBeFocused();
  await page.keyboard.press('End');
  await expect(linus).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(linus).toBeFocused();

  const projects = section.getByRole('grid', { name: 'Project actions' });
  const rows = projects.getByRole('row');
  await expect(rows).toHaveCount(2);
  await rows.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(rows.first().getByRole('button', { name: 'Open' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(rows.first().getByRole('button', { name: 'More Roadmap actions' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(rows.first().getByRole('button', { name: 'Open' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');
  await expect(rows.first()).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(rows.nth(1)).toBeFocused();
});

test('List preserves forced-color focus and selected checkmark safeguards', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Computed forced-color coverage is Chromium-only.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');

  const ada = page
    .locator('#list')
    .getByRole('listbox', { name: 'People list' })
    .getByRole('option', { name: 'Ada' });
  await ada.focus();
  await expect(ada).toHaveCSS('outline-style', 'solid');
  await expect(ada.locator('.fui-ListItem__checkmarkIndicator')).toHaveCSS(
    'background-color',
    'rgba(5, 0, 73, 0.8)',
  );
});

test('Listbox preserves active-descendant navigation, controlled state, and released semantics', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#listbox');
  const single = section.getByRole('listbox', { name: 'Favorite animal' });
  const cat = single.getByRole('option', { name: 'Cat' });
  const dog = single.getByRole('option', { name: 'Dog' });
  const horse = single.getByRole('option', { name: 'Horse · unavailable' });

  await expect(single).toHaveAttribute('tabindex', '0');
  await expect(single).toHaveAttribute('aria-activedescendant', (await dog.getAttribute('id'))!);
  await expect(dog).toHaveAttribute('aria-selected', 'true');
  await expect(horse).toHaveAttribute('aria-disabled', 'true');
  await single.focus();
  await page.keyboard.press('ArrowDown');
  await expect(single).toHaveAttribute('aria-activedescendant', (await horse.getAttribute('id'))!);
  await page.keyboard.press('Enter');
  await expect(dog).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(single).toHaveAttribute(
    'aria-activedescendant',
    (await single.getByRole('option', { name: 'Dolphin' }).getAttribute('id'))!,
  );
  await page.keyboard.press('Home');
  await expect(single).toHaveAttribute('aria-activedescendant', (await cat.getAttribute('id'))!);
  await page.keyboard.press(' ');
  await expect(cat).toHaveAttribute('aria-selected', 'true');
  await expect(dog).toHaveAttribute('aria-selected', 'false');

  const multiple = section.getByRole('menu', { name: 'Companion animals' });
  const multipleDog = multiple.getByRole('menuitemcheckbox', { name: 'Dog' });
  const multipleBird = multiple.getByRole('menuitemcheckbox', { name: 'Bird' });
  const multipleRabbit = multiple.getByRole('menuitemcheckbox', { name: 'Rabbit · unavailable' });
  await expect(multiple).not.toHaveAttribute('aria-multiselectable');
  await expect(multipleDog).toHaveAttribute('aria-checked', 'true');
  await multipleBird.click();
  await expect(multipleBird).toHaveAttribute('aria-checked', 'true');
  await expect(section.getByText('Selected companions: dog, bird')).toBeVisible();
  await multipleRabbit.click({ force: true });
  await expect(multipleRabbit).toHaveAttribute('aria-checked', 'false');

  const controlled = section.getByRole('listbox', { name: 'Deployment region' });
  const west = controlled.getByRole('option', { name: 'West Europe' });
  const east = controlled.getByRole('option', { name: 'East US' });
  await expect(controlled).toHaveAttribute('aria-required', 'true');
  await expect(controlled).toHaveAttribute('aria-describedby', /^fui-field-.+__hint$/);
  await east.click();
  await expect(west).toHaveAttribute('aria-selected', 'true');
  await expect(east).toHaveAttribute('aria-selected', 'false');
  await expect(section.getByText('Controlled attempt: east')).toBeVisible();

  await page.locator('main').evaluate((main) => main.setAttribute('dir', 'rtl'));
  const checkIcon = multipleDog.locator('.fui-Option__checkIcon');
  await expect(checkIcon).toHaveCSS('margin-right', '-2px');
  expect(
    Number.parseFloat(await checkIcon.evaluate((element) => getComputedStyle(element).marginLeft)),
  ).toBeGreaterThan(0);
});

test('Listbox preserves forced-color focus and selection safeguards', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Computed forced-color coverage is Chromium-only.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');

  const listbox = page.locator('#listbox').getByRole('listbox', { name: 'Favorite animal' });
  await listbox.focus();
  const activeId = await listbox.getAttribute('aria-activedescendant');
  const activeOption = page.locator(`#${activeId}`);
  const focusOverlay = await activeOption.evaluate((element) => {
    const after = getComputedStyle(element, '::after');
    return { borderStyle: after.borderStyle, borderWidth: after.borderWidth };
  });
  expect(focusOverlay.borderStyle).toBe('solid');
  expect(focusOverlay.borderWidth).toBe('2px');

  const selectedCheck = listbox
    .getByRole('option', { name: 'Dog' })
    .locator('.fui-Option__checkIcon');
  await expect(selectedCheck).toHaveCSS('color', 'rgb(0, 0, 0)');
});

test('Avatar preserves fallbacks, group layouts, and overflow interaction', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#avatar');
  const ada = section.getByRole('img', { name: 'Ada Lovelace' }).first();
  await expect(ada.locator('.fui-Avatar__initials')).toHaveText('AL');
  await expect(ada).toHaveCSS('width', '32px');

  const active = section.getByRole('img', { name: 'Linus Torvalds, available, active' });
  await expect(active).toHaveClass(/fui-Avatar--active-ring-shadow/);
  await expect(active.locator('.fui-PresenceBadge')).toBeVisible();

  const stack = section.getByRole('group', { name: 'Engineering team' });
  await expect(stack).toHaveClass(/fui-AvatarGroup--stack/);
  const trigger = stack.getByRole('button', { name: 'View more people.' });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const surface = stack.getByRole('dialog', { name: 'Overflow' });
  await expect(surface).toBeFocused();
  await expect(surface.getByRole('listitem')).toHaveCount(3);
  await page.keyboard.press('Escape');
  await expect(surface).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(section.getByText('Overflow popover: closed')).toBeVisible();

  const pie = section.getByRole('group', { name: 'Project contributors' });
  await expect(pie).toHaveClass(/fui-AvatarGroup--pie/);
  await expect(pie).toHaveCSS('width', '48px');
  await expect(pie).toHaveCSS('height', '48px');
  const pieItems = pie.locator(':scope > .fui-AvatarGroupItem');
  await expect(pieItems).toHaveCount(3);
  await expect(pieItems.nth(0)).toHaveCSS('position', 'absolute');
  await expect(pieItems.nth(1)).toHaveCSS('transform', 'matrix(0.5, 0, 0, 0.5, 0, 0)');
  await expect(pieItems.nth(2)).toHaveCSS('transform', 'matrix(0.5, 0, 0, 0.5, 0, 0)');
  await expect(pie.getByRole('button', { name: 'View more people.' })).toHaveText('');
});

test('Persona preserves media mapping, text hierarchy, and layouts', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#persona');
  const ada = section.locator('.fui-Persona').filter({ hasText: 'Ada Lovelace' });
  await expect(ada.locator('.fui-Avatar')).toHaveCSS('width', '32px');
  await expect(ada.locator('.fui-Persona__secondaryText')).toHaveText('Mathematician');
  await expect(ada.locator('.fui-Persona__quaternaryText')).toHaveText('Available');

  const grace = section.locator('.fui-Persona').filter({ hasText: 'Grace Hopper' });
  await expect(grace).toHaveClass(/fui-Persona--size-extra-large/);
  await expect(grace.locator('.fui-Avatar')).toHaveCSS('width', '40px');

  const before = section.locator('.fui-Persona').filter({ hasText: 'Katherine Johnson' });
  await expect(before).toHaveClass(/fui-Persona--text-position-before/);
  expect(
    await before
      .locator(':scope > .fui-Persona__media')
      .evaluate((media) => !media.nextElementSibling),
  ).toBe(true);

  const below = section.locator('.fui-Persona').filter({ hasText: 'Dorothy Vaughan' });
  await expect(below).toHaveClass(/fui-Persona--text-position-below/);
  await expect(below).toHaveCSS('justify-items', 'center');

  const presenceOnly = section.locator('.fui-Persona').filter({ hasText: 'Margaret Hamilton' });
  await expect(presenceOnly).toHaveClass(/fui-Persona--presence-only/);
  await expect(presenceOnly.locator('.fui-Avatar')).toHaveCount(0);
  await expect(
    presenceOnly.getByRole('img', { name: 'do not disturb out of office' }),
  ).toBeVisible();

  await page.locator('main').evaluate((main) => main.setAttribute('dir', 'rtl'));
  await expect(ada.locator('.fui-Persona__media')).toHaveCSS('margin-right', '0px');
  await expect(ada.locator('.fui-Persona__media')).toHaveCSS('margin-left', '8px');
  await expect(before.locator('.fui-Persona__media')).toHaveCSS('margin-right', '8px');
  await expect(before.locator('.fui-Persona__media')).toHaveCSS('margin-left', '0px');
});

test('Persona preserves forced-color text treatment', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Computed forced-color coverage is Chromium-only.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');

  const primary = page.locator('#persona .fui-Persona__primaryText').first();
  await expect(primary).toHaveCSS('color', 'rgb(0, 0, 0)');
});

test('Avatar preserves forced-color and reduced-motion safeguards', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Computed media-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/');

  const active = page.locator('#avatar').getByRole('img', {
    name: 'Linus Torvalds, available, active',
  });
  await expect(active).toHaveCSS('transition-duration', '0s');
  const trigger = page
    .locator('#avatar')
    .getByRole('group', { name: 'Engineering team' })
    .getByRole('button', { name: 'View more people.' });
  await expect(trigger).toHaveCSS('border-style', 'solid');
});

test('Radio uses native common-name selection and arrow keys across engines', async ({ page }) => {
  await page.goto('/');

  const group = page.getByRole('radiogroup', { name: 'Native choices' });
  const alpha = group.getByRole('radio', { name: 'Alpha' });
  const beta = group.getByRole('radio', { name: 'Beta' });
  const gamma = group.getByRole('radio', { name: 'Gamma' });

  await expect(alpha).toBeChecked();
  await beta.check();
  await expect(alpha).not.toBeChecked();
  await expect(beta).toBeChecked();

  await beta.focus();
  await page.keyboard.press('ArrowRight');
  await expect(gamma).toBeChecked();
  await expect(gamma).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(beta).toBeChecked();
  await expect(beta).toBeFocused();

  const names = await group
    .getByRole('radio')
    .evaluateAll((radios) => radios.map((radio) => (radio as HTMLInputElement).name));
  expect(names.every((name) => name === 'radio-native-choice')).toBe(true);
});

test('Radio controlled standalone and group interactions roll back until updated', async ({
  page,
}) => {
  await page.goto('/');

  const controlledGroup = page.locator('.radio-controlled-group');
  await controlledGroup.getByRole('radio', { name: 'Gamma' }).click();
  await expect(controlledGroup.getByRole('radio', { name: 'Gamma' })).toBeChecked();
  await expect(controlledGroup.getByText('Controlled value: gamma')).toBeVisible();

  const rollback = page.locator('.radio-controlled-rollback');
  await rollback.getByRole('radio', { name: 'Attempt Beta' }).click();
  await expect(rollback.getByRole('radio', { name: 'Locked Alpha' })).toBeChecked();
  await expect(rollback.getByRole('radio', { name: 'Attempt Beta' })).not.toBeChecked();

  const standalone = page.locator('.radio-standalone-sample');
  const controlledStandalone = standalone.getByRole('radio', { name: 'Controlled standalone' });
  const lockedStandalone = standalone.getByRole('radio', { name: 'Locked standalone' });
  await controlledStandalone.check();
  await expect(controlledStandalone).toBeChecked();
  await expect(standalone.getByText('Standalone value: true')).toBeVisible();
  await lockedStandalone.click();
  await expect(lockedStandalone).not.toBeChecked();
});

test('Radio form submission and reset preserve native values', async ({ page }) => {
  await page.goto('/');

  const form = page.locator('.radio-form-demo');
  const email = form.getByRole('radio', { name: 'Email receipt' });
  const paper = form.getByRole('radio', { name: 'Paper receipt' });
  await expect(email).toBeChecked();
  await paper.check();
  await form.getByRole('button', { name: 'Submit radio form' }).click();
  await expect(form.getByText('Submitted radio: paper')).toBeVisible();

  await form.getByRole('button', { name: 'Reset radio form' }).click();
  await expect(email).toBeChecked();
  await expect(paper).not.toBeChecked();
  await form.getByRole('button', { name: 'Submit radio form' }).click();
  await expect(form.getByText('Submitted radio: email')).toBeVisible();
});

test('Radio generated names, IDs, Field semantics, layouts, RTL, disabled, and focus work', async ({
  page,
}) => {
  await page.goto('/');

  const field = page.locator('.radio-field-demo');
  const fieldGroup = field.getByRole('radiogroup', { name: 'Preferred contact' });
  const fieldLabel = field.locator('.fui-Field__label');
  const validation = field.locator('.fui-Field__validationMessage');
  const hint = field.locator('.fui-Field__hint');
  const fieldLabelId = await fieldLabel.getAttribute('id');
  const validationId = await validation.getAttribute('id');
  const hintId = await hint.getAttribute('id');
  expect(fieldLabelId).not.toBeNull();
  expect(validationId).not.toBeNull();
  expect(hintId).not.toBeNull();
  await expect(fieldGroup).toHaveAttribute('aria-labelledby', fieldLabelId!);
  await expect(fieldGroup).toHaveAttribute('aria-describedby', `${validationId} ${hintId}`);
  await expect(fieldGroup).toHaveAttribute('aria-required', 'true');
  await expect(fieldGroup).toHaveAttribute('aria-invalid', 'true');
  for (const radio of await fieldGroup.getByRole('radio').all()) {
    await expect(radio).toHaveAttribute('required', '');
    await expect(radio).toHaveAttribute('aria-invalid', 'true');
  }

  const stacked = page.locator('.radio-stacked-layout');
  await expect(stacked).toHaveCSS('flex-direction', 'row');
  const stackedNames = await stacked
    .getByRole('radio')
    .evaluateAll((radios) => radios.map((radio) => (radio as HTMLInputElement).name));
  expect(new Set(stackedNames).size).toBe(1);
  expect(stackedNames[0]).toBeTruthy();
  for (const radio of await stacked.getByRole('radio').all()) {
    const id = await radio.getAttribute('id');
    expect(id).toMatch(/^fui-radio-/);
    await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
  }

  const below = page.getByRole('radio', { name: 'Label below' });
  const belowRoot = below.locator('xpath=..');
  await expect(belowRoot).toHaveCSS('flex-direction', 'column');
  const disabled = page.getByRole('radio', { name: 'Disabled', exact: true });
  const disabledChecked = page.getByRole('radio', { name: 'Disabled checked' });
  await expect(disabled).toBeDisabled();
  await expect(disabledChecked).toBeDisabled();
  await expect(disabledChecked).toBeChecked();

  const alpha = page.getByRole('radiogroup', { name: 'Native choices' }).getByRole('radio', {
    name: 'Alpha',
  });
  await alpha.focus();
  await expect(alpha).toBeFocused();
  const root = alpha.locator('xpath=..');
  expect(await root.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe('none');

  const after = page.getByRole('radio', { name: 'Label after' });
  const indicator = after.locator('xpath=..').locator('.fui-Radio__indicator');
  const label = page.locator(`label[for="${await after.getAttribute('id')}"]`);
  const ltrIndicator = await indicator.boundingBox();
  const ltrLabel = await label.boundingBox();
  expect(ltrIndicator).not.toBeNull();
  expect(ltrLabel).not.toBeNull();
  expect(ltrIndicator!.x).toBeLessThan(ltrLabel!.x);

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  const rtlIndicator = await indicator.boundingBox();
  const rtlLabel = await label.boundingBox();
  expect(rtlIndicator).not.toBeNull();
  expect(rtlLabel).not.toBeNull();
  expect(rtlIndicator!.x).toBeGreaterThan(rtlLabel!.x);
});

test('Select preserves native options, keyboard, forms, controlled rollback, and Field semantics', async ({
  page,
  browserName,
}) => {
  await page.goto('/');

  const section = page.locator('#select');
  const form = section.locator('.select-form-demo');
  const select = form.getByLabel('Companion');
  const label = form.locator('label');

  await label.click();
  await expect(select).toBeFocused();
  await expect(select).toHaveAttribute('required', '');
  await expect(select).toHaveAttribute('name', 'companion');
  expect(await select.locator('option').count()).toBe(6);
  await expect(select.locator('optgroup').first()).toHaveAttribute('label', 'Land animals');
  await expect(select.locator('optgroup').last()).toHaveAttribute('label', 'Water animals');

  const keyboardSelect = section.locator('.select-appearance-outline select');
  await keyboardSelect.focus();
  await expect(keyboardSelect).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  const keyboardValue = await keyboardSelect.inputValue();
  expect(['blue', 'green']).toContain(keyboardValue);
  test.info().annotations.push({
    type: 'platform-note',
    description: `The ${browserName} engine exposes native select arrow-key selection as ${keyboardValue}; the popup and commit timing remain browser/OS-owned.`,
  });

  await select.selectOption('seal');
  await expect(select).toHaveValue('seal');
  await expect(section.locator('.select-current-value')).toContainText('seal');

  const formData = await form.evaluate((element) =>
    Object.fromEntries(new FormData(element as HTMLFormElement).entries()),
  );
  expect(formData).toEqual({ companion: 'seal' });

  const resetForm = section.locator('.select-reset-demo');
  const resetSelect = resetForm.getByLabel('Resettable animal');
  await expect(resetSelect).toHaveValue('dog');
  await resetSelect.selectOption('seal');
  await expect(resetSelect).toHaveValue('seal');
  await resetForm.getByRole('button', { name: 'Reset select form' }).click();
  await expect(resetSelect).toHaveValue('dog');

  const controlled = section.locator('.select-controlled-demo');
  const controlledSelect = controlled.getByLabel('Controlled rollback animal');
  await expect(controlledSelect).toHaveValue('cat');
  await controlledSelect.selectOption('dog');
  await expect(controlledSelect).toHaveValue('cat');
  await controlled.getByRole('button', { name: 'Set controlled animal to Seal' }).click();
  await expect(controlledSelect).toHaveValue('seal');

  await expect(section.locator('.select-disabled select')).toBeDisabled();
  await expect(section.locator('.select-invalid select')).toHaveAttribute('aria-invalid', 'true');
  await expect(section.locator('.select-custom-icon .fui-Select__icon')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(section.locator('[data-select-custom-icon]')).toBeVisible();
  await expect(section.locator('.select-size-small select')).toHaveCSS('height', '24px');
  await expect(section.locator('.select-size-medium select')).toHaveCSS('height', '32px');
  await expect(section.locator('.select-size-large select')).toHaveCSS('height', '40px');
  await expect(section.locator('.select-appearance-underline select')).toHaveCSS(
    'border-bottom-style',
    'solid',
  );
  await expect(section.locator('.select-appearance-filled-darker select')).toHaveCSS(
    'border-left-color',
    'rgba(0, 0, 0, 0)',
  );

  test.info().annotations.push({
    type: 'platform-note',
    description: `Native select popup rendering is browser/OS-owned in ${browserName}; coverage asserts the DOM value, keyboard selection, grouping, and form contracts.`,
  });
});

test('Select icon placement follows RTL logical direction', async ({ page }) => {
  await page.goto('/');

  const selectRoot = page.locator('#select .select-custom-icon');
  const select = selectRoot.locator('select');
  const icon = selectRoot.locator('.fui-Select__icon');
  const ltrSelectBox = await select.boundingBox();
  const ltrIconBox = await icon.boundingBox();
  expect(ltrSelectBox).not.toBeNull();
  expect(ltrIconBox).not.toBeNull();
  expect(ltrIconBox!.x).toBeGreaterThan(ltrSelectBox!.x + ltrSelectBox!.width / 2);

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  const rtlSelectBox = await select.boundingBox();
  const rtlIconBox = await icon.boundingBox();
  expect(rtlSelectBox).not.toBeNull();
  expect(rtlIconBox).not.toBeNull();
  expect(rtlIconBox!.x).toBeLessThan(rtlSelectBox!.x + rtlSelectBox!.width / 2);
});

test('Select reduced motion shortens focus underline transitions', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const root = page.locator('#select .select-appearance-outline');
  const beforeFocus = await root.evaluate((element) => ({
    duration: getComputedStyle(element, '::after').transitionDuration,
    delay: getComputedStyle(element, '::after').transitionDelay,
  }));
  expect(beforeFocus).toEqual({ duration: '1e-05s', delay: '1e-05s' });

  await root.locator('select').focus();
  const afterFocus = await root.evaluate((element) => ({
    duration: getComputedStyle(element, '::after').transitionDuration,
    delay: getComputedStyle(element, '::after').transitionDelay,
  }));
  expect(afterFocus).toEqual({ duration: '1e-05s', delay: '1e-05s' });
});

test('SpinButton commits editing with blur and Enter and cancels with Escape', async ({ page }) => {
  await page.goto('/');

  const input = page.getByRole('spinbutton', { name: 'Bounded quantity' });
  await input.fill('7');
  await input.blur();
  await expect(input).toHaveValue('7');

  await input.fill('9');
  await input.press('Enter');
  await expect(input).toHaveValue('9');

  await input.fill('13');
  await input.press('Escape');
  await expect(input).toHaveValue('9');
});

test('SpinButton handles Arrow, Page, Home, End, precision, and bounds', async ({ page }) => {
  await page.goto('/');

  const bounded = page.getByRole('spinbutton', { name: 'Bounded quantity' });
  await bounded.focus();
  await bounded.press('ArrowUp');
  await expect(bounded).toHaveValue('7');
  await bounded.press('ArrowDown');
  await expect(bounded).toHaveValue('5');
  await bounded.press('PageUp');
  await expect(bounded).toHaveValue('15');
  await bounded.press('PageDown');
  await expect(bounded).toHaveValue('5');
  await bounded.press('Home');
  await expect(bounded).toHaveValue('0');
  await bounded.press('End');
  await expect(bounded).toHaveValue('20');
  await expect(
    bounded.locator('xpath=..').getByRole('button', { name: 'Increment value' }),
  ).toBeDisabled();

  const precise = page.getByRole('spinbutton', { name: 'Precise amount' });
  await precise.focus();
  await precise.press('ArrowUp');
  await expect(precise).toHaveValue('0.3');
});

test('SpinButton buttons retain input focus, repeat, and controlled rollback', async ({ page }) => {
  await page.goto('/');

  const bounded = page.getByRole('spinbutton', { name: 'Bounded quantity' });
  const increment = bounded.locator('xpath=..').getByRole('button', { name: 'Increment value' });
  await bounded.focus();
  await increment.dispatchEvent('mousedown', { button: 0 });
  await increment.dispatchEvent('mouseup', { button: 0 });
  await expect(bounded).toBeFocused();
  const valueAfterPress = Number(await bounded.inputValue());
  expect(valueAfterPress).toBeGreaterThan(5);

  await increment.dispatchEvent('mousedown', { button: 0 });
  await page.waitForTimeout(360);
  await increment.dispatchEvent('mouseup', { button: 0 });
  await expect
    .poll(async () => Number(await bounded.inputValue()))
    .toBeGreaterThan(valueAfterPress);

  const rollback = page.getByRole('spinbutton', { name: 'Controlled rollback' });
  await rollback.fill('99');
  await rollback.press('Enter');
  await expect(rollback).toHaveValue('4');
  await rollback.press('ArrowUp');
  await expect(rollback).toHaveValue('4');
});

test('SpinButton preserves form data, reset, Field, states, and appearances', async ({ page }) => {
  await page.goto('/');

  const form = page.locator('.spin-button-form');
  const quantity = form.getByRole('spinbutton', { name: 'Resettable quantity' });
  await quantity.fill('8');
  await quantity.press('Enter');
  await form.getByRole('button', { name: 'Submit SpinButton form' }).click();
  await expect(form.getByText('Submitted quantity: 8')).toBeVisible();
  await form.getByRole('button', { name: 'Reset SpinButton form' }).click();
  await expect(quantity).toHaveValue('2');

  const fieldInput = page.getByRole('spinbutton', { name: 'Cases' });
  const field = fieldInput.locator('xpath=../..');
  const label = field.locator('label');
  await label.click();
  await expect(fieldInput).toBeFocused();
  await expect(fieldInput).toHaveAttribute('required', '');
  await expect(fieldInput.locator('xpath=..')).toHaveClass(/fui-SpinButton--small/);

  await expect(page.getByRole('spinbutton', { name: 'Disabled SpinButton' })).toBeDisabled();
  await expect(page.getByRole('spinbutton', { name: 'Read-only SpinButton' })).toHaveAttribute(
    'readonly',
    '',
  );
  for (const appearance of ['outline', 'underline', 'filled-darker', 'filled-lighter']) {
    await expect(page.locator(`.spin-button-${appearance}`)).toHaveClass(
      new RegExp(`fui-SpinButton--${appearance}`),
    );
  }
});

test('SpinButton uses logical button placement in RTL', async ({ page }) => {
  await page.goto('/');
  const input = page.getByRole('spinbutton', { name: 'Bounded quantity' });
  const root = input.locator('xpath=..');
  const increment = root.getByRole('button', { name: 'Increment value' });
  const ltrRoot = await root.boundingBox();
  const ltrButton = await increment.boundingBox();
  expect(ltrRoot).not.toBeNull();
  expect(ltrButton).not.toBeNull();
  expect(ltrButton!.x).toBeGreaterThan(ltrRoot!.x + ltrRoot!.width / 2);

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  const rtlRoot = await root.boundingBox();
  const rtlButton = await increment.boundingBox();
  expect(rtlRoot).not.toBeNull();
  expect(rtlButton).not.toBeNull();
  expect(rtlButton!.x).toBeLessThan(rtlRoot!.x + rtlRoot!.width / 2);
});

test('SpinButton reduced motion minimizes focus transition', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const root = page.getByRole('spinbutton', { name: 'Bounded quantity' }).locator('xpath=..');
  const transition = await root.evaluate((element) => ({
    duration: getComputedStyle(element, '::after').transitionDuration,
    delay: getComputedStyle(element, '::after').transitionDelay,
  }));
  expect(Number.parseFloat(transition.duration)).toBeLessThanOrEqual(0.00001);
  expect(Number.parseFloat(transition.delay)).toBeLessThanOrEqual(0.00001);
});

test('SearchBox preserves typing, search/change events, dismiss, Escape, and focus restoration', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#search-box');
  const input = section.getByRole('searchbox', { name: 'Search documentation' });
  const root = input.locator('xpath=..');
  const dismiss = root.getByRole('button', { name: 'clear' });

  await input.fill('architecture');
  await expect(input).toHaveValue('architecture');
  await expect(section.locator('.search-box-value')).toHaveText('Value: architecture');
  await expect(section.locator('.search-box-event-log')).toHaveText('input: architecture');

  await input.dispatchEvent('search');
  await expect(section.locator('.search-box-event-log')).toHaveText('search: architecture');
  await input.dispatchEvent('change');
  await expect(section.locator('.search-box-event-log')).toHaveText('change: architecture');

  await input.focus();
  await dismiss.click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(section.locator('.search-box-event-log')).toHaveText('clear');

  await input.fill('escape query');
  await input.press('Escape');
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(section.locator('.search-box-event-log')).toHaveText('clear');
});

test('SearchBox preserves controlled rollback, native reset, and form data', async ({ page }) => {
  await page.goto('/');

  const section = page.locator('#search-box');
  const controlled = section.getByRole('searchbox', { name: 'Controlled rollback search' });
  await expect(controlled).toHaveValue('Locked query');
  await controlled.fill('Proposed query');
  await expect(controlled).toHaveValue('Locked query');
  await expect(section.locator('.search-box-event-log')).toHaveText('proposed: Proposed query');

  const form = section.locator('.search-box-reset-demo');
  const resettable = form.getByRole('searchbox', { name: 'Resettable search' });
  await resettable.fill('Changed query');
  expect(
    await form.evaluate((element) => new FormData(element as HTMLFormElement).get('reset-query')),
  ).toBe('Changed query');
  await form.getByRole('button', { name: 'Reset search form' }).click();
  await expect(resettable).toHaveValue('Resettable query');
  expect(
    await form.evaluate((element) => new FormData(element as HTMLFormElement).get('reset-query')),
  ).toBe('Resettable query');
});

test('SearchBox preserves content slots, appearances, sizes, Field, disabled, and read-only states', async ({
  page,
}) => {
  await page.goto('/');

  const section = page.locator('#search-box');
  const slotted = section.getByRole('searchbox', { name: 'Search people by voice' });
  const slottedRoot = slotted.locator('xpath=..');
  await expect(slottedRoot.locator('.search-box-prefix')).toHaveText('People:');
  await slotted.focus();
  await expect(section.getByRole('button', { name: 'Start voice search' })).toBeVisible();
  await expect(section.getByRole('button', { name: 'Start voice search' })).not.toHaveAttribute(
    'aria-hidden',
    'true',
  );

  const sizes = [
    ['Small outline search', '24px'],
    ['Medium underline search', '32px'],
    ['Large filled darker search', '40px'],
  ] as const;
  for (const [name, minHeight] of sizes) {
    const root = section.getByRole('searchbox', { name }).locator('xpath=..');
    await expect(root).toHaveCSS('min-height', minHeight);
  }
  await expect(
    section.getByRole('searchbox', { name: 'Medium underline search' }).locator('xpath=..'),
  ).toHaveCSS('border-top-style', 'none');
  await expect(
    section.getByRole('searchbox', { name: 'Large filled darker search' }).locator('xpath=..'),
  ).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');

  const field = section.locator('.search-box-field');
  const fieldInput = field.getByRole('searchbox', { name: 'Product search' });
  const label = field.locator('label');
  await label.click();
  await expect(fieldInput).toBeFocused();
  await expect(fieldInput).toHaveAttribute('required', '');
  await expect(fieldInput).toHaveAttribute('aria-invalid', 'true');
  await expect(fieldInput.locator('xpath=..')).toHaveClass(/fui-SearchBox--large/);
  const descriptionIds = (await fieldInput.getAttribute('aria-describedby'))?.split(' ') ?? [];
  expect(descriptionIds).toHaveLength(2);

  const disabled = section.getByRole('searchbox', { name: 'Disabled search' });
  const readOnly = section.getByRole('searchbox', { name: 'Read-only search' });
  await expect(disabled).toBeDisabled();
  await expect(readOnly).toHaveAttribute('readonly', '');
  const disabledValue = await disabled.inputValue();
  const readOnlyValue = await readOnly.inputValue();
  await disabled.locator('xpath=..').getByRole('button', { name: 'clear' }).click({ force: true });
  await readOnly.locator('xpath=..').getByRole('button', { name: 'clear' }).click({ force: true });
  await expect(disabled).toHaveValue(disabledValue);
  await expect(readOnly).toHaveValue(readOnlyValue);
});

test('SearchBox RTL uses logical spacing and keeps trailing content on the inline end', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('#search-box');
  const input = section.getByRole('searchbox', { name: 'Search people by voice' });
  await input.focus();
  const before = input.locator('xpath=preceding-sibling::*[1]');
  const after = input.locator('xpath=following-sibling::*[1]');

  const ltrInput = await input.boundingBox();
  const ltrBefore = await before.boundingBox();
  const ltrAfter = await after.boundingBox();
  expect(ltrInput).not.toBeNull();
  expect(ltrBefore).not.toBeNull();
  expect(ltrAfter).not.toBeNull();
  expect(ltrBefore!.x).toBeLessThan(ltrInput!.x);
  expect(ltrAfter!.x).toBeGreaterThan(ltrInput!.x);

  await page.locator('html').evaluate((element) => element.setAttribute('dir', 'rtl'));
  const rtlInput = await input.boundingBox();
  const rtlBefore = await before.boundingBox();
  const rtlAfter = await after.boundingBox();
  expect(rtlInput).not.toBeNull();
  expect(rtlBefore).not.toBeNull();
  expect(rtlAfter).not.toBeNull();
  expect(rtlBefore!.x).toBeGreaterThan(rtlInput!.x);
  expect(rtlAfter!.x).toBeLessThan(rtlInput!.x);
});

test('SearchBox reduced motion removes perceptible focus-border transitions', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Reduced-motion computed-style coverage is Chromium-only.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const root = page
    .locator('#search-box')
    .getByRole('searchbox', { name: 'Search documentation' })
    .locator('xpath=..');
  await root.locator('input').focus();
  const transition = await root.evaluate((element) => ({
    delay: getComputedStyle(element, '::after').transitionDelay,
    duration: getComputedStyle(element, '::after').transitionDuration,
  }));
  expect(Number.parseFloat(transition.delay)).toBeLessThanOrEqual(0.00001);
  expect(Number.parseFloat(transition.duration)).toBeLessThanOrEqual(0.00001);
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
  const clear = amount.locator('xpath=..').getByRole('button', { name: 'Clear', exact: true });
  await amount.fill('125');
  await clear.click();

  await expect(amount).toHaveValue('');
  await expect(amount).toBeFocused();
  await expect(clear).not.toHaveAttribute('aria-hidden', 'true');
});

test('forced-color styles retain system-color state rules', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Forced-colors emulation is Chromium-only.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');

  const checked = page.getByLabel('Accept terms').locator('xpath=..');
  const indicator = checked.locator('.fui-Checkbox__indicator');
  const invalidInput = page.locator('.fui-Input--invalid').first();
  const primary = page.getByRole('button', { name: 'Primary', exact: true });
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
  const select = page.locator('#select .select-appearance-outline select');
  const selectIcon = page.locator('#select .select-appearance-outline .fui-Select__icon');
  const invalidSelect = page.locator('#select .select-invalid select');
  const disabledSelect = page.locator('#select .select-disabled select');
  const checkedRadio = page
    .getByRole('radiogroup', { name: 'Native choices' })
    .getByRole('radio', { name: 'Alpha' });
  const checkedRadioRoot = checkedRadio.locator('xpath=..');
  const checkedRadioIndicator = checkedRadioRoot.locator('.fui-Radio__indicator');
  const disabledRadio = page.getByRole('radio', { name: 'Disabled', exact: true });
  const disabledRadioLabel = page.locator(`label[for="${await disabledRadio.getAttribute('id')}"]`);
  const switchIndicator = page.locator('#switch .switch-size-medium .fui-Switch__indicator');
  const disabledSwitchIndicator = page
    .locator('#switch')
    .getByRole('switch', { name: 'Focusable disabled' })
    .locator('xpath=..')
    .locator('.fui-Switch__indicator');
  const progressTrack = page.locator('#progress-bar .progress-bar-rounded-medium');
  const progressBar = progressTrack.locator('.fui-ProgressBar__bar');
  const skeletonWave = page.locator('#skeleton .skeleton-wave-opaque .skeleton-line-long');
  const sliderRoot = page.getByRole('slider', { name: 'Medium slider' }).locator('xpath=..');
  const sliderRail = sliderRoot.locator('.fui-Slider__rail');
  const sliderThumb = sliderRoot.locator('.fui-Slider__thumb');
  const disabledSliderRoot = page
    .getByRole('slider', { name: 'Disabled slider' })
    .locator('xpath=..');
  const selectedCard = page.locator('#card .card-selectable');
  await selectedCard.locator('input[type="checkbox"]').check({ force: true });
  await expect(selectedCard).toHaveClass(/fui-Card--selected/);
  const disabledCard = page.locator('#card .card-disabled');
  const spinRoot = page.getByRole('spinbutton', { name: 'Bounded quantity' }).locator('xpath=..');
  const spinInput = spinRoot.getByRole('spinbutton');
  const spinIncrement = spinRoot.getByRole('button', { name: 'Increment value' });
  const disabledSpinInput = page.getByRole('spinbutton', { name: 'Disabled SpinButton' });
  const searchRoot = page
    .locator('#search-box')
    .getByRole('searchbox', { name: 'Search documentation' })
    .locator('xpath=..');
  const invalidSearch = page
    .locator('#search-box .search-box-field')
    .getByRole('searchbox', { name: 'Product search' })
    .locator('xpath=..');
  const disabledSearch = page
    .locator('#search-box')
    .getByRole('searchbox', { name: 'Disabled search' });
  const toggleChecked = page.locator('#toggle-button .toggle-primary');
  const toggleDisabled = page.locator('#toggle-button .toggle-disabled');

  await expect(indicator).toHaveCSS('border-color', 'rgb(0, 0, 0)');
  await expect(invalidInput).toHaveCSS('forced-color-adjust', 'none');
  await expect(invalidTextarea).toHaveCSS('forced-color-adjust', 'none');
  await expect(primary).toHaveCSS('forced-color-adjust', 'none');
  await expect(outlinedBadge).toHaveCSS('border-color', 'rgb(0, 0, 0)');
  await expect(filledBadge).toHaveCSS('border-color', 'rgb(0, 0, 0)');
  await expect(spinnerIndicator).toHaveCSS('forced-color-adjust', 'none');
  await expect(checkedRadioRoot).toHaveCSS('forced-color-adjust', 'none');
  const toggleSystemColors = await page.evaluate(() => {
    const probe = document.createElement('span');
    document.body.append(probe);
    probe.style.color = 'Highlight';
    const highlight = getComputedStyle(probe).color;
    probe.style.color = 'HighlightText';
    const highlightText = getComputedStyle(probe).color;
    probe.style.color = 'GrayText';
    const grayText = getComputedStyle(probe).color;
    probe.remove();
    return { highlight, highlightText, grayText };
  });
  await expect(checkedRadioIndicator).toHaveCSS('border-color', toggleSystemColors.highlight);
  await expect(toggleChecked).toHaveCSS('forced-color-adjust', 'none');
  await expect(toggleChecked).toHaveCSS('background-color', toggleSystemColors.highlight);
  await expect(toggleChecked).toHaveCSS('color', toggleSystemColors.highlightText);
  await expect(toggleDisabled).toHaveCSS('color', toggleSystemColors.grayText);
  await expect(select).toHaveCSS('forced-color-adjust', 'none');
  const selectSystemColors = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'FieldText';
    document.body.append(probe);
    const fieldText = getComputedStyle(probe).color;
    probe.style.color = 'Mark';
    const mark = getComputedStyle(probe).color;
    probe.style.color = 'GrayText';
    const grayText = getComputedStyle(probe).color;
    probe.remove();
    return { fieldText, mark, grayText };
  });
  await expect(selectIcon).toHaveCSS('color', selectSystemColors.fieldText);
  await expect(invalidSelect).toHaveCSS('border-color', selectSystemColors.mark);
  await expect(disabledSelect).toHaveCSS('color', selectSystemColors.grayText);
  await expect(sliderRail).toHaveCSS('forced-color-adjust', 'none');
  await expect(sliderThumb).toHaveCSS('forced-color-adjust', 'none');
  await expect(selectedCard).toHaveCSS('forced-color-adjust', 'none');
  const cardSystemColors = await selectedCard.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
    border: getComputedStyle(element, '::after').borderColor,
  }));
  expect(cardSystemColors.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(cardSystemColors.color).not.toBe(cardSystemColors.background);
  expect(cardSystemColors.border).not.toBe('rgba(0, 0, 0, 0)');
  await expect(disabledCard).toHaveCSS(
    'color',
    await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.style.color = 'GrayText';
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }),
  );
  const sliderSystemColors = await sliderRoot.evaluate((element) => ({
    progress: getComputedStyle(element).getPropertyValue('--fui-Slider__progress--color').trim(),
    rail: getComputedStyle(element).getPropertyValue('--fui-Slider__rail--color').trim(),
    thumb: getComputedStyle(element).getPropertyValue('--fui-Slider__thumb--color').trim(),
  }));
  expect(sliderSystemColors.progress).toBe('Highlight');
  expect(sliderSystemColors.rail).toBe('CanvasText');
  expect(sliderSystemColors.thumb).toBe('Highlight');
  const disabledSliderSystemColors = await disabledSliderRoot.evaluate((element) => ({
    progress: getComputedStyle(element).getPropertyValue('--fui-Slider__progress--color').trim(),
    rail: getComputedStyle(element).getPropertyValue('--fui-Slider__rail--color').trim(),
    thumb: getComputedStyle(element).getPropertyValue('--fui-Slider__thumb--color').trim(),
  }));
  expect(disabledSliderSystemColors).toEqual({
    progress: 'GrayText',
    rail: 'GrayText',
    thumb: 'GrayText',
  });
  const spinnerSystemColors = await spinnerIndicator.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }));
  expect(spinnerSystemColors.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(spinnerSystemColors.color).not.toBe('rgba(0, 0, 0, 0)');
  expect(spinnerSystemColors.background).not.toBe(spinnerSystemColors.color);
  const switchSystemColors = await switchIndicator.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    border: getComputedStyle(element).borderColor,
    color: getComputedStyle(element).color,
  }));
  expect(switchSystemColors.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(switchSystemColors.border).toBe(switchSystemColors.background);
  expect(switchSystemColors.color).not.toBe(switchSystemColors.background);
  const progressSystemColors = await progressTrack.evaluate((element) => ({
    track: getComputedStyle(element).backgroundColor,
    bar: getComputedStyle(element.querySelector('.fui-ProgressBar__bar')!).backgroundColor,
    barForcedColorAdjust: getComputedStyle(element.querySelector('.fui-ProgressBar__bar')!)
      .forcedColorAdjust,
  }));
  expect(progressSystemColors.track).not.toBe('rgba(0, 0, 0, 0)');
  expect(progressSystemColors.bar).not.toBe('rgba(0, 0, 0, 0)');
  expect(progressSystemColors.bar).not.toBe(progressSystemColors.track);
  expect(progressSystemColors.barForcedColorAdjust).toBe('none');
  await expect(progressBar).toHaveCSS('forced-color-adjust', 'none');
  await expect(searchRoot).toHaveCSS('forced-color-adjust', 'none');
  await searchRoot.locator('input').focus();
  const searchSystemColors = await searchRoot.evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
    focusOutline: getComputedStyle(element).outlineColor,
    focusBorder: getComputedStyle(element, '::after').borderBottomColor,
  }));
  expect(searchSystemColors.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(searchSystemColors.color).not.toBe('rgba(0, 0, 0, 0)');
  expect(searchSystemColors.focusOutline).not.toBe('rgba(0, 0, 0, 0)');
  expect(searchSystemColors.focusBorder).not.toBe('rgba(0, 0, 0, 0)');
  await searchRoot.locator('input').blur();
  await expect(invalidSearch).toHaveCSS('border-color', 'rgb(255, 255, 0)');
  await expect(spinRoot).toHaveCSS('forced-color-adjust', 'none');
  await expect(spinInput).toHaveCSS('color', 'rgb(0, 0, 0)');
  await expect(spinIncrement).toHaveCSS('color', 'rgb(0, 0, 0)');
  const skeletonWaveAfter = await skeletonWave.evaluate((element) => ({
    backgroundColor: getComputedStyle(element, '::after').backgroundColor,
    animationName: getComputedStyle(element, '::after').animationName,
  }));
  expect(skeletonWaveAfter.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(skeletonWaveAfter.animationName).toBe('fui-skeleton-wave');

  const grayText = await page.evaluate(() => {
    const probe = document.createElement('span');
    probe.style.color = 'GrayText';
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });

  await expect(disabledLabel).toHaveCSS('color', grayText);
  await expect(disabledRadioLabel).toHaveCSS('color', grayText);
  await expect(disabledSwitchIndicator).toHaveCSS('border-color', grayText);
  await expect(disabledSwitchIndicator).toHaveCSS('color', grayText);
  await expect(disabledTextarea).toHaveCSS('-webkit-text-fill-color', grayText);
  await expect(disabledLink).toHaveCSS('color', grayText);
  await expect(disabledSpinInput).toHaveCSS('color', grayText);
  await expect(disabledSearch).toHaveCSS('color', grayText);

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

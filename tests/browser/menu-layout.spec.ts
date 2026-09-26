import { expect, test } from '@playwright/test';

for (const direction of ['ltr', 'rtl'] as const) {
  test(`Menu selectable spacing and keyboard behavior in local ${direction}`, async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#menu');
    await section.evaluate((element, dir) => element.setAttribute('dir', dir), direction);
    const trigger = section.getByRole('button', { name: 'Choose view', exact: true });
    await trigger.click();
    const menu = page.getByRole('menu', { name: 'View preferences' });
    const surface = menu.locator('..');
    await expect(surface).toHaveAttribute('dir', direction);
    await expect(menu).toHaveCSS('direction', direction);
    await expect(menu.locator('.fui-MenuItem__icon')).toHaveCount(0);
    for (const width of [180, 300]) {
      await surface.evaluate((element, size) => {
        element.style.width = `${size}px`;
      }, width);
      await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      const rows = await menu.locator('.fui-MenuItem').evaluateAll((items) =>
        items.map((item) => {
          const check = item.querySelector('.fui-MenuItem__checkmark')!.getBoundingClientRect();
          const content = item.querySelector('.fui-MenuItem__content')!;
          const box = content.getBoundingClientRect();
          const style = getComputedStyle(content);
          const rtl = style.direction === 'rtl';
          return {
            gap:
              (rtl ? check.left - box.right : box.left - check.right) +
              parseFloat(style.paddingInlineStart),
            checkWidth: check.width,
            aligned: Math.abs((check.top + check.bottom - box.top - box.bottom) / 2) < 1,
            overflow: item.scrollWidth > item.clientWidth,
            start: rtl ? box.right : box.left,
          };
        }),
      );
      for (const row of rows) {
        expect(row.gap).toBeCloseTo(6, 1);
        expect(row.checkWidth).toBe(16);
        expect(row.aligned).toBe(true);
        expect(row.overflow).toBe(false);
        expect(row.start).toBeCloseTo(rows[0]!.start, 1);
      }
      const triggerBox = await trigger.boundingBox();
      const surfaceBox = await surface.boundingBox();
      expect(direction === 'rtl' ? surfaceBox!.x + surfaceBox!.width : surfaceBox!.x).toBeCloseTo(
        direction === 'rtl' ? triggerBox!.x + triggerBox!.width : triggerBox!.x,
        0,
      );
    }
    await expect(menu.getByRole('menuitemcheckbox', { name: 'Show status' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    const owner = menu.getByRole('menuitemcheckbox', { name: 'Show owner' });
    await expect(owner).toBeFocused();
    await page.keyboard.press('Space');
    await expect(owner).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await expect(menu.getByRole('menuitemradio', { name: 'Name', exact: true })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(menu).toHaveCount(0);
    const opposite = direction === 'rtl' ? 'ltr' : 'rtl';
    await section.evaluate((element, dir) => element.setAttribute('dir', dir), opposite);
    await trigger.click();
    await expect(surface).toHaveAttribute('dir', opposite);
  });

  test(`Menu selectable icons and secondary content remain on one row in ${direction}`, async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .locator('#menu')
      .evaluate((element, dir) => element.setAttribute('dir', dir), direction);
    await page.getByRole('button', { name: 'Choose display options' }).click();
    const menu = page.getByRole('menu', { name: 'Display options' });
    await expect(menu).toHaveCSS('direction', direction);
    await expect(menu.locator('.fui-MenuItem__icon')).toHaveCount(4);
    await expect(menu.locator('.fui-MenuItem__secondary')).toHaveCount(3);
    const rows = await menu.locator('.fui-MenuItem').evaluateAll((items) =>
      items.map((item) => {
        const check = item.querySelector('.fui-MenuItem__checkmark')!.getBoundingClientRect();
        const icon = item.querySelector('.fui-MenuItem__icon')!.getBoundingClientRect();
        const content = item.querySelector('.fui-MenuItem__content')!;
        const label = content.getBoundingClientRect();
        const secondary = item.querySelector('.fui-MenuItem__secondary')?.getBoundingClientRect();
        const rtl = getComputedStyle(item).direction === 'rtl';
        return {
          checkGap: rtl ? check.left - icon.right : icon.left - check.right,
          labelGap: rtl ? icon.left - label.right : label.left - icon.right,
          secondaryAfter:
            !secondary || (rtl ? secondary.right <= label.left : secondary.left >= label.right),
          secondaryAligned:
            !secondary ||
            Math.abs((secondary.top + secondary.bottom - label.top - label.bottom) / 2) < 1,
          overflow: item.scrollWidth > item.clientWidth,
          truncated: content.scrollWidth > content.clientWidth,
          start: rtl ? label.right : label.left,
        };
      }),
    );
    for (const row of rows) {
      expect(row.checkGap).toBeCloseTo(4, 1);
      expect(row.labelGap).toBeCloseTo(4, 1);
      expect(row.secondaryAfter).toBe(true);
      expect(row.secondaryAligned).toBe(true);
      expect(row.overflow).toBe(false);
      expect(row.start).toBeCloseTo(rows[0]!.start, 1);
    }
    expect(rows[2]!.truncated).toBe(true);
    const notifications = menu.getByRole('menuitemcheckbox', { name: /Notifications/ });
    await notifications.click();
    await expect(notifications).toHaveAttribute('aria-checked', 'true');
  });
}

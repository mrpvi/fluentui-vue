// @vitest-environment happy-dom

import { createSSRApp, nextTick } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SsrFixture } from './SsrFixture';

describe('hydration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('hydrates generated IDs, delayed spinner markup, and interactive controls without warnings', async () => {
    const html = await renderToString(createSSRApp(SsrFixture));
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);

    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const app = createSSRApp(SsrFixture);

    app.mount(container);
    await nextTick();

    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(container.querySelector('label[for^="fui-field-"]')).not.toBeNull();
    expect(container.querySelector('input[aria-describedby]')).not.toBeNull();

    const switches = [...container.querySelectorAll<HTMLInputElement>('input[role="switch"]')];
    expect(switches).toHaveLength(2);
    expect(switches[0]?.checked).toBe(true);
    expect(switches[0]?.name).toBe('server-switch');
    expect(switches[0]?.value).toBe('enabled');
    expect(container.querySelector('.ssr-switch label')?.getAttribute('for')).toBe(switches[0]?.id);
    expect(switches[1]?.required).toBe(true);
    expect(switches[1]?.getAttribute('aria-describedby')).not.toBeNull();
    expect(container.querySelector('.ssr-field-switch')?.classList.contains('fui-Switch')).toBe(
      true,
    );

    switches[0]?.click();
    await nextTick();
    expect(switches[0]?.checked).toBe(false);

    const radioGroup = container.querySelector<HTMLElement>('.ssr-radio-group');
    expect(radioGroup).not.toBeNull();
    const radios = [...radioGroup!.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
    expect(radios).toHaveLength(2);
    expect(radios[0]?.checked).toBe(true);
    expect(radios[1]?.checked).toBe(false);
    expect(radios[0]?.name).toBeTruthy();
    expect(radios[1]?.name).toBe(radios[0]?.name);
    for (const radio of radios) {
      expect(radio.id).toMatch(/^fui-radio-/);
      expect(radioGroup?.querySelector(`label[for="${radio.id}"]`)).not.toBeNull();
    }

    const select = container.querySelector<HTMLSelectElement>('select[name="companion"]');
    expect(select).not.toBeNull();
    expect(select?.value).toBe('dog');
    expect(select?.required).toBe(true);
    expect(select?.getAttribute('aria-describedby')).not.toBeNull();
    expect(select?.closest('.fui-Select')?.querySelector('.fui-Select__icon')).not.toBeNull();

    const dividers = [...container.querySelectorAll<HTMLElement>('[role="separator"]')];
    expect(dividers).toHaveLength(3);
    expect(dividers[0]?.getAttribute('aria-labelledby')).toBeNull();
    expect(dividers[0]?.getAttribute('aria-label')).toBe('Contentless boundary');
    expect(dividers[1]?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(dividers[2]?.getAttribute('aria-orientation')).toBe('vertical');

    for (const divider of dividers.slice(1)) {
      const content = divider.querySelector<HTMLElement>('.fui-Divider__wrapper');
      expect(content).not.toBeNull();
      expect(divider.getAttribute('aria-labelledby')).toBe(content?.id);
    }

    const sliders = [...container.querySelectorAll<HTMLInputElement>('input[type="range"]')];
    expect(sliders).toHaveLength(2);
    expect(sliders[0]?.valueAsNumber).toBe(0.3);
    expect(sliders[0]?.getAttribute('aria-label')).toBe('Server volume');
    expect(sliders[0]?.closest('.fui-Slider')?.getAttribute('style')).toContain(
      '--fui-Slider--progress:80%',
    );
    expect(sliders[1]?.getAttribute('orient')).toBe('vertical');
    expect(sliders[1]?.getAttribute('aria-invalid')).toBe('true');
    expect(sliders[1]?.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(container.querySelector('label[for="' + sliders[1]?.id + '"]')).not.toBeNull();

    const spinners = [...container.querySelectorAll<HTMLElement>('.fui-Spinner')];
    expect(spinners).toHaveLength(2);
    expect(spinners[0]?.querySelector('.fui-Spinner__spinner')).not.toBeNull();
    expect(spinners[0]?.getAttribute('aria-labelledby')).toBe(
      spinners[0]?.querySelector<HTMLElement>('.fui-Spinner__label')?.id,
    );

    const progressBars = [...container.querySelectorAll<HTMLElement>('.fui-ProgressBar')];
    expect(progressBars).toHaveLength(3);
    const determinateProgress = container.querySelector<HTMLElement>('.ssr-determinate-progress');
    expect(determinateProgress?.getAttribute('aria-valuemin')).toBe('0');
    expect(determinateProgress?.getAttribute('aria-valuemax')).toBe('100');
    expect(determinateProgress?.getAttribute('aria-valuenow')).toBe('36');
    expect(
      determinateProgress?.querySelector<HTMLElement>('.fui-ProgressBar__bar')?.style.width,
    ).toBe('36%');

    const indeterminateProgress = container.querySelector<HTMLElement>(
      '.ssr-indeterminate-progress',
    );
    expect(indeterminateProgress?.getAttribute('aria-valuemin')).toBeNull();
    expect(indeterminateProgress?.getAttribute('aria-valuemax')).toBeNull();
    expect(indeterminateProgress?.getAttribute('aria-valuenow')).toBeNull();
    expect(indeterminateProgress?.querySelector('.fui-ProgressBar__indeterminateMotion')).not.toBe(
      null,
    );

    const fieldProgress = container.querySelector<HTMLElement>('.ssr-field-progress');
    expect(fieldProgress?.getAttribute('aria-labelledby')).toBe(
      fieldProgress?.closest('.fui-Field')?.querySelector<HTMLElement>('label')?.id,
    );
    expect(fieldProgress?.getAttribute('aria-describedby')).toBe(
      [
        fieldProgress
          ?.closest('.fui-Field')
          ?.querySelector<HTMLElement>('.fui-Field__validationMessage')?.id,
        fieldProgress?.closest('.fui-Field')?.querySelector<HTMLElement>('.fui-Field__hint')?.id,
      ].join(' '),
    );
    expect(fieldProgress?.querySelector('.fui-ProgressBar__bar--warning')).not.toBeNull();

    const skeleton = container.querySelector<HTMLElement>('.ssr-skeleton');
    expect(skeleton?.getAttribute('role')).toBe('progressbar');
    expect(skeleton?.getAttribute('aria-busy')).toBe('true');
    expect(skeleton?.querySelector('.ssr-skeleton-item')?.tagName).toBe('SPAN');
    expect(skeleton?.querySelector('.ssr-skeleton-item')?.className).toContain(
      'fui-SkeletonItem--pulse',
    );
    expect(skeleton?.querySelector('.ssr-skeleton-item')?.className).toContain(
      'fui-SkeletonItem--translucent',
    );
    expect(skeleton?.querySelector('.ssr-skeleton-item')?.className).toContain(
      'fui-SkeletonItem--size-24',
    );
    expect(skeleton?.querySelector('.ssr-skeleton-item')?.className).toContain(
      'fui-SkeletonItem--circle',
    );

    const skeletonStatus = container.querySelector<HTMLElement>('.ssr-skeleton-status');
    expect(skeletonStatus?.tagName).toBe('SPAN');
    expect(skeletonStatus?.getAttribute('role')).toBe('status');
    expect(skeletonStatus?.getAttribute('aria-busy')).toBe('false');
    expect(skeletonStatus?.style.width).toBe('180px');

    const card = container.querySelector<HTMLElement>('.ssr-card');
    const cardCheckbox = card?.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(card?.getAttribute('role')).toBe('group');
    expect(cardCheckbox?.checked).toBe(true);
    expect(cardCheckbox?.name).toBe('server-card');
    expect(cardCheckbox?.value).toBe('report');
    expect(cardCheckbox?.getAttribute('aria-labelledby')).toBe('server-card-title');
    expect(card?.querySelector('.fui-CardPreview')).not.toBeNull();
    expect(card?.querySelector('.fui-CardHeader')).not.toBeNull();
    expect(card?.querySelector('.fui-CardFooter')).not.toBeNull();
    card?.click();
    await nextTick();
    expect(cardCheckbox?.checked).toBe(false);
    expect(container.querySelector('.ssr-article-card')?.tagName).toBe('ARTICLE');

    const spinButtons = [...container.querySelectorAll<HTMLElement>('.fui-SpinButton')];
    expect(spinButtons).toHaveLength(3);
    const serverQuantity = container.querySelector<HTMLInputElement>('.ssr-spin-button input');
    expect(serverQuantity?.value).toBe('2');
    expect(serverQuantity?.getAttribute('aria-valuemin')).toBe('0');
    expect(serverQuantity?.getAttribute('aria-valuemax')).toBe('10');
    expect(serverQuantity?.getAttribute('aria-valuenow')).toBe('2');
    const serverPrice = container.querySelector<HTMLInputElement>(
      '.ssr-formatted-spin-button input',
    );
    expect(serverPrice?.value).toBe('$3.00');
    expect(serverPrice?.getAttribute('aria-valuetext')).toBe('$3.00');
    const fieldSpinButton = container.querySelector<HTMLInputElement>(
      '.ssr-field-spin-button input',
    );
    expect(fieldSpinButton?.required).toBe(true);
    expect(fieldSpinButton?.id).toBe(
      fieldSpinButton?.closest('.fui-Field')?.querySelector<HTMLLabelElement>('label')?.htmlFor,
    );
    expect(fieldSpinButton?.getAttribute('aria-describedby')).toBe(
      fieldSpinButton?.closest('.fui-Field')?.querySelector<HTMLElement>('.fui-Field__hint')?.id,
    );

    const delayedSpinner = container.querySelector<HTMLElement>('.ssr-delayed-spinner');
    expect(delayedSpinner).not.toBeNull();
    expect(delayedSpinner?.children).toHaveLength(0);
    expect(delayedSpinner?.getAttribute('aria-labelledby')).toMatch(/^fui-spinner-.+__label$/);

    await vi.advanceTimersByTimeAsync(999);
    expect(delayedSpinner?.children).toHaveLength(0);
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await nextTick();
    const delayedLabel = delayedSpinner?.querySelector<HTMLElement>('.fui-Spinner__label');
    expect(delayedSpinner?.querySelector('.fui-Spinner__spinner')).not.toBeNull();
    expect(delayedLabel?.textContent).toBe('Delayed server loading');
    expect(delayedSpinner?.getAttribute('aria-labelledby')).toBe(delayedLabel?.id);
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    app.unmount();
    warning.mockRestore();
    error.mockRestore();
    container.remove();
  });
});

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

    const spinners = [...container.querySelectorAll<HTMLElement>('[role="progressbar"]')];
    expect(spinners).toHaveLength(2);
    expect(spinners[0]?.querySelector('.fui-Spinner__spinner')).not.toBeNull();
    expect(spinners[0]?.getAttribute('aria-labelledby')).toBe(
      spinners[0]?.querySelector<HTMLElement>('.fui-Spinner__label')?.id,
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

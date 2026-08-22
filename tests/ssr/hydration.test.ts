// @vitest-environment happy-dom

import { createSSRApp, nextTick } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it, vi } from 'vitest';
import { SsrFixture } from './SsrFixture';

describe('hydration', () => {
  it('hydrates generated IDs and interactive controls without warnings', async () => {
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

    app.unmount();
    warning.mockRestore();
    error.mockRestore();
    container.remove();
  });
});

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

    app.unmount();
    warning.mockRestore();
    error.mockRestore();
    container.remove();
  });
});

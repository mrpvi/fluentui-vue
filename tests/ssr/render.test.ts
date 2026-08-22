import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { describe, expect, it } from 'vitest';
import { SsrFixture } from './SsrFixture';

describe('SSR rendering', () => {
  it('renders deterministic semantic markup with generated relationships', async () => {
    const firstRender = await renderToString(createSSRApp(SsrFixture));
    const secondRender = await renderToString(createSSRApp(SsrFixture));

    expect(firstRender).toBe(secondRender);
    expect(firstRender).toContain('<h1');
    expect(firstRender).toContain('type="email"');
    expect(firstRender).toContain('aria-describedby=');
    expect(firstRender).toContain('required');
    expect(firstRender).toContain('type="checkbox"');
    expect(firstRender).toContain('href="#details"');
  });
});

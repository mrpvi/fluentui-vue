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
    expect(firstRender).toContain('alt="SSR image"');
    expect(firstRender).toContain('fui-Image--fit-cover');
    expect(firstRender).toContain('fui-Image--shape-rounded');
    expect(firstRender).not.toContain('fui-Image--fit-fill');
    expect(firstRender).toContain('aria-label="Contentless boundary"');
    expect(firstRender).toMatch(
      /role="separator" aria-orientation="horizontal" aria-labelledby="(fui-divider-[^"]+__content)"><div id="\1" class="fui-Divider__wrapper"><!--\[-->Server section<!--\]--><\/div>/,
    );
    expect(firstRender).toMatch(
      /role="separator" aria-orientation="vertical" aria-labelledby="(fui-divider-[^"]+__content)"><div id="\1" class="fui-Divider__wrapper"><!--\[-->Vertical section<!--\]--><\/div>/,
    );
  });
});

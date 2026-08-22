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
    expect(firstRender).toContain('fui-Badge--tint');
    expect(firstRender).toContain('fui-Badge--success');
    expect(firstRender).toContain('99+');
    expect(firstRender).toContain('aria-label="away out of office"');
    expect(firstRender).toContain('fui-PresenceBadge--size-large');
    expect(firstRender).toContain('fui-Spinner--size-large');
    expect(firstRender).toMatch(
      /role="progressbar" aria-labelledby="(fui-spinner-[^"]+__label)"><span id="\1" class="fui-Spinner__label">.*Server loading.*<\/span><span class="fui-Spinner__spinner" aria-hidden="true">.*<span class="fui-Spinner__spinnerTail"><\/span>.*<\/span>/,
    );
    expect(firstRender).toMatch(
      /class="fui-Spinner fui-Spinner--primary fui-Spinner--size-medium fui-Spinner--label-after ssr-delayed-spinner" style="" role="progressbar" aria-labelledby="fui-spinner-[^"]+__label"><!--v-if--><!--v-if--><!--v-if--><\/div>/,
    );
    const delayedMarkup = firstRender.match(
      /<div class="[^"]*ssr-delayed-spinner[\s\S]*?<\/div>/,
    )?.[0];
    expect(delayedMarkup).not.toContain('fui-Spinner__spinner');
    expect(delayedMarkup).not.toContain('fui-Spinner__label');
    expect(firstRender).toMatch(
      /role="separator" aria-orientation="horizontal" aria-labelledby="(fui-divider-[^"]+__content)"><div id="\1" class="fui-Divider__wrapper"><!--\[-->Server section<!--\]--><\/div>/,
    );
    expect(firstRender).toMatch(
      /role="separator" aria-orientation="vertical" aria-labelledby="(fui-divider-[^"]+__content)"><div id="\1" class="fui-Divider__wrapper"><!--\[-->Vertical section<!--\]--><\/div>/,
    );
  });
});

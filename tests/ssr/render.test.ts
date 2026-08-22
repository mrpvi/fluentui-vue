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
    expect(firstRender).toContain('role="switch"');
    expect(firstRender).toContain('name="server-switch"');
    expect(firstRender).toContain('value="enabled"');
    expect(firstRender).toContain('fui-Switch--checked');
    expect(firstRender).toMatch(
      /class="fui-Switch[^"]*ssr-switch[^"]*"[^>]*><input[^>]*id="(fui-switch-[^"]+)"[^>]*checked[^>]*><label[^>]*for="\1"[^>]*>.*Server switch.*<\/label><div[^>]*aria-hidden="true"/,
    );
    expect(firstRender).toMatch(
      /<label[^>]*for="(fui-field-[^"]+)"[^>]*>.*Server field switch.*<\/label>[\s\S]*?<input(?=[^>]*id="\1")(?=[^>]*role="switch")(?=[^>]*required)(?=[^>]*aria-describedby="[^"]+")[^>]*>/,
    );
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
    expect(firstRender).toMatch(
      /aria-label="Server progress" class="fui-ProgressBar fui-ProgressBar--rounded fui-ProgressBar--large ssr-determinate-progress"[^>]*role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="36"><div class="fui-ProgressBar__bar fui-ProgressBar__bar--brand fui-ProgressBar__bar--determinate-transition" style="width:36%;"><\/div><\/div>/,
    );
    expect(firstRender).toMatch(
      /aria-label="Server indeterminate progress" class="fui-ProgressBar fui-ProgressBar--rounded fui-ProgressBar--medium ssr-indeterminate-progress"[^>]*role="progressbar"><div class="fui-ProgressBar__indeterminateMotion"><div class="fui-ProgressBar__bar fui-ProgressBar__bar--indeterminate"><\/div><\/div><\/div>/,
    );
    expect(firstRender).toContain('fui-ProgressBar__bar--warning');
    expect(firstRender).toMatch(
      /class="fui-Slider fui-Slider--medium fui-Slider--horizontal ssr-slider" style="--fui-Slider--progress:80%;--fui-Slider--steps-percent:10%;"><input aria-label="Server volume" id="fui-slider-[^"]+" class="fui-Slider__input" type="range" min="-0.5" max="0.5" step="0.1" value="0.3">/,
    );
    expect(firstRender).toMatch(
      /class="fui-Slider fui-Slider--small fui-Slider--vertical fui-Slider--invalid ssr-field-slider" style="--fui-Slider--progress:0%;--fui-Slider--steps-percent:1%;"><input aria-describedby="[^"]+" aria-invalid="true" id="(fui-field-[^"]+)" class="fui-Slider__input" type="range" min="0" max="100" step="1" orient="vertical" value="0">/,
    );
    expect(firstRender).toMatch(
      /aria-label="Server skeleton" class="fui-Skeleton ssr-skeleton" style="" role="progressbar" aria-busy="true"><!--\[--><span class="fui-SkeletonItem fui-SkeletonItem--pulse fui-SkeletonItem--translucent fui-SkeletonItem--size-24 fui-SkeletonItem--circle ssr-skeleton-item" style=""><!--\[--><!--\]--><\/span><!--\]--><\/div>/,
    );
    expect(firstRender).toMatch(
      /aria-label="Server skeleton status" class="fui-Skeleton ssr-skeleton-status" style="width:180px;" role="status" aria-busy="false"><!--\[--><div class="fui-SkeletonItem fui-SkeletonItem--wave fui-SkeletonItem--opaque fui-SkeletonItem--size-16 fui-SkeletonItem--rectangle" style=""><!--\[--><!--\]--><\/div><!--\]--><\/span>/,
    );
    expect(firstRender).toMatch(
      /id="fui-field-[^"]+__control" aria-labelledby="fui-field-[^"]+__label" aria-describedby="fui-field-[^"]+__validation-message fui-field-[^"]+__hint" class="fui-ProgressBar fui-ProgressBar--rounded fui-ProgressBar--medium ssr-field-progress"[^>]*role="progressbar" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0.75">/,
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
    expect(firstRender).toMatch(
      /class="fui-Card fui-Card--filled fui-Card--vertical fui-Card--medium fui-Card--interactive fui-Card--selectable fui-Card--selected ssr-card"[^>]*role="group"[^>]*><input class="fui-Card__checkbox" type="checkbox" checked[^>]*name="server-card" value="report"/,
    );
    expect(firstRender).toContain('class="fui-CardPreview"');
    expect(firstRender).toContain('class="fui-CardHeader"');
    expect(firstRender).toContain('class="fui-CardFooter"');
    expect(firstRender).toMatch(
      /<article(?=[^>]*aria-label="Server article")(?=[^>]*class="fui-Card[^>]*ssr-article-card")[^>]*>/,
    );
  });
});

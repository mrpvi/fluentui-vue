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

    const toggleButton = container.querySelector<HTMLButtonElement>('.ssr-toggle-button');
    expect(toggleButton?.type).toBe('button');
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('true');
    const hydratedToggle = toggleButton;
    toggleButton?.click();
    await nextTick();
    expect(toggleButton?.getAttribute('aria-pressed')).toBe('false');
    expect(container.querySelector('.ssr-toggle-button')).toBe(hydratedToggle);

    const compoundButton = container.querySelector<HTMLButtonElement>('.ssr-compound-button');
    expect(compoundButton?.type).toBe('button');
    expect(compoundButton?.textContent).toContain('Server compound action');
    expect(compoundButton?.textContent).toContain('Server secondary content');
    expect(
      compoundButton?.querySelector('.fui-CompoundButton__icon')?.getAttribute('aria-hidden'),
    ).toBe('true');
    const compoundLink = container.querySelector<HTMLAnchorElement>('.ssr-compound-link');
    expect(compoundLink?.href).toContain('#compound-details');
    expect(compoundLink?.getAttribute('role')).toBeNull();

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

    const searchBoxes = [...container.querySelectorAll<HTMLElement>('.fui-SearchBox')];
    expect(searchBoxes).toHaveLength(2);
    const standaloneSearch = container.querySelector<HTMLElement>('.ssr-search-box');
    const standaloneSearchInput = standaloneSearch?.querySelector<HTMLInputElement>('input');
    expect(standaloneSearchInput?.type).toBe('search');
    expect(standaloneSearchInput?.value).toBe('Server query');
    expect(standaloneSearch?.querySelector('[role="button"]')?.getAttribute('tabindex')).toBe('-1');

    const fieldSearch = container.querySelector<HTMLElement>('.ssr-field-search-box');
    const fieldSearchInput = fieldSearch?.querySelector<HTMLInputElement>('input');
    expect(fieldSearch?.classList.contains('fui-SearchBox--large')).toBe(true);
    expect(fieldSearchInput?.id).toBe(
      fieldSearch?.closest('.fui-Field')?.querySelector<HTMLLabelElement>('label')?.htmlFor,
    );
    expect(fieldSearchInput?.getAttribute('aria-describedby')).toBe(
      fieldSearch?.closest('.fui-Field')?.querySelector<HTMLElement>('.fui-Field__hint')?.id,
    );

    fieldSearchInput!.value = 'Hydrated query';
    fieldSearchInput!.dispatchEvent(new Event('input', { bubbles: true }));
    await nextTick();
    expect(fieldSearchInput?.value).toBe('Hydrated query');
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

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

    const rating = container.querySelector<HTMLElement>('.ssr-rating');
    expect(rating?.getAttribute('role')).toBe('radiogroup');
    expect(rating?.querySelectorAll('input[type="radio"]')).toHaveLength(10);
    expect(
      [...(rating?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? [])]
        .filter((input) => input.checked)
        .map((input) => input.value),
    ).toEqual(['2.5']);

    const fieldRating = container.querySelector<HTMLElement>('.ssr-field-rating');
    expect(fieldRating?.getAttribute('aria-labelledby')).toBe(
      fieldRating?.closest('.fui-Field')?.querySelector<HTMLElement>('label')?.id,
    );
    expect(fieldRating?.getAttribute('aria-describedby')).toBe(
      fieldRating?.closest('.fui-Field')?.querySelector<HTMLElement>('.fui-Field__hint')?.id,
    );
    expect(fieldRating?.getAttribute('aria-required')).toBe('true');
    expect(fieldRating?.querySelector<HTMLInputElement>('input')?.required).toBe(true);

    const readOnlyRating = container.querySelector<HTMLElement>('.ssr-readonly-rating');
    expect(readOnlyRating?.getAttribute('aria-readonly')).toBe('true');
    expect(readOnlyRating?.querySelectorAll('input')).toHaveLength(0);
    const disabledRating = container.querySelector<HTMLElement>('.ssr-disabled-rating');
    expect(disabledRating?.getAttribute('aria-disabled')).toBe('true');
    expect(disabledRating?.querySelector<HTMLInputElement>('input')?.disabled).toBe(true);

    const ratingDisplay = container.querySelector<HTMLElement>('.ssr-rating-display');
    expect(ratingDisplay?.getAttribute('role')).toBe('img');
    expect(ratingDisplay?.getAttribute('aria-label')).toBe('Server rating display');
    expect(ratingDisplay?.querySelector('.fui-RatingDisplay__valueText')?.textContent).toBe('4.5');
    expect(ratingDisplay?.querySelector('.fui-RatingDisplay__countText')?.textContent).toBe(
      '1,160',
    );
    expect(ratingDisplay?.querySelectorAll('.fui-RatingItem')).toHaveLength(5);

    const compactRatingDisplay = container.querySelector<HTMLElement>(
      '.ssr-compact-rating-display',
    );
    expect(compactRatingDisplay?.querySelectorAll('.fui-RatingItem')).toHaveLength(1);
    expect(compactRatingDisplay?.querySelector('.fui-RatingItem')?.className).toContain(
      'fui-RatingItem--marigold',
    );

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

    const singleListbox = container.querySelector<HTMLElement>('.ssr-listbox');
    expect(singleListbox?.getAttribute('role')).toBe('listbox');
    expect(singleListbox?.getAttribute('tabindex')).toBe('0');
    expect(singleListbox?.getAttribute('aria-required')).toBe('true');
    expect(singleListbox?.getAttribute('aria-labelledby')).toBe(
      singleListbox?.closest('.fui-Field')?.querySelector<HTMLElement>('label')?.id,
    );
    expect(singleListbox?.getAttribute('aria-describedby')).toBe(
      singleListbox?.closest('.fui-Field')?.querySelector<HTMLElement>('.fui-Field__hint')?.id,
    );
    const singleOptions = [
      ...(singleListbox?.querySelectorAll<HTMLElement>('[role="option"]') ?? []),
    ];
    expect(singleOptions).toHaveLength(2);
    expect(singleOptions[0]?.id).toMatch(/^fui-option-/);
    expect(singleOptions[0]?.getAttribute('aria-selected')).toBe('true');
    expect(singleOptions[1]?.getAttribute('aria-disabled')).toBe('true');
    expect(singleListbox?.getAttribute('aria-activedescendant')).toBe(singleOptions[0]?.id);
    const optionGroup = singleListbox?.querySelector<HTMLElement>('[role="group"]');
    expect(optionGroup?.getAttribute('aria-labelledby')).toBe(
      optionGroup?.querySelector<HTMLElement>('.fui-OptionGroup__label')?.id,
    );

    singleListbox?.focus();
    singleListbox?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
    singleListbox?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    await nextTick();
    expect(singleListbox?.getAttribute('aria-activedescendant')).toBe(singleOptions[1]?.id);
    expect(singleOptions[0]?.getAttribute('aria-selected')).toBe('true');
    expect(singleOptions[1]?.getAttribute('aria-selected')).toBe('false');

    const multiselectListbox = container.querySelector<HTMLElement>('.ssr-multiselect-listbox');
    expect(multiselectListbox?.getAttribute('role')).toBe('menu');
    expect(multiselectListbox?.getAttribute('aria-multiselectable')).toBeNull();
    const multiselectOptions = [
      ...(multiselectListbox?.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]') ?? []),
    ];
    expect(multiselectOptions).toHaveLength(2);
    expect(multiselectOptions[0]?.getAttribute('aria-checked')).toBe('true');
    multiselectOptions[1]?.click();
    await nextTick();
    expect(multiselectOptions[0]?.getAttribute('aria-checked')).toBe('true');
    expect(multiselectOptions[1]?.getAttribute('aria-checked')).toBe('true');

    const dropdown = container.querySelector<HTMLElement>('.ssr-dropdown');
    const dropdownTrigger = dropdown?.querySelector<HTMLButtonElement>('.fui-Dropdown__button');
    expect(dropdownTrigger?.getAttribute('role')).toBe('combobox');
    expect(dropdownTrigger?.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownTrigger?.getAttribute('aria-required')).toBe('true');
    expect(dropdownTrigger?.getAttribute('aria-labelledby')).toBe(
      dropdown?.closest('.fui-Field')?.querySelector<HTMLElement>('label')?.id,
    );
    expect(dropdownTrigger?.getAttribute('aria-describedby')).toBe(
      dropdown?.closest('.fui-Field')?.querySelector<HTMLElement>('.fui-Field__hint')?.id,
    );
    expect(dropdownTrigger?.textContent).toContain('Server Cat');
    dropdownTrigger?.click();
    await nextTick();
    await nextTick();
    const dropdownPopup = dropdown?.querySelector<HTMLElement>('.fui-Dropdown__listbox');
    const dropdownOptions = [
      ...(dropdownPopup?.querySelectorAll<HTMLElement>('[role="option"]') ?? []),
    ];
    expect(dropdownTrigger?.getAttribute('aria-expanded')).toBe('true');
    expect(dropdownPopup?.classList.contains('fui-Dropdown__listbox--closed')).toBe(false);
    expect(dropdownOptions).toHaveLength(2);
    expect(dropdownTrigger?.getAttribute('aria-activedescendant')).toBe(dropdownOptions[0]?.id);
    dropdownOptions[1]?.click();
    await nextTick();
    expect(dropdownTrigger?.getAttribute('aria-expanded')).toBe('false');
    expect(dropdownTrigger?.textContent).toContain('Server Dog');

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

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import ProgressBar from '../src/components/ProgressBar/ProgressBar.vue';
import type {
  ProgressBarColor,
  ProgressBarShape,
  ProgressBarThickness,
} from '../src/components/ProgressBar/ProgressBar.types';

const progressBarCss = readFileSync(
  resolve(process.cwd(), 'src/components/ProgressBar/progressBar.css'),
  'utf8',
);

describe('FProgressBar', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders an indeterminate fixed div progressbar with upstream defaults', () => {
    const wrapper = mount(ProgressBar);

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.attributes('aria-valuemin')).toBeUndefined();
    expect(wrapper.attributes('aria-valuemax')).toBeUndefined();
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined();
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-ProgressBar',
        'fui-ProgressBar--rounded',
        'fui-ProgressBar--medium',
      ]),
    );
    expect(wrapper.get('.fui-ProgressBar__indeterminateMotion').element.tagName).toBe('DIV');
    expect(wrapper.get('.fui-ProgressBar__bar').classes()).toContain(
      'fui-ProgressBar__bar--indeterminate',
    );
  });

  it('disables only the indeterminate motion wrapper when requested', () => {
    const wrapper = mount(ProgressBar, { props: { indeterminateMotion: false } });

    expect(wrapper.find('.fui-ProgressBar__indeterminateMotion').exists()).toBe(false);
    expect(wrapper.get('.fui-ProgressBar__bar').classes()).toContain(
      'fui-ProgressBar__bar--indeterminate',
    );
  });

  it('does not render an indeterminate motion wrapper for determinate progress', () => {
    const wrapper = mount(ProgressBar, { props: { value: 0.5 } });

    expect(wrapper.find('.fui-ProgressBar__indeterminateMotion').exists()).toBe(false);
  });

  it('sets determinate ARIA and width using the default maximum', () => {
    const wrapper = mount(ProgressBar, { props: { value: 0.52 } });

    expect(wrapper.attributes('aria-valuemin')).toBe('0');
    expect(wrapper.attributes('aria-valuemax')).toBe('1');
    expect(wrapper.attributes('aria-valuenow')).toBe('0.52');
    expect(wrapper.get('.fui-ProgressBar__bar').attributes('style')).toContain('width: 52%');
  });

  it('sets determinate ARIA and width using a custom maximum', () => {
    const wrapper = mount(ProgressBar, { props: { value: 13, max: 42 } });

    expect(wrapper.attributes('aria-valuemin')).toBe('0');
    expect(wrapper.attributes('aria-valuemax')).toBe('42');
    expect(wrapper.attributes('aria-valuenow')).toBe('13');
    expect(wrapper.get('.fui-ProgressBar__bar').attributes('style')).toContain(
      'width: 30.952380952380953%',
    );
  });

  it('keeps numeric ARIA for a determinate zero value', () => {
    const wrapper = mount(ProgressBar, { props: { value: 0 } });

    expect(wrapper.attributes('aria-valuemin')).toBe('0');
    expect(wrapper.attributes('aria-valuemax')).toBe('1');
    expect(wrapper.attributes('aria-valuenow')).toBe('0');
    expect(wrapper.get('.fui-ProgressBar__bar').attributes('style')).toContain('width: 0%');
  });

  it.each<ProgressBarShape>(['rounded', 'square'])('applies the %s shape', (shape) => {
    expect(mount(ProgressBar, { props: { shape } }).classes()).toContain(
      `fui-ProgressBar--${shape}`,
    );
  });

  it.each<ProgressBarThickness>(['medium', 'large'])('applies the %s thickness', (thickness) => {
    expect(mount(ProgressBar, { props: { thickness } }).classes()).toContain(
      `fui-ProgressBar--${thickness}`,
    );
  });

  it.each<ProgressBarColor>(['brand', 'error', 'warning', 'success'])(
    'applies the %s color to determinate progress',
    (color) => {
      expect(
        mount(ProgressBar, { props: { value: 0.5, color } })
          .get('.fui-ProgressBar__bar')
          .classes(),
      ).toContain(`fui-ProgressBar__bar--${color}`);
    },
  );

  it.each<ProgressBarColor>(['error', 'warning', 'success'])(
    'keeps indeterminate progress brand-colored when color is %s',
    (color) => {
      const bar = mount(ProgressBar, { props: { color } }).get('.fui-ProgressBar__bar');

      expect(bar.classes()).toContain('fui-ProgressBar__bar--indeterminate');
      expect(bar.classes()).not.toContain(`fui-ProgressBar__bar--${color}`);
    },
  );

  it('adds a width transition only when the normalized value is greater than 0.01', () => {
    expect(
      mount(ProgressBar, { props: { value: 0.01, max: 100 } })
        .get('.fui-ProgressBar__bar')
        .classes(),
    ).not.toContain('fui-ProgressBar__bar--determinate-transition');
    expect(
      mount(ProgressBar, { props: { value: 0.0101, max: 100 } })
        .get('.fui-ProgressBar__bar')
        .classes(),
    ).toContain('fui-ProgressBar__bar--determinate-transition');
  });

  it('defines the released three-second motion and opacity-only reduced motion', () => {
    expect(progressBarCss).toContain(
      'animation: fui-progress-bar-indeterminate 3s linear infinite',
    );
    expect(progressBarCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-name: fui-progress-bar-indeterminate-reduced-motion;/,
    );
    expect(progressBarCss).toMatch(
      /@keyframes fui-progress-bar-indeterminate-reduced-motion[\s\S]*opacity: 0\.2;[\s\S]*opacity: 1;/,
    );
    const reducedMotionKeyframes = progressBarCss.match(
      /@keyframes fui-progress-bar-indeterminate-reduced-motion\s*{([\s\S]*?)\n}/,
    )?.[1];
    expect(reducedMotionKeyframes).not.toContain('translate:');
  });

  it('defines forced-colors track and bar colors', () => {
    expect(progressBarCss).toMatch(
      /@media \(forced-colors: active\)[\s\S]*background-color: CanvasText;[\s\S]*background-color: Highlight;/,
    );
  });

  it.each([0, -1])('normalizes max=%s to one and warns', (max) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(ProgressBar, { props: { value: 0.5, max } });

    expect(wrapper.attributes('aria-valuemax')).toBe('1');
    expect(wrapper.attributes('aria-valuenow')).toBe('0.5');
    expect(consoleError).toHaveBeenCalledWith(
      `[FProgressBar] The prop 'max' must be greater than 0. Received max: ${max}`,
    );
  });

  it('clamps a negative value to zero and warns', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(ProgressBar, { props: { value: -5, max: 3 } });

    expect(wrapper.attributes('aria-valuenow')).toBe('0');
    expect(wrapper.get('.fui-ProgressBar__bar').attributes('style')).toContain('width: 0%');
    expect(consoleError).toHaveBeenCalledWith(
      "[FProgressBar] The prop 'value' must be greater than or equal to zero. Received value: -5",
    );
  });

  it('clamps a value greater than max and warns', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(ProgressBar, { props: { value: 23, max: 10 } });

    expect(wrapper.attributes('aria-valuenow')).toBe('10');
    expect(wrapper.get('.fui-ProgressBar__bar').attributes('style')).toContain('width: 100%');
    expect(consoleError).toHaveBeenCalledWith(
      "[FProgressBar] The prop 'value' must be less than or equal to 'max'. Received value: 23, max: 10",
    );
  });

  it('validates against normalized max when max is invalid', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(ProgressBar, { props: { value: 2, max: 0 } });

    expect(wrapper.attributes('aria-valuemax')).toBe('1');
    expect(wrapper.attributes('aria-valuenow')).toBe('1');
    expect(consoleError).toHaveBeenCalledWith(
      "[FProgressBar] The prop 'value' must be less than or equal to 'max'. Received value: 2, max: 1",
    );
  });

  it('does not warn for valid or indeterminate values', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    mount(ProgressBar, { props: { value: 5, max: 10 } });
    mount(ProgressBar, { props: { max: 10 } });

    expect(consoleError).not.toHaveBeenCalled();
  });

  it('updates normalized ARIA, width, variants, and motion reactively', async () => {
    const wrapper = mount(ProgressBar);

    await wrapper.setProps({
      value: 4,
      max: 8,
      shape: 'square',
      thickness: 'large',
      color: 'success',
    });
    expect(wrapper.attributes('aria-valuenow')).toBe('4');
    expect(wrapper.attributes('aria-valuemax')).toBe('8');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['fui-ProgressBar--square', 'fui-ProgressBar--large']),
    );
    expect(wrapper.find('.fui-ProgressBar__indeterminateMotion').exists()).toBe(false);
    expect(wrapper.get('.fui-ProgressBar__bar').classes()).toContain(
      'fui-ProgressBar__bar--success',
    );
    expect(wrapper.get('.fui-ProgressBar__bar').attributes('style')).toContain('width: 50%');

    await wrapper.setProps({ value: undefined, indeterminateMotion: false });
    expect(wrapper.attributes('aria-valuenow')).toBeUndefined();
    expect(wrapper.find('.fui-ProgressBar__indeterminateMotion').exists()).toBe(false);
    expect(wrapper.get('.fui-ProgressBar__bar').classes()).toContain(
      'fui-ProgressBar__bar--indeterminate',
    );
  });

  it('integrates Field label, generated control id, descriptions, and error color', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Upload progress',
        validationMessage: 'Upload failed',
        hint: 'Try again',
      },
      slots: { default: () => h(ProgressBar, { value: 0.5 }) },
    });
    const progressbar = wrapper.get('[role="progressbar"]');
    const label = wrapper.get('label');
    const message = wrapper.get('.fui-Field__validationMessage');
    const hint = wrapper.get('.fui-Field__hint');

    expect(progressbar.attributes('id')).toBe(label.attributes('for'));
    expect(progressbar.attributes('aria-labelledby')).toBe(label.attributes('id'));
    expect(progressbar.attributes('aria-describedby')).toBe(
      `${message.attributes('id')} ${hint.attributes('id')}`,
    );
    expect(progressbar.get('.fui-ProgressBar__bar').classes()).toContain(
      'fui-ProgressBar__bar--error',
    );
  });

  it.each<'warning' | 'success'>(['warning', 'success'])(
    'inherits %s color from Field validation state',
    (validationState) => {
      const wrapper = mount(Field, {
        props: { validationMessage: 'Status', validationState },
        slots: { default: () => h(ProgressBar, { value: 0.5 }) },
      });

      expect(wrapper.get('.fui-ProgressBar__bar').classes()).toContain(
        `fui-ProgressBar__bar--${validationState}`,
      );
    },
  );

  it('lets an explicit color override Field validation color', () => {
    const wrapper = mount(Field, {
      props: { validationMessage: 'Failed', validationState: 'error' },
      slots: { default: () => h(ProgressBar, { value: 0.5, color: 'success' }) },
    });

    expect(wrapper.get('.fui-ProgressBar__bar').classes()).toContain(
      'fui-ProgressBar__bar--success',
    );
  });

  it('preserves explicit ids and ARIA while merging and deduplicating Field descriptions', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Upload progress',
        validationMessage: 'Failed',
        hint: 'Retry',
      },
      slots: {
        default: () =>
          h(ProgressBar, {
            value: 0.5,
            id: 'custom-progress',
            'aria-labelledby': 'external-label',
            'aria-describedby': 'external-help external-help',
          }),
      },
    });
    const progressbar = wrapper.get('[role="progressbar"]');
    const messageId = wrapper.get('.fui-Field__validationMessage').attributes('id');
    const hintId = wrapper.get('.fui-Field__hint').attributes('id');

    expect(progressbar.attributes('id')).toBe('custom-progress');
    expect(progressbar.attributes('aria-labelledby')).toBe('external-label');
    expect(progressbar.attributes('aria-describedby')).toBe(`${messageId} ${hintId} external-help`);
  });

  it('forwards attrs, listeners, class, and style while protecting managed semantics', async () => {
    const onClick = vi.fn();
    const wrapper = mount(ProgressBar, {
      props: { value: 0.5 },
      attrs: {
        id: 'upload-progress',
        title: 'Uploading',
        'aria-label': 'Upload progress',
        'aria-valuenow': 99,
        class: 'custom-progress',
        style: 'margin: 2px',
        role: 'status',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('upload-progress');
    expect(wrapper.attributes('title')).toBe('Uploading');
    expect(wrapper.attributes('aria-label')).toBe('Upload progress');
    expect(wrapper.attributes('aria-valuenow')).toBe('0.5');
    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.classes()).toContain('custom-progress');
    expect(wrapper.attributes('style')).toContain('margin: 2px');
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('exposes only the native root element and emits no events', () => {
    const wrapper = mount(ProgressBar);
    const vm = wrapper.vm as unknown as { element: HTMLDivElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
    expect(wrapper.emitted()).toEqual({});
  });
});

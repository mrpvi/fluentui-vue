import { renderToString } from '@vue/server-renderer';
import { mount } from '@vue/test-utils';
import { createSSRApp } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Spinner from '../src/components/Spinner/Spinner.vue';
import type {
  SpinnerAppearance,
  SpinnerLabelPosition,
  SpinnerSize,
} from '../src/components/Spinner/Spinner.types';

describe('FSpinner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders an immediate div progressbar with upstream defaults', () => {
    const wrapper = mount(Spinner);
    const indicator = wrapper.get('.fui-Spinner__spinner');

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined();
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Spinner',
        'fui-Spinner--primary',
        'fui-Spinner--size-medium',
        'fui-Spinner--label-after',
      ]),
    );
    expect(indicator.attributes('aria-hidden')).toBe('true');
    expect(indicator.get('.fui-Spinner__spinnerTail').element.tagName).toBe('SPAN');
  });

  it('renders a span root when requested', () => {
    const wrapper = mount(Spinner, { props: { as: 'span' } });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.attributes('role')).toBe('progressbar');
  });

  it.each<SpinnerAppearance>(['primary', 'inverted'])('applies the %s appearance', (appearance) => {
    expect(mount(Spinner, { props: { appearance } }).classes()).toContain(
      `fui-Spinner--${appearance}`,
    );
  });

  it.each<SpinnerSize>([
    'extra-tiny',
    'tiny',
    'extra-small',
    'small',
    'medium',
    'large',
    'extra-large',
    'huge',
  ])('applies the %s size', (size) => {
    expect(mount(Spinner, { props: { size } }).classes()).toContain(`fui-Spinner--size-${size}`);
  });

  it.each<SpinnerLabelPosition>(['above', 'below', 'before', 'after'])(
    'positions the label %s the indicator',
    (labelPosition) => {
      const wrapper = mount(Spinner, {
        props: { label: 'Loading', labelPosition },
      });
      const label = wrapper.get('.fui-Spinner__label');
      const indicator = wrapper.get('.fui-Spinner__spinner');
      const labelIndex = [...wrapper.element.children].indexOf(label.element);
      const indicatorIndex = [...wrapper.element.children].indexOf(indicator.element);

      expect(wrapper.classes()).toContain(`fui-Spinner--label-${labelPosition}`);
      expect(wrapper.classes().includes('fui-Spinner--vertical')).toBe(
        labelPosition === 'above' || labelPosition === 'below',
      );
      expect(labelIndex < indicatorIndex).toBe(
        labelPosition === 'above' || labelPosition === 'before',
      );
    },
  );

  it('renders and associates a label prop with a deterministic generated id', () => {
    const wrapper = mount(Spinner, { props: { label: 'Loading records' } });
    const label = wrapper.get('.fui-Spinner__label');

    expect(label.text()).toBe('Loading records');
    expect(label.attributes('id')).toMatch(/^fui-spinner-.+__label$/);
    expect(wrapper.attributes('aria-labelledby')).toBe(label.attributes('id'));
  });

  it('prefers label slot content over the label prop', () => {
    const wrapper = mount(Spinner, {
      props: { label: 'Prop label' },
      slots: { label: '<strong>Slot label</strong>' },
    });

    expect(wrapper.get('.fui-Spinner__label').text()).toBe('Slot label');
    expect(wrapper.find('strong').exists()).toBe(true);
  });

  it('uses a consumer supplied aria-labelledby without replacing it', () => {
    const wrapper = mount(Spinner, {
      props: { label: 'Visible label' },
      attrs: { 'aria-labelledby': 'external-label' },
    });

    expect(wrapper.attributes('aria-labelledby')).toBe('external-label');
    expect(wrapper.get('.fui-Spinner__label').attributes('id')).toMatch(/^fui-spinner-.+__label$/);
  });

  it('does not add generated aria-labelledby when there is no visible label', () => {
    const wrapper = mount(Spinner, {
      attrs: { 'aria-label': 'Loading results' },
    });

    expect(wrapper.attributes('aria-label')).toBe('Loading results');
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined();
  });

  it('forwards a consumer supplied aria-labelledby without a visible label', () => {
    const wrapper = mount(Spinner, {
      attrs: { 'aria-labelledby': 'external-label' },
    });

    expect(wrapper.attributes('aria-labelledby')).toBe('external-label');
  });

  it('renders custom indicator content inside decorative semantics', () => {
    const wrapper = mount(Spinner, {
      slots: { indicator: '<svg aria-label="Consumer indicator"></svg>' },
    });
    const indicator = wrapper.get('.fui-Spinner__spinner');

    expect(indicator.attributes('aria-hidden')).toBe('true');
    expect(indicator.get('svg').attributes('aria-label')).toBe('Consumer indicator');
    expect(indicator.find('.fui-Spinner__spinnerTail').exists()).toBe(false);
  });

  it('keeps the progressbar root while delaying both indicator and label', async () => {
    const wrapper = mount(Spinner, {
      props: { delay: 1000, label: 'Loading' },
    });

    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.attributes('aria-labelledby')).toMatch(/^fui-spinner-.+__label$/);
    expect(wrapper.element.children).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(999);
    expect(wrapper.element.children).toHaveLength(0);

    await vi.advanceTimersByTimeAsync(1);
    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(true);
    expect(wrapper.find('.fui-Spinner__label').exists()).toBe(true);
  });

  it('server-renders delayed markup deterministically without the indicator or label', async () => {
    const firstRender = await renderToString(
      createSSRApp(Spinner, { delay: 1000, label: 'Server loading' }),
    );
    const secondRender = await renderToString(
      createSSRApp(Spinner, { delay: 1000, label: 'Server loading' }),
    );

    expect(firstRender).toBe(secondRender);
    expect(firstRender).toContain('role="progressbar"');
    expect(firstRender).toMatch(/aria-labelledby="fui-spinner-[^"]+__label"/);
    expect(firstRender).not.toContain('fui-Spinner__spinner');
    expect(firstRender).not.toContain('fui-Spinner__label');
  });

  it('server-renders immediate markup deterministically with structural spans', async () => {
    const firstRender = await renderToString(createSSRApp(Spinner, { label: 'Server loading' }));
    const secondRender = await renderToString(createSSRApp(Spinner, { label: 'Server loading' }));

    expect(firstRender).toBe(secondRender);
    expect(firstRender).toContain('class="fui-Spinner__spinner" aria-hidden="true"');
    expect(firstRender).toContain('class="fui-Spinner__spinnerTail"');
    expect(firstRender).toMatch(
      /aria-labelledby="(fui-spinner-[^"]+__label)"[^>]*>.*<span id="\1" class="fui-Spinner__label">/,
    );
  });

  it('restarts the delay when delay changes to another positive value', async () => {
    const wrapper = mount(Spinner, { props: { delay: 1000 } });

    await vi.advanceTimersByTimeAsync(600);
    await wrapper.setProps({ delay: 800 });
    await vi.advanceTimersByTimeAsync(799);
    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(true);
  });

  it('shows immediately when delay changes to zero or a negative value', async () => {
    const wrapper = mount(Spinner, { props: { delay: 1000 } });

    await wrapper.setProps({ delay: 0 });
    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(true);

    await wrapper.setProps({ delay: 500 });
    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(false);

    await wrapper.setProps({ delay: -1 });
    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(true);
  });

  it('starts a fresh delay when changing from immediate to delayed', async () => {
    const wrapper = mount(Spinner, { props: { delay: 0 } });

    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(true);
    await wrapper.setProps({ delay: 250 });
    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(false);

    await vi.advanceTimersByTimeAsync(250);
    expect(wrapper.find('.fui-Spinner__spinner').exists()).toBe(true);
  });

  it('cleans up the pending delay timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const wrapper = mount(Spinner, { props: { delay: 1000 } });

    wrapper.unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    clearTimeoutSpy.mockRestore();
  });

  it('forwards native attributes, listeners, class, and style to the root', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Spinner, {
      attrs: {
        id: 'loading-state',
        title: 'Loading state',
        'aria-label': 'Loading records',
        'data-kind': 'async',
        class: 'custom',
        style: 'margin: 2px',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('loading-state');
    expect(wrapper.attributes('title')).toBe('Loading state');
    expect(wrapper.attributes('aria-label')).toBe('Loading records');
    expect(wrapper.attributes('data-kind')).toBe('async');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('margin: 2px');

    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('protects the managed progressbar role from fallthrough attributes', () => {
    const wrapper = mount(Spinner, {
      attrs: { role: 'status' },
    });

    expect(wrapper.attributes('role')).toBe('progressbar');
  });

  it('updates root element, variants, label ordering, and labeling reactively', async () => {
    const wrapper = mount(Spinner, {
      props: { label: 'Loading', labelPosition: 'after' },
    });

    await wrapper.setProps({
      as: 'span',
      appearance: 'inverted',
      labelPosition: 'above',
      size: 'huge',
    });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Spinner--inverted',
        'fui-Spinner--label-above',
        'fui-Spinner--size-huge',
        'fui-Spinner--vertical',
      ]),
    );
    expect(wrapper.element.firstElementChild).toBe(wrapper.get('.fui-Spinner__label').element);
    expect(wrapper.attributes('aria-labelledby')).toBe(
      wrapper.get('.fui-Spinner__label').attributes('id'),
    );
  });

  it('exposes only the native root element and emits no component events', () => {
    const wrapper = mount(Spinner);
    const vm = wrapper.vm as unknown as { element: HTMLElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
    expect(wrapper.emitted()).toEqual({});
  });
});

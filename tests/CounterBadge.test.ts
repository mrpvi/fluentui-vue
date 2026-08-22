import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CounterBadge from '../src/components/CounterBadge/CounterBadge.vue';
import type {
  CounterBadgeAppearance,
  CounterBadgeColor,
  CounterBadgeShape,
} from '../src/components/CounterBadge/CounterBadge.types';
import type { BadgeSize } from '../src/components/Badge';

describe('FCounterBadge', () => {
  it('keeps a fixed div root but hides the generated zero by default', () => {
    const wrapper = mount(CounterBadge);

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toBe('');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Badge',
        'fui-CounterBadge',
        'fui-Badge--filled',
        'fui-Badge--brand',
        'fui-Badge--circular',
        'fui-Badge--size-medium',
        'fui-CounterBadge--hidden',
      ]),
    );
  });

  it('shows zero when showZero is true', () => {
    const wrapper = mount(CounterBadge, { props: { showZero: true } });

    expect(wrapper.text()).toBe('0');
    expect(wrapper.classes()).not.toContain('fui-CounterBadge--hidden');
  });

  it('generates the count and formats overflow with N+', () => {
    expect(mount(CounterBadge, { props: { count: 42 } }).text()).toBe('42');
    expect(mount(CounterBadge, { props: { count: 100 } }).text()).toBe('99+');
    expect(mount(CounterBadge, { props: { count: 8, overflowCount: 7 } }).text()).toBe('7+');
  });

  it('does not clamp negative counts', () => {
    expect(mount(CounterBadge, { props: { count: -3 } }).text()).toBe('-3');
  });

  it('renders a 6px dot and suppresses generated count content', () => {
    const wrapper = mount(CounterBadge, { props: { count: 42, dot: true } });

    expect(wrapper.text()).toBe('');
    expect(wrapper.classes()).toContain('fui-CounterBadge--dot');
    expect(wrapper.classes()).not.toContain('fui-CounterBadge--hidden');
  });

  it('lets custom default content win over generated count and dot suppression', () => {
    const customCount = mount(CounterBadge, {
      props: { count: 42 },
      slots: { default: '<strong>Custom</strong>' },
    });
    const customDot = mount(CounterBadge, {
      props: { count: 42, dot: true },
      slots: { default: '<strong>Custom</strong>' },
    });

    expect(customCount.text()).toBe('Custom');
    expect(customCount.text()).not.toContain('42');
    expect(customDot.text()).toBe('Custom');
    expect(customDot.classes()).toContain('fui-CounterBadge--dot');
  });

  it('treats a supplied empty default slot as custom content and keeps the root displayed', () => {
    const wrapper = mount(CounterBadge, { slots: { default: '' } });

    expect(wrapper.text()).toBe('');
    expect(wrapper.classes()).not.toContain('fui-CounterBadge--hidden');
  });

  it.each<CounterBadgeAppearance>(['filled', 'ghost'])(
    'applies the restricted %s appearance',
    (appearance) => {
      expect(mount(CounterBadge, { props: { appearance } }).classes()).toContain(
        `fui-Badge--${appearance}`,
      );
    },
  );

  it.each<CounterBadgeColor>(['brand', 'danger', 'important', 'informative'])(
    'applies the restricted %s color',
    (color) => {
      expect(mount(CounterBadge, { props: { color } }).classes()).toContain(`fui-Badge--${color}`);
    },
  );

  it.each<CounterBadgeShape>(['circular', 'rounded'])('applies the %s shape', (shape) => {
    expect(mount(CounterBadge, { props: { shape } }).classes()).toContain(`fui-Badge--${shape}`);
  });

  it.each<BadgeSize>(['tiny', 'extra-small', 'small', 'medium', 'large', 'extra-large'])(
    'applies the %s size',
    (size) => {
      expect(mount(CounterBadge, { props: { size } }).classes()).toContain(
        `fui-Badge--size-${size}`,
      );
    },
  );

  it('supports icon slots in either position without aria-hiding consumer content', () => {
    const before = mount(CounterBadge, {
      props: { count: 1 },
      slots: { icon: '<svg aria-label="Counter icon"></svg>' },
    });
    const after = mount(CounterBadge, {
      props: { count: 1, iconPosition: 'after' },
      slots: { icon: '<svg aria-label="Counter icon"></svg>' },
    });

    expect(before.element.firstElementChild).toBe(before.get('.fui-CounterBadge__icon').element);
    expect(after.element.lastElementChild).toBe(after.get('.fui-CounterBadge__icon').element);
    expect(before.get('.fui-CounterBadge__icon').attributes('aria-hidden')).toBeUndefined();
  });

  it('forwards root attributes, listeners, class, and style', async () => {
    const onClick = vi.fn();
    const wrapper = mount(CounterBadge, {
      props: { count: 4 },
      attrs: {
        id: 'counter',
        'aria-label': 'Four notifications',
        class: 'custom',
        style: 'margin: 2px',
        'data-kind': 'notifications',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('counter');
    expect(wrapper.attributes('aria-label')).toBe('Four notifications');
    expect(wrapper.attributes('data-kind')).toBe('notifications');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('margin: 2px');
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('updates count visibility and formatting reactively', async () => {
    const wrapper = mount(CounterBadge);

    await wrapper.setProps({ count: 100 });
    expect(wrapper.text()).toBe('99+');
    expect(wrapper.classes()).not.toContain('fui-CounterBadge--hidden');

    await wrapper.setProps({ dot: true });
    expect(wrapper.text()).toBe('');
    expect(wrapper.classes()).toContain('fui-CounterBadge--dot');

    await wrapper.setProps({ count: 0, dot: false, showZero: false });
    expect(wrapper.classes()).toContain('fui-CounterBadge--hidden');
  });

  it('exposes only the native counter element and emits no component events', () => {
    const wrapper = mount(CounterBadge);
    const vm = wrapper.vm as unknown as { element: HTMLDivElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
    expect(wrapper.emitted()).toEqual({});
  });
});

import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Badge from '../src/components/Badge/Badge.vue';
import type {
  BadgeAppearance,
  BadgeColor,
  BadgeShape,
  BadgeSize,
} from '../src/components/Badge/Badge.types';

describe('FBadge', () => {
  it('renders a fixed div with upstream defaults', () => {
    const wrapper = mount(Badge, { slots: { default: 'New' } });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toBe('New');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Badge',
        'fui-Badge--filled',
        'fui-Badge--brand',
        'fui-Badge--circular',
        'fui-Badge--size-medium',
        'fui-Badge--icon-before',
      ]),
    );
  });

  it.each<BadgeAppearance>(['filled', 'ghost', 'outline', 'tint'])(
    'applies the %s appearance',
    (appearance) => {
      expect(mount(Badge, { props: { appearance } }).classes()).toContain(
        `fui-Badge--${appearance}`,
      );
    },
  );

  it.each<BadgeColor>([
    'brand',
    'danger',
    'important',
    'informative',
    'severe',
    'subtle',
    'success',
    'warning',
  ])('applies the %s color', (color) => {
    expect(mount(Badge, { props: { color } }).classes()).toContain(`fui-Badge--${color}`);
  });

  it.each<BadgeSize>(['tiny', 'extra-small', 'small', 'medium', 'large', 'extra-large'])(
    'applies the %s size',
    (size) => {
      expect(mount(Badge, { props: { size } }).classes()).toContain(`fui-Badge--size-${size}`);
    },
  );

  it.each<BadgeShape>(['circular', 'rounded', 'square'])('applies the %s shape', (shape) => {
    expect(mount(Badge, { props: { shape } }).classes()).toContain(`fui-Badge--${shape}`);
  });

  it('renders the icon before content by default without hiding it from assistive technology', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: '<span class="content">Text</span>',
        icon: '<svg aria-label="Badge icon"></svg>',
      },
    });
    const icon = wrapper.get('.fui-Badge__icon');

    expect(wrapper.element.firstElementChild).toBe(icon.element);
    expect(icon.attributes('aria-hidden')).toBeUndefined();
    expect(icon.get('svg').attributes('aria-label')).toBe('Badge icon');
  });

  it('renders the icon after content when requested', () => {
    const wrapper = mount(Badge, {
      props: { iconPosition: 'after' },
      slots: { default: '<span class="content">Text</span>', icon: '<svg></svg>' },
    });

    expect(wrapper.element.lastElementChild).toBe(wrapper.get('.fui-Badge__icon').element);
    expect(wrapper.classes()).toContain('fui-Badge--icon-after');
  });

  it('renders icon-only and content-only forms without extra wrappers', () => {
    const iconOnly = mount(Badge, { slots: { icon: '<svg></svg>' } });
    const contentOnly = mount(Badge, { slots: { default: 'Text' } });

    expect(iconOnly.element.children).toHaveLength(1);
    expect(iconOnly.find('.fui-Badge__icon').exists()).toBe(true);
    expect(contentOnly.element.children).toHaveLength(0);
    expect(contentOnly.text()).toBe('Text');
  });

  it('forwards native attributes, listeners, class, and style to the root', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Badge, {
      attrs: {
        id: 'badge',
        title: 'Badge title',
        'aria-label': 'Custom badge',
        'data-kind': 'status',
        class: 'custom',
        style: 'margin: 2px',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('badge');
    expect(wrapper.attributes('title')).toBe('Badge title');
    expect(wrapper.attributes('aria-label')).toBe('Custom badge');
    expect(wrapper.attributes('data-kind')).toBe('status');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('margin: 2px');
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('updates variants reactively', async () => {
    const wrapper = mount(Badge);

    await wrapper.setProps({
      appearance: 'tint',
      color: 'warning',
      iconPosition: 'after',
      shape: 'square',
      size: 'extra-large',
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Badge--tint',
        'fui-Badge--warning',
        'fui-Badge--icon-after',
        'fui-Badge--square',
        'fui-Badge--size-extra-large',
      ]),
    );
  });

  it('exposes only the native badge element and emits no component events', () => {
    const wrapper = mount(Badge);
    const vm = wrapper.vm as unknown as { element: HTMLDivElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
    expect(wrapper.emitted()).toEqual({});
  });
});

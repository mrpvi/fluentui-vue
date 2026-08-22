/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Skeleton from '../src/components/Skeleton/Skeleton.vue';
import SkeletonItem from '../src/components/SkeletonItem/SkeletonItem.vue';
import type { SkeletonAnimation, SkeletonSize } from '../src/components/Skeleton/Skeleton.types';

const sizes: SkeletonSize[] = [
  8, 12, 14, 16, 20, 22, 24, 28, 32, 36, 40, 48, 52, 56, 64, 72, 92, 96, 120, 128,
];

describe('FSkeletonItem', () => {
  it('renders a div with wave, opaque, 16, and rectangle defaults', () => {
    const wrapper = mount(SkeletonItem);

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-SkeletonItem',
        'fui-SkeletonItem--wave',
        'fui-SkeletonItem--opaque',
        'fui-SkeletonItem--size-16',
        'fui-SkeletonItem--rectangle',
      ]),
    );
  });

  it('renders a block span root when requested', () => {
    const wrapper = mount(SkeletonItem, { props: { as: 'span' } });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain('fui-SkeletonItem');
  });

  it.each(['wave', 'pulse'] as const)('applies the %s animation', (animation) => {
    expect(mount(SkeletonItem, { props: { animation } }).classes()).toContain(
      `fui-SkeletonItem--${animation}`,
    );
  });

  it.each(['opaque', 'translucent'] as const)('applies the %s appearance', (appearance) => {
    expect(mount(SkeletonItem, { props: { appearance } }).classes()).toContain(
      `fui-SkeletonItem--${appearance}`,
    );
  });

  it.each(sizes)('applies exact size %i', (size) => {
    expect(mount(SkeletonItem, { props: { size } }).classes()).toContain(
      `fui-SkeletonItem--size-${size}`,
    );
  });

  it.each(['circle', 'square', 'rectangle'] as const)('applies the %s shape', (shape) => {
    expect(mount(SkeletonItem, { props: { shape } }).classes()).toContain(
      `fui-SkeletonItem--${shape}`,
    );
  });

  it('renders default slot content without an extra wrapper', () => {
    const wrapper = mount(SkeletonItem, { slots: { default: '<span>Preview</span>' } });

    expect(wrapper.element.children).toHaveLength(1);
    expect(wrapper.get('span').text()).toBe('Preview');
  });

  it('prefers every item prop over nearest context while inheriting omitted values', () => {
    const host = mount(
      defineComponent({
        render() {
          return h(
            Skeleton,
            { animation: 'pulse', appearance: 'translucent', size: 64, shape: 'circle' },
            {
              default: () => [
                h(SkeletonItem, {
                  animation: 'wave',
                  appearance: 'opaque',
                  size: 20,
                  shape: 'square',
                }),
                h(SkeletonItem, { appearance: 'opaque', shape: 'rectangle' }),
              ],
            },
          );
        },
      }),
    );
    const [overridden, partial] = host.findAllComponents(SkeletonItem);

    expect(overridden.classes()).toEqual(
      expect.arrayContaining([
        'fui-SkeletonItem--wave',
        'fui-SkeletonItem--opaque',
        'fui-SkeletonItem--size-20',
        'fui-SkeletonItem--square',
      ]),
    );
    expect(partial.classes()).toEqual(
      expect.arrayContaining([
        'fui-SkeletonItem--pulse',
        'fui-SkeletonItem--opaque',
        'fui-SkeletonItem--size-64',
        'fui-SkeletonItem--rectangle',
      ]),
    );
  });

  it('uses the nearest nested skeleton context', () => {
    const host = mount(
      defineComponent({
        render() {
          return h(
            Skeleton,
            { animation: 'wave', appearance: 'opaque', size: 20, shape: 'rectangle' },
            {
              default: () =>
                h(
                  Skeleton,
                  { animation: 'pulse', appearance: 'translucent', size: 120, shape: 'square' },
                  { default: () => h(SkeletonItem) },
                ),
            },
          );
        },
      }),
    );

    expect(host.getComponent(SkeletonItem).classes()).toEqual(
      expect.arrayContaining([
        'fui-SkeletonItem--pulse',
        'fui-SkeletonItem--translucent',
        'fui-SkeletonItem--size-120',
        'fui-SkeletonItem--square',
      ]),
    );
  });

  it('updates item overrides and inherited context reactively', async () => {
    const host = mount(
      defineComponent({
        props: {
          animation: { type: String as () => SkeletonAnimation, default: 'wave' },
          size: { type: Number as () => SkeletonSize, default: 16 },
        },
        render() {
          return h(
            Skeleton,
            { animation: this.animation, appearance: 'translucent', size: 72, shape: 'circle' },
            {
              default: () =>
                h(SkeletonItem, {
                  size: this.size,
                  shape: this.size === 16 ? 'rectangle' : 'square',
                }),
            },
          );
        },
      }),
      { props: { animation: 'wave', size: 16 } },
    );

    await host.setProps({ animation: 'pulse', size: 32 });

    expect(host.getComponent(SkeletonItem).classes()).toEqual(
      expect.arrayContaining([
        'fui-SkeletonItem--pulse',
        'fui-SkeletonItem--translucent',
        'fui-SkeletonItem--size-32',
        'fui-SkeletonItem--square',
      ]),
    );
  });

  it('forwards native attributes, ARIA, listeners, class, and style to the root', async () => {
    const onClick = vi.fn();
    const wrapper = mount(SkeletonItem, {
      attrs: {
        id: 'avatar-stencil',
        title: 'Avatar placeholder',
        role: 'img',
        'aria-label': 'Loading avatar',
        'data-kind': 'avatar',
        class: 'custom',
        style: 'margin: 2px',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('avatar-stencil');
    expect(wrapper.attributes('title')).toBe('Avatar placeholder');
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('Loading avatar');
    expect(wrapper.attributes('data-kind')).toBe('avatar');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('margin: 2px');

    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('exposes only the native root element and emits no component events', () => {
    const wrapper = mount(SkeletonItem);
    const vm = wrapper.vm as unknown as { element: HTMLElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
    expect(wrapper.emitted()).toEqual({});
  });
});

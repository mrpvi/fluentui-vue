/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Skeleton from '../src/components/Skeleton/Skeleton.vue';
import SkeletonItem from '../src/components/SkeletonItem/SkeletonItem.vue';
import type { SkeletonAnimation, SkeletonSize } from '../src/components/Skeleton/Skeleton.types';

describe('FSkeleton', () => {
  it('renders a div progressbar with busy semantics and upstream defaults', () => {
    const wrapper = mount(Skeleton, { slots: { default: '<span>Loading</span>' } });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toContain('fui-Skeleton');
    expect(wrapper.attributes('role')).toBe('progressbar');
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.text()).toBe('Loading');
  });

  it('renders a block span root when requested', () => {
    const wrapper = mount(Skeleton, { props: { as: 'span' } });

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.classes()).toContain('fui-Skeleton');
  });

  it.each([
    { attrs: { role: 'status' }, expectedRole: 'status', expectedBusy: 'true' },
    { attrs: { 'aria-busy': 'false' }, expectedRole: 'progressbar', expectedBusy: 'false' },
    {
      attrs: { role: 'region', 'aria-busy': false },
      expectedRole: 'region',
      expectedBusy: 'false',
    },
  ])(
    'preserves architecture-safe explicit consumer ARIA %#',
    ({ attrs, expectedRole, expectedBusy }) => {
      const wrapper = mount(Skeleton, { attrs });

      expect(wrapper.attributes('role')).toBe(expectedRole);
      expect(wrapper.attributes('aria-busy')).toBe(expectedBusy);
    },
  );

  it.each([
    { width: 240, expected: 'width: 240px' },
    { width: '50%', expected: 'width: 50%' },
    { width: 'calc(100% - 2rem)', expected: 'width: calc(100% - 2rem)' },
  ] as const)('maps deprecated width $width to inline CSS', ({ width, expected }) => {
    const wrapper = mount(Skeleton, { props: { width } });

    expect(wrapper.attributes('style')).toContain(expected);
    expect(wrapper.attributes('width')).toBeUndefined();
  });

  it('merges deprecated width after consumer inline style', () => {
    const wrapper = mount(Skeleton, {
      props: { width: 320 },
      attrs: { style: 'margin: 2px; width: 100px' },
    });

    expect(wrapper.attributes('style')).toContain('margin: 2px');
    expect((wrapper.element as HTMLElement).style.width).toBe('320px');
  });

  it('forwards native attributes, listeners, class, and style to the root', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Skeleton, {
      attrs: {
        id: 'loading-card',
        title: 'Loading card',
        'aria-label': 'Loading profile',
        'data-kind': 'card',
        class: 'custom',
        style: 'margin: 2px',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('loading-card');
    expect(wrapper.attributes('title')).toBe('Loading card');
    expect(wrapper.attributes('aria-label')).toBe('Loading profile');
    expect(wrapper.attributes('data-kind')).toBe('card');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('margin: 2px');

    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('provides animation, appearance, size, and shape to items', () => {
    const host = mount(
      defineComponent({
        render() {
          return h(
            Skeleton,
            { animation: 'pulse', appearance: 'translucent', size: 48, shape: 'circle' },
            { default: () => h(SkeletonItem) },
          );
        },
      }),
    );
    const item = host.getComponent(SkeletonItem);

    expect(item.classes()).toEqual(
      expect.arrayContaining([
        'fui-SkeletonItem--pulse',
        'fui-SkeletonItem--translucent',
        'fui-SkeletonItem--size-48',
        'fui-SkeletonItem--circle',
      ]),
    );
  });

  it('inherits animation and appearance through nested skeletons while unset size and shape reset', () => {
    const host = mount(
      defineComponent({
        render() {
          return h(
            Skeleton,
            { animation: 'pulse', appearance: 'translucent', size: 72, shape: 'circle' },
            { default: () => h(Skeleton, null, { default: () => h(SkeletonItem) }) },
          );
        },
      }),
    );
    const item = host.getComponent(SkeletonItem);

    expect(item.classes()).toEqual(
      expect.arrayContaining([
        'fui-SkeletonItem--pulse',
        'fui-SkeletonItem--translucent',
        'fui-SkeletonItem--size-16',
        'fui-SkeletonItem--rectangle',
      ]),
    );
  });

  it('updates provided context reactively through nested skeletons', async () => {
    const host = mount(
      defineComponent({
        props: {
          animation: { type: String as () => SkeletonAnimation, default: 'wave' },
          size: { type: Number as () => SkeletonSize, default: 16 },
        },
        render() {
          return h(
            Skeleton,
            { animation: this.animation, appearance: 'opaque', size: this.size, shape: 'square' },
            {
              default: () =>
                h(
                  Skeleton,
                  { size: this.size, shape: 'square' },
                  { default: () => h(SkeletonItem) },
                ),
            },
          );
        },
      }),
      { props: { animation: 'wave', size: 16 } },
    );

    await host.setProps({ animation: 'pulse', size: 96 });

    expect(host.getComponent(SkeletonItem).classes()).toEqual(
      expect.arrayContaining(['fui-SkeletonItem--pulse', 'fui-SkeletonItem--size-96']),
    );
  });

  it('exposes only the native root element and emits no component events', () => {
    const wrapper = mount(Skeleton);
    const vm = wrapper.vm as unknown as { element: HTMLElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
    expect(wrapper.emitted()).toEqual({});
  });
});

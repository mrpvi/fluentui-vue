import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Divider from '../src/components/Divider/Divider.vue';
import type {
  DividerAlignContent,
  DividerAppearance,
} from '../src/components/Divider/Divider.types';

describe('FDivider', () => {
  it('renders a horizontal separator with upstream defaults', () => {
    const wrapper = mount(Divider);

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.attributes('role')).toBe('separator');
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal');
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined();
    expect(wrapper.element.children).toHaveLength(0);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Divider',
        'fui-Divider--horizontal',
        'fui-Divider--align-center',
        'fui-Divider--default',
        'fui-Divider--childless',
      ]),
    );
  });

  it('wraps content and names the separator with that content', () => {
    const wrapper = mount(Divider, { slots: { default: 'Section two' } });
    const content = wrapper.get('.fui-Divider__wrapper');

    expect(content.text()).toBe('Section two');
    expect(content.attributes('id')).toMatch(/^fui-divider-.+__content$/);
    expect(wrapper.attributes('aria-labelledby')).toBe(content.attributes('id'));
    expect(wrapper.element.children).toHaveLength(1);
    expect(wrapper.classes()).toContain('fui-Divider--with-content');
    expect(wrapper.classes()).not.toContain('fui-Divider--childless');
  });

  it('does not treat empty text as absent when the default slot is provided', () => {
    const wrapper = mount(Divider, { slots: { default: '' } });
    const content = wrapper.get('.fui-Divider__wrapper');

    expect(wrapper.attributes('aria-labelledby')).toBe(content.attributes('id'));
    expect(wrapper.classes()).toContain('fui-Divider--with-content');
  });

  it.each<DividerAlignContent>(['start', 'center', 'end'])(
    'applies the %s content alignment',
    (alignContent) => {
      expect(mount(Divider, { props: { alignContent } }).classes()).toContain(
        `fui-Divider--align-${alignContent}`,
      );
    },
  );

  it.each<DividerAppearance>(['brand', 'default', 'strong', 'subtle'])(
    'applies the %s appearance',
    (appearance) => {
      expect(mount(Divider, { props: { appearance } }).classes()).toContain(
        `fui-Divider--${appearance}`,
      );
    },
  );

  it('applies inset spacing as a visual modifier', () => {
    const wrapper = mount(Divider, { props: { inset: true } });

    expect(wrapper.classes()).toContain('fui-Divider--inset');
    expect(wrapper.attributes('inset')).toBeUndefined();
  });

  it('renders a vertical separator with content', () => {
    const wrapper = mount(Divider, {
      props: { vertical: true },
      slots: { default: 'Vertical' },
    });

    expect(wrapper.attributes('role')).toBe('separator');
    expect(wrapper.attributes('aria-orientation')).toBe('vertical');
    expect(wrapper.classes()).toContain('fui-Divider--vertical');
    expect(wrapper.classes()).not.toContain('fui-Divider--horizontal');
    expect(wrapper.get('.fui-Divider__wrapper').text()).toBe('Vertical');
  });

  it('updates orientation, modifiers, and content reactively', async () => {
    const wrapper = mount(Divider, {
      props: {
        alignContent: 'start',
        appearance: 'subtle',
        inset: false,
        vertical: false,
      },
      slots: { default: 'Content' },
    });

    await wrapper.setProps({
      alignContent: 'end',
      appearance: 'brand',
      inset: true,
      vertical: true,
    });

    expect(wrapper.attributes('aria-orientation')).toBe('vertical');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Divider--vertical',
        'fui-Divider--align-end',
        'fui-Divider--brand',
        'fui-Divider--inset',
      ]),
    );
    expect(wrapper.classes()).not.toContain('fui-Divider--horizontal');
  });

  it('forwards native attributes, listeners, class, style, and custom color to the root', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Divider, {
      attrs: {
        id: 'section-divider',
        title: 'Section boundary',
        color: '#ff00ff',
        'aria-label': 'Custom divider',
        'data-kind': 'section',
        class: 'custom',
        style: 'width: 100px',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('section-divider');
    expect(wrapper.attributes('title')).toBe('Section boundary');
    expect(wrapper.attributes('color')).toBe('#ff00ff');
    expect(wrapper.attributes('aria-label')).toBe('Custom divider');
    expect(wrapper.attributes('data-kind')).toBe('section');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('width: 100px');

    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('protects managed separator semantics from fallthrough attributes', () => {
    const wrapper = mount(Divider, {
      props: { vertical: true },
      attrs: {
        role: 'presentation',
        'aria-orientation': 'horizontal',
        'aria-labelledby': 'consumer-label',
      },
      slots: { default: 'Managed label' },
    });
    const content = wrapper.get('.fui-Divider__wrapper');

    expect(wrapper.attributes('role')).toBe('separator');
    expect(wrapper.attributes('aria-orientation')).toBe('vertical');
    expect(wrapper.attributes('aria-labelledby')).toBe(content.attributes('id'));
  });

  it('preserves an explicit accessible name while still using content labeling', () => {
    const wrapper = mount(Divider, {
      attrs: { 'aria-label': 'Explicit divider name' },
      slots: { default: 'Visible content' },
    });

    expect(wrapper.attributes('aria-label')).toBe('Explicit divider name');
    expect(wrapper.attributes('aria-labelledby')).toBe(
      wrapper.get('.fui-Divider__wrapper').attributes('id'),
    );
  });

  it('exposes only the native divider element', () => {
    const wrapper = mount(Divider);
    const vm = wrapper.vm as unknown as { element: HTMLDivElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
  });

  it('defines no component-specific emitted events', () => {
    const wrapper = mount(Divider);

    expect(wrapper.emitted()).toEqual({});
  });
});

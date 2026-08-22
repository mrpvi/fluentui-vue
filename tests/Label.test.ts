import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Label from '../src/components/Label/Label.vue';
import type { LabelSize, LabelWeight } from '../src/components/Label/Label.types';

describe('FLabel', () => {
  it('renders a native label with upstream defaults', () => {
    const wrapper = mount(Label, { slots: { default: 'Email address' } });

    expect(wrapper.element.tagName).toBe('LABEL');
    expect(wrapper.text()).toBe('Email address');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Label',
        'fui-Label--medium',
        'fui-Label--regular',
      ]),
    );
  });

  it('associates with a native input through the forwarded for attribute', () => {
    const Host = defineComponent({
      render: () =>
        h('div', [
          h(Label, { for: 'email' }, () => 'Email address'),
          h('input', { id: 'email' }),
        ]),
    });
    const wrapper = mount(Host);
    const label = wrapper.get('label');
    const input = wrapper.get('input');

    expect(label.attributes('for')).toBe(input.attributes('id'));
  });

  it('forwards native attributes, listeners, class, and style to the root', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Label, {
      attrs: {
        id: 'email-label',
        for: 'email',
        'aria-label': 'Email',
        'data-kind': 'field-label',
        class: 'custom',
        style: 'display: block',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('email-label');
    expect(wrapper.attributes('for')).toBe('email');
    expect(wrapper.attributes('aria-label')).toBe('Email');
    expect(wrapper.attributes('data-kind')).toBe('field-label');
    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('display: block');

    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each<LabelSize>(['small', 'medium', 'large'])('applies the %s size', size => {
    expect(mount(Label, { props: { size } }).classes()).toContain(`fui-Label--${size}`);
  });

  it.each<LabelWeight>(['regular', 'semibold'])('applies the %s weight', weight => {
    expect(mount(Label, { props: { weight } }).classes()).toContain(`fui-Label--${weight}`);
  });

  it('applies the disabled visual state without inventing native disabled semantics', () => {
    const wrapper = mount(Label, { props: { disabled: true } });

    expect(wrapper.classes()).toContain('fui-Label--disabled');
    expect(wrapper.attributes('disabled')).toBeUndefined();
    expect(wrapper.attributes('aria-disabled')).toBeUndefined();
  });

  it('renders the default visual required indicator after label content', () => {
    const wrapper = mount(Label, {
      props: { required: true },
      slots: { default: 'Email address' },
    });
    const indicator = wrapper.get('.fui-Label__required');

    expect(wrapper.text()).toBe('Email address*');
    expect(wrapper.element.lastElementChild).toBe(indicator.element);
    expect(indicator.text()).toBe('*');
    expect(indicator.attributes('aria-hidden')).toBe('true');
  });

  it('renders custom required text and omits false or empty indicators', () => {
    const custom = mount(Label, { props: { required: '(required)' } });
    const disabled = mount(Label, { props: { required: false } });
    const empty = mount(Label, { props: { required: '' } });

    expect(custom.get('.fui-Label__required').text()).toBe('(required)');
    expect(disabled.find('.fui-Label__required').exists()).toBe(false);
    expect(empty.find('.fui-Label__required').exists()).toBe(false);
  });

  it('lets the decorative required slot override the prop', () => {
    const wrapper = mount(Label, {
      props: { required: 'ignored' },
      slots: { required: '<abbr title="required">Required</abbr>' },
    });
    const indicator = wrapper.get('.fui-Label__required');

    expect(indicator.text()).toBe('Required');
    expect(indicator.attributes('aria-hidden')).toBe('true');
  });

  it('renders a required slot even without the required prop', () => {
    const wrapper = mount(Label, {
      slots: { required: '<span data-required>!</span>' },
    });

    expect(wrapper.get('[data-required]').text()).toBe('!');
  });

  it('exposes only the native label element', () => {
    const wrapper = mount(Label);
    const vm = wrapper.vm as unknown as { element: HTMLLabelElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
  });

  it('does not define component-specific emitted events', () => {
    const wrapper = mount(Label);
    expect(wrapper.emitted()).toEqual({});
  });
});

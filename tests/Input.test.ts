import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import Input from '../src/components/Input/Input.vue';

describe('FInput', () => {
  it('renders an input with upstream defaults', () => {
    const wrapper = mount(Input);
    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('text');
    expect(wrapper.classes()).toContain('fui-Input--outline');
    expect(wrapper.classes()).toContain('fui-Input--medium');
    expect(input.element.value).toBe('');
  });

  it('supports uncontrolled defaultValue and ignores later default updates', async () => {
    const wrapper = mount(Input, { props: { defaultValue: 'hello' } });
    const input = wrapper.get('input');

    expect(input.element.value).toBe('hello');
    await input.setValue('world');
    expect(input.element.value).toBe('world');

    await wrapper.setProps({ defaultValue: 'ignored' });
    expect(input.element.value).toBe('world');
  });

  it('supports controlled modelValue and does not self-update without a prop update', async () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } });
    const input = wrapper.get('input');

    input.element.value = 'world';
    await input.trigger('input');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world']);
    expect(wrapper.emitted('input')?.[0]?.[1]).toEqual({ value: 'world' });
    expect(input.element.value).toBe('hello');

    await wrapper.setProps({ modelValue: 'world' });
    expect(input.element.value).toBe('world');
  });

  it('prefers modelValue when modelValue and defaultValue are both provided', () => {
    const wrapper = mount(Input, {
      props: { modelValue: 'controlled', defaultValue: 'default' },
    });

    expect(wrapper.get('input').element.value).toBe('controlled');
  });

  it('treats an explicitly bound undefined modelValue as controlled', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: undefined, defaultValue: 'default' },
    });
    const input = wrapper.get('input');

    expect(input.element.value).toBe('');
    input.element.value = 'typed';
    await input.trigger('input');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['typed']);
    expect(input.element.value).toBe('');
  });

  it('emits change data for native change events without duplicating v-model updates', async () => {
    const wrapper = mount(Input);
    const input = wrapper.get('input');

    input.element.value = 'changed';
    await input.trigger('input');
    await input.trigger('change');

    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 'changed' });
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
  });

  it('forwards input attributes while applying class and style to the wrapper', () => {
    const wrapper = mount(Input, {
      attrs: {
        class: 'custom',
        style: 'width: 18rem',
        id: 'email',
        placeholder: 'name@example.com',
        maxlength: '30',
        'aria-invalid': 'true',
      },
    });

    expect(wrapper.classes()).toContain('custom');
    expect(wrapper.attributes('style')).toContain('width: 18rem');
    expect(wrapper.get('input').attributes('id')).toBe('email');
    expect(wrapper.get('input').attributes('placeholder')).toBe('name@example.com');
    expect(wrapper.classes()).toContain('fui-Input--invalid');
  });

  it('renders content slots around the input in the expected order', () => {
    const wrapper = mount(Input, {
      slots: {
        'content-before': '<span data-before>$</span>',
        'content-after': '<span data-after>USD</span>',
      },
    });

    expect(wrapper.element.children[0].classList).toContain('fui-Input__contentBefore');
    expect(wrapper.element.children[1].tagName).toBe('INPUT');
    expect(wrapper.element.children[2].classList).toContain('fui-Input__contentAfter');
    expect(wrapper.classes()).toContain('fui-Input--with-content-before');
    expect(wrapper.classes()).toContain('fui-Input--with-content-after');
    expect(wrapper.get('[data-before]').element.closest('[aria-hidden="true"]')).toBeNull();
    expect(wrapper.get('[data-after]').element.closest('[aria-hidden="true"]')).toBeNull();
  });

  it('keeps interactive adornment content available to assistive technology', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Input, {
      slots: {
        'content-after': () =>
          h('button', { type: 'button', 'aria-label': 'Clear input', onClick }, 'Clear'),
      },
    });

    const button = wrapper.get('button');
    expect(button.element.closest('[aria-hidden="true"]')).toBeNull();
    await button.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('reflects disabled and appearance classes', () => {
    const wrapper = mount(Input, {
      props: { appearance: 'filled-darker', size: 'large' },
      attrs: { disabled: true },
    });

    expect(wrapper.classes()).toContain('fui-Input--filled-darker');
    expect(wrapper.classes()).toContain('fui-Input--large');
    expect(wrapper.classes()).toContain('fui-Input--disabled');
    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
  });

  it('consumes Field context while preserving explicit control overrides', () => {
    const automatic = mount(Field, {
      props: {
        label: 'Email',
        hint: 'Use a work address',
        validationMessage: 'Invalid email',
        required: true,
      },
      slots: { default: () => h(Input) },
    });
    const overridden = mount(Field, {
      props: {
        label: 'Email',
        validationMessage: 'Invalid email',
        required: true,
      },
      slots: {
        default: () =>
          h(Input, {
            id: 'explicit-email',
            required: false,
            'aria-invalid': 'false',
            'aria-describedby': 'external-help',
          }),
      },
    });

    const automaticInput = automatic.get('input');
    expect(automaticInput.attributes('id')).toBe(automatic.get('label').attributes('for'));
    expect(automaticInput.attributes('required')).toBeDefined();
    expect(automaticInput.attributes('aria-invalid')).toBe('true');
    expect(automaticInput.attributes('aria-describedby')?.split(' ')).toHaveLength(2);

    const overriddenInput = overridden.get('input');
    expect(overriddenInput.attributes('id')).toBe('explicit-email');
    expect(overriddenInput.attributes('required')).toBeUndefined();
    expect(overriddenInput.attributes('aria-invalid')).toBe('false');
    expect(overriddenInput.attributes('aria-describedby')).toContain('external-help');
  });

  it('does not emit updates when only the model prop changes', async () => {
    const wrapper = mount(Input, { props: { modelValue: 'one' } });
    await wrapper.setProps({ modelValue: 'two' });

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('input')).toBeUndefined();
  });

  it('exposes focus and select methods for the native input', () => {
    const wrapper = mount(Input, { attachTo: document.body });
    const vm = wrapper.vm as unknown as { focus: () => void; select: () => void };
    const element = wrapper.get('input').element;
    const focus = vi.spyOn(element, 'focus');
    const select = vi.spyOn(element, 'select');

    vm.focus();
    vm.select();

    expect(focus).toHaveBeenCalledOnce();
    expect(select).toHaveBeenCalledOnce();
  });
});

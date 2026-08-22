import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from '../src/components/Checkbox/Checkbox.vue';
import Field from '../src/components/Field/Field.vue';

describe('FCheckbox', () => {
  it('renders an unchecked native checkbox with upstream defaults', () => {
    const wrapper = mount(Checkbox);
    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('checkbox');
    expect(input.element.checked).toBe(false);
    expect(input.element.indeterminate).toBe(false);
    expect(wrapper.classes()).toContain('fui-Checkbox--square');
    expect(wrapper.classes()).toContain('fui-Checkbox--medium');
    expect(wrapper.classes()).toContain('fui-Checkbox--label-after');
  });

  it('supports uncontrolled checked state', async () => {
    const wrapper = mount(Checkbox, { props: { defaultChecked: true } });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(true);
    await input.setValue(false);

    expect(wrapper.classes()).toContain('fui-Checkbox--unchecked');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ checked: false });
  });

  it('supports controlled modelValue and restores the controlled DOM state', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: true } });
    const input = wrapper.get('input');

    await input.setValue(false);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(input.element.checked).toBe(true);

    await wrapper.setProps({ modelValue: false });
    expect(input.element.checked).toBe(false);
  });

  it('treats an explicitly bound undefined modelValue as controlled', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: undefined, defaultChecked: true },
    });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(false);
    await input.setValue(true);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(input.element.checked).toBe(false);
  });

  it('sets native indeterminate state for mixed values', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: 'mixed' } });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(false);
    expect(input.element.indeterminate).toBe(true);
    expect(wrapper.classes()).toContain('fui-Checkbox--mixed');
    expect(wrapper.find('.fui-Checkbox__mixedMark').exists()).toBe(true);

    await wrapper.setProps({ modelValue: true });
    expect(input.element.indeterminate).toBe(false);
    expect(input.element.checked).toBe(true);
  });

  it('associates generated and supplied ids with labels', () => {
    const generated = mount(Checkbox, { props: { label: 'Accept terms' } });
    const supplied = mount(Checkbox, {
      props: { label: 'Subscribe' },
      attrs: { id: 'subscribe' },
    });

    expect(generated.get('label').attributes('for')).toBe(generated.get('input').attributes('id'));
    expect(supplied.get('input').attributes('id')).toBe('subscribe');
    expect(supplied.get('label').attributes('for')).toBe('subscribe');
  });

  it('renders label before or after the indicator', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Label', labelPosition: 'before' } });

    expect(wrapper.element.children[1].tagName).toBe('LABEL');
    expect(wrapper.element.children[2].classList).toContain('fui-Checkbox__indicator');

    await wrapper.setProps({ labelPosition: 'after' });
    expect(wrapper.element.children[1].classList).toContain('fui-Checkbox__indicator');
    expect(wrapper.element.children[2].tagName).toBe('LABEL');
  });

  it('supports custom label and indicator slots', () => {
    const wrapper = mount(Checkbox, {
      slots: {
        label: '<strong>Custom label</strong>',
        indicator: '<span data-indicator>✓</span>',
      },
    });

    expect(wrapper.get('label strong').text()).toBe('Custom label');
    expect(wrapper.get('[data-indicator]').text()).toBe('✓');
    expect(wrapper.get('[data-indicator]').element.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('forwards native attributes and disabled state to the input', () => {
    const wrapper = mount(Checkbox, {
      props: { disabled: true, shape: 'circular', size: 'large' },
      attrs: { name: 'terms', required: true, value: 'accepted', 'aria-invalid': 'true' },
    });

    const input = wrapper.get('input');
    expect(input.attributes('name')).toBe('terms');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('value')).toBe('accepted');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('fui-Checkbox--disabled');
    expect(wrapper.classes()).toContain('fui-Checkbox--circular');
    expect(wrapper.classes()).toContain('fui-Checkbox--large');
  });

  it('consumes Field context without adding a duplicate internal label', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Accept terms',
        hint: 'Required to continue',
        required: true,
      },
      slots: { default: () => h(Checkbox) },
    });
    const input = wrapper.get('input[type="checkbox"]');

    expect(wrapper.findAll('label')).toHaveLength(1);
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-describedby')).toBe(
      wrapper.get('.fui-Field__hint').attributes('id'),
    );
  });

  it('ignores later defaultChecked updates in uncontrolled mode', async () => {
    const wrapper = mount(Checkbox, { props: { defaultChecked: false } });
    await wrapper.setProps({ defaultChecked: true });

    expect(wrapper.get('input').element.checked).toBe(false);
  });

  it('exposes focus for the native checkbox input', () => {
    const wrapper = mount(Checkbox, { attachTo: document.body });
    const focus = (wrapper.vm as unknown as { focus: () => void }).focus;
    const spy = vi.spyOn(wrapper.get('input').element, 'focus');

    focus();
    expect(spy).toHaveBeenCalledOnce();
  });
});

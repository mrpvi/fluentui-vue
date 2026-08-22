import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Radio from '../src/components/Radio/Radio.vue';
import RadioGroup from '../src/components/RadioGroup/RadioGroup.vue';

function isChecked(element: Element): boolean {
  return (element as HTMLInputElement).checked;
}

describe('FRadio', () => {
  it('renders a native radio with its required string value and defaults', () => {
    const wrapper = mount(Radio, { props: { value: 'alpha' } });
    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('radio');
    expect(input.attributes('value')).toBe('alpha');
    expect(input.element.checked).toBe(false);
    expect(wrapper.classes()).toContain('fui-Radio--label-after');
  });

  it('supports uncontrolled standalone state and ignores later defaultChecked updates', async () => {
    const wrapper = mount(Radio, { props: { value: 'alpha', defaultChecked: true } });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(true);
    await wrapper.setProps({ defaultChecked: false });
    expect(input.element.checked).toBe(true);
  });

  it('supports controlled standalone state and restores the controlled DOM state', async () => {
    const wrapper = mount(Radio, { props: { value: 'alpha', modelValue: false } });
    const input = wrapper.get('input');

    await input.setValue(true);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 'alpha' });
    expect(input.element.checked).toBe(false);

    await wrapper.setProps({ modelValue: true });
    expect(input.element.checked).toBe(true);
  });

  it('treats explicitly bound undefined modelValue as controlled', async () => {
    const wrapper = mount(Radio, {
      props: { value: 'alpha', modelValue: undefined, defaultChecked: true },
    });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(false);
    await input.setValue(true);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    expect(input.element.checked).toBe(false);
  });

  it('only emits its local events when selected', async () => {
    const wrapper = mount(Radio, { props: { value: 'alpha' } });
    const input = wrapper.get('input');

    input.element.checked = false;
    await input.trigger('change');
    expect(wrapper.emitted('change')).toBeUndefined();

    input.element.checked = true;
    await input.trigger('change');
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
  });

  it('generates an associated label id and honors a supplied id', () => {
    const generated = mount(Radio, { props: { value: 'a', label: 'Alpha' } });
    const supplied = mount(Radio, {
      props: { value: 'b', label: 'Beta' },
      attrs: { id: 'beta-radio' },
    });

    expect(generated.get('label').attributes('for')).toBe(generated.get('input').attributes('id'));
    expect(supplied.get('input').attributes('id')).toBe('beta-radio');
    expect(supplied.get('label').attributes('for')).toBe('beta-radio');
  });

  it('renders the label below and supports label and decorative indicator slots', () => {
    const wrapper = mount(Radio, {
      props: { value: 'alpha', labelPosition: 'below' },
      slots: {
        label: '<strong>Custom label</strong>',
        indicator: '<span data-indicator>dot</span>',
      },
    });

    expect(wrapper.classes()).toContain('fui-Radio--label-below');
    expect(wrapper.element.children[1].classList).toContain('fui-Radio__indicator');
    expect(wrapper.get('label strong').text()).toBe('Custom label');
    expect(wrapper.get('[data-indicator]').element.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('routes class and style to the root and remaining attributes to the input', () => {
    const wrapper = mount(Radio, {
      props: { value: 'alpha', disabled: true },
      attrs: {
        class: 'custom-radio',
        style: 'margin-inline-start: 4px',
        name: 'choice',
        required: true,
        'aria-label': 'Alpha choice',
        'aria-invalid': 'true',
        'data-radio': 'alpha',
        type: 'checkbox',
        checked: false,
      },
    });
    const input = wrapper.get('input');

    expect(wrapper.classes()).toContain('custom-radio');
    expect(wrapper.attributes('style')).toContain('margin-inline-start: 4px');
    expect(wrapper.attributes('data-radio')).toBeUndefined();
    expect(input.attributes('type')).toBe('radio');
    expect(input.attributes('name')).toBe('choice');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-label')).toBe('Alpha choice');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('data-radio')).toBe('alpha');
    expect(input.attributes('disabled')).toBeDefined();
  });

  it('uses native common-name exclusivity without custom keyboard handlers', async () => {
    const wrapper = mount({
      render: () =>
        h('div', [
          h(Radio, { value: 'a', name: 'letters', label: 'A' }),
          h(Radio, { value: 'b', name: 'letters', label: 'B' }),
        ]),
    });
    const inputs = wrapper.findAll('input[type="radio"]');

    await inputs[0].setValue(true);
    await inputs[1].setValue(true);

    expect(isChecked(inputs[0].element)).toBe(false);
    expect(isChecked(inputs[1].element)).toBe(true);
    expect(wrapper.findAll('[keydown]').length).toBe(0);
  });

  it('restores uncontrolled native state and reapplies controlled state on form reset', async () => {
    const uncontrolled = mount({
      render: () => h('form', [h(Radio, { value: 'a', defaultChecked: true })]),
    });
    const uncontrolledInput = uncontrolled.get('input');
    uncontrolledInput.element.checked = false;
    uncontrolled.get('form').element.reset();
    await vi.waitFor(() => expect(uncontrolledInput.element.checked).toBe(true));

    const controlled = mount({
      render: () => h('form', [h(Radio, { value: 'a', modelValue: true })]),
    });
    const controlledInput = controlled.get('input');
    controlledInput.element.checked = false;
    controlled.get('form').element.reset();
    await vi.waitFor(() => expect(controlledInput.element.checked).toBe(true));
  });

  it('exposes the native input and focus method', () => {
    const wrapper = mount(Radio, { props: { value: 'alpha' }, attachTo: document.body });
    const exposed = wrapper.vm as unknown as {
      element: HTMLInputElement;
      focus: () => void;
    };
    const spy = vi.spyOn(wrapper.get('input').element, 'focus');

    expect(exposed.element).toBe(wrapper.get('input').element);
    exposed.focus();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('works as a labeled child of RadioGroup', () => {
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'b' },
      slots: {
        default: () => [
          h(Radio, { value: 'a', label: 'Alpha' }),
          h(Radio, { value: 'b', label: 'Beta' }),
        ],
      },
    });

    expect(isChecked(wrapper.get('input[value="a"]').element)).toBe(false);
    expect(isChecked(wrapper.get('input[value="b"]').element)).toBe(true);
    expect(wrapper.get('label[for]').text()).toBe('Alpha');
  });
});

import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import Select from '../src/components/Select/Select.vue';

const options = () => [
  h('option', { value: '' }, 'Choose one'),
  h('optgroup', { label: 'Pets' }, [
    h('option', { value: 'cat' }, 'Cat'),
    h('option', { value: 'dog' }, 'Dog'),
  ]),
];

async function resetForm(form: HTMLFormElement) {
  form.reset();
  await new Promise((resolve) => setTimeout(resolve));
  await nextTick();
}

describe('FSelect', () => {
  it('renders a native select with option and optgroup content', () => {
    const wrapper = mount(Select, { slots: { default: options } });
    const select = wrapper.get('select');

    expect(wrapper.classes()).toContain('fui-Select');
    expect(wrapper.classes()).toContain('fui-Select--outline');
    expect(wrapper.classes()).toContain('fui-Select--medium');
    expect(select.findAll('option')).toHaveLength(3);
    expect(select.get('optgroup').attributes('label')).toBe('Pets');
    expect(select.element.value).toBe('');
  });

  it('supports uncontrolled defaultValue once and ignores later default changes', async () => {
    const wrapper = mount(Select, {
      props: { defaultValue: 'dog' },
      slots: { default: options },
    });
    const select = wrapper.get('select');

    expect(select.element.value).toBe('dog');
    select.element.value = 'cat';
    await select.trigger('change');
    expect(select.element.value).toBe('cat');

    await wrapper.setProps({ defaultValue: 'dog' });
    expect(select.element.value).toBe('cat');
  });

  it('keeps a controlled DOM value until the parent updates it', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'cat' },
      slots: { default: options },
    });
    const select = wrapper.get('select');

    select.element.value = 'dog';
    await select.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toEqual([['dog']]);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 'dog' });
    expect(select.element.value).toBe('cat');

    await wrapper.setProps({ modelValue: 'dog' });
    expect(select.element.value).toBe('dog');
  });

  it('prefers modelValue over defaultValue', () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'cat', defaultValue: 'dog' },
      slots: { default: options },
    });

    expect(wrapper.get('select').element.value).toBe('cat');
  });

  it('treats an explicitly bound undefined modelValue as controlled empty string', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: undefined, defaultValue: 'cat' },
      slots: { default: options },
    });
    const select = wrapper.get('select');

    expect(select.element.value).toBe('');
    select.element.value = 'dog';
    await select.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toEqual([['dog']]);
    expect(select.element.value).toBe('');
  });

  it('emits update and change exactly once per native change', async () => {
    const wrapper = mount(Select, { slots: { default: options } });
    const select = wrapper.get('select');

    select.element.value = 'cat';
    await select.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')?.[0]?.[0]).toBeInstanceOf(Event);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 'cat' });
  });

  it('does not emit interaction events for prop-only updates', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: 'cat' },
      slots: { default: options },
    });

    await wrapper.setProps({ modelValue: 'dog' });

    expect(wrapper.get('select').element.value).toBe('dog');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('routes native and ARIA attributes to select while root owns class and style', () => {
    const wrapper = mount(Select, {
      attrs: {
        class: 'custom-select',
        style: 'width: 18rem',
        id: 'pet',
        name: 'pet',
        required: true,
        disabled: true,
        autocomplete: 'off',
        'aria-label': 'Pet',
        'aria-invalid': 'true',
        value: 'dog',
        selected: true,
        size: 5,
      },
      slots: { default: options },
    });
    const select = wrapper.get('select');

    expect(wrapper.classes()).toContain('custom-select');
    expect(wrapper.attributes('style')).toContain('width: 18rem');
    expect(wrapper.attributes('id')).toBeUndefined();
    expect(select.attributes('id')).toBe('pet');
    expect(select.attributes('name')).toBe('pet');
    expect(select.attributes('required')).toBeDefined();
    expect(select.attributes('disabled')).toBeDefined();
    expect(select.attributes('aria-label')).toBe('Pet');
    expect(select.attributes('value')).toBeUndefined();
    expect(select.attributes('selected')).toBeUndefined();
    expect(select.attributes('size')).toBeUndefined();
    expect(wrapper.classes()).toContain('fui-Select--disabled');
    expect(wrapper.classes()).toContain('fui-Select--invalid');
  });

  it('preserves released runtime behavior for a raw multiple attribute with scalar events', async () => {
    const wrapper = mount(Select, {
      attrs: { multiple: true },
      slots: { default: options },
    });
    const select = wrapper.get('select');

    expect(select.attributes('multiple')).toBeDefined();
    select.element.options[1].selected = true;
    select.element.options[0].selected = false;
    await select.trigger('change');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['cat']);
  });

  it('integrates with Field label, required, description, invalid, and size context', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Pet',
        hint: 'Select a companion',
        validationMessage: 'Choose a pet',
        required: true,
        size: 'large',
      },
      slots: { default: () => h(Select, null, { default: options }) },
    });
    const selectWrapper = wrapper.getComponent(Select);
    const select = wrapper.get('select');

    expect(select.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(select.attributes('required')).toBeDefined();
    expect(select.attributes('aria-invalid')).toBe('true');
    expect(select.attributes('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(selectWrapper.classes()).toContain('fui-Select--large');
  });

  it('preserves explicit Field overrides', () => {
    const wrapper = mount(Field, {
      props: { label: 'Pet', validationMessage: 'Choose a pet', required: true, size: 'large' },
      slots: {
        default: () =>
          h(
            Select,
            {
              id: 'explicit-pet',
              required: false,
              'aria-invalid': 'false',
              'aria-describedby': 'external-help',
              size: 'small',
            },
            { default: options },
          ),
      },
    });
    const selectWrapper = wrapper.getComponent(Select);
    const select = wrapper.get('select');

    expect(select.attributes('id')).toBe('explicit-pet');
    expect(select.attributes('required')).toBeUndefined();
    expect(select.attributes('aria-invalid')).toBe('false');
    expect(select.attributes('aria-describedby')).toContain('external-help');
    expect(selectWrapper.classes()).toContain('fui-Select--small');
  });

  it('renders the decorative icon after select and hides it from assistive technology', () => {
    const wrapper = mount(Select, {
      slots: {
        default: options,
        icon: '<svg data-custom-icon><path /></svg>',
      },
    });
    const icon = wrapper.get('.fui-Select__icon');

    expect(wrapper.element.children[0].tagName).toBe('SELECT');
    expect(wrapper.element.children[1]).toBe(icon.element);
    expect(icon.attributes('aria-hidden')).toBe('true');
    expect(icon.find('[data-custom-icon]').exists()).toBe(true);
  });

  it('exposes the primary element and focus method', () => {
    const wrapper = mount(Select, { attachTo: document.body, slots: { default: options } });
    const vm = wrapper.vm as unknown as {
      element: HTMLSelectElement;
      focus: () => void;
    };
    const element = wrapper.get('select').element;
    const focus = vi.spyOn(element, 'focus');

    expect(vm.element).toBe(element);
    vm.focus();
    expect(focus).toHaveBeenCalledOnce();

    wrapper.unmount();
  });

  it.each([
    ['outline', 'small'],
    ['underline', 'medium'],
    ['filled-darker', 'large'],
    ['filled-lighter', 'medium'],
  ] as const)('applies %s appearance and %s size classes', (appearance, size) => {
    const wrapper = mount(Select, { props: { appearance, size }, slots: { default: options } });

    expect(wrapper.classes()).toContain(`fui-Select--${appearance}`);
    expect(wrapper.classes()).toContain(`fui-Select--${size}`);
  });

  it('uses the first option by default and restores it on native form reset', async () => {
    const wrapper = mount({
      setup: () => () =>
        h('form', null, [
          h(Select, null, {
            default: () => [
              h('option', { value: 'first' }, 'First'),
              h('option', { value: 'second' }, 'Second'),
            ],
          }),
        ]),
    });
    const form = wrapper.get('form').element;
    const select = wrapper.get('select');

    expect(select.element.value).toBe('first');
    select.element.value = 'second';
    await select.trigger('change');
    expect(select.element.value).toBe('second');

    await resetForm(form);
    expect(select.element.value).toBe('first');
  });

  it('restores uncontrolled defaultValue on native form reset', async () => {
    const wrapper = mount({
      setup: () => () =>
        h('form', null, [
          h(
            Select,
            { defaultValue: 'second' },
            {
              default: () => [
                h('option', { value: 'first' }, 'First'),
                h('option', { value: 'second' }, 'Second'),
              ],
            },
          ),
        ]),
    });
    const form = wrapper.get('form').element;
    const select = wrapper.get('select');

    expect(select.element.value).toBe('second');
    select.element.value = 'first';
    await select.trigger('change');
    await resetForm(form);

    expect(select.element.value).toBe('second');
  });

  it('reapplies a controlled value after native form reset', async () => {
    const wrapper = mount({
      setup: () => () =>
        h('form', null, [
          h(
            Select,
            { modelValue: 'second' },
            {
              default: () => [
                h('option', { value: 'first' }, 'First'),
                h('option', { value: 'second' }, 'Second'),
              ],
            },
          ),
        ]),
    });
    const form = wrapper.get('form').element;
    const select = wrapper.get('select');

    select.element.value = 'first';
    await resetForm(form);
    expect(select.element.value).toBe('second');
  });
});

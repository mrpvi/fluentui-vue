import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import Radio from '../src/components/Radio/Radio.vue';
import RadioGroup from '../src/components/RadioGroup/RadioGroup.vue';

function isChecked(element: Element): boolean {
  return (element as HTMLInputElement).checked;
}

function radioChildren(overrides: Record<string, unknown> = {}) {
  return () => [
    h(Radio, { value: 'a', label: 'Alpha', ...overrides }),
    h(Radio, { value: 'b', label: 'Beta', ...overrides }),
    h(Radio, { value: 'c', label: 'Gamma', ...overrides }),
  ];
}

describe('FRadioGroup', () => {
  it('renders a vertical radiogroup and routes attrs, class, style, and default slot', () => {
    const wrapper = mount(RadioGroup, {
      attrs: {
        class: 'custom-group',
        style: 'margin-left: 2px',
        'aria-label': 'Letters',
        'data-group': 'letters',
      },
      slots: { default: radioChildren() },
    });

    expect(wrapper.attributes('role')).toBe('radiogroup');
    expect(wrapper.classes()).toContain('fui-RadioGroup--vertical');
    expect(wrapper.classes()).toContain('custom-group');
    expect(wrapper.attributes('style')).toContain('margin-left: 2px');
    expect(wrapper.attributes('aria-label')).toBe('Letters');
    expect(wrapper.attributes('data-group')).toBe('letters');
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3);
  });

  it.each(['vertical', 'horizontal', 'horizontal-stacked'] as const)(
    'applies the %s layout class',
    (layout) => {
      const wrapper = mount(RadioGroup, { props: { layout } });
      expect(wrapper.classes()).toContain(`fui-RadioGroup--${layout}`);
    },
  );

  it('supplies an explicit group name and generates one stable common name otherwise', async () => {
    const explicit = mount(RadioGroup, {
      props: { name: 'letters' },
      slots: { default: radioChildren() },
    });
    expect(explicit.findAll('input').map((input) => input.attributes('name'))).toEqual([
      'letters',
      'letters',
      'letters',
    ]);

    const generated = mount(RadioGroup, { slots: { default: radioChildren() } });
    const initialNames = generated.findAll('input').map((input) => input.attributes('name'));
    expect(initialNames[0]).toBeTruthy();
    expect(new Set(initialNames).size).toBe(1);
    await generated.setProps({ disabled: true });
    expect(generated.findAll('input').map((input) => input.attributes('name'))).toEqual(
      initialNames,
    );
  });

  it('allows explicit radio attrs and props to override inheritable group values', () => {
    const wrapper = mount(RadioGroup, {
      props: {
        name: 'group-name',
        disabled: true,
        required: true,
        layout: 'horizontal-stacked',
      },
      attrs: { 'aria-describedby': 'group-description' },
      slots: {
        default: () => [
          h(Radio, { value: 'a', label: 'Inherited' }),
          h(Radio, {
            value: 'b',
            label: 'Local',
            name: 'local-name',
            disabled: false,
            required: false,
            labelPosition: 'after',
            'aria-describedby': 'local-description',
          }),
        ],
      },
    });
    const inputs = wrapper.findAll('input');

    expect(inputs[0].attributes('name')).toBe('group-name');
    expect(inputs[0].attributes('disabled')).toBeDefined();
    expect(inputs[0].attributes('required')).toBeDefined();
    expect(inputs[0].attributes('aria-describedby')).toBe('group-description');
    expect(wrapper.findAllComponents(Radio)[0].classes()).toContain('fui-Radio--label-below');

    expect(inputs[1].attributes('name')).toBe('local-name');
    expect(inputs[1].attributes('disabled')).toBeUndefined();
    expect(inputs[1].attributes('required')).toBeUndefined();
    expect(inputs[1].attributes('aria-describedby')).toBe('local-description');
    expect(wrapper.findAllComponents(Radio)[1].classes()).toContain('fui-Radio--label-after');
  });

  it('supports uncontrolled defaultValue and ignores later defaultValue updates', async () => {
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'c' },
      slots: { default: radioChildren() },
    });

    expect(wrapper.findAll('input').map((input) => isChecked(input.element))).toEqual([
      false,
      false,
      true,
    ]);
    await wrapper.setProps({ defaultValue: 'b' });
    expect(wrapper.findAll('input').map((input) => isChecked(input.element))).toEqual([
      false,
      false,
      true,
    ]);
  });

  it('supports controlled modelValue updates and explicit undefined controlledness', async () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a' },
      slots: { default: radioChildren() },
    });
    expect(wrapper.findAll('input').map((input) => isChecked(input.element))).toEqual([
      true,
      false,
      false,
    ]);

    await wrapper.setProps({ modelValue: 'b' });
    expect(wrapper.findAll('input').map((input) => isChecked(input.element))).toEqual([
      false,
      true,
      false,
    ]);

    const explicitUndefined = mount(RadioGroup, {
      props: { modelValue: undefined, defaultValue: 'c' },
      slots: { default: radioChildren() },
    });
    expect(explicitUndefined.findAll('input').map((input) => isChecked(input.element))).toEqual([
      false,
      false,
      false,
    ]);
  });

  it('lets explicit radio checked state override group selection', () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a' },
      slots: {
        default: () => [
          h(Radio, { value: 'a', label: 'Alpha' }),
          h(Radio, { value: 'b', label: 'Beta', modelValue: true }),
        ],
      },
    });

    expect(isChecked(wrapper.get('input[value="a"]').element)).toBe(false);
    expect(isChecked(wrapper.get('input[value="b"]').element)).toBe(true);
  });

  it('updates uncontrolled selection and emits local and delegated events exactly once', async () => {
    const wrapper = mount(RadioGroup, { slots: { default: radioChildren() } });
    const beta = wrapper.get('input[value="b"]');

    await beta.setValue(true);

    expect(wrapper.emitted('update:modelValue')).toEqual([['b']]);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 'b' });
    const betaComponent = wrapper.findAllComponents(Radio)[1];
    expect(betaComponent.emitted('update:modelValue')).toEqual([[true]]);
    expect(betaComponent.emitted('change')).toHaveLength(1);
    expect(wrapper.findAll('input').map((input) => isChecked(input.element))).toEqual([
      false,
      true,
      false,
    ]);
  });

  it('keeps controlled selection until the parent updates and still emits once', async () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a' },
      slots: { default: radioChildren() },
    });

    await wrapper.get('input[value="b"]').setValue(true);
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([['b']]);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.findAll('input').map((input) => isChecked(input.element))).toEqual([
      true,
      false,
      false,
    ]);
  });

  it('filters delegated change events to radio inputs only', async () => {
    const wrapper = mount(RadioGroup, {
      slots: { default: () => [h('input', { type: 'checkbox' }), h('select', [h('option')])] },
    });

    await wrapper.get('input[type="checkbox"]').setValue(true);
    await wrapper.get('select').trigger('change');

    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('integrates Field labeling, description, invalid, and required state and propagates descendants', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Pick a letter',
        hint: 'Choose one option',
        validationMessage: 'Selection required',
        required: true,
      },
      slots: {
        default: () => h(RadioGroup, null, { default: radioChildren() }),
      },
    });
    const group = wrapper.get('[role="radiogroup"]');
    const descriptionIds = [
      wrapper.get('.fui-Field__validationMessage').attributes('id'),
      wrapper.get('.fui-Field__hint').attributes('id'),
    ].join(' ');

    expect(group.attributes('aria-labelledby')).toBe(wrapper.get('label').attributes('id'));
    expect(group.attributes('aria-describedby')).toBe(descriptionIds);
    expect(group.attributes('aria-invalid')).toBe('true');
    expect(group.attributes('aria-required')).toBe('true');
    for (const input of wrapper.findAll('input[type="radio"]')) {
      expect(input.attributes('required')).toBeDefined();
      expect(input.attributes('aria-describedby')).toBe(descriptionIds);
      expect(input.attributes('aria-invalid')).toBe('true');
    }
  });

  it('restores uncontrolled selection and reapplies controlled selection on form reset', async () => {
    const uncontrolled = mount({
      render: () => h('form', [h(RadioGroup, { defaultValue: 'a' }, { default: radioChildren() })]),
    });
    await uncontrolled.get('input[value="b"]').setValue(true);
    uncontrolled.get('form').element.reset();
    await vi.waitFor(() =>
      expect(uncontrolled.findAll('input').map((input) => isChecked(input.element))).toEqual([
        true,
        false,
        false,
      ]),
    );

    const controlled = mount({
      render: () => h('form', [h(RadioGroup, { modelValue: 'a' }, { default: radioChildren() })]),
    });
    (controlled.get('input[value="a"]').element as HTMLInputElement).checked = false;
    (controlled.get('input[value="b"]').element as HTMLInputElement).checked = true;
    controlled.get('form').element.reset();
    await vi.waitFor(() =>
      expect(controlled.findAll('input').map((input) => isChecked(input.element))).toEqual([
        true,
        false,
        false,
      ]),
    );
  });

  it('exposes the root and focuses the first enabled radio', () => {
    const wrapper = mount(RadioGroup, {
      attachTo: document.body,
      slots: { default: radioChildren({ disabled: false }) },
    });
    const exposed = wrapper.vm as unknown as {
      element: HTMLDivElement;
      focus: () => void;
    };
    const firstInput = wrapper.get('input').element;
    const spy = vi.spyOn(firstInput, 'focus');

    expect(exposed.element).toBe(wrapper.element);
    exposed.focus();
    expect(spy).toHaveBeenCalledOnce();
  });
});

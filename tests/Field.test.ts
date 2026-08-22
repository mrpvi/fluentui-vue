import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from '../src/components/Checkbox/Checkbox.vue';
import Field from '../src/components/Field/Field.vue';
import type {
  FieldOrientation,
  FieldSize,
  FieldValidationState,
} from '../src/components/Field/Field.types';
import Input from '../src/components/Input/Input.vue';

describe('FField', () => {
  it('renders an empty vertical medium field with upstream defaults', () => {
    const wrapper = mount(Field);

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Field',
        'fui-Field--vertical',
        'fui-Field--medium',
        'fui-Field--validation-none',
      ]),
    );
    expect(wrapper.find('label').exists()).toBe(false);
    expect(wrapper.find('.fui-Field__validationMessage').exists()).toBe(false);
    expect(wrapper.find('.fui-Field__hint').exists()).toBe(false);
  });

  it.each<FieldOrientation>(['vertical', 'horizontal'])(
    'applies the %s orientation',
    orientation => {
      expect(mount(Field, { props: { orientation } }).classes()).toContain(
        `fui-Field--${orientation}`,
      );
    },
  );

  it.each<FieldSize>(['small', 'medium', 'large'])(
    'applies the %s size to the field and label',
    size => {
      const wrapper = mount(Field, {
        props: { label: 'Name', size },
      });

      expect(wrapper.classes()).toContain(`fui-Field--${size}`);
      expect(wrapper.get('label').classes()).toContain(`fui-Label--${size}`);
    },
  );

  it.each<FieldValidationState>(['none', 'error', 'warning', 'success'])(
    'applies the %s validation state',
    validationState => {
      const wrapper = mount(Field, {
        props: { validationMessage: 'Status', validationState },
      });

      expect(wrapper.classes()).toContain(`fui-Field--validation-${validationState}`);
      expect(wrapper.get('.fui-Field__validationMessage').classes()).toContain(
        `fui-Field__validationMessage--${validationState}`,
      );
    },
  );

  it('defaults a present validation message to the error state', () => {
    const wrapper = mount(Field, {
      props: { validationMessage: 'Enter a value.' },
    });
    const message = wrapper.get('.fui-Field__validationMessage');

    expect(wrapper.classes()).toContain('fui-Field--validation-error');
    expect(message.attributes('role')).toBe('alert');
    expect(message.text()).toBe('Enter a value.');
    expect(wrapper.get('.fui-Field__validationMessageIcon').attributes('aria-hidden')).toBe(
      'true',
    );
  });

  it('uses alert semantics only for error and warning messages', () => {
    const error = mount(Field, {
      props: { validationMessage: 'Error', validationState: 'error' },
    });
    const warning = mount(Field, {
      props: { validationMessage: 'Warning', validationState: 'warning' },
    });
    const success = mount(Field, {
      props: { validationMessage: 'Success', validationState: 'success' },
    });
    const none = mount(Field, {
      props: { validationMessage: 'Info', validationState: 'none' },
    });

    expect(error.get('.fui-Field__validationMessage').attributes('role')).toBe('alert');
    expect(warning.get('.fui-Field__validationMessage').attributes('role')).toBe('alert');
    expect(success.get('.fui-Field__validationMessage').attributes('role')).toBeUndefined();
    expect(none.get('.fui-Field__validationMessage').attributes('role')).toBeUndefined();
    expect(none.find('.fui-Field__validationMessageIcon').exists()).toBe(false);
  });

  it('renders label, control, validation message, and hint in order', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Email',
        validationMessage: 'Invalid email',
        hint: 'Use a work address',
      },
      slots: { default: () => h(Input) },
    });

    expect(wrapper.element.children[0].tagName).toBe('LABEL');
    expect(wrapper.element.children[1].classList).toContain('fui-Input');
    expect(wrapper.element.children[2].classList).toContain(
      'fui-Field__validationMessage',
    );
    expect(wrapper.element.children[3].classList).toContain('fui-Field__hint');
  });

  it('passes its size to FInput unless the control explicitly overrides it', () => {
    const inherited = mount(Field, {
      props: { size: 'large' },
      slots: { default: () => h(Input) },
    });
    const overridden = mount(Field, {
      props: { size: 'large' },
      slots: { default: () => h(Input, { size: 'small' }) },
    });

    expect(inherited.get('.fui-Input').classes()).toContain('fui-Input--large');
    expect(overridden.get('.fui-Input').classes()).toContain('fui-Input--small');
  });

  it('automatically associates FInput with label, messages, required, and invalid state', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Email',
        validationMessage: 'Invalid email',
        hint: 'Use a work address',
        required: true,
      },
      slots: { default: () => h(Input) },
    });
    const label = wrapper.get('label');
    const input = wrapper.get('input');
    const message = wrapper.get('.fui-Field__validationMessage');
    const hint = wrapper.get('.fui-Field__hint');

    expect(label.attributes('for')).toBe(input.attributes('id'));
    expect(label.get('.fui-Label__required').attributes('aria-hidden')).toBe('true');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe(
      `${message.attributes('id')} ${hint.attributes('id')}`,
    );
    expect(wrapper.get('.fui-Input').classes()).toContain('fui-Input--invalid');
  });

  it('preserves explicit control ARIA attributes and merges described-by ids without duplicates', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Email',
        validationMessage: 'Invalid email',
        hint: 'Use a work address',
        required: true,
      },
      slots: {
        default: () =>
          h(Input, {
            id: 'custom-email',
            'aria-labelledby': 'external-label',
            'aria-describedby': 'external-help external-help',
            'aria-invalid': 'false',
            required: false,
          }),
      },
    });
    const input = wrapper.get('input');
    const messageId = wrapper.get('.fui-Field__validationMessage').attributes('id');
    const hintId = wrapper.get('.fui-Field__hint').attributes('id');

    expect(input.attributes('id')).toBe('custom-email');
    expect(input.attributes('aria-labelledby')).toBe('external-label');
    expect(input.attributes('aria-invalid')).toBe('false');
    expect(input.attributes('required')).toBeUndefined();
    expect(input.attributes('aria-describedby')).toBe(
      `${messageId} ${hintId} external-help`,
    );
  });

  it('uses aria-labelledby when an explicit control id no longer matches the generated label for', () => {
    const wrapper = mount(Field, {
      props: { label: 'Email' },
      slots: { default: () => h(Input, { id: 'custom-email' }) },
    });

    expect(wrapper.get('input').attributes('aria-labelledby')).toBe(
      wrapper.get('label').attributes('id'),
    );
  });

  it('automatically wires a label-free FCheckbox without creating a second label', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Accept terms',
        hint: 'Required to continue',
        required: true,
      },
      slots: { default: () => h(Checkbox) },
    });
    const checkbox = wrapper.get('input[type="checkbox"]');

    expect(wrapper.findAll('label')).toHaveLength(1);
    expect(wrapper.get('label').attributes('for')).toBe(checkbox.attributes('id'));
    expect(checkbox.attributes('required')).toBeDefined();
    expect(checkbox.attributes('aria-describedby')).toBe(
      wrapper.get('.fui-Field__hint').attributes('id'),
    );
  });

  it('provides scoped control props for native and third-party controls', () => {
    const Host = defineComponent({
      components: { Field },
      template: `
        <Field
          label="Native email"
          hint="Native hint"
          validation-message="Native error"
          required
          v-slot="controlProps"
        >
          <input v-bind="controlProps" type="email" />
        </Field>
      `,
    });
    const wrapper = mount(Host);
    const input = wrapper.get('input');

    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')?.split(' ')).toHaveLength(2);
  });

  it('lets named slots override textual props and customize the decorative icon', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Prop label',
        validationMessage: 'Prop message',
        hint: 'Prop hint',
        validationState: 'warning',
      },
      slots: {
        label: '<strong>Slot label</strong>',
        'validation-message': '<span data-message>Slot message</span>',
        hint: '<span data-hint>Slot hint</span>',
        'validation-message-icon': '<span data-icon>!</span>',
      },
    });

    expect(wrapper.get('label').text()).toBe('Slot label');
    expect(wrapper.get('[data-message]').text()).toBe('Slot message');
    expect(wrapper.get('[data-hint]').text()).toBe('Slot hint');
    expect(wrapper.get('[data-icon]').text()).toBe('!');
    expect(wrapper.get('[data-icon]').element.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('forwards root attributes, listeners, class, and style', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Field, {
      attrs: {
        id: 'account-field',
        class: 'custom-field',
        style: 'max-width: 20rem',
        'data-kind': 'account',
        onClick,
      },
    });

    expect(wrapper.attributes('id')).toBe('account-field');
    expect(wrapper.attributes('data-kind')).toBe('account');
    expect(wrapper.classes()).toContain('custom-field');
    expect(wrapper.attributes('style')).toContain('max-width: 20rem');
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies horizontal no-label alignment', () => {
    const wrapper = mount(Field, {
      props: { orientation: 'horizontal' },
      slots: { default: () => h(Input) },
    });

    expect(wrapper.classes()).toContain('fui-Field--horizontal-no-label');
  });

  it('exposes only the native root element and emits no events', () => {
    const wrapper = mount(Field);
    const vm = wrapper.vm as unknown as { element: HTMLDivElement; focus?: () => void };

    expect(vm.element).toBe(wrapper.element);
    expect(vm.focus).toBeUndefined();
    expect(wrapper.emitted()).toEqual({});
  });
});

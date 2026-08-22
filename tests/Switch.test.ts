import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import Switch from '../src/components/Switch/Switch.vue';

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('FSwitch', () => {
  it('renders an unchecked native switch with upstream defaults', () => {
    const wrapper = mount(Switch);
    const input = wrapper.get('input');

    expect(input.attributes('type')).toBe('checkbox');
    expect(input.attributes('role')).toBe('switch');
    expect(input.element.checked).toBe(false);
    expect(wrapper.classes()).toContain('fui-Switch--medium');
    expect(wrapper.classes()).toContain('fui-Switch--label-after');
    expect(wrapper.get('.fui-Switch__indicator').attributes('aria-hidden')).toBe('true');
  });

  it('supports uncontrolled checked state and emits each event once', async () => {
    const wrapper = mount(Switch, { props: { defaultChecked: true } });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(true);
    await input.setValue(false);

    expect(input.element.checked).toBe(false);
    expect(wrapper.classes()).not.toContain('fui-Switch--checked');
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('change')?.[0]?.[0]).toBeInstanceOf(Event);
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ checked: false });
  });

  it('supports controlled modelValue and restores the controlled DOM state', async () => {
    const wrapper = mount(Switch, { props: { modelValue: true } });
    const input = wrapper.get('input');

    await input.setValue(false);
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    expect(input.element.checked).toBe(true);

    await wrapper.setProps({ modelValue: false });
    expect(input.element.checked).toBe(false);
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
  });

  it('treats an explicitly bound undefined modelValue as controlled unchecked', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: undefined, defaultChecked: true },
    });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(false);
    await input.setValue(true);
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    expect(input.element.checked).toBe(false);
  });

  it('detects kebab-case model-value bindings as controlled', async () => {
    const wrapper = mount({
      components: { Switch },
      data: () => ({ checked: true }),
      template: '<Switch :model-value="checked" />',
    });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(true);
    await input.setValue(false);
    await nextTick();
    expect(input.element.checked).toBe(true);
  });

  it('does not emit when controlled props change', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } });

    await wrapper.setProps({ modelValue: true });

    expect(wrapper.get('input').element.checked).toBe(true);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('associates generated and supplied ids with labels', () => {
    const generated = mount(Switch, { props: { label: 'Notifications' } });
    const supplied = mount(Switch, {
      props: { label: 'Location' },
      attrs: { id: 'location-switch' },
    });

    expect(generated.get('label').attributes('for')).toBe(generated.get('input').attributes('id'));
    expect(supplied.get('input').attributes('id')).toBe('location-switch');
    expect(supplied.get('label').attributes('for')).toBe('location-switch');
  });

  it.each([
    ['before', ['INPUT', 'LABEL', 'DIV']],
    ['above', ['INPUT', 'LABEL', 'DIV']],
    ['after', ['INPUT', 'DIV', 'LABEL']],
  ] as const)('renders %s label position in upstream DOM order', (labelPosition, tags) => {
    const wrapper = mount(Switch, { props: { label: 'Label', labelPosition } });

    expect([...wrapper.element.children].map((element) => element.tagName)).toEqual(tags);
    expect(wrapper.classes()).toContain(`fui-Switch--label-${labelPosition}`);
  });

  it('supports small and medium size geometry classes', async () => {
    const wrapper = mount(Switch, { props: { size: 'small' } });

    expect(wrapper.classes()).toContain('fui-Switch--small');
    expect(wrapper.get('input').classes()).toContain('fui-Switch__input--small');
    expect(wrapper.get('.fui-Switch__indicator').classes()).toContain(
      'fui-Switch__indicator--small',
    );

    await wrapper.setProps({ size: 'medium' });
    expect(wrapper.classes()).toContain('fui-Switch--medium');
  });

  it('supports custom label and decorative indicator slots with checked state', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: true },
      slots: {
        label: '<strong>Custom label</strong>',
        indicator: ({ checked }: { checked: boolean }) =>
          h('span', { 'data-indicator': checked ? 'on' : 'off' }),
      },
    });

    expect(wrapper.get('label strong').text()).toBe('Custom label');
    expect(wrapper.get('[data-indicator]').attributes('data-indicator')).toBe('on');
    expect(wrapper.get('[data-indicator]').element.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('routes root class and style while forwarding native, form, and ARIA attrs to input', () => {
    const wrapper = mount(Switch, {
      attrs: {
        class: 'custom-root',
        style: 'margin-top: 3px',
        name: 'notifications',
        value: 'enabled',
        form: 'settings',
        required: true,
        tabindex: '2',
        'aria-label': 'Notifications',
        'aria-invalid': 'true',
        'data-control': 'switch',
      },
    });
    const input = wrapper.get('input');

    expect(wrapper.classes()).toContain('custom-root');
    expect(wrapper.attributes('style')).toContain('margin-top: 3px');
    expect(wrapper.attributes('name')).toBeUndefined();
    expect(input.attributes('name')).toBe('notifications');
    expect(input.attributes('value')).toBe('enabled');
    expect(input.attributes('form')).toBe('settings');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('tabindex')).toBe('2');
    expect(input.attributes('aria-label')).toBe('Notifications');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('data-control')).toBe('switch');
    expect(wrapper.classes()).toContain('fui-Switch--invalid');
  });

  it('does not allow attrs to override managed input state', () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false },
      attrs: {
        checked: true,
        type: 'radio',
        role: 'checkbox',
        'aria-disabled': 'true',
      },
    });
    const input = wrapper.get('input');

    expect(input.element.checked).toBe(false);
    expect(input.attributes('type')).toBe('checkbox');
    expect(input.attributes('role')).toBe('switch');
    expect(input.attributes('aria-disabled')).toBeUndefined();
  });

  it('renders upstream Label required and disabled styling from native control state', () => {
    const required = mount(Switch, {
      props: { label: 'Required switch' },
      attrs: { required: true },
    });
    const disabledFocusable = mount(Switch, {
      props: { label: 'Unavailable switch', disabledFocusable: true },
    });

    expect(required.get('input').attributes('required')).toBeDefined();
    expect(required.get('.fui-Switch__label').classes()).toContain('fui-Label');
    expect(required.get('.fui-Label__required').text()).toBe('*');
    expect(required.get('.fui-Label__required').attributes('aria-hidden')).toBe('true');
    expect(disabledFocusable.get('.fui-Switch__label').classes()).toContain('fui-Label--disabled');
  });

  it('supports disabled as a native fallthrough prop as well as a declared prop', () => {
    const wrapper = mount(Switch, { attrs: { disabled: true } });

    expect(wrapper.get('input').attributes('disabled')).toBeDefined();
    expect(wrapper.classes()).toContain('fui-Switch--disabled');
  });

  it('uses native disabled behavior', async () => {
    const wrapper = mount(Switch, { props: { disabled: true, label: 'Disabled' } });
    const input = wrapper.get('input');

    expect(input.attributes('disabled')).toBeDefined();
    expect(input.attributes('aria-disabled')).toBeUndefined();
    expect(wrapper.classes()).toContain('fui-Switch--disabled');
    await input.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('keeps disabledFocusable focusable and blocks click activation', async () => {
    const wrapper = mount(Switch, {
      attachTo: document.body,
      props: { disabled: true, disabledFocusable: true },
    });
    const input = wrapper.get('input');

    expect(input.attributes('disabled')).toBeUndefined();
    expect(input.attributes('aria-disabled')).toBe('true');
    input.element.focus();
    expect(document.activeElement).toBe(input.element);

    await input.trigger('click');
    await nextTick();
    expect(input.element.checked).toBe(false);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it.each([' ', 'Enter'])('blocks %s activation when disabledFocusable', async (key) => {
    const wrapper = mount(Switch, {
      props: { defaultChecked: true, disabledFocusable: true },
    });
    const input = wrapper.get('input');

    await input.trigger('keydown', { key });
    await nextTick();

    expect(input.element.checked).toBe(true);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('ignores later defaultChecked updates in uncontrolled mode', async () => {
    const wrapper = mount(Switch, { props: { defaultChecked: false } });

    await wrapper.setProps({ defaultChecked: true });

    expect(wrapper.get('input').element.checked).toBe(false);
  });

  it('restores the initial uncontrolled state on native form reset', async () => {
    const wrapper = mount({
      components: { Switch },
      template: '<form><Switch default-checked /></form>',
    });
    const form = wrapper.get('form');
    const input = wrapper.get('input');

    expect(input.element.defaultChecked).toBe(true);
    await input.setValue(false);
    expect(input.element.checked).toBe(false);

    input.element.checked = input.element.defaultChecked;
    form.element.dispatchEvent(new Event('reset'));
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();

    expect(input.element.checked).toBe(true);
  });

  it('rolls controlled state back after native form reset', async () => {
    const wrapper = mount({
      components: { Switch },
      template: '<form><Switch :modelValue="true" /></form>',
    });
    const form = wrapper.get('form');
    const switchWrapper = wrapper.findComponent(Switch);
    const input = wrapper.get('input');

    input.element.defaultChecked = false;
    input.element.checked = input.element.defaultChecked;
    form.element.dispatchEvent(new Event('reset'));
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();

    expect(input.element.checked).toBe(true);
    expect(switchWrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('consumes Field label, required, description, and invalid context', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Enable alerts',
        hint: 'Applies to all projects',
        validationMessage: 'Choose a setting',
        required: true,
      },
      slots: { default: () => h(Switch) },
    });
    const input = wrapper.get('input[role="switch"]');

    expect(wrapper.findAll('label')).toHaveLength(1);
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe(
      `${wrapper.get('.fui-Field__validationMessage').attributes('id')} ${wrapper.get('.fui-Field__hint').attributes('id')}`,
    );
    expect(wrapper.get('.fui-Switch').classes()).toContain('fui-Switch--invalid');
  });

  it('merges consumer and Field description references', () => {
    const wrapper = mount(Field, {
      props: { hint: 'Field hint' },
      slots: { default: () => h(Switch, { 'aria-describedby': 'consumer-description' }) },
    });
    const input = wrapper.get('input');

    expect(input.attributes('aria-describedby')).toBe(
      `${wrapper.get('.fui-Field__hint').attributes('id')} consumer-description`,
    );
  });

  it('exposes the native element and focus operation', () => {
    const wrapper = mount(Switch, { attachTo: document.body });
    const exposed = wrapper.vm as unknown as {
      element: HTMLInputElement;
      focus: () => void;
    };
    const input = wrapper.get('input').element;
    const focusSpy = vi.spyOn(input, 'focus');

    expect(exposed.element).toBe(input);
    exposed.focus();
    expect(focusSpy).toHaveBeenCalledOnce();
  });
});

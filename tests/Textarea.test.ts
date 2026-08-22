import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import Textarea from '../src/components/Textarea/Textarea.vue';
import type {
  TextareaAppearance,
  TextareaResize,
  TextareaSize,
} from '../src/components/Textarea/Textarea.types';

afterEach(() => vi.restoreAllMocks());

describe('FTextarea', () => {
  it('renders a native textarea with upstream defaults', () => {
    const wrapper = mount(Textarea);
    const textarea = wrapper.get('textarea');

    expect(wrapper.element.tagName).toBe('SPAN');
    expect(textarea.element.tagName).toBe('TEXTAREA');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Textarea',
        'fui-Textarea--outline',
        'fui-Textarea--medium',
        'fui-Textarea--resize-none',
      ]),
    );
    expect(textarea.element.value).toBe('');
  });

  it.each<TextareaAppearance>([
    'outline',
    'filled-darker',
    'filled-lighter',
    'filled-darker-shadow',
    'filled-lighter-shadow',
  ])('applies the %s appearance', (appearance) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(Textarea, { props: { appearance } });

    expect(wrapper.classes()).toContain(`fui-Textarea--${appearance}`);
    expect(error).toHaveBeenCalledTimes(appearance.endsWith('-shadow') ? 1 : 0);
  });

  it.each<TextareaSize>(['small', 'medium', 'large'])('applies the %s size', (size) => {
    expect(mount(Textarea, { props: { size } }).classes()).toContain(`fui-Textarea--${size}`);
  });

  it.each<TextareaResize>(['none', 'horizontal', 'vertical', 'both'])(
    'applies the %s resize mode',
    (resize) => {
      expect(mount(Textarea, { props: { resize } }).classes()).toContain(
        `fui-Textarea--resize-${resize}`,
      );
    },
  );

  it('warns when a later appearance changes to a deprecated shadow variant', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const wrapper = mount(Textarea);

    await wrapper.setProps({ appearance: 'filled-darker-shadow' });

    expect(error).toHaveBeenCalledOnce();
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('appearance="filled-darker-shadow" is deprecated'),
    );
  });

  it('supports uncontrolled defaultValue and ignores later default updates', async () => {
    const wrapper = mount(Textarea, { props: { defaultValue: 'Initial notes' } });
    const textarea = wrapper.get('textarea');

    expect(textarea.element.value).toBe('Initial notes');
    await textarea.setValue('Edited notes');
    expect(textarea.element.value).toBe('Edited notes');

    await wrapper.setProps({ defaultValue: 'Ignored notes' });
    expect(textarea.element.value).toBe('Edited notes');
  });

  it('supports controlled modelValue and restores the prop until it updates', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'Controlled notes' } });
    const textarea = wrapper.get('textarea');

    textarea.element.value = 'Attempted edit';
    await textarea.trigger('input');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Attempted edit']);
    expect(wrapper.emitted('input')?.[0]?.[1]).toEqual({ value: 'Attempted edit' });
    expect(textarea.element.value).toBe('Controlled notes');

    await wrapper.setProps({ modelValue: 'Accepted edit' });
    expect(textarea.element.value).toBe('Accepted edit');
  });

  it('prefers modelValue when both value props are provided', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'Controlled', defaultValue: 'Default' },
    });

    expect(wrapper.get('textarea').element.value).toBe('Controlled');
  });

  it('treats explicitly bound undefined modelValue as controlled', async () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: undefined, defaultValue: 'Default' },
    });
    const textarea = wrapper.get('textarea');

    expect(textarea.element.value).toBe('');
    textarea.element.value = 'Typed';
    await textarea.trigger('input');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Typed']);
    expect(textarea.element.value).toBe('');
  });

  it('emits native event data once for input and change', async () => {
    const wrapper = mount(Textarea);
    const textarea = wrapper.get('textarea');

    textarea.element.value = 'Changed';
    await textarea.trigger('input');
    await textarea.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('input')?.[0]?.[1]).toEqual({ value: 'Changed' });
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 'Changed' });
  });

  it('does not emit user events when only modelValue changes', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'One' } });

    await wrapper.setProps({ modelValue: 'Two' });

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('input')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('applies class and style to the root while forwarding native attributes', () => {
    const wrapper = mount(Textarea, {
      attrs: {
        class: 'custom-textarea',
        style: 'width: 22rem',
        id: 'notes',
        name: 'notes',
        rows: '5',
        maxlength: '240',
        placeholder: 'Write notes',
        readonly: true,
        'aria-invalid': 'true',
      },
    });
    const textarea = wrapper.get('textarea');

    expect(wrapper.classes()).toContain('custom-textarea');
    expect(wrapper.attributes('style')).toContain('width: 22rem');
    expect(textarea.attributes('id')).toBe('notes');
    expect(textarea.attributes('name')).toBe('notes');
    expect(textarea.attributes('rows')).toBe('5');
    expect(textarea.attributes('maxlength')).toBe('240');
    expect(textarea.attributes('placeholder')).toBe('Write notes');
    expect(textarea.attributes('readonly')).toBeDefined();
    expect(wrapper.classes()).toContain('fui-Textarea--readonly');
    expect(wrapper.classes()).toContain('fui-Textarea--invalid');
  });

  it('reflects disabled state on the root and native textarea', () => {
    const wrapper = mount(Textarea, { attrs: { disabled: true } });

    expect(wrapper.classes()).toContain('fui-Textarea--disabled');
    expect(wrapper.get('textarea').attributes('disabled')).toBeDefined();
  });

  it('consumes Field context and preserves explicit control overrides', () => {
    const automatic = mount(Field, {
      props: {
        label: 'Biography',
        hint: 'Keep it concise.',
        validationMessage: 'Biography is required.',
        required: true,
        size: 'large',
      },
      slots: { default: () => h(Textarea) },
    });
    const overridden = mount(Field, {
      props: {
        label: 'Biography',
        validationMessage: 'Biography is required.',
        required: true,
        size: 'large',
      },
      slots: {
        default: () =>
          h(Textarea, {
            id: 'explicit-bio',
            size: 'small',
            required: false,
            'aria-invalid': 'false',
            'aria-describedby': 'external-help',
          }),
      },
    });

    const automaticTextarea = automatic.get('textarea');
    expect(automaticTextarea.attributes('id')).toBe(automatic.get('label').attributes('for'));
    expect(automaticTextarea.attributes('required')).toBeDefined();
    expect(automaticTextarea.attributes('aria-invalid')).toBe('true');
    expect(automaticTextarea.attributes('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(automatic.get('.fui-Textarea').classes()).toContain('fui-Textarea--large');
    expect(automatic.get('.fui-Textarea').classes()).toContain('fui-Textarea--invalid');

    const overriddenTextarea = overridden.get('textarea');
    expect(overriddenTextarea.attributes('id')).toBe('explicit-bio');
    expect(overriddenTextarea.attributes('required')).toBeUndefined();
    expect(overriddenTextarea.attributes('aria-invalid')).toBe('false');
    expect(overriddenTextarea.attributes('aria-describedby')).toContain('external-help');
    expect(overridden.get('.fui-Textarea').classes()).toContain('fui-Textarea--small');
    expect(overridden.get('.fui-Textarea').classes()).not.toContain('fui-Textarea--invalid');
  });

  it('restores native uncontrolled and controlled values after form reset', async () => {
    const Host = defineComponent({
      setup: () => () =>
        h('form', [
          h(Textarea, {
            'data-uncontrolled': '',
            defaultValue: 'Default notes',
          }),
          h(Textarea, {
            'data-controlled': '',
            modelValue: 'Controlled notes',
          }),
        ]),
    });
    const wrapper = mount(Host, { attachTo: document.body });
    const uncontrolled = wrapper.get<HTMLTextAreaElement>('[data-uncontrolled]');
    const controlled = wrapper.get<HTMLTextAreaElement>('[data-controlled]');
    const form = wrapper.get('form').element as HTMLFormElement;

    await uncontrolled.setValue('Changed uncontrolled');
    controlled.element.value = 'Changed controlled';
    form.reset();
    await new Promise((resolve) => setTimeout(resolve));

    expect(uncontrolled.element.value).toBe('Default notes');
    expect(controlled.element.value).toBe('Controlled notes');
  });

  it('exposes the native element plus focus and select methods', () => {
    const wrapper = mount(Textarea, { attachTo: document.body });
    const vm = wrapper.vm as unknown as {
      element: HTMLTextAreaElement;
      focus: () => void;
      select: () => void;
    };
    const element = wrapper.get('textarea').element;
    const focus = vi.spyOn(element, 'focus');
    const select = vi.spyOn(element, 'select');

    vm.focus();
    vm.select();

    expect(vm.element).toBe(element);
    expect(focus).toHaveBeenCalledOnce();
    expect(select).toHaveBeenCalledOnce();
  });
});

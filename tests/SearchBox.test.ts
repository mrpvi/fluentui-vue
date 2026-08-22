import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import Field from '../src/components/Field/Field.vue';
import SearchBox from '../src/components/SearchBox/SearchBox.vue';

async function resetForm(form: HTMLFormElement) {
  form.reset();
  await new Promise((resolve) => setTimeout(resolve));
  await nextTick();
}

describe('FSearchBox', () => {
  it('renders native search semantics and released defaults', () => {
    const wrapper = mount(SearchBox);
    const input = wrapper.get('input');
    const dismiss = wrapper.get('[role="button"]');

    expect(input.attributes('type')).toBe('search');
    expect(input.element.getAttribute('role')).toBeNull();
    expect(wrapper.classes()).toContain('fui-SearchBox--outline');
    expect(wrapper.classes()).toContain('fui-SearchBox--medium');
    expect(input.element.value).toBe('');
    expect(wrapper.get('.fui-SearchBox__contentBefore svg').attributes('aria-hidden')).toBe('true');
    expect(dismiss.attributes('aria-label')).toBe('clear');
    expect(dismiss.attributes('tabindex')).toBe('-1');
  });

  it('supports uncontrolled defaultValue once and ignores later default updates', async () => {
    const wrapper = mount(SearchBox, { props: { defaultValue: 'hello' } });
    const input = wrapper.get('input');

    expect(input.element.value).toBe('hello');
    await input.setValue('world');
    await wrapper.setProps({ defaultValue: 'ignored' });

    expect(input.element.value).toBe('world');
  });

  it('restores uncontrolled defaultValue on native form reset', async () => {
    const wrapper = mount({
      setup: () => () => h('form', null, [h(SearchBox, { defaultValue: 'hello' })]),
    });
    const form = wrapper.get('form').element;
    const input = wrapper.get('input');

    await input.setValue('world');
    await resetForm(form);

    expect(input.element.value).toBe('hello');
  });

  it('rolls controlled typing back until the parent updates', async () => {
    const wrapper = mount(SearchBox, { props: { modelValue: 'hello' } });
    const input = wrapper.get('input');

    input.element.value = 'world';
    await input.trigger('input');

    expect(wrapper.emitted('update:modelValue')).toEqual([['world']]);
    expect(wrapper.emitted('input')?.[0]?.[1]).toEqual({ value: 'world' });
    expect(input.element.value).toBe('hello');

    await wrapper.setProps({ modelValue: 'world' });
    expect(input.element.value).toBe('world');
  });

  it('prefers modelValue and treats explicitly bound undefined as controlled', async () => {
    const preferred = mount(SearchBox, {
      props: { modelValue: 'controlled', defaultValue: 'default' },
    });
    expect(preferred.get('input').element.value).toBe('controlled');

    const undefinedControlled = mount(SearchBox, {
      props: { modelValue: undefined, defaultValue: 'default' },
    });
    const input = undefinedControlled.get('input');
    expect(input.element.value).toBe('');

    input.element.value = 'typed';
    await input.trigger('input');
    expect(undefinedControlled.emitted('update:modelValue')).toEqual([['typed']]);
    expect(input.element.value).toBe('');
  });

  it('recognizes kebab-case model-value bindings as controlled', async () => {
    const wrapper = mount(SearchBox, {
      attrs: { 'model-value': 'kebab controlled' },
    });
    const input = wrapper.get('input');

    expect(input.element.value).toBe('kebab controlled');
    input.element.value = 'proposed';
    await input.trigger('input');
    expect(input.element.value).toBe('kebab controlled');
    expect(wrapper.emitted('update:modelValue')).toEqual([['proposed']]);
  });

  it('reapplies a controlled value on form reset without emitting', async () => {
    const wrapper = mount({
      setup: () => () => h('form', null, [h(SearchBox, { modelValue: 'fixed' })]),
    });
    const component = wrapper.getComponent(SearchBox);
    const input = wrapper.get('input');

    input.element.value = 'changed';
    await resetForm(wrapper.get('form').element);

    expect(input.element.value).toBe('fixed');
    expect(component.emitted('update:modelValue')).toBeUndefined();
    expect(component.emitted('input')).toBeUndefined();
    expect(component.emitted('change')).toBeUndefined();
  });

  it('emits typing, native search, and native change events once', async () => {
    const wrapper = mount(SearchBox);
    const input = wrapper.get('input');

    input.element.value = 'query';
    await input.trigger('input');
    await input.trigger('search');
    await input.trigger('change');

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('input')).toHaveLength(1);
    expect(wrapper.emitted('search')).toHaveLength(1);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('search')?.[0]?.[1]).toEqual({ value: 'query' });
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual({ value: 'query' });
  });

  it('does not emit interaction events for prop-only updates', async () => {
    const wrapper = mount(SearchBox, { props: { modelValue: 'one' } });

    await wrapper.setProps({ modelValue: 'two' });

    expect(wrapper.get('input').element.value).toBe('two');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('input')).toBeUndefined();
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('search')).toBeUndefined();
    expect(wrapper.emitted('clear')).toBeUndefined();
  });

  it('clears on dismiss once, prevents activation defaults, and restores focus', async () => {
    const wrapper = mount(SearchBox, { props: { defaultValue: 'hello' }, attachTo: document.body });
    const input = wrapper.get('input').element;
    const focus = vi.spyOn(input, 'focus');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });

    wrapper.get('[role="button"]').element.dispatchEvent(click);
    await nextTick();

    expect(click.defaultPrevented).toBe(true);
    expect(input.value).toBe('');
    expect(wrapper.emitted('update:modelValue')).toEqual([['']]);
    expect(wrapper.emitted('input')).toHaveLength(1);
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(focus).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it('rolls a controlled dismiss clear back after reporting the proposed value', async () => {
    const wrapper = mount(SearchBox, { props: { modelValue: 'fixed' } });

    await wrapper.get('[role="button"]').trigger('click');

    expect(wrapper.get('input').element.value).toBe('fixed');
    expect(wrapper.emitted('update:modelValue')).toEqual([['']]);
    expect(wrapper.emitted('clear')?.[0]?.[1]).toEqual({ value: '' });
  });

  it('clears on Escape exactly once and prevents default', async () => {
    const wrapper = mount(SearchBox, { props: { defaultValue: 'hello' } });
    const input = wrapper.get('input');
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });

    input.element.dispatchEvent(event);
    await nextTick();

    expect(event.defaultPrevented).toBe(true);
    expect(input.element.value).toBe('');
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    expect(wrapper.emitted('input')).toHaveLength(1);
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('does nothing on Escape when already empty', async () => {
    const wrapper = mount(SearchBox);

    await wrapper.get('input').trigger('keydown', { key: 'Escape' });

    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('clear')).toBeUndefined();
  });

  it('participates in FormData with native name and form ownership', async () => {
    const wrapper = mount(
      {
        setup: () => () =>
          h('div', null, [
            h('form', { id: 'search-form' }),
            h(SearchBox, { name: 'query', form: 'search-form', defaultValue: 'fluent' }),
          ]),
      },
      { attachTo: document.body },
    );
    await nextTick();

    const form = wrapper.get('form').element;
    expect(wrapper.get('input').element.form).toBe(form);
    expect(new FormData(form).get('query')).toBe('fluent');
    wrapper.unmount();
  });

  it('routes class/style to the wrapper and native/ARIA attributes to the input', () => {
    const wrapper = mount(SearchBox, {
      attrs: {
        class: 'custom-search',
        style: 'width: 18rem',
        id: 'query',
        name: 'query',
        placeholder: 'Search',
        autocomplete: 'off',
        maxlength: '30',
        required: true,
        'aria-label': 'Search products',
        'aria-invalid': 'true',
        type: 'email',
        value: 'ignored',
      },
    });
    const input = wrapper.get('input');

    expect(wrapper.classes()).toContain('custom-search');
    expect(wrapper.attributes('style')).toContain('width: 18rem');
    expect(wrapper.attributes('id')).toBeUndefined();
    expect(input.attributes('id')).toBe('query');
    expect(input.attributes('name')).toBe('query');
    expect(input.attributes('placeholder')).toBe('Search');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-label')).toBe('Search products');
    expect(input.attributes('type')).toBe('search');
    expect(input.element.value).toBe('');
    expect(input.attributes('value')).not.toBe('ignored');
    expect(input.attributes('size')).toBeUndefined();
    expect(wrapper.classes()).toContain('fui-SearchBox--invalid');
  });

  it('integrates with Field label, required, descriptions, invalid state, and size', () => {
    const wrapper = mount(Field, {
      props: {
        label: 'Search products',
        hint: 'Use a product name',
        validationMessage: 'Enter a query',
        required: true,
        size: 'large',
      },
      slots: { default: () => h(SearchBox) },
    });
    const search = wrapper.getComponent(SearchBox);
    const input = wrapper.get('input');

    expect(input.attributes('id')).toBe(wrapper.get('label').attributes('for'));
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')?.split(' ')).toHaveLength(2);
    expect(search.classes()).toContain('fui-SearchBox--large');
  });

  it('preserves explicit Field overrides', () => {
    const wrapper = mount(Field, {
      props: { label: 'Search', validationMessage: 'Required', required: true, size: 'large' },
      slots: {
        default: () =>
          h(SearchBox, {
            id: 'explicit-query',
            required: false,
            'aria-invalid': 'false',
            'aria-describedby': 'external-help',
            size: 'small',
          }),
      },
    });
    const input = wrapper.get('input');

    expect(input.attributes('id')).toBe('explicit-query');
    expect(input.attributes('required')).toBeUndefined();
    expect(input.attributes('aria-invalid')).toBe('false');
    expect(input.attributes('aria-describedby')).toContain('external-help');
    expect(wrapper.getComponent(SearchBox).classes()).toContain('fui-SearchBox--small');
  });

  it('renders justified slots in Fluent order and reveals trailing content on focus', async () => {
    const wrapper = mount(SearchBox, {
      slots: {
        'content-before': '<span data-before>Before</span>',
        'content-after': '<button type="button" data-after>Voice</button>',
        dismiss: '<span data-dismiss>Dismiss</span>',
      },
      attachTo: document.body,
    });
    const rootChildren = wrapper.element.children;
    const after = wrapper.get('.fui-SearchBox__contentAfter');

    expect(rootChildren[0].classList).toContain('fui-SearchBox__contentBefore');
    expect(rootChildren[1].tagName).toBe('INPUT');
    expect(rootChildren[2].classList).toContain('fui-SearchBox__contentAfter');
    expect(wrapper.get('[data-before]').element.closest('[aria-hidden="true"]')).toBeNull();
    expect(wrapper.get('[data-after]').element.closest('[aria-hidden="true"]')).toBeNull();
    expect(wrapper.get('[data-dismiss]').element.closest('[aria-hidden="true"]')).toBeNull();
    expect(after.classes()).not.toContain('fui-SearchBox__contentAfter--visible');

    await wrapper.get('input').trigger('focusin');
    expect(after.classes()).toContain('fui-SearchBox__contentAfter--visible');
    wrapper.unmount();
  });

  it('prevents clear behavior when disabled or read-only', async () => {
    const disabled = mount(SearchBox, { props: { defaultValue: 'disabled', disabled: true } });
    expect(disabled.get('input').attributes('disabled')).toBeDefined();
    await disabled.get('[role="button"]').trigger('click');
    expect(disabled.get('input').element.value).toBe('disabled');
    expect(disabled.emitted('clear')).toBeUndefined();

    const readOnly = mount(SearchBox, { props: { defaultValue: 'readonly', readOnly: true } });
    expect(readOnly.get('input').attributes('readonly')).toBeDefined();
    await readOnly.get('[role="button"]').trigger('click');
    expect(readOnly.get('input').element.value).toBe('readonly');
    expect(readOnly.emitted('clear')).toBeUndefined();
  });

  it('exposes the primary input and imperative focus/select methods', () => {
    const wrapper = mount(SearchBox, { attachTo: document.body });
    const vm = wrapper.vm as unknown as {
      element: HTMLInputElement;
      focus: () => void;
      select: () => void;
    };
    const element = wrapper.get('input').element;
    const focus = vi.spyOn(element, 'focus');
    const select = vi.spyOn(element, 'select');

    expect(vm.element).toBe(element);
    vm.focus();
    vm.select();
    expect(focus).toHaveBeenCalledOnce();
    expect(select).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it.each([
    ['outline', 'small'],
    ['underline', 'medium'],
    ['filled-darker', 'large'],
    ['filled-lighter', 'medium'],
  ] as const)('applies %s appearance and %s size classes', (appearance, size) => {
    const wrapper = mount(SearchBox, { props: { appearance, size } });

    expect(wrapper.classes()).toContain(`fui-SearchBox--${appearance}`);
    expect(wrapper.classes()).toContain(`fui-SearchBox--${size}`);
  });

  it('supports idiomatic v-model integration', async () => {
    const Host = defineComponent({
      setup() {
        const value = ref('initial');
        return () =>
          h(SearchBox, {
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => {
              value.value = next;
            },
          });
      },
    });
    const wrapper = mount(Host);
    const input = wrapper.get('input');

    input.element.value = 'updated';
    await input.trigger('input');
    await nextTick();

    expect(input.element.value).toBe('updated');
  });
});

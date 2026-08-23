import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ToggleButton from '../src/components/ToggleButton/ToggleButton.vue';

const toggleButtonCss = readFileSync(
  resolve(process.cwd(), 'src/components/ToggleButton/toggleButton.css'),
  'utf8',
);
const buttonCss = readFileSync(resolve(process.cwd(), 'src/components/Button/button.css'), 'utf8');

afterEach(() => {
  document.body.innerHTML = '';
});

describe('FToggleButton', () => {
  it('renders a native unpressed button with upstream defaults', () => {
    const wrapper = mount(ToggleButton, { slots: { default: 'Pin' } });
    const button = wrapper.get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-pressed')).toBe('false');
    expect(button.classes()).toContain('fui-Button');
    expect(button.classes()).toContain('fui-ToggleButton');
    expect(button.classes()).toContain('fui-Button--secondary');
    expect(button.classes()).toContain('fui-Button--rounded');
    expect(button.classes()).toContain('fui-Button--medium');
    expect(button.text()).toBe('Pin');
  });

  it('supports uncontrolled checked state and emits update before click completes', async () => {
    const observedStates: string[] = [];
    const wrapper = mount(ToggleButton, {
      props: {
        defaultChecked: true,
        onClick: () => observedStates.push(wrapper.get('button').attributes('aria-pressed') ?? ''),
      },
      slots: { default: 'Pin' },
    });
    const button = wrapper.get('button');

    expect(button.attributes('aria-pressed')).toBe('true');
    await button.trigger('click');

    expect(observedStates).toEqual(['true']);
    expect(button.attributes('aria-pressed')).toBe('false');
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);

    await button.trigger('click');
    expect(button.attributes('aria-pressed')).toBe('true');
    expect(wrapper.emitted('click')).toHaveLength(2);
    expect(wrapper.emitted('update:modelValue')).toEqual([[false], [true]]);
  });

  it('keeps controlled DOM and ARIA state prop-authoritative', async () => {
    const wrapper = mount(ToggleButton, { props: { modelValue: true } });
    const button = wrapper.get('button');

    await button.trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(button.attributes('aria-pressed')).toBe('true');
    expect(button.classes()).toContain('fui-ToggleButton--checked');

    await wrapper.setProps({ modelValue: false });
    expect(button.attributes('aria-pressed')).toBe('false');
    expect(button.classes()).not.toContain('fui-ToggleButton--checked');
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
  });

  it('treats explicitly bound undefined modelValue as controlled unchecked', async () => {
    const wrapper = mount(ToggleButton, {
      props: { modelValue: undefined, defaultChecked: true },
    });
    const button = wrapper.get('button');

    expect(button.attributes('aria-pressed')).toBe('false');
    await button.trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    expect(button.attributes('aria-pressed')).toBe('false');
  });

  it('keeps template kebab-case explicit undefined controlled', async () => {
    const wrapper = mount({
      components: { ToggleButton },
      data: () => ({ checked: undefined as boolean | undefined }),
      template:
        '<ToggleButton :model-value="checked" default-checked>Template controlled</ToggleButton>',
    });
    const toggle = wrapper.getComponent(ToggleButton);
    const button = wrapper.get('button');

    expect(button.attributes('aria-pressed')).toBe('false');
    await button.trigger('click');

    expect(toggle.emitted('update:modelValue')).toEqual([[true]]);
    expect(button.attributes('aria-pressed')).toBe('false');
  });

  it('ignores later defaultChecked changes in uncontrolled mode', async () => {
    const wrapper = mount(ToggleButton, { props: { defaultChecked: false } });

    await wrapper.setProps({ defaultChecked: true });

    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false');
  });

  it('lets click preventDefault veto the state update', async () => {
    const wrapper = mount(ToggleButton, {
      props: {
        onClick: (event: MouseEvent) => event.preventDefault(),
      },
    });

    await wrapper.get('button').trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false');
  });

  it('emits click and model update exactly once through public listeners', async () => {
    const click = vi.fn();
    const update = vi.fn();
    const wrapper = mount(ToggleButton, {
      props: {
        onClick: click,
        'onUpdate:modelValue': update,
      },
    });

    await wrapper.get('button').trigger('click');

    expect(click).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith(true);
  });

  it('uses native disabled semantics and suppresses all interaction', async () => {
    const wrapper = mount(ToggleButton, {
      props: { disabled: true, defaultChecked: true },
    });
    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeDefined();
    expect(button.attributes('aria-disabled')).toBeUndefined();
    expect(button.attributes('aria-pressed')).toBe('true');
    await button.trigger('click');

    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(button.attributes('aria-pressed')).toBe('true');
  });

  it('keeps disabledFocusable focusable and suppresses component activation', async () => {
    const wrapper = mount(ToggleButton, {
      attachTo: document.body,
      props: { disabledFocusable: true },
    });
    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeUndefined();
    expect(button.attributes('aria-disabled')).toBe('true');
    button.element.focus();
    expect(document.activeElement).toBe(button.element);

    await button.trigger('click');
    for (const key of ['Enter', ' ']) {
      await button.trigger('keydown', { key });
    }

    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(button.attributes('aria-pressed')).toBe('false');
  });

  it('gives native disabled precedence when both disabled props are set', async () => {
    const wrapper = mount(ToggleButton, {
      props: { disabled: true, disabledFocusable: true },
    });
    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeDefined();
    expect(button.attributes('aria-disabled')).toBeUndefined();
    expect(button.classes()).toContain('fui-Button--disabled');
    expect(button.classes()).toContain('fui-ToggleButton--disabled');
    expect(button.classes()).not.toContain('fui-Button--disabled-focusable');
    expect(button.classes()).not.toContain('fui-ToggleButton--disabled-focusable');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('delegates enabled keyboard activation to the native button', () => {
    const wrapper = mount(ToggleButton);
    const button = wrapper.get('button');
    const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true });

    button.element.dispatchEvent(enter);
    button.element.dispatchEvent(space);

    expect(enter.defaultPrevented).toBe(false);
    expect(space.defaultPrevented).toBe(false);
  });

  it('defaults to type button and preserves explicit native submit behavior', async () => {
    const submit = vi.fn((event: Event) => event.preventDefault());
    const defaultWrapper = mount(
      {
        components: { ToggleButton },
        template: '<form @submit="submit"><ToggleButton>Default</ToggleButton></form>',
        methods: { submit },
      },
      { attachTo: document.body },
    );
    const submitWrapper = mount(
      {
        components: { ToggleButton },
        template: '<form @submit="submit"><ToggleButton type="submit">Submit</ToggleButton></form>',
        methods: { submit },
      },
      { attachTo: document.body },
    );

    defaultWrapper.get('button').element.click();
    submitWrapper.get('button').element.click();
    await nextTick();

    expect(defaultWrapper.get('button').attributes('type')).toBe('button');
    expect(submitWrapper.get('button').attributes('type')).toBe('submit');
    expect(submit).toHaveBeenCalledOnce();
  });

  it('supports appearance, shape, size, accessible and checked classes', () => {
    const wrapper = mount(ToggleButton, {
      props: {
        appearance: 'transparent',
        shape: 'circular',
        size: 'large',
        defaultChecked: true,
        isAccessible: true,
      },
    });

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'fui-Button--transparent',
        'fui-Button--circular',
        'fui-Button--large',
        'fui-ToggleButton--transparent',
        'fui-ToggleButton--checked',
        'fui-ToggleButton--accessible',
      ]),
    );
  });

  it('renders decorative icons before, after, and icon-only with inherited button geometry', async () => {
    const wrapper = mount(ToggleButton, {
      props: { size: 'small' },
      attrs: { 'aria-label': 'Pin item' },
      slots: { default: 'Pin', icon: '<svg data-icon="pin" />' },
    });

    expect(wrapper.element.firstElementChild?.classList).toContain('fui-ToggleButton__icon');
    expect(wrapper.get('.fui-ToggleButton__icon').attributes('aria-hidden')).toBe('true');

    await wrapper.setProps({ iconPosition: 'after' });
    expect(wrapper.element.lastElementChild?.classList).toContain('fui-ToggleButton__icon');

    const iconOnly = mount(ToggleButton, {
      props: { size: 'small' },
      attrs: { 'aria-label': 'Pin item' },
      slots: { icon: '<svg />' },
    });
    expect(iconOnly.classes()).toContain('fui-Button--icon-only-small');
    expect(iconOnly.find('.fui-Button__icon--before').exists()).toBe(false);
  });

  it('warns when an icon-only toggle button has no accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    mount(ToggleButton, { slots: { icon: '<svg />' } });

    expect(warn).toHaveBeenCalledWith(
      '[FToggleButton] Icon-only toggle buttons require an accessible name through aria-label or aria-labelledby.',
    );
    warn.mockRestore();
  });

  it('routes native attrs, class, style, form attrs and accessible naming to the button', () => {
    const wrapper = mount(ToggleButton, {
      attrs: {
        id: 'pin-toggle',
        class: 'custom',
        style: 'margin-inline-start: 2px',
        name: 'pin',
        value: 'yes',
        form: 'settings',
        tabindex: '2',
        'aria-label': 'Pin item',
        'data-control': 'toggle',
      },
    });
    const button = wrapper.get('button');

    expect(button.attributes('id')).toBe('pin-toggle');
    expect(button.classes()).toContain('custom');
    expect(button.attributes('style')).toContain('margin-inline-start: 2px');
    expect(button.attributes('name')).toBe('pin');
    expect(button.attributes('value')).toBe('yes');
    expect(button.attributes('form')).toBe('settings');
    expect(button.attributes('tabindex')).toBe('2');
    expect(button.attributes('aria-label')).toBe('Pin item');
    expect(button.attributes('data-control')).toBe('toggle');
  });

  it('does not allow attrs to override managed native or ARIA state', () => {
    const wrapper = mount(ToggleButton, {
      props: { modelValue: false },
      attrs: {
        role: 'checkbox',
        'aria-disabled': 'true',
        'aria-pressed': 'true',
        'aria-checked': 'true',
      },
    });
    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeUndefined();
    expect(button.attributes('role')).toBeUndefined();
    expect(button.attributes('aria-disabled')).toBeUndefined();
    expect(button.attributes('aria-pressed')).toBe('false');
    expect(button.attributes('aria-checked')).toBeUndefined();
  });

  it('accepts disabled through Vue native fallthrough prop normalization', async () => {
    const wrapper = mount(ToggleButton, { attrs: { disabled: true } });
    const button = wrapper.get('button');

    expect(button.attributes('disabled')).toBeDefined();
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('defines forced-color specificity, logical spacing, focus, and inherited reduced motion', () => {
    expect(toggleButtonCss).toContain('.fui-Button.fui-ToggleButton.fui-ToggleButton--checked');
    expect(toggleButtonCss).toContain('.fui-Button.fui-ToggleButton--disabled');
    expect(toggleButtonCss).toContain('color: HighlightText');
    expect(toggleButtonCss).toContain('background-color: Highlight');
    expect(toggleButtonCss).toContain('color: GrayText');
    expect(toggleButtonCss).toContain(':focus-visible');
    expect(buttonCss).toContain('margin-inline-end');
    expect(buttonCss).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });

  it('exposes the native element and focus operation', () => {
    const wrapper = mount(ToggleButton, { attachTo: document.body });
    const exposed = wrapper.vm as unknown as {
      element: HTMLButtonElement;
      focus: () => void;
    };
    const button = wrapper.get('button').element;
    const focusSpy = vi.spyOn(button, 'focus');

    expect(exposed.element).toBe(button);
    exposed.focus();
    expect(focusSpy).toHaveBeenCalledOnce();
  });
});

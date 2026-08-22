import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Button from '../src/components/Button/Button.vue';

describe('FButton', () => {
  it('renders a native button with upstream defaults', () => {
    const wrapper = mount(Button, { slots: { default: 'Save' } });
    const button = wrapper.get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.classes()).toContain('fui-Button--secondary');
    expect(button.classes()).toContain('fui-Button--rounded');
    expect(button.classes()).toContain('fui-Button--medium');
    expect(button.text()).toBe('Save');
  });

  it('forwards native attributes and user classes to the root', () => {
    const wrapper = mount(Button, {
      attrs: { id: 'save', class: 'custom', 'aria-label': 'Save changes' },
    });

    const button = wrapper.get('button');
    expect(button.attributes('id')).toBe('save');
    expect(button.attributes('aria-label')).toBe('Save changes');
    expect(button.classes()).toContain('custom');
  });

  it('renders icons before and after content', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Next', icon: '<svg data-icon="arrow" />' },
    });

    expect(wrapper.element.firstElementChild?.classList).toContain('fui-Button__icon');
    await wrapper.setProps({ iconPosition: 'after' });
    expect(wrapper.element.lastElementChild?.classList).toContain('fui-Button__icon');
  });

  it('uses icon-only dimensions when no default slot exists', () => {
    const wrapper = mount(Button, {
      props: { size: 'small' },
      attrs: { 'aria-label': 'Add item' },
      slots: { icon: '<svg />' },
    });

    expect(wrapper.classes()).toContain('fui-Button--icon-only');
    expect(wrapper.classes()).toContain('fui-Button--icon-only-small');
    expect(wrapper.find('.fui-Button__icon--before').exists()).toBe(false);
  });

  it('warns when an icon-only button has no accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    mount(Button, { slots: { icon: '<svg />' } });

    expect(warn).toHaveBeenCalledWith(
      '[FButton] Icon-only buttons require an accessible name through aria-label or aria-labelledby.',
    );
    warn.mockRestore();
  });

  it('accepts aria-label and aria-labelledby names for icon-only buttons', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    mount(Button, {
      attrs: { 'aria-label': 'Add item' },
      slots: { icon: '<svg />' },
    });
    mount(Button, {
      attrs: { 'aria-labelledby': 'add-label' },
      slots: { icon: '<svg />' },
    });

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('emits clicks for enabled buttons', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('click')?.[0]?.[0]).toBeInstanceOf(MouseEvent);
  });

  it('suppresses interaction for disabled and disabledFocusable buttons', async () => {
    const disabled = mount(Button, { props: { disabled: true } });
    const focusable = mount(Button, { props: { disabledFocusable: true } });

    await disabled.trigger('click');
    await focusable.trigger('click');

    expect(disabled.emitted('click')).toBeUndefined();
    expect(disabled.get('button').attributes('disabled')).toBeDefined();
    expect(focusable.emitted('click')).toBeUndefined();
    expect(focusable.get('button').attributes('disabled')).toBeUndefined();
    expect(focusable.get('button').attributes('aria-disabled')).toBe('true');
  });

  it('renders anchors with correct link and button semantics', async () => {
    const link = mount(Button, { props: { as: 'a', href: '/docs' } });
    const buttonAnchor = mount(Button, { props: { as: 'a' } });

    expect(link.get('a').attributes('href')).toBe('/docs');
    expect(link.get('a').attributes('role')).toBeUndefined();
    expect(buttonAnchor.get('a').attributes('role')).toBe('button');
    expect(buttonAnchor.get('a').attributes('tabindex')).toBe('0');

    await buttonAnchor.get('a').trigger('keydown', { key: 'Enter' });
    expect(buttonAnchor.emitted('click')).toHaveLength(1);
  });

  it('removes disabled anchors from tab order and navigation', () => {
    const wrapper = mount(Button, {
      props: { as: 'a', href: '/docs', disabled: true },
    });

    const anchor = wrapper.get('a');
    expect(anchor.attributes('href')).toBeUndefined();
    expect(anchor.attributes('tabindex')).toBe('-1');
    expect(anchor.attributes('aria-disabled')).toBe('true');
  });

  it('exposes a focus method for the native root', () => {
    const wrapper = mount(Button, { attachTo: document.body });
    const focus = (wrapper.vm as unknown as { focus: () => void }).focus;
    const spy = vi.spyOn(wrapper.element as HTMLButtonElement, 'focus');

    focus();
    expect(spy).toHaveBeenCalledOnce();
  });
});

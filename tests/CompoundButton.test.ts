/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import CompoundButton from '../src/components/CompoundButton/CompoundButton.vue';

describe('FCompoundButton', () => {
  it('renders a native button with upstream defaults and content structure', () => {
    const wrapper = mount(CompoundButton, {
      props: { secondaryContent: 'More details' },
      slots: { default: 'Save' },
    });
    const button = wrapper.get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.classes()).toContain('fui-CompoundButton');
    expect(button.classes()).toContain('fui-Button--secondary');
    expect(button.classes()).toContain('fui-Button--rounded');
    expect(button.classes()).toContain('fui-CompoundButton--medium');
    expect(button.get('.fui-CompoundButton__contentContainer').text()).toBe('SaveMore details');
    expect(button.get('.fui-CompoundButton__secondaryContent').text()).toBe('More details');
  });

  it('renders secondary content without primary content and includes it in the accessible name', () => {
    const wrapper = mount(CompoundButton, {
      props: { secondaryContent: 'Open recent files' },
      slots: { icon: '<svg data-icon="recent" />' },
    });
    const button = wrapper.get('button');

    expect(button.text()).toBe('Open recent files');
    expect(button.attributes('aria-label')).toBeUndefined();
    expect(button.get('.fui-CompoundButton__secondaryContent').text()).toBe('Open recent files');
    expect(button.get('.fui-CompoundButton__icon').attributes('aria-hidden')).toBe('true');
    expect(button.classes()).not.toContain('fui-CompoundButton--icon-only');
  });

  it('lets the secondaryContent slot override the prop', () => {
    const wrapper = mount(CompoundButton, {
      props: { secondaryContent: 'Prop details' },
      slots: {
        default: 'Save',
        'secondary-content': '<strong>Slot details</strong>',
      },
    });

    expect(wrapper.get('.fui-CompoundButton__secondaryContent').html()).toContain(
      '<strong>Slot details</strong>',
    );
    expect(wrapper.text()).not.toContain('Prop details');
  });

  it('renders icon slots before and after the content container', async () => {
    const wrapper = mount(CompoundButton, {
      props: { secondaryContent: 'Details' },
      slots: { default: 'Next', icon: '<svg data-icon="arrow" />' },
    });

    expect(wrapper.element.firstElementChild?.classList).toContain('fui-CompoundButton__icon');
    expect(wrapper.element.lastElementChild?.classList).toContain(
      'fui-CompoundButton__contentContainer',
    );

    await wrapper.setProps({ iconPosition: 'after' });
    expect(wrapper.element.firstElementChild?.classList).toContain(
      'fui-CompoundButton__contentContainer',
    );
    expect(wrapper.element.lastElementChild?.classList).toContain('fui-CompoundButton__icon');
  });

  it('uses CompoundButton icon-only dimensions only without primary and secondary content', () => {
    const iconOnly = mount(CompoundButton, {
      props: { size: 'small' },
      attrs: { 'aria-label': 'Open calendar' },
      slots: { icon: '<svg />' },
    });
    const withSecondary = mount(CompoundButton, {
      props: { secondaryContent: 'Calendar' },
      slots: { icon: '<svg />' },
    });

    expect(iconOnly.classes()).toContain('fui-CompoundButton--icon-only');
    expect(iconOnly.classes()).toContain('fui-CompoundButton--icon-only-small');
    expect(iconOnly.find('.fui-CompoundButton__contentContainer').exists()).toBe(false);
    expect(withSecondary.classes()).not.toContain('fui-CompoundButton--icon-only');
  });

  it('warns only when icon-only content has no accessible name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    mount(CompoundButton, { slots: { icon: '<svg />' } });
    mount(CompoundButton, {
      props: { secondaryContent: 'Calendar' },
      slots: { icon: '<svg />' },
    });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      '[FCompoundButton] Icon-only buttons require an accessible name through aria-label or aria-labelledby.',
    );
    warn.mockRestore();
  });

  it.each([
    ['secondary', 'fui-CompoundButton--secondary'],
    ['primary', 'fui-CompoundButton--primary'],
    ['outline', 'fui-CompoundButton--outline'],
    ['subtle', 'fui-CompoundButton--subtle'],
    ['transparent', 'fui-CompoundButton--transparent'],
  ] as const)('supports the %s appearance', (appearance, expectedClass) => {
    const wrapper = mount(CompoundButton, { props: { appearance } });
    expect(wrapper.classes()).toContain(expectedClass);
  });

  it.each(['rounded', 'circular', 'square'] as const)('supports the %s shape', (shape) => {
    const wrapper = mount(CompoundButton, { props: { shape } });
    expect(wrapper.classes()).toContain(`fui-Button--${shape}`);
  });

  it.each(['small', 'medium', 'large'] as const)('supports the %s size', (size) => {
    const wrapper = mount(CompoundButton, { props: { size } });
    expect(wrapper.classes()).toContain(`fui-CompoundButton--${size}`);
  });

  it('forwards native attributes, form attributes, user classes, and styles', () => {
    const wrapper = mount(CompoundButton, {
      attrs: {
        id: 'save',
        class: 'custom',
        style: 'width: 100%;',
        name: 'intent',
        value: 'save',
        form: 'editor',
        formaction: '/save',
        formmethod: 'post',
        'aria-label': 'Save changes with details',
        'data-track': 'save',
      },
    });

    const button = wrapper.get('button');
    expect(button.attributes('id')).toBe('save');
    expect(button.attributes('name')).toBe('intent');
    expect(button.attributes('value')).toBe('save');
    expect(button.attributes('form')).toBe('editor');
    expect(button.attributes('formaction')).toBe('/save');
    expect(button.attributes('formmethod')).toBe('post');
    expect(button.attributes('aria-label')).toBe('Save changes with details');
    expect(button.attributes('data-track')).toBe('save');
    expect(button.classes()).toContain('custom');
    expect(button.attributes('style')).toContain('width: 100%');
  });

  it('defaults to type button and preserves an explicit submit type', () => {
    const defaultButton = mount(CompoundButton);
    const submitButton = mount(CompoundButton, { attrs: { type: 'submit' } });

    expect(defaultButton.get('button').attributes('type')).toBe('button');
    expect(submitButton.get('button').attributes('type')).toBe('submit');
  });

  it('submits a native form only when explicitly configured as submit', async () => {
    const Host = defineComponent({
      components: { CompoundButton },
      template: `
        <form @submit.prevent="$emit('submitted')">
          <CompoundButton>Default</CompoundButton>
          <CompoundButton type="submit">Submit</CompoundButton>
        </form>
      `,
    });
    const wrapper = mount(Host, { attachTo: document.body });
    const buttons = wrapper.findAll('button');

    await buttons[0].trigger('click');
    expect(wrapper.emitted('submitted')).toBeUndefined();

    await buttons[1].trigger('click');
    expect(wrapper.emitted('submitted')).toHaveLength(1);
    wrapper.unmount();
  });

  it('emits one native click payload for enabled buttons', () => {
    const onClick = vi.fn();
    const wrapper = mount(CompoundButton, {
      props: { onClick },
    });

    wrapper.get('button').element.click();

    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('uses native keyboard activation without duplicate click emissions', async () => {
    const wrapper = mount(CompoundButton, { attachTo: document.body });
    const button = wrapper.get('button');

    await button.trigger('keydown', { key: 'Enter' });
    await button.trigger('keyup', { key: 'Enter' });
    expect(wrapper.emitted('click')).toBeUndefined();

    button.element.click();
    expect(wrapper.emitted('click')).toHaveLength(1);
    wrapper.unmount();
  });

  it('suppresses interaction for disabled and disabledFocusable buttons', async () => {
    const parentClick = vi.fn();
    const disabled = mount(CompoundButton, {
      props: { disabled: true },
      attrs: { onClick: parentClick },
    });
    const focusable = mount(CompoundButton, {
      props: { disabledFocusable: true },
      attrs: { onClick: parentClick },
    });

    await disabled.trigger('click');
    await focusable.trigger('click');
    const keydown = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    focusable.element.dispatchEvent(keydown);

    expect(disabled.emitted('click')).toBeUndefined();
    expect(disabled.get('button').attributes('disabled')).toBeDefined();
    expect(disabled.get('button').attributes('aria-disabled')).toBe('true');
    expect(focusable.emitted('click')).toBeUndefined();
    expect(focusable.get('button').attributes('disabled')).toBeUndefined();
    expect(focusable.get('button').attributes('aria-disabled')).toBe('true');
    expect(keydown.defaultPrevented).toBe(true);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('renders anchors with matching FButton link and button semantics', async () => {
    const link = mount(CompoundButton, { props: { as: 'a', href: '/docs' } });
    const buttonAnchor = mount(CompoundButton, { props: { as: 'a' } });

    expect(link.get('a').attributes('href')).toBe('/docs');
    expect(link.get('a').attributes('role')).toBeUndefined();
    expect(buttonAnchor.get('a').attributes('role')).toBe('button');
    expect(buttonAnchor.get('a').attributes('tabindex')).toBe('0');

    await buttonAnchor.get('a').trigger('keydown', { key: 'Enter' });
    expect(buttonAnchor.emitted('click')).toHaveLength(1);
  });

  it('removes disabled anchors from navigation while preserving disabledFocusable focusability', () => {
    const disabled = mount(CompoundButton, {
      props: { as: 'a', href: '/docs', disabled: true },
    });
    const focusable = mount(CompoundButton, {
      props: { as: 'a', href: '/docs', disabledFocusable: true },
    });

    expect(disabled.get('a').attributes('href')).toBeUndefined();
    expect(disabled.get('a').attributes('tabindex')).toBe('-1');
    expect(disabled.get('a').attributes('aria-disabled')).toBe('true');
    expect(focusable.get('a').attributes('href')).toBeUndefined();
    expect(focusable.get('a').attributes('tabindex')).toBe('0');
    expect(focusable.get('a').attributes('aria-disabled')).toBe('true');
  });

  it('exposes the native element and focus method', async () => {
    const component = ref<InstanceType<typeof CompoundButton> | null>(null);
    const Host = defineComponent({
      components: { CompoundButton },
      setup: () => ({ component }),
      template: '<CompoundButton ref="component">Focus</CompoundButton>',
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await nextTick();
    const button = wrapper.get('button').element;
    const focus = vi.spyOn(button, 'focus');

    expect(component.value?.element).toBe(button);
    component.value?.focus();
    expect(focus).toHaveBeenCalledOnce();
    wrapper.unmount();
  });
});

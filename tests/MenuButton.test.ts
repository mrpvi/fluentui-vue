import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { FMenu, FMenuItem, FMenuList, FMenuPopover } from '../src/components/Menu';
import { FMenuButton } from '../src/components/MenuButton';

describe('FMenuButton', () => {
  it('renders menu-button semantics and toggles uncontrolled open state', async () => {
    const wrapper = mount(FMenuButton, { slots: { default: 'Actions' } });
    const button = wrapper.get('button');
    expect(button.attributes('aria-haspopup')).toBe('menu');
    expect(button.attributes('aria-expanded')).toBe('false');
    await button.trigger('click');
    expect(button.attributes('aria-expanded')).toBe('true');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('supports controlled state and disabledFocusable suppression', async () => {
    const wrapper = mount(FMenuButton, { props: { modelValue: true, disabledFocusable: true } });
    const button = wrapper.get('button');
    expect(button.attributes('aria-expanded')).toBe('true');
    expect(button.attributes('aria-disabled')).toBe('true');
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('acts as a native FMenu trigger when composed inside FMenu', async () => {
    const wrapper = mount(FMenu, {
      attachTo: document.body,
      props: { inline: true },
      slots: {
        default: () => [
          h(FMenuButton, null, () => 'Actions'),
          h(FMenuPopover, null, {
            default: () => h(FMenuList, null, { default: () => h(FMenuItem, null, () => 'Edit') }),
          }),
        ],
      },
    });
    await wrapper.find('.fui-MenuButton').trigger('click');
    await nextTick();
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    expect(wrapper.find('.fui-MenuButton').attributes('aria-expanded')).toBe('true');
    wrapper.unmount();
  });
});

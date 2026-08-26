import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { FMenu, FMenuItem, FMenuList, FMenuPopover } from '../src/components/Menu';
import { FSplitButton } from '../src/components/SplitButton';

describe('FSplitButton', () => {
  it('keeps primary and menu actions independent', async () => {
    const wrapper = mount(FSplitButton, { slots: { default: 'Save' } });
    const buttons = wrapper.findAll('button');
    expect(wrapper.attributes('role')).toBe('group');
    await buttons[0]!.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    await buttons[1]!.trigger('click');
    expect(wrapper.emitted('menuClick')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(buttons[1]!.attributes('aria-expanded')).toBe('true');
  });

  it('opens the menu button with Alt+ArrowDown', async () => {
    const wrapper = mount(FSplitButton);
    await wrapper.trigger('keydown', { key: 'ArrowDown', altKey: true });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('opens an FMenu from the secondary action', async () => {
    const wrapper = mount(FMenu, {
      attachTo: document.body,
      props: { inline: true },
      slots: {
        default: () => [
          h(FSplitButton, null, () => 'Save'),
          h(FMenuPopover, null, {
            default: () =>
              h(FMenuList, null, { default: () => h(FMenuItem, null, () => 'Save as') }),
          }),
        ],
      },
    });
    await wrapper.find('.fui-SplitButton__menuButton').trigger('click');
    await nextTick();
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    expect(wrapper.find('.fui-SplitButton__menuButton').attributes('aria-expanded')).toBe('true');
    wrapper.unmount();
  });
});

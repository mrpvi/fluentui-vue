import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  FMenu,
  FMenuItem,
  FMenuItemCheckbox,
  FMenuList,
  FMenuPopover,
  FMenuTrigger,
} from '../src/components/Menu';

describe('Menu family', () => {
  it('opens from the trigger and renders an accessible menu', async () => {
    const wrapper = mount(FMenu, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(FMenuTrigger, null, { default: () => 'Actions' }),
          h(FMenuPopover, null, {
            default: () =>
              h(FMenuList, null, { default: () => h(FMenuItem, null, { default: () => 'Edit' }) }),
          }),
        ],
      },
    });
    await wrapper.find('.fui-MenuTrigger').trigger('click');
    await nextTick();
    expect(document.body.querySelector('[role="menu"]')).toBeTruthy();
    expect(document.body.querySelector('[role="menuitem"]')?.textContent).toContain('Edit');
    wrapper.unmount();
  });

  it('supports keyboard navigation and Escape restoration', async () => {
    const onOpenChange = vi.fn();
    const wrapper = mount(FMenu, {
      attachTo: document.body,
      props: { onOpenChange },
      slots: {
        default: () => [
          h(FMenuTrigger, null, { default: () => 'Actions' }),
          h(FMenuPopover, null, {
            default: () =>
              h(FMenuList, null, {
                default: () => [
                  h(FMenuItem, null, { default: () => 'Alpha' }),
                  h(FMenuItem, null, { default: () => 'Beta' }),
                ],
              }),
          }),
        ],
      },
    });
    const trigger = wrapper.find('.fui-MenuTrigger');
    (trigger.element as HTMLElement).focus();
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await nextTick();
    expect(document.activeElement?.textContent).toContain('Alpha');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    expect(onOpenChange).toHaveBeenCalledWith(
      expect.any(KeyboardEvent),
      expect.objectContaining({ open: false }),
    );
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });

  it('updates checkbox values', async () => {
    const wrapper = mount(FMenu, {
      props: { defaultOpen: true },
      slots: {
        default: () =>
          h(FMenuPopover, null, {
            default: () =>
              h(FMenuList, null, {
                default: () =>
                  h(FMenuItemCheckbox, { name: 'view', value: 'grid' }, { default: () => 'Grid' }),
              }),
          }),
      },
    });
    await nextTick();
    const item = document.body.querySelector('[role="menuitemcheckbox"]') as HTMLElement;
    expect(item).toBeTruthy();
    item.click();
    await nextTick();
    expect(wrapper.emitted('update:checkedValues')?.[0]).toEqual([{ view: ['grid'] }]);
    expect(wrapper.emitted('checkedValueChange')?.[0]?.[1]).toMatchObject({
      name: 'view',
      value: 'grid',
      checked: true,
    });
    wrapper.unmount();
  });
});

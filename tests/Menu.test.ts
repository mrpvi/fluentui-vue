import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FMenu,
  FMenuItem,
  FMenuItemCheckbox,
  FMenuItemRadio,
  FMenuItemSwitch,
  FMenuList,
  FMenuPopover,
  FMenuTrigger,
} from '../src/components/Menu';

afterEach(() => vi.restoreAllMocks());

describe('Menu family', () => {
  for (const component of [FMenuItemCheckbox, FMenuItemRadio, FMenuItemSwitch]) {
    it(`${component.name} omits unused icons and forwards named slots`, async () => {
      const wrapper = mount(FMenu, {
        props: { inline: true, defaultOpen: true },
        slots: {
          default: () =>
            h(FMenuList, null, {
              default: () => [
                h(component, { name: 'view', value: 'plain' }, { default: () => 'Plain' }),
                h(
                  component,
                  { name: 'view', value: 'custom', defaultChecked: true },
                  {
                    default: () => 'Custom',
                    icon: () => h('svg', { 'data-icon': '' }),
                    checkmark: () => h('span', { 'data-check': '' }, '✓'),
                    secondaryContent: () => 'Ctrl+K',
                  },
                ),
              ],
            }),
        },
      });
      const [plain, custom] = wrapper.findAll('.fui-MenuItem--selectable');
      expect(plain!.find('.fui-MenuItem__icon').exists()).toBe(false);
      expect(plain!.find('.fui-MenuItem__checkmark').exists()).toBe(true);
      expect(custom!.find('.fui-MenuItem__icon [data-icon]').exists()).toBe(true);
      expect(custom!.get('.fui-MenuItem__checkmark [data-check]').text()).toBe('✓');
      expect(custom!.get('.fui-MenuItem__secondary').text()).toBe('Ctrl+K');
      expect(custom!.attributes('aria-checked')).toBe('true');
      expect(custom!.attributes('role')).toBe(
        component === FMenuItemRadio ? 'menuitemradio' : 'menuitemcheckbox',
      );
      await wrapper.setProps({ hasIcons: true });
      expect(plain!.get('.fui-MenuItem__icon').text()).toBe('');
      await wrapper.setProps({ hasIcons: false });
      expect(plain!.find('.fui-MenuItem__icon').exists()).toBe(false);
      wrapper.unmount();
    });
  }

  it.each(['Enter', ' '])(
    'activates selectable items with %s unless the event is prevented',
    async (key) => {
      const wrapper = mount(FMenu, {
        props: { inline: true, defaultOpen: true },
        slots: {
          default: () =>
            h(FMenuItemCheckbox, { name: 'view', value: 'grid' }, { default: () => 'Grid' }),
        },
      });
      const item = wrapper.get('[role="menuitemcheckbox"]');
      await item.trigger('keydown', { key });
      expect(item.attributes('aria-checked')).toBe('true');
      const prevented = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      prevented.preventDefault();
      item.element.dispatchEvent(prevented);
      await nextTick();
      expect(item.attributes('aria-checked')).toBe('true');
      wrapper.unmount();
    },
  );

  it.each([undefined, 'ltr'] as const)(
    'preserves local RTL through Teleport with popup override %s',
    async (override) => {
      const wrapper = mount(FMenu, {
        attachTo: document.body,
        attrs: { style: 'direction: rtl' },
        props: { defaultOpen: true },
        slots: {
          default: () => [
            h(FMenuTrigger, null, { default: () => 'Options' }),
            h(FMenuPopover, override ? { dir: override } : {}, {
              default: () =>
                h(FMenuList, null, {
                  default: () =>
                    h(
                      FMenuItemCheckbox,
                      { name: 'view', value: 'grid' },
                      { default: () => 'Grid' },
                    ),
                }),
            }),
          ],
        },
      });
      await nextTick();
      await nextTick();
      const popover = document.body.querySelector('.fui-MenuPopover') as HTMLElement;
      expect(popover.dir).toBe(override ?? 'rtl');
      expect(popover.style.position).toBe('fixed');
      expect(wrapper.element.contains(popover)).toBe(false);
      await wrapper.setProps({ style: 'direction: ltr' });
      await nextTick();
      expect(popover.dir).toBe('ltr');
      wrapper.unmount();
    },
  );

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

  it('ignores consumer-prevented trigger clicks', async () => {
    const wrapper = mount(FMenu, {
      slots: {
        default: () => [
          h(
            FMenuTrigger,
            { onClick: (event: MouseEvent) => event.preventDefault() },
            { default: () => 'Context only' },
          ),
          h(FMenuPopover, null, {
            default: () =>
              h(FMenuList, null, { default: () => h(FMenuItem, null, { default: () => 'Edit' }) }),
          }),
        ],
      },
    });

    await wrapper.find('.fui-MenuTrigger').trigger('click');
    await nextTick();
    expect(wrapper.find('.fui-MenuTrigger').attributes('aria-expanded')).toBe('false');
  });

  it('registers and positions a teleported popover after opening', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.classList.contains('fui-MenuTrigger')) {
        return {
          width: 100,
          height: 32,
          top: 20,
          right: 140,
          bottom: 52,
          left: 40,
          x: 40,
          y: 20,
          toJSON() {},
        };
      }
      return {
        width: 180,
        height: 120,
        top: 0,
        right: 180,
        bottom: 120,
        left: 0,
        x: 0,
        y: 0,
        toJSON() {},
      };
    });

    const wrapper = mount(FMenu, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(FMenuTrigger, null, { default: () => 'Actions' }),
          h(
            FMenuPopover,
            { style: 'min-width: 220px' },
            {
              default: () =>
                h(FMenuList, null, {
                  default: () => h(FMenuItem, null, { default: () => 'Edit' }),
                }),
            },
          ),
        ],
      },
    });

    await wrapper.find('.fui-MenuTrigger').trigger('click');
    await nextTick();
    await nextTick();

    const popover = document.body.querySelector('.fui-MenuPopover') as HTMLElement;
    expect(popover).toBeTruthy();
    expect(popover.style.position).toBe('fixed');
    expect(popover.style.left).toBe('40px');
    expect(popover.style.top).toBe('56px');
    expect(popover.style.minWidth).toBe('220px');
  });

  it.each([
    ['ltr', 'above', 400],
    ['rtl', 'above', 320],
    ['ltr', 'before', 216],
    ['rtl', 'before', 504],
    ['ltr', 'after', 504],
    ['rtl', 'after', 216],
  ] as const)('positions %s popovers logically %s', async (direction, positioning, left) => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('fui-MenuTrigger')
        ? new DOMRect(400, 200, 100, 32)
        : new DOMRect(0, 0, 180, 120);
    });
    const wrapper = mount(FMenu, {
      attachTo: document.body,
      attrs: { style: `direction: ${direction}` },
      props: { defaultOpen: true, positioning },
      slots: {
        default: () => [
          h(FMenuTrigger, null, { default: () => 'Options' }),
          h(
            FMenuPopover,
            { style: `direction: ${direction}` },
            {
              default: () =>
                h(FMenuList, null, {
                  default: () => h(FMenuItem, null, { default: () => 'Edit' }),
                }),
            },
          ),
        ],
      },
    });
    await nextTick();
    await nextTick();
    const popover = document.body.querySelector('.fui-MenuPopover') as HTMLElement;
    expect(popover.style.left).toBe(`${left}px`);
    wrapper.unmount();
  });

  it('keeps inline popovers mounted in document flow', async () => {
    const wrapper = mount(FMenu, {
      props: { inline: true, modelValue: false },
      slots: {
        default: () =>
          h(FMenuPopover, null, {
            default: () =>
              h(FMenuList, null, { default: () => h(FMenuItem, null, { default: () => 'Edit' }) }),
          }),
      },
    });

    await nextTick();
    const popover = wrapper.get('.fui-MenuPopover');
    expect(popover.attributes('hidden')).toBeDefined();
    expect(popover.attributes('style')).toBeUndefined();

    await wrapper.setProps({ modelValue: true });
    await nextTick();
    expect(popover.attributes('hidden')).toBeUndefined();
    expect(popover.attributes('style')).toBeUndefined();
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

  it('updates radio values exclusively', async () => {
    const wrapper = mount(FMenu, {
      props: { defaultOpen: true, defaultCheckedValues: { sort: ['recent'] } },
      slots: {
        default: () =>
          h(FMenuPopover, null, {
            default: () =>
              h(FMenuList, null, {
                default: () => [
                  h(
                    FMenuItemRadio,
                    { name: 'sort', value: 'recent' },
                    { default: () => 'Most recent' },
                  ),
                  h(FMenuItemRadio, { name: 'sort', value: 'name' }, { default: () => 'Name' }),
                ],
              }),
          }),
      },
    });
    await nextTick();
    const items = document.body.querySelectorAll<HTMLElement>('[role="menuitemradio"]');
    items[1]?.click();
    await nextTick();
    expect(wrapper.emitted('update:checkedValues')?.[0]).toEqual([{ sort: ['name'] }]);
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

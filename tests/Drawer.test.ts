import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import {
  FDrawer,
  FDrawerBody,
  FDrawerFooter,
  FDrawerHeader,
  FDrawerHeaderNavigation,
  FDrawerHeaderTitle,
  FInlineDrawer,
  FOverlayDrawer,
} from '../src/components/Drawer';

describe('Drawer family', () => {
  it('opens an overlay drawer and associates its title', async () => {
    const wrapper = mount(FDrawer, {
      attachTo: document.body,
      props: { defaultOpen: true },
      slots: {
        default: () =>
          h(FOverlayDrawer, null, {
            default: () => h(FDrawerHeaderTitle, null, { default: () => 'Settings' }),
          }),
      },
    });
    await nextTick();
    const surface = document.body.querySelector('.fui-DrawerSurface');
    expect(surface).toBeTruthy();
    expect(surface?.getAttribute('role')).toBe('dialog');
    expect(surface?.getAttribute('aria-labelledby')).toMatch(/^fui-drawer-title-/);
    wrapper.unmount();
  });

  it('emits a close event when Escape is pressed', async () => {
    const onOpenChange = vi.fn();
    const wrapper = mount(FDrawer, {
      attachTo: document.body,
      props: { defaultOpen: true, onOpenChange },
      slots: { default: () => h(FOverlayDrawer) },
    });
    await nextTick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    expect(onOpenChange).toHaveBeenCalledWith(
      expect.any(KeyboardEvent),
      expect.objectContaining({ open: false, type: 'escapeKeyDown' }),
    );
    wrapper.unmount();
  });

  it('renders inline drawer content without teleporting', () => {
    const wrapper = mount(FDrawer, {
      props: { type: 'inline' },
      slots: {
        default: () =>
          h(FInlineDrawer, null, {
            default: () => [
              h(FDrawerHeader, null, { default: () => h(FDrawerHeaderNavigation) }),
              h(FDrawerBody, null, { default: () => 'Body' }),
              h(FDrawerFooter, null, { default: () => 'Footer' }),
            ],
          }),
      },
    });
    expect(wrapper.find('.fui-Drawer--inline').exists()).toBe(true);
    expect(wrapper.text()).toContain('Body');
    wrapper.unmount();
  });
});

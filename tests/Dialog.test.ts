import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  FDialog,
  FDialogActions,
  FDialogBody,
  FDialogSurface,
  FDialogTitle,
  FDialogTrigger,
} from '../src';

describe('FDialog', () => {
  it('opens from trigger and renders an accessible surface', async () => {
    const wrapper = mount(FDialog, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(FDialogTrigger, {}, () => 'Open dialog'),
          h(FDialogSurface, {}, () => [
            h(FDialogTitle, {}, () => 'Dialog title'),
            h(FDialogBody, {}, () => 'Dialog body'),
          ]),
        ],
      },
    });
    await wrapper.get('.fui-DialogTrigger').trigger('click');
    await nextTick();
    const surface = document.body.querySelector('.fui-DialogSurface');
    expect(surface).not.toBeNull();
    expect(surface?.getAttribute('role')).toBe('dialog');
    expect(surface?.getAttribute('aria-modal')).toBe('true');
    expect(surface?.getAttribute('aria-labelledby')).toMatch(/^fui-dialog-title-/);
    wrapper.unmount();
  });

  it('supports controlled state and reports trigger changes', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount(FDialog, {
      props: { modelValue: false, 'onUpdate:modelValue': onUpdate, onOpenChange: onChange },
      slots: {
        default: () => [
          h(FDialogTrigger, {}, () => 'Open'),
          h(FDialogSurface, {}, () => 'Content'),
        ],
      },
    });
    await wrapper.get('.fui-DialogTrigger').trigger('click');
    expect(onUpdate).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledWith(expect.any(MouseEvent), {
      open: true,
      type: 'triggerClick',
      event: expect.any(MouseEvent),
    });
    wrapper.unmount();
  });

  it('dismisses on escape and restores focus', async () => {
    const wrapper = mount(FDialog, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(FDialogTrigger, {}, () => 'Open'),
          h(FDialogSurface, {}, () => 'Content'),
        ],
      },
    });
    const trigger = wrapper.get('.fui-DialogTrigger');
    await trigger.trigger('click');
    await nextTick();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    expect(document.body.querySelector('.fui-DialogSurface')).toBeNull();
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });

  it('does not close alert dialogs from escape or backdrop clicks', async () => {
    const wrapper = mount(FDialog, {
      props: { modalType: 'alert', defaultOpen: true },
      attachTo: document.body,
      slots: { default: () => h(FDialogSurface, {}, () => 'Alert') },
    });
    await nextTick();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await (document.body.querySelector('.fui-DialogBackdrop') as HTMLElement).click();
    expect(document.body.querySelector('.fui-DialogSurface')).not.toBeNull();
    wrapper.unmount();
  });

  it('renders action layout variants', () => {
    const wrapper = mount(FDialogActions, {
      props: { position: 'start', fluid: true },
      slots: { default: () => 'Actions' },
    });
    expect(wrapper.classes()).toContain('fui-DialogActions--start');
    expect(wrapper.classes()).toContain('fui-DialogActions--fluid');
  });
});

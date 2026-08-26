import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { FPopover, FPopoverSurface, FPopoverTrigger } from '../src';

describe('FPopover', () => {
  it('toggles uncontrolled open state and exposes trigger relationships', async () => {
    const wrapper = mount(FPopover, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(FPopoverTrigger, {}, () => 'Open'),
          h(FPopoverSurface, {}, () => 'Details'),
        ],
      },
    });
    const trigger = wrapper.get('.fui-PopoverTrigger');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await trigger.trigger('click');
    await nextTick();
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(trigger.attributes('aria-controls')).toMatch(/^fui-popover-surface-/);
    expect(document.body.querySelector('.fui-PopoverSurface')).not.toBeNull();
    wrapper.unmount();
  });

  it('supports controlled state and emits changes', async () => {
    const onUpdate = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount(FPopover, {
      props: { modelValue: false, 'onUpdate:modelValue': onUpdate, onOpenChange: onChange },
      attachTo: document.body,
      slots: {
        default: () => [
          h(FPopoverTrigger, {}, () => 'Open'),
          h(FPopoverSurface, {}, () => 'Details'),
        ],
      },
    });
    await wrapper.get('.fui-PopoverTrigger').trigger('click');
    expect(onUpdate).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledWith(expect.any(MouseEvent), {
      open: true,
      reason: 'click',
    });
    wrapper.unmount();
  });

  it('dismisses on escape and restores focus', async () => {
    const wrapper = mount(FPopover, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(FPopoverTrigger, {}, () => 'Open'),
          h(FPopoverSurface, {}, () => 'Details'),
        ],
      },
    });
    const trigger = wrapper.get('.fui-PopoverTrigger');
    await trigger.trigger('click');
    await nextTick();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });

  it('dismisses on outside pointer input', async () => {
    const wrapper = mount(FPopover, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(FPopoverTrigger, {}, () => 'Open'),
          h(FPopoverSurface, {}, () => 'Details'),
        ],
      },
    });
    const trigger = wrapper.get('.fui-PopoverTrigger');
    await trigger.trigger('click');
    await nextTick();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await nextTick();
    expect(trigger.attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
  });
});

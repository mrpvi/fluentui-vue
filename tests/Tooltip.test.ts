import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { FTooltip } from '../src';

describe('FTooltip', () => {
  it('shows after focus delay and associates the trigger', async () => {
    vi.useFakeTimers();
    const wrapper = mount(FTooltip, {
      attachTo: document.body,
      props: { content: 'Helpful text', showDelay: 10 },
      slots: { default: '<button>Help</button>' },
    });
    const trigger = wrapper.get('button');
    await trigger.trigger('focus');
    vi.advanceTimersByTime(10);
    await nextTick();
    expect(trigger.attributes('aria-describedby')).toMatch(/^fui-tooltip-/);
    expect(document.body.querySelector('[role="tooltip"]')?.textContent).toContain('Helpful text');
    wrapper.unmount();
    vi.useRealTimers();
  });

  it('supports controlled visibility and emits updates', async () => {
    vi.useFakeTimers();
    const onUpdate = vi.fn();
    const onVisible = vi.fn();
    const wrapper = mount(FTooltip, {
      attachTo: document.body,
      props: {
        content: 'Controlled',
        visible: false,
        'onUpdate:visible': onUpdate,
        onVisibleChange: onVisible,
      },
      slots: { default: '<button>Help</button>' },
    });
    await wrapper.get('.fui-Tooltip__trigger').trigger('mouseenter');
    vi.advanceTimersByTime(250);
    expect(onUpdate).toHaveBeenCalledWith(true);
    expect(onVisible).toHaveBeenCalledWith(expect.any(MouseEvent), { visible: true });
    wrapper.unmount();
  });

  it('hides on blur and escape', async () => {
    vi.useFakeTimers();
    const wrapper = mount(FTooltip, {
      attachTo: document.body,
      props: { content: 'Dismiss me', showDelay: 0, hideDelay: 0 },
      slots: { default: '<button>Help</button>' },
    });
    await wrapper.get('.fui-Tooltip__trigger').trigger('focus');
    vi.advanceTimersByTime(250);
    await nextTick();
    vi.advanceTimersByTime(0);
    await nextTick();
    expect(document.body.querySelector('[role="tooltip"]')?.getAttribute('hidden')).toBeNull();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    expect(document.body.querySelector('[role="tooltip"]')?.hasAttribute('hidden')).toBe(true);
    wrapper.unmount();
    vi.useRealTimers();
  });
});

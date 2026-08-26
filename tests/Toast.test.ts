import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { FToast, FToastBody, FToastFooter, FToaster, FToastTitle, FToastTrigger } from '../src';

describe('Toast family', () => {
  it('composes accessible toast parts and dismisses through its trigger', async () => {
    const onDismiss = vi.fn();
    const wrapper = mount(FToast, {
      props: { intent: 'success', toastId: 'saved', onDismiss },
      slots: {
        default: () => [
          h(FToastTitle, null, { default: () => 'Saved' }),
          h(FToastBody, null, { default: () => 'Changes saved', subtitle: () => 'Just now' }),
          h(FToastFooter, null, {
            default: () => h(FToastTrigger, null, { default: () => 'Close' }),
          }),
        ],
      },
    });
    await nextTick();
    expect(wrapper.attributes('role')).toBe('listitem');
    expect(wrapper.attributes('aria-labelledby')).toBe(
      wrapper.get('.fui-ToastTitle').attributes('id'),
    );
    expect(wrapper.attributes('aria-describedby')).toBe(
      wrapper.get('.fui-ToastBody').attributes('id'),
    );
    await wrapper.get('.fui-ToastTrigger').trigger('click');
    expect(onDismiss).toHaveBeenCalledWith(expect.any(MouseEvent), {
      toastId: 'saved',
      reason: 'trigger',
    });
  });

  it('auto dismisses after its timeout', async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    mount(FToast, { props: { timeout: 50, onDismiss } });
    await vi.advanceTimersByTimeAsync(50);
    expect(onDismiss).toHaveBeenCalledWith(undefined, { toastId: undefined, reason: 'timeout' });
    vi.useRealTimers();
  });

  it('exposes an imperative Vue-native toaster controller', async () => {
    const wrapper = mount(FToaster, { props: { inline: true, timeout: -1 } });
    const controller = wrapper.vm as unknown as {
      dispatchToast: (content: string, options?: { toastId?: string }) => string;
      dismissToast: (id: string) => void;
    };
    controller.dispatchToast('Hello', { toastId: 'hello' });
    await nextTick();
    expect(wrapper.find('.fui-Toast').text()).toContain('Hello');
    controller.dismissToast('hello');
    await nextTick();
    expect(wrapper.find('.fui-Toast').exists()).toBe(false);
  });
});

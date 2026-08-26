import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { FAriaLiveAnnouncer } from '../src';

describe('FAriaLiveAnnouncer', () => {
  it('prioritizes assertive queued messages and clears each live region', async () => {
    vi.useFakeTimers();
    const wrapper = mount(FAriaLiveAnnouncer, { props: { messageDuration: 20 } });
    const api = wrapper.vm as unknown as {
      announce: (message: string, options?: { politeness?: 'polite' | 'assertive' }) => void;
    };
    api.announce('First');
    api.announce('Second');
    api.announce('Urgent', { politeness: 'assertive' });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('First');
    await vi.advanceTimersByTimeAsync(20);
    expect(wrapper.find('[aria-live="assertive"]').text()).toBe('Urgent');
    await vi.advanceTimersByTimeAsync(20);
    expect(wrapper.find('[aria-live="polite"]').text()).toBe('Second');
    vi.useRealTimers();
  });
});

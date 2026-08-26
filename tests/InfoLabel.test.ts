import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import { FInfoButton, FInfoLabel } from '../src';

describe('InfoLabel family', () => {
  it('composes a label and information button with shared naming', async () => {
    const wrapper = mount(FInfoLabel, {
      props: { info: 'Use your work email', for: 'email', required: true },
      slots: { default: () => 'Email' },
    });
    expect(wrapper.get('label').attributes('for')).toBe('email');
    const trigger = wrapper.get('.fui-InfoButton__trigger');
    expect(trigger.attributes('aria-labelledby')).toContain(wrapper.get('label').attributes('id'));
    await trigger.trigger('click');
    await nextTick();
    expect(wrapper.get('[role="note"]').text()).toBe('Use your work email');
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });

  it('dismisses an information surface with Escape and restores focus', async () => {
    const wrapper = mount(FInfoButton, {
      attachTo: document.body,
      props: { info: 'Details', inline: true },
    });
    const trigger = wrapper.get('button');
    await trigger.trigger('click');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    expect(wrapper.find('[role="note"]').exists()).toBe(false);
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });
});

import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import {
  FTeachingPopover,
  FTeachingPopoverBody,
  FTeachingPopoverCarousel,
  FTeachingPopoverCarouselCard,
  FTeachingPopoverCarouselFooterButton,
  FTeachingPopoverSurface,
  FTeachingPopoverTitle,
  FTeachingPopoverTrigger,
} from '../src/components/TeachingPopover';
describe('TeachingPopover family', () => {
  it('opens, traps focus, dismisses on Escape and restores focus', async () => {
    const wrapper = mount(FTeachingPopover, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(FTeachingPopoverTrigger, null, { default: () => 'Learn' }),
          h(FTeachingPopoverSurface, null, {
            default: () => [
              h(FTeachingPopoverTitle, null, { default: () => 'Tip' }),
              h(FTeachingPopoverBody, null, { default: () => h('button', 'Action') }),
            ],
          }),
        ],
      },
    });
    const trigger = wrapper.find('.fui-TeachingPopoverTrigger');
    (trigger.element as HTMLElement).focus();
    await trigger.trigger('click');
    await nextTick();
    expect(document.body.querySelector('.fui-TeachingPopoverSurface')).toBeTruthy();
    expect(document.activeElement?.textContent).toContain('Action');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await nextTick();
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });
  it('navigates teaching carousel values', async () => {
    const wrapper = mount(FTeachingPopoverCarousel, {
      slots: {
        default: () => [
          h(FTeachingPopoverCarouselCard, { value: 'one' }, { default: () => 'One' }),
          h(FTeachingPopoverCarouselCard, { value: 'two' }, { default: () => 'Two' }),
          h(FTeachingPopoverCarouselFooterButton, { navType: 'next', altText: 'Done' }),
        ],
      },
    });
    await nextTick();
    expect(wrapper.text()).toContain('One');
    await wrapper.find('button').trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['two']);
    expect(wrapper.text()).toContain('Two');
  });
});

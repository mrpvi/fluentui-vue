import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  FCarousel,
  FCarouselButton,
  FCarouselCard,
  FCarouselNav,
  FCarouselNavButton,
  FCarouselSlider,
  FCarouselViewport,
} from '../src/components/Carousel';
function content(props: Record<string, unknown> = {}) {
  return mount(FCarousel, {
    props,
    slots: {
      default: () => [
        h(FCarouselViewport, null, {
          default: () =>
            h(FCarouselSlider, null, {
              default: () => [
                h(FCarouselCard, null, { default: () => h('button', 'One') }),
                h(FCarouselCard, null, { default: () => h('button', 'Two') }),
              ],
            }),
        }),
        h(FCarouselButton, { navType: 'next' }),
        h(FCarouselNav, null, {
          default: () => [h(FCarouselNavButton, { index: 0 }), h(FCarouselNavButton, { index: 1 })],
        }),
      ],
    },
  });
}
describe('Carousel family', () => {
  it('navigates and keeps inactive cards inert', async () => {
    const wrapper = content();
    await nextTick();
    await wrapper.find('.fui-CarouselButton').trigger('click');
    await nextTick();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
    expect(wrapper.findAll('.fui-CarouselCard')[0]?.attributes('inert')).toBeDefined();
    expect(wrapper.findAll('.fui-CarouselCard')[1]?.attributes('aria-hidden')).toBe('false');
  });
  it('supports keyboard navigation and controlled state', async () => {
    const change = vi.fn();
    const wrapper = content({ activeIndex: 0, onActiveIndexChange: change });
    await wrapper.trigger('keydown', { key: 'End' });
    expect(change).toHaveBeenCalledWith(
      expect.any(KeyboardEvent),
      expect.objectContaining({ index: 1, reason: 'keyboard' }),
    );
    expect(wrapper.findAll('.fui-CarouselCard')[0]?.attributes('aria-hidden')).toBe('false');
  });
});

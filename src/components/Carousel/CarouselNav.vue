<script setup lang="ts">
import { inject, provide, ref, useAttrs } from 'vue';
import type { CarouselNavProps, CarouselNavSlots } from './Carousel.types';
import { carouselContextKey, carouselNavContextKey } from './carouselContext';
import CarouselNavButton from './CarouselNavButton.vue';
defineOptions({ name: 'FCarouselNav', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselNavProps>(), {
  as: 'div',
  ariaLabel: 'Choose slide',
});
defineSlots<CarouselNavSlots>();
const attrs = useAttrs();
const context = inject(carouselContextKey);
if (!context) throw new Error('FCarouselNav must be used inside FCarousel.');
const nextIndex = ref(0);
provide(carouselNavContextKey, { registerButton: () => nextIndex.value++ });
function keydown(event: KeyboardEvent) {
  const buttons = Array.from(
    (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
      'button:not([disabled]), [role="button"]',
    ),
  );
  const current = buttons.indexOf(document.activeElement as HTMLElement);
  let next: number;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
    next = (current + 1) % buttons.length;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
    next = (current - 1 + buttons.length) % buttons.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = buttons.length - 1;
  else return;
  event.preventDefault();
  buttons[next]?.focus();
}
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-CarouselNav"
    :class="{ 'fui-CarouselNav--brand': props.appearance === 'brand' }"
    role="group"
    :aria-label="props.ariaLabel"
    @keydown="keydown"
  >
    <slot :total="context.groups.value.length" :active-index="context.activeIndex.value"
      ><CarouselNavButton v-for="(_, index) in context.groups.value" :key="index" :index="index"
    /></slot>
  </component>
</template>
<style>
@import './carousel.css';
</style>

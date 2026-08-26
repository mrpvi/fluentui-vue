<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import type { CarouselSliderProps, CarouselSliderSlots } from './Carousel.types';
import { carouselContextKey } from './carouselContext';
defineOptions({ name: 'FCarouselSlider', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselSliderProps>(), { as: 'div', cardFocus: false });
defineSlots<CarouselSliderSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedContext = inject(carouselContextKey);
if (!injectedContext) throw new Error('FCarouselSlider must be used inside FCarousel.');
const context = injectedContext;
const transform = computed(() => `translateX(${-context.activeIndex.value * 100}%)`);
function handleKeydown(event: KeyboardEvent) {
  if (!props.cardFocus) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    const rtl = getComputedStyle(root.value as HTMLElement).direction === 'rtl';
    const next = event.key === 'ArrowRight' ? !rtl : rtl;
    context.move(next ? 'next' : 'prev', event, 'keyboard');
  }
}
onMounted(() => context.registerSlider(root.value));
onBeforeUnmount(() => context.registerSlider(null));
defineExpose({ element: root });
</script>
<template>
  <component
    :is="props.as"
    ref="root"
    v-bind="attrs"
    class="fui-CarouselSlider"
    :class="{ 'fui-CarouselSlider--fade': context.motion.value === 'fade' }"
    :style="context.motion.value === 'slide' ? { transform } : undefined"
    @keydown="handleKeydown"
    ><slot
  /></component>
</template>
<style>
@import './carousel.css';
</style>

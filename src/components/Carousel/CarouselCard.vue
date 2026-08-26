<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue';
import type { CarouselCardProps, CarouselCardSlots } from './Carousel.types';
import { carouselContextKey } from './carouselContext';
defineOptions({ name: 'FCarouselCard', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselCardProps>(), { as: 'div', autoSize: false });
defineSlots<CarouselCardSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const id = `fui-carousel-card-${useId()}`;
const context = inject(carouselContextKey);
if (!context) throw new Error('FCarouselCard must be used inside FCarousel.');
let unregister: (() => void) | undefined;
onMounted(() => {
  if (root.value) unregister = context.registerCard({ id, element: root.value });
});
onBeforeUnmount(() => unregister?.());
defineExpose({ element: root });
</script>
<template>
  <component
    :is="props.as"
    :id="id"
    ref="root"
    v-bind="attrs"
    class="fui-CarouselCard"
    :class="{ 'fui-CarouselCard--autoSize': props.autoSize }"
    role="group"
    aria-roledescription="slide"
    ><slot
  /></component>
</template>
<style>
@import './carousel.css';
</style>

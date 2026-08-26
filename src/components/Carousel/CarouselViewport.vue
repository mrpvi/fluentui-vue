<script setup lang="ts">
import { inject, onMounted, onBeforeUnmount, ref, useAttrs } from 'vue';
import type { CarouselViewportProps, CarouselViewportSlots } from './Carousel.types';
import { carouselContextKey } from './carouselContext';
defineOptions({ name: 'FCarouselViewport', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselViewportProps>(), { as: 'div' });
defineSlots<CarouselViewportSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const context = inject(carouselContextKey);
if (!context) throw new Error('FCarouselViewport must be used inside FCarousel.');
onMounted(() => context.registerViewport(root.value));
onBeforeUnmount(() => context.registerViewport(null));
defineExpose({ element: root });
</script>
<template>
  <component :is="props.as" ref="root" v-bind="attrs" class="fui-CarouselViewport"
    ><slot
  /></component>
</template>
<style>
@import './carousel.css';
</style>

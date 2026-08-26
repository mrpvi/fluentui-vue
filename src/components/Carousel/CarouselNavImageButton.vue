<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type { CarouselNavImageButtonProps, CarouselNavImageButtonSlots } from './Carousel.types';
import { carouselContextKey, carouselNavContextKey } from './carouselContext';
defineOptions({ name: 'FCarouselNavImageButton', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselNavImageButtonProps>(), { as: 'button', alt: '' });
defineSlots<CarouselNavImageButtonSlots>();
const attrs = useAttrs();
const context = inject(carouselContextKey);
if (!context) throw new Error('FCarouselNavImageButton must be used inside FCarousel.');
const nav = inject(carouselNavContextKey);
const registeredIndex = nav?.registerButton() ?? 0;
const index = computed(() => props.index ?? registeredIndex);
const selected = computed(() => context.activeIndex.value === index.value);
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-CarouselNavImageButton"
    :class="{ 'fui-CarouselNavImageButton--selected': selected }"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-current="selected ? 'true' : undefined"
    :aria-label="props.ariaLabel ?? `Go to slide ${index + 1}`"
    @click="context.select(index, $event, 'nav')"
  >
    <slot name="image"><img :src="props.src" :alt="props.alt" /></slot
    ><slot :selected="selected" :index="index" />
  </component>
</template>
<style>
@import './carousel.css';
</style>

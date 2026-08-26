<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type { CarouselNavButtonProps, CarouselNavButtonSlots } from './Carousel.types';
import { carouselContextKey, carouselNavContextKey } from './carouselContext';
defineOptions({ name: 'FCarouselNavButton', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselNavButtonProps>(), { as: 'button' });
defineSlots<CarouselNavButtonSlots>();
const attrs = useAttrs();
const context = inject(carouselContextKey);
if (!context) throw new Error('FCarouselNavButton must be used inside FCarousel.');
const nav = inject(carouselNavContextKey);
const registeredIndex = nav?.registerButton() ?? 0;
const index = computed(() => props.index ?? registeredIndex);
const selected = computed(() => context.activeIndex.value === index.value);
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-CarouselNavButton"
    :class="{ 'fui-CarouselNavButton--selected': selected }"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-current="selected ? 'true' : undefined"
    :aria-label="props.ariaLabel ?? `Go to slide ${index + 1}`"
    @click="context.select(index, $event, 'nav')"
  >
    <slot :selected="selected" :index="index"><span aria-hidden="true" /></slot>
  </component>
</template>
<style>
@import './carousel.css';
</style>

<script setup lang="ts">
import { useAttrs } from 'vue';
import type { CarouselNavContainerProps, CarouselNavContainerSlots } from './Carousel.types';
defineOptions({ name: 'FCarouselNavContainer', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselNavContainerProps>(), {
  as: 'div',
  layout: 'inline',
});
defineSlots<CarouselNavContainerSlots>();
const attrs = useAttrs();
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-CarouselNavContainer"
    :class="`fui-CarouselNavContainer--${props.layout}`"
  >
    <slot name="prev" /><slot name="autoplay" /><slot name="nav" /><slot /><slot name="next" />
  </component>
</template>
<style>
@import './carousel.css';
</style>

<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type { CarouselButtonProps, CarouselButtonSlots } from './Carousel.types';
import { carouselContextKey } from './carouselContext';
defineOptions({ name: 'FCarouselButton', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselButtonProps>(), { as: 'button', navType: 'next' });
defineSlots<CarouselButtonSlots>();
const attrs = useAttrs();
const injectedContext = inject(carouselContextKey);
if (!injectedContext) throw new Error('FCarouselButton must be used inside FCarousel.');
const context = injectedContext;
const disabled = computed(
  () =>
    props.disabled ||
    (!context.circular.value &&
      (props.navType === 'prev'
        ? context.activeIndex.value === 0
        : context.activeIndex.value >= context.groups.value.length - 1)),
);
function click(event: MouseEvent) {
  if (!disabled.value) context.move(props.navType, event);
}
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-CarouselButton"
    :class="`fui-CarouselButton--${props.navType}`"
    :type="props.as === 'button' ? 'button' : undefined"
    :disabled="props.as === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
    :aria-label="props.ariaLabel ?? (props.navType === 'next' ? 'Next slide' : 'Previous slide')"
    @click="click"
  >
    <slot name="icon"
      ><span aria-hidden="true">{{ props.navType === 'next' ? '›' : '‹' }}</span></slot
    ><slot />
  </component>
</template>
<style>
@import './carousel.css';
</style>

<script setup lang="ts">
import { inject, onMounted, useAttrs } from 'vue';
import type {
  CarouselAutoplayButtonEmits,
  CarouselAutoplayButtonProps,
  CarouselAutoplayButtonSlots,
} from './Carousel.types';
import { carouselContextKey } from './carouselContext';
defineOptions({ name: 'FCarouselAutoplayButton', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselAutoplayButtonProps>(), {
  as: 'button',
  defaultPlaying: true,
  ariaLabelPlay: 'Start autoplay',
  ariaLabelPause: 'Pause autoplay',
});
const emit = defineEmits<CarouselAutoplayButtonEmits>();
defineSlots<CarouselAutoplayButtonSlots>();
const attrs = useAttrs();
const injectedContext = inject(carouselContextKey);
if (!injectedContext) throw new Error('FCarouselAutoplayButton must be used inside FCarousel.');
const context = injectedContext;
onMounted(() => context.setPlaying(props.defaultPlaying));
function click(event: MouseEvent) {
  const next = !context.playing.value;
  context.setPlaying(next);
  emit('update:playing', next);
  emit('playingChange', event, next);
}
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-CarouselAutoplayButton"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-pressed="context.playing.value"
    :aria-label="context.playing.value ? props.ariaLabelPause : props.ariaLabelPlay"
    @click="click"
  >
    <slot name="icon" :playing="context.playing.value"
      ><span aria-hidden="true">{{ context.playing.value ? 'Ⅱ' : '▶' }}</span></slot
    ><slot :playing="context.playing.value" />
  </component>
</template>
<style>
@import './carousel.css';
</style>

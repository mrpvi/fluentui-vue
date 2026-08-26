<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type {
  TeachingPopoverCarouselFooterProps,
  TeachingPopoverCarouselFooterSlots,
} from './TeachingPopover.types';
import { teachingCarouselContextKey } from './teachingPopoverContext';
import TeachingPopoverCarouselFooterButton from './TeachingPopoverCarouselFooterButton.vue';
defineOptions({ name: 'FTeachingPopoverCarouselFooter', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverCarouselFooterProps>(), {
  as: 'div',
  layout: 'centered',
});
defineSlots<TeachingPopoverCarouselFooterSlots>();
const attrs = useAttrs();
const context = inject(teachingCarouselContextKey);
if (!context)
  throw new Error('FTeachingPopoverCarouselFooter must be used inside FTeachingPopoverCarousel.');
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-TeachingPopoverCarouselFooter"
    :class="`fui-TeachingPopoverCarouselFooter--${props.layout}`"
    ><slot name="previous" :disabled="false"
      ><TeachingPopoverCarouselFooterButton
        nav-type="prev"
        :alt-text="props.initialStepText" /></slot
    ><slot /><slot name="next" :final="false"
      ><TeachingPopoverCarouselFooterButton nav-type="next" :alt-text="props.finalStepText" /></slot
  ></component>
</template>
<style>
@import './teachingPopover.css';
</style>

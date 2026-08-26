<script setup lang="ts">
import { inject, provide, ref, useAttrs } from 'vue';
import type {
  TeachingPopoverCarouselNavProps,
  TeachingPopoverCarouselNavSlots,
} from './TeachingPopover.types';
import {
  teachingCarouselContextKey,
  teachingCarouselNavContextKey,
} from './teachingPopoverContext';
import TeachingPopoverCarouselNavButton from './TeachingPopoverCarouselNavButton.vue';
defineOptions({ name: 'FTeachingPopoverCarouselNav', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverCarouselNavProps>(), {
  as: 'div',
  ariaLabel: 'Choose step',
});
defineSlots<TeachingPopoverCarouselNavSlots>();
const attrs = useAttrs();
const context = inject(teachingCarouselContextKey);
if (!context)
  throw new Error('FTeachingPopoverCarouselNav must be used inside FTeachingPopoverCarousel.');
const index = ref(0);
provide(teachingCarouselNavContextKey, { nextValue: () => context.values.value[index.value++] });
function keydown(event: KeyboardEvent) {
  const buttons = Array.from(
    (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('button'),
  );
  let current = buttons.indexOf(document.activeElement as HTMLElement);
  if (event.key === 'ArrowRight') current++;
  else if (event.key === 'ArrowLeft') current--;
  else if (event.key === 'Home') current = 0;
  else if (event.key === 'End') current = buttons.length - 1;
  else return;
  event.preventDefault();
  buttons[(current + buttons.length) % buttons.length]?.focus();
}
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-TeachingPopoverCarouselNav"
    role="group"
    :aria-label="props.ariaLabel"
    @keydown="keydown"
    ><slot :values="context.values.value" :value="context.value.value"
      ><TeachingPopoverCarouselNavButton
        v-for="entry in context.values.value"
        :key="entry"
        :value="entry" /></slot
  ></component>
</template>
<style>
@import './teachingPopover.css';
</style>

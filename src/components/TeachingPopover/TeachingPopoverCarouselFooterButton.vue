<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type {
  TeachingPopoverCarouselFooterButtonProps,
  TeachingPopoverCarouselFooterButtonSlots,
} from './TeachingPopover.types';
import { teachingCarouselContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverCarouselFooterButton', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverCarouselFooterButtonProps>(), {
  as: 'button',
});
defineSlots<TeachingPopoverCarouselFooterButtonSlots>();
const attrs = useAttrs();
const injectedContext = inject(teachingCarouselContextKey);
if (!injectedContext)
  throw new Error(
    'FTeachingPopoverCarouselFooterButton must be used inside FTeachingPopoverCarousel.',
  );
const context = injectedContext;
const index = computed(() => context.values.value.indexOf(context.value.value ?? ''));
const disabled = computed(() => props.navType === 'prev' && index.value <= 0);
const final = computed(
  () => props.navType === 'next' && index.value >= context.values.value.length - 1,
);
function click(event: MouseEvent) {
  if (disabled.value) return;
  if (final.value) context.finish(event);
  else context.move(props.navType, event);
}
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-TeachingPopoverCarouselFooterButton"
    :class="`fui-TeachingPopoverCarouselFooterButton--${props.navType}`"
    :type="props.as === 'button' ? 'button' : undefined"
    :disabled="props.as === 'button' ? disabled : undefined"
    @click="click"
    ><slot :final="final" :disabled="disabled">{{
      final ? props.altText : props.navType === 'next' ? 'Next' : 'Previous'
    }}</slot></component
  >
</template>
<style>
@import './teachingPopover.css';
</style>

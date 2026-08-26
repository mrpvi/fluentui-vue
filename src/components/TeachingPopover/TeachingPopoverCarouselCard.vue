<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, useAttrs } from 'vue';
import type {
  TeachingPopoverCarouselCardProps,
  TeachingPopoverCarouselCardSlots,
} from './TeachingPopover.types';
import { teachingCarouselContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverCarouselCard', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverCarouselCardProps>(), { as: 'div' });
defineSlots<TeachingPopoverCarouselCardSlots>();
const attrs = useAttrs();
const context = inject(teachingCarouselContextKey);
if (!context)
  throw new Error('FTeachingPopoverCarouselCard must be used inside FTeachingPopoverCarousel.');
let unregister: (() => void) | undefined;
onMounted(() => (unregister = context.register(props.value)));
onBeforeUnmount(() => unregister?.());
</script>
<template>
  <component
    :is="props.as"
    v-show="context.value.value === props.value"
    v-bind="attrs"
    class="fui-TeachingPopoverCarouselCard"
    role="group"
    ><slot
  /></component>
</template>
<style>
@import './teachingPopover.css';
</style>

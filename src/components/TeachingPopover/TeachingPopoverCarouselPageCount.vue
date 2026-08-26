<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type {
  TeachingPopoverCarouselPageCountProps,
  TeachingPopoverCarouselPageCountSlots,
} from './TeachingPopover.types';
import { teachingCarouselContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverCarouselPageCount', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverCarouselPageCountProps>(), { as: 'div' });
defineSlots<TeachingPopoverCarouselPageCountSlots>();
const attrs = useAttrs();
const context = inject(teachingCarouselContextKey);
if (!context)
  throw new Error(
    'FTeachingPopoverCarouselPageCount must be used inside FTeachingPopoverCarousel.',
  );
const current = computed(() =>
  Math.max(1, context.values.value.indexOf(context.value.value ?? '') + 1),
);
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-TeachingPopoverCarouselPageCount"
    ><slot :current-page="current" :total-pages="context.values.value.length"
      >{{ current }} / {{ context.values.value.length }}</slot
    ></component
  >
</template>
<style>
@import './teachingPopover.css';
</style>

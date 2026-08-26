<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type {
  TeachingPopoverCarouselNavButtonProps,
  TeachingPopoverCarouselNavButtonSlots,
} from './TeachingPopover.types';
import {
  teachingCarouselContextKey,
  teachingCarouselNavContextKey,
} from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverCarouselNavButton', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverCarouselNavButtonProps>(), { as: 'button' });
defineSlots<TeachingPopoverCarouselNavButtonSlots>();
const attrs = useAttrs();
const context = inject(teachingCarouselContextKey);
if (!context)
  throw new Error(
    'FTeachingPopoverCarouselNavButton must be used inside FTeachingPopoverCarousel.',
  );
const nav = inject(teachingCarouselNavContextKey);
const value = props.value ?? nav?.nextValue() ?? '';
const selected = computed(() => context.value.value === value);
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-TeachingPopoverCarouselNavButton"
    :class="{ 'fui-TeachingPopoverCarouselNavButton--selected': selected }"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-current="selected ? 'step' : undefined"
    :aria-label="props.ariaLabel ?? `Go to ${value}`"
    @click="context.select(value, $event)"
    ><slot :selected="selected"><span aria-hidden="true" /></slot
  ></component>
</template>
<style>
@import './teachingPopover.css';
</style>

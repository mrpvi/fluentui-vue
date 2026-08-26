<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type { TeachingPopoverTitleProps, TeachingPopoverTitleSlots } from './TeachingPopover.types';
import { teachingPopoverContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverTitle', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverTitleProps>(), {
  as: 'h2',
  dismissLabel: 'Dismiss',
  showDismiss: false,
});
defineSlots<TeachingPopoverTitleSlots>();
const attrs = useAttrs();
const context = inject(teachingPopoverContextKey);
if (!context) throw new Error('FTeachingPopoverTitle must be used inside FTeachingPopover.');
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-TeachingPopoverTitle"
    ><span><slot /></span
    ><button
      v-if="props.showDismiss"
      type="button"
      class="fui-TeachingPopoverDismiss"
      :aria-label="props.dismissLabel"
      @click="context.requestOpen(false, $event, 'dismiss')"
    >
      <slot name="dismiss"><span aria-hidden="true">×</span></slot>
    </button></component
  >
</template>
<style>
@import './teachingPopover.css';
</style>

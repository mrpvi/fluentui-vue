<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type {
  TeachingPopoverHeaderProps,
  TeachingPopoverHeaderSlots,
} from './TeachingPopover.types';
import { teachingPopoverContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverHeader', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverHeaderProps>(), {
  as: 'div',
  dismissLabel: 'Dismiss',
  hideDismiss: false,
});
defineSlots<TeachingPopoverHeaderSlots>();
const attrs = useAttrs();
const context = inject(teachingPopoverContextKey);
if (!context) throw new Error('FTeachingPopoverHeader must be used inside FTeachingPopover.');
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-TeachingPopoverHeader"
    ><span v-if="$slots.icon" class="fui-TeachingPopoverHeader__icon"><slot name="icon" /></span
    ><span class="fui-TeachingPopoverHeader__content"><slot /></span
    ><button
      v-if="!props.hideDismiss"
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

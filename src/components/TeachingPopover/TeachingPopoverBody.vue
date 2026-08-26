<script setup lang="ts">
import { useAttrs } from 'vue';
import type { TeachingPopoverBodyProps, TeachingPopoverBodySlots } from './TeachingPopover.types';
defineOptions({ name: 'FTeachingPopoverBody', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverBodyProps>(), {
  as: 'div',
  mediaLength: 'medium',
});
defineSlots<TeachingPopoverBodySlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-TeachingPopoverBody"
    ><div
      v-if="$slots.media"
      class="fui-TeachingPopoverBody__media"
      :class="`fui-TeachingPopoverBody__media--${props.mediaLength}`"
    >
      <slot name="media" />
    </div>
    <div class="fui-TeachingPopoverBody__content"><slot /></div
  ></component>
</template>
<style>
@import './teachingPopover.css';
</style>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import type {
  TeachingPopoverSurfaceProps,
  TeachingPopoverSurfaceSlots,
} from './TeachingPopover.types';
import { teachingPopoverContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverSurface', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverSurfaceProps>(), {
  as: 'div',
  role: 'dialog',
});
defineSlots<TeachingPopoverSurfaceSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const context = inject(teachingPopoverContextKey);
if (!context) throw new Error('FTeachingPopoverSurface must be used inside FTeachingPopover.');
const target = computed(() => context.mountNode.value);
onMounted(() => context.registerSurface(root.value));
onBeforeUnmount(() => context.registerSurface(null));
</script>
<template>
  <Teleport v-if="!context.inlinePopup.value" :to="target"
    ><component
      :is="props.as"
      v-show="context.open.value"
      :id="context.surfaceId"
      ref="root"
      v-bind="attrs"
      class="fui-TeachingPopoverSurface"
      :class="`fui-TeachingPopoverSurface--${context.appearance.value}`"
      :style="[context.surfaceStyle.value, attrs.style]"
      :role="props.role"
      :aria-label="props.ariaLabel"
      :aria-labelledby="props.ariaLabel ? undefined : context.triggerId"
      tabindex="-1"
      ><slot /></component></Teleport
  ><component
    :is="props.as"
    v-else
    v-show="context.open.value"
    :id="context.surfaceId"
    ref="root"
    v-bind="attrs"
    class="fui-TeachingPopoverSurface"
    :class="`fui-TeachingPopoverSurface--${context.appearance.value}`"
    :role="props.role"
    :aria-label="props.ariaLabel"
    tabindex="-1"
    ><slot
  /></component>
</template>
<style>
@import './teachingPopover.css';
</style>

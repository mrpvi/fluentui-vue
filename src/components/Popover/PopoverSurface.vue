<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs } from 'vue';
import type { PopoverSurfaceProps, PopoverSurfaceSlots } from './PopoverSurface.types';
import { popoverContextKey } from './popoverContext';

defineOptions({ name: 'FPopoverSurface', inheritAttrs: false });
const props = withDefaults(defineProps<PopoverSurfaceProps>(), { as: 'div' });
defineSlots<PopoverSurfaceSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedContext = inject(popoverContextKey);
if (!injectedContext) throw new Error('FPopoverSurface must be used inside FPopover.');
const context = injectedContext;
const teleportTarget = computed(() => context.mountNode.value);

onMounted(() => context.registerSurface(root.value));
defineExpose({ element: root, focus: () => root.value?.focus() });
</script>

<template>
  <Teleport v-if="!context.inlinePopup.value" :to="teleportTarget">
    <component
      :is="props.as"
      :id="context.surfaceId"
      ref="root"
      v-bind="attrs"
      :style="[context.surfaceStyle.value, attrs.style]"
      class="fui-PopoverSurface"
      :role="props.role ?? 'dialog'"
      tabindex="-1"
      :hidden="!context.open.value"
    >
      <slot />
    </component>
  </Teleport>
  <component
    :is="props.as"
    v-else
    :id="context.surfaceId"
    ref="root"
    v-bind="attrs"
    :style="[context.surfaceStyle.value, attrs.style]"
    class="fui-PopoverSurface"
    role="dialog"
    tabindex="-1"
    :hidden="!context.open.value"
  >
    <slot />
  </component>
</template>

<style>
@import './popover.css';
</style>

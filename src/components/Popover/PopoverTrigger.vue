<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs } from 'vue';
import type { PopoverTriggerProps, PopoverTriggerSlots } from './PopoverTrigger.types';
import { popoverContextKey } from './popoverContext';

defineOptions({ name: 'FPopoverTrigger', inheritAttrs: false });
const props = withDefaults(defineProps<PopoverTriggerProps>(), { as: 'button' });
defineSlots<PopoverTriggerSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedContext = inject(popoverContextKey);
if (!injectedContext) throw new Error('FPopoverTrigger must be used inside FPopover.');
const context = injectedContext;
const id = computed(() => String(attrs.id ?? context.triggerId));

function handleClick(event: MouseEvent) {
  if (event.defaultPrevented) return;
  context.requestOpen(!context.open.value, event, 'click');
}

onMounted(() => context.registerTrigger(root.value));
defineExpose({ element: root, focus: () => root.value?.focus() });
</script>

<template>
  <component
    :is="props.as"
    v-bind="attrs"
    :id="id"
    ref="root"
    class="fui-PopoverTrigger"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-expanded="context.open.value"
    :aria-controls="context.open.value ? context.surfaceId : undefined"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

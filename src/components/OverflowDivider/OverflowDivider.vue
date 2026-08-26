<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import { overflowContextKey } from '../Overflow/overflowContext';
import type { OverflowDividerProps, OverflowDividerSlots } from './OverflowDivider.types';

defineOptions({ name: 'FOverflowDivider', inheritAttrs: false });
const props = defineProps<OverflowDividerProps>();
defineSlots<OverflowDividerSlots>();
const attrs = useAttrs();
const overflow = inject(overflowContextKey);
if (!overflow) throw new Error('FOverflowDivider must be used inside FOverflow.');
const root = ref<HTMLElement | null>(null);
let unregister: (() => void) | undefined;
onMounted(() => {
  if (root.value) {
    unregister = overflow.registerItem({
      element: root.value,
      groupId: props.groupId,
      id: `divider-${props.groupId}`,
      pinned: false,
      priority: 0,
      type: 'divider',
    });
  }
});
onBeforeUnmount(() => unregister?.());
defineExpose({ element: root });
</script>

<template>
  <div
    ref="root"
    v-bind="attrs"
    class="fui-OverflowDivider"
    role="separator"
    :data-overflow-divider="groupId"
  >
    <slot />
  </div>
</template>

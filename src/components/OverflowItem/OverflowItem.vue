<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import { overflowContextKey } from '../Overflow/overflowContext';
import type { OverflowItemProps, OverflowItemSlots } from './OverflowItem.types';

defineOptions({ name: 'FOverflowItem', inheritAttrs: false });
const props = withDefaults(defineProps<OverflowItemProps>(), { pinned: false, priority: 0 });
defineSlots<OverflowItemSlots>();
const attrs = useAttrs();
const overflow = inject(overflowContextKey);
if (!overflow) throw new Error('FOverflowItem must be used inside FOverflow.');
const root = ref<HTMLElement | null>(null);
let unregister: (() => void) | undefined;
onMounted(() => {
  if (root.value) {
    unregister = overflow.registerItem({
      element: root.value,
      groupId: props.groupId,
      id: props.id,
      pinned: Boolean(props.pinned),
      priority: props.priority ?? 0,
      type: 'item',
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
    class="fui-OverflowItem"
    :data-overflow-item="id"
    :data-overflow-group="groupId"
  >
    <slot />
  </div>
</template>

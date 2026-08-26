<script setup lang="ts">
import { computed, ref } from 'vue';
import type { TableResizeHandleEmits, TableResizeHandleProps } from './Table.types';
defineOptions({ name: 'FTableResizeHandle' });
const props = withDefaults(defineProps<TableResizeHandleProps>(), {
  minWidth: 40,
  maxWidth: 1000,
  width: 100,
});
const emit = defineEmits<TableResizeHandleEmits>();
const currentWidth = ref(props.width);
const clampedWidth = computed(() =>
  Math.min(props.maxWidth, Math.max(props.minWidth, currentWidth.value)),
);
function emitResize(event: MouseEvent | KeyboardEvent, width: number, delta: number, end = false) {
  currentWidth.value = Math.min(props.maxWidth, Math.max(props.minWidth, width));
  emit('resize', event, { columnId: props.columnId, width: clampedWidth.value, delta });
  if (end) emit('resizeEnd', event, { columnId: props.columnId, width: clampedWidth.value });
}
function handleKeydown(event: KeyboardEvent) {
  const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
  if (!direction) return;
  event.preventDefault();
  const delta = direction * (event.shiftKey ? 10 : 1);
  emitResize(event, clampedWidth.value + delta, delta, true);
}
function handlePointerdown(event: MouseEvent) {
  event.preventDefault();
  const startX = event.clientX;
  const startWidth = clampedWidth.value;
  const move = (moveEvent: MouseEvent) =>
    emitResize(moveEvent, startWidth + moveEvent.clientX - startX, moveEvent.clientX - startX);
  const up = (upEvent: MouseEvent) => {
    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', up);
    emitResize(upEvent, startWidth + upEvent.clientX - startX, upEvent.clientX - startX, true);
  };
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
}
</script>
<template>
  <div
    class="fui-TableResizeHandle"
    role="separator"
    tabindex="0"
    aria-orientation="vertical"
    :aria-label="ariaLabel ?? 'Resize column'"
    :aria-valuemin="minWidth"
    :aria-valuemax="maxWidth"
    :aria-valuenow="clampedWidth"
    @mousedown="handlePointerdown"
    @keydown="handleKeydown"
  />
</template>

<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { dataGridContextKey } from './dataGridContext';
import type { DataGridCellProps, DataGridCellSlots } from './DataGrid.types';
defineOptions({ name: 'FDataGridCell', inheritAttrs: false });
const props = withDefaults(defineProps<DataGridCellProps>(), { focusMode: 'cell' });
defineSlots<DataGridCellSlots>();
const attrs = useAttrs();
const injectedGrid = inject(dataGridContextKey);
if (!injectedGrid) throw new Error('FDataGridCell must be used inside FDataGrid.');
const grid = injectedGrid;
const divs = computed(() => props.noNativeElements ?? grid.noNativeElements.value);
const focusable = computed(() =>
  grid.focusMode.value === 'cell' || grid.focusMode.value === 'composite'
    ? props.focusMode !== 'none'
    : false,
);
function descendants(el: HTMLElement) {
  return Array.from(
    el.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ),
  );
}
function handleKeydown(event: KeyboardEvent) {
  const cell = event.currentTarget as HTMLElement;
  if (event.target !== cell) {
    if (props.focusMode === 'group' && event.key === 'Escape') {
      event.preventDefault();
      cell.focus();
    }
    return;
  }
  if (props.focusMode === 'group' && event.key === 'Enter') {
    event.preventDefault();
    descendants(cell)[0]?.focus();
    return;
  }
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    grid.moveFocus(cell, event.key);
  }
}
</script>
<template>
  <component
    :is="divs ? 'div' : 'td'"
    v-bind="attrs"
    :class="['fui-TableCell', 'fui-DataGridCell', attrs.class]"
    role="gridcell"
    :tabindex="focusable ? (attrs.tabindex ?? 0) : undefined"
    @keydown="handleKeydown"
    ><slot
  /></component>
</template>

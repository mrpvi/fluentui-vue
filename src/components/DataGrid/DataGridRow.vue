<script setup lang="ts">
import { computed, inject, provide, useAttrs } from 'vue';
import { dataGridContextKey, dataGridRowIdKey } from './dataGridContext';
import type { DataGridRowProps, DataGridRowSlots } from './DataGrid.types';
defineOptions({ name: 'FDataGridRow', inheritAttrs: false });
const props = withDefaults(defineProps<DataGridRowProps>(), { appearance: 'none' });
defineSlots<DataGridRowSlots>();
const attrs = useAttrs();
const injectedGrid = inject(dataGridContextKey);
if (!injectedGrid) throw new Error('FDataGridRow must be used inside FDataGrid.');
const grid = injectedGrid;
const divs = computed(() => props.noNativeElements ?? grid.noNativeElements.value);
const id = computed(() => props.rowId);
if (props.rowId !== undefined) provide(dataGridRowIdKey, id);
const selected = computed(() => id.value !== undefined && grid.isSelected(id.value));
const appearance = computed(() =>
  selected.value ? grid.selectionAppearance.value : props.appearance,
);
function handleKeydown(event: KeyboardEvent) {
  if (
    id.value !== undefined &&
    event.target === event.currentTarget &&
    event.key === ' ' &&
    grid.selectionMode.value
  ) {
    event.preventDefault();
    grid.toggleRow(id.value, event);
  }
}
</script>
<template>
  <component
    :is="divs ? 'div' : 'tr'"
    v-bind="attrs"
    :class="[
      'fui-TableRow',
      'fui-DataGridRow',
      `fui-TableRow--${appearance}`,
      { 'fui-DataGridRow--selected': selected },
      attrs.class,
    ]"
    role="row"
    :tabindex="grid.focusMode.value === 'row' ? 0 : undefined"
    :aria-selected="grid.selectionMode.value ? String(selected) : undefined"
    @keydown="handleKeydown"
    ><slot v-if="grid.selectionMode.value" name="selection-cell" :selected="selected" /><slot
  /></component>
</template>

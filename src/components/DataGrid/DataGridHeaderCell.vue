<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { dataGridContextKey } from './dataGridContext';
import FTableResizeHandle from '../Table/TableResizeHandle.vue';
import type { DataGridHeaderCellProps, DataGridHeaderCellSlots } from './DataGrid.types';
defineOptions({ name: 'FDataGridHeaderCell', inheritAttrs: false });
const props = withDefaults(defineProps<DataGridHeaderCellProps>(), {
  sortable: true,
  focusMode: 'cell',
});
defineSlots<DataGridHeaderCellSlots>();
const attrs = useAttrs();
const injectedGrid = inject(dataGridContextKey);
if (!injectedGrid) throw new Error('FDataGridHeaderCell must be used inside FDataGrid.');
const grid = injectedGrid;
const divs = computed(() => props.noNativeElements ?? grid.noNativeElements.value);
const direction = computed(() =>
  grid.sortState.value?.sortColumn === props.columnId
    ? grid.sortState.value.sortDirection
    : undefined,
);
const column = computed(() =>
  grid.columns.value.find((value) => value.columnId === props.columnId),
);
const width = computed(() => grid.getColumnWidth(props.columnId));
function sort(event: MouseEvent) {
  if (props.sortable && !event.defaultPrevented) grid.requestSort(props.columnId, event);
}
function resize(event: MouseEvent | KeyboardEvent, data: { width: number }) {
  grid.resizeColumn(props.columnId, data.width, event);
}
function handleKeydown(event: KeyboardEvent) {
  const cell = event.currentTarget as HTMLElement;
  if (
    event.target === cell &&
    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)
  ) {
    event.preventDefault();
    grid.moveFocus(cell, event.key);
  }
}
</script>
<template>
  <component
    :is="divs ? 'div' : 'th'"
    v-bind="attrs"
    :class="[
      'fui-TableHeaderCell',
      'fui-DataGridHeaderCell',
      { 'fui-TableHeaderCell--sortable': sortable },
      attrs.class,
    ]"
    role="columnheader"
    :tabindex="
      grid.focusMode.value === 'cell' || grid.focusMode.value === 'composite' ? 0 : undefined
    "
    :aria-sort="direction"
    :style="[attrs.style, width ? { width: `${width}px`, flex: `0 0 ${width}px` } : undefined]"
    @keydown="handleKeydown"
    ><button v-if="sortable" class="fui-TableHeaderCell__button" type="button" @click="sort">
      <slot /><span class="fui-TableHeaderCell__sortIcon" aria-hidden="true"
        ><slot name="sort-icon" :direction="direction">{{
          direction === 'ascending' ? '▲' : direction === 'descending' ? '▼' : '⇅'
        }}</slot></span
      ></button
    ><slot v-else /><span v-if="$slots.aside" class="fui-TableHeaderCell__aside"
      ><slot name="aside" /></span
    ><FTableResizeHandle
      v-if="grid.columns.value.length && column && width !== undefined"
      :column-id="columnId"
      :width="width"
      :min-width="column.minWidth"
      :max-width="column.maxWidth"
      @resize="resize"
  /></component>
</template>

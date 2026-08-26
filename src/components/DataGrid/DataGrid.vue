<script setup lang="ts" generic="TItem = unknown">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { tableContextKey } from '../Table/tableContext';
import { dataGridContextKey } from './dataGridContext';
import type {
  DataGridColumnId,
  DataGridEmits,
  DataGridProps,
  DataGridRowId,
  DataGridSlots,
  DataGridSortState,
} from './DataGrid.types';

defineOptions({ name: 'FDataGrid', inheritAttrs: false });
const props = withDefaults(defineProps<DataGridProps<TItem>>(), {
  items: () => [],
  columns: () => [],
  size: 'medium',
  noNativeElements: false,
  focusMode: 'cell',
  subtleSelection: false,
  selectionAppearance: 'brand',
  resizableColumns: false,
});
const emit = defineEmits<DataGridEmits>();
defineSlots<DataGridSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const isSelectionControlled = useIsPropProvided('modelValue');
const isSortControlled = useIsPropProvided('sortState');
const internalSelection = ref<DataGridRowId[]>([...(props.defaultSelectedItems ?? [])]);
const internalSort = ref<DataGridSortState | undefined>(props.defaultSortState);
const widths = ref(new Map<DataGridColumnId, number>());
const selectedItems = computed(() =>
  isSelectionControlled ? [...(props.modelValue ?? [])] : internalSelection.value,
);
const activeSort = computed(() => (isSortControlled ? props.sortState : internalSort.value));
const rowIds = computed(() =>
  props.items.map((item, index) => props.getRowId?.(item, index) ?? index),
);
const allSelected = computed<boolean | 'mixed'>(() =>
  !rowIds.value.length
    ? false
    : rowIds.value.every((id) => selectedItems.value.includes(id))
      ? true
      : rowIds.value.some((id) => selectedItems.value.includes(id))
        ? 'mixed'
        : false,
);
function commitSelection(next: DataGridRowId[], event: Event) {
  if (!isSelectionControlled) internalSelection.value = next;
  emit('update:modelValue', next);
  emit('selectionChange', event, { selectedItems: next });
}
function toggleRow(rowId: DataGridRowId, event: Event) {
  if (!props.selectionMode) return;
  const current = selectedItems.value;
  const next =
    props.selectionMode === 'single'
      ? [rowId]
      : current.includes(rowId)
        ? current.filter((id) => id !== rowId)
        : [...current, rowId];
  commitSelection(next, event);
}
function toggleAll(event: Event) {
  if (props.selectionMode !== 'multiselect') return;
  commitSelection(allSelected.value === true ? [] : [...rowIds.value], event);
}
function requestSort(columnId: DataGridColumnId, event: Event) {
  const next: DataGridSortState = {
    sortColumn: columnId,
    sortDirection:
      activeSort.value?.sortColumn === columnId && activeSort.value.sortDirection === 'ascending'
        ? 'descending'
        : 'ascending',
  };
  if (!isSortControlled) internalSort.value = next;
  emit('update:sortState', next);
  emit('sortChange', event, next);
}
function getColumnWidth(columnId: DataGridColumnId) {
  return (
    widths.value.get(columnId) ??
    props.columns.find((column) => column.columnId === columnId)?.width
  );
}
function resizeColumn(columnId: DataGridColumnId, width: number, event: Event) {
  const column = props.columns.find((value) => value.columnId === columnId);
  const next = Math.min(column?.maxWidth ?? 1000, Math.max(column?.minWidth ?? 40, width));
  widths.value.set(columnId, next);
  widths.value = new Map(widths.value);
  emit('columnResize', event, { columnId, width: next });
}
function moveFocus(cell: HTMLElement, key: string) {
  const grid = root.value;
  if (!grid) return;
  const rows = Array.from(grid.querySelectorAll<HTMLElement>('[role="row"]'));
  const row = cell.closest<HTMLElement>('[role="row"]');
  if (!row) return;
  const rowIndex = rows.indexOf(row);
  const cells = Array.from(
    row.querySelectorAll<HTMLElement>('[role="gridcell"], [role="columnheader"]'),
  );
  const cellIndex = cells.indexOf(cell);
  let nextRow = rowIndex;
  let nextCell = cellIndex;
  if (key === 'ArrowRight') nextCell++;
  else if (key === 'ArrowLeft') nextCell--;
  else if (key === 'ArrowDown') nextRow++;
  else if (key === 'ArrowUp') nextRow--;
  else if (key === 'Home') nextCell = 0;
  else if (key === 'End') nextCell = cells.length - 1;
  else return;
  const targetRow = rows[Math.max(0, Math.min(rows.length - 1, nextRow))];
  const targetCells = targetRow
    ? Array.from(
        targetRow.querySelectorAll<HTMLElement>('[role="gridcell"], [role="columnheader"]'),
      )
    : [];
  const target = targetCells[Math.max(0, Math.min(targetCells.length - 1, nextCell))];
  if (target) {
    cell.tabIndex = -1;
    target.tabIndex = 0;
    target.focus();
  }
}
const noNativeElements = computed(() => props.noNativeElements);
provide(tableContextKey, {
  size: computed(() => props.size),
  noNativeElements,
  sortable: computed(() => true),
});
provide(dataGridContextKey, {
  root,
  size: computed(() => props.size),
  noNativeElements,
  focusMode: computed(() => props.focusMode),
  selectionMode: computed(() => props.selectionMode),
  subtleSelection: computed(() => props.subtleSelection),
  selectionAppearance: computed(() => props.selectionAppearance),
  sortState: activeSort,
  columns: computed(() => (props.columns as DataGridProps['columns']) ?? []),
  isSelected: (id) => selectedItems.value.includes(id),
  toggleRow,
  toggleAll,
  allSelected,
  requestSort,
  getColumnWidth,
  resizeColumn,
  moveFocus,
});
defineExpose({ selectedItems, sortState: activeSort });
</script>
<template>
  <component
    :is="noNativeElements ? 'div' : 'table'"
    ref="root"
    v-bind="attrs"
    :class="['fui-Table', 'fui-DataGrid', `fui-Table--${size}`, attrs.class]"
    role="grid"
    :aria-multiselectable="selectionMode === 'multiselect' ? 'true' : undefined"
    ><slot
  /></component>
</template>
<style>
@import '../Table/table.css';
@import './dataGrid.css';
</style>

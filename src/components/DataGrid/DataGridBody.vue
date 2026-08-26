<script setup lang="ts">
import { computed, getCurrentInstance, inject, useAttrs } from 'vue';
import { dataGridContextKey } from './dataGridContext';
import type { DataGridSectionProps, DataGridSectionSlots } from './DataGrid.types';
defineOptions({ name: 'FDataGridBody', inheritAttrs: false });
const props = defineProps<DataGridSectionProps>();
defineSlots<DataGridSectionSlots>();
const attrs = useAttrs();
const grid = inject(dataGridContextKey);
if (!grid) throw new Error('FDataGridBody must be used inside FDataGrid.');
const divs = computed(() => props.noNativeElements ?? grid.noNativeElements.value);
const owner = getCurrentInstance()?.parent?.props as
  { items?: unknown[]; getRowId?: (item: unknown, index: number) => string | number } | undefined;
const rows = computed(() => {
  const items = [...(owner?.items ?? [])];
  const sort = grid.sortState.value;
  if (sort) {
    const column = grid.columns.value.find((value) => value.columnId === sort.sortColumn);
    if (column?.compare)
      items.sort((a, b) => (sort.sortDirection === 'ascending' ? 1 : -1) * column.compare!(a, b));
  }
  return items.map((item, index) => ({
    item,
    index,
    rowId: owner?.getRowId?.(item, index) ?? index,
  }));
});
</script>
<template>
  <component
    :is="divs ? 'div' : 'tbody'"
    v-bind="attrs"
    :class="['fui-TableBody', 'fui-DataGridBody', attrs.class]"
    :role="divs ? 'rowgroup' : attrs.role"
    ><template v-for="row in rows" :key="row.rowId"
      ><slot :item="row.item" :row-id="row.rowId" :index="row.index" /></template
  ></component>
</template>

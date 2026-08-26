<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { dataGridContextKey } from './dataGridContext';
import type { DataGridSectionProps, DataGridSectionSlots } from './DataGrid.types';
defineOptions({ name: 'FDataGridHeader', inheritAttrs: false });
const props = defineProps<DataGridSectionProps>();
defineSlots<DataGridSectionSlots>();
const attrs = useAttrs();
const grid = inject(dataGridContextKey);
if (!grid) throw new Error('FDataGridHeader must be used inside FDataGrid.');
const divs = computed(() => props.noNativeElements ?? grid.noNativeElements.value);
</script>
<template>
  <component
    :is="divs ? 'div' : 'thead'"
    v-bind="attrs"
    :class="['fui-TableHeader', 'fui-DataGridHeader', attrs.class]"
    :role="divs ? 'rowgroup' : attrs.role"
    ><slot
  /></component>
</template>

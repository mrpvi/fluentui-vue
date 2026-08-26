<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { tableContextKey } from './tableContext';
import type { TableCellProps, TableCellSlots } from './Table.types';

defineOptions({ name: 'FTableCell', inheritAttrs: false });
const props = defineProps<TableCellProps>();
defineSlots<TableCellSlots>();
const attrs = useAttrs();
const table = inject(tableContextKey);
const noNativeElements = computed(
  () => props.noNativeElements ?? table?.noNativeElements.value ?? false,
);
</script>

<template>
  <component
    :is="noNativeElements ? 'div' : 'td'"
    v-bind="attrs"
    :class="['fui-TableCell', attrs.class]"
    :role="noNativeElements ? 'cell' : attrs.role"
    ><slot
  /></component>
</template>

<script setup lang="ts">
import { computed, inject, provide, useAttrs } from 'vue';
import { tableContextKey, tableHeaderContextKey } from './tableContext';
import type { TableSectionProps, TableSectionSlots } from './Table.types';

defineOptions({ name: 'FTableBody', inheritAttrs: false });
const props = defineProps<TableSectionProps>();
defineSlots<TableSectionSlots>();
const attrs = useAttrs();
const table = inject(tableContextKey);
const noNativeElements = computed(
  () => props.noNativeElements ?? table?.noNativeElements.value ?? false,
);
provide(
  tableHeaderContextKey,
  computed(() => false),
);
</script>

<template>
  <component
    :is="noNativeElements ? 'div' : 'tbody'"
    v-bind="attrs"
    class="fui-TableBody"
    :role="noNativeElements ? 'rowgroup' : attrs.role"
    ><slot
  /></component>
</template>

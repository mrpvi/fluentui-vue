<script setup lang="ts">
import { computed, inject, provide, useAttrs } from 'vue';
import { tableContextKey, tableHeaderContextKey } from './tableContext';
import type { TableSectionProps, TableSectionSlots } from './Table.types';

defineOptions({ name: 'FTableHeader', inheritAttrs: false });
const props = defineProps<TableSectionProps>();
defineSlots<TableSectionSlots>();
const attrs = useAttrs();
const table = inject(tableContextKey);
const noNativeElements = computed(
  () => props.noNativeElements ?? table?.noNativeElements.value ?? false,
);
provide(
  tableHeaderContextKey,
  computed(() => true),
);
</script>

<template>
  <component
    :is="noNativeElements ? 'div' : 'thead'"
    v-bind="attrs"
    class="fui-TableHeader"
    :role="noNativeElements ? 'rowgroup' : attrs.role"
    ><slot
  /></component>
</template>

<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { tableContextKey } from './tableContext';
import type { TableRowProps, TableRowSlots } from './Table.types';

defineOptions({ name: 'FTableRow', inheritAttrs: false });
const props = withDefaults(defineProps<TableRowProps>(), { appearance: 'none' });
defineSlots<TableRowSlots>();
const attrs = useAttrs();
const table = inject(tableContextKey);
const noNativeElements = computed(
  () => props.noNativeElements ?? table?.noNativeElements.value ?? false,
);
</script>

<template>
  <component
    :is="noNativeElements ? 'div' : 'tr'"
    v-bind="attrs"
    :class="['fui-TableRow', `fui-TableRow--${appearance}`, attrs.class]"
    :role="noNativeElements ? 'row' : attrs.role"
    ><slot
  /></component>
</template>

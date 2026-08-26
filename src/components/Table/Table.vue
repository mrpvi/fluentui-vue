<script setup lang="ts">
import { computed, provide, useAttrs } from 'vue';
import { tableContextKey } from './tableContext';
import type { TableProps, TableSlots } from './Table.types';

defineOptions({ name: 'FTable', inheritAttrs: false });
const props = withDefaults(defineProps<TableProps>(), {
  size: 'medium',
  noNativeElements: false,
  sortable: false,
});
defineSlots<TableSlots>();
const attrs = useAttrs();
const noNativeElements = computed(() => props.noNativeElements);
provide(tableContextKey, {
  size: computed(() => props.size),
  noNativeElements,
  sortable: computed(() => props.sortable),
});
</script>

<template>
  <component
    :is="noNativeElements ? 'div' : 'table'"
    v-bind="attrs"
    :class="['fui-Table', `fui-Table--${size}`, attrs.class]"
    :role="noNativeElements ? 'table' : attrs.role"
  >
    <slot />
  </component>
</template>

<style>
@import './table.css';
</style>

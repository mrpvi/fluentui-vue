<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { tableContextKey } from './tableContext';
import type {
  TableHeaderCellEmits,
  TableHeaderCellProps,
  TableHeaderCellSlots,
} from './Table.types';

defineOptions({ name: 'FTableHeaderCell', inheritAttrs: false });
const props = defineProps<TableHeaderCellProps>();
const emit = defineEmits<TableHeaderCellEmits>();
defineSlots<TableHeaderCellSlots>();
const attrs = useAttrs();
const table = inject(tableContextKey);
const noNativeElements = computed(
  () => props.noNativeElements ?? table?.noNativeElements.value ?? false,
);
const isSortable = computed(() => props.sortable ?? table?.sortable.value ?? false);
function handleSort(event: MouseEvent | KeyboardEvent) {
  if (!event.defaultPrevented) emit('sort', event);
}
function handleKeydown(event: KeyboardEvent) {
  if (isSortable.value && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    handleSort(event);
  }
}
</script>

<template>
  <component
    :is="noNativeElements ? 'div' : 'th'"
    v-bind="attrs"
    :class="['fui-TableHeaderCell', { 'fui-TableHeaderCell--sortable': isSortable }, attrs.class]"
    :role="noNativeElements ? 'columnheader' : attrs.role"
    :aria-sort="sortDirection"
  >
    <button
      v-if="isSortable"
      class="fui-TableHeaderCell__button"
      type="button"
      @click="handleSort"
      @keydown="handleKeydown"
    >
      <slot /><span class="fui-TableHeaderCell__sortIcon" aria-hidden="true"
        ><slot name="sort-icon" :direction="sortDirection">{{
          sortDirection === 'ascending' ? '▲' : sortDirection === 'descending' ? '▼' : '⇅'
        }}</slot></span
      >
    </button>
    <slot v-else />
    <span v-if="$slots.aside" class="fui-TableHeaderCell__aside"><slot name="aside" /></span>
  </component>
</template>

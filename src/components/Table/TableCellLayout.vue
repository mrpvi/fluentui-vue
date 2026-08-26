<script setup lang="ts">
import type { TableCellLayoutProps, TableCellLayoutSlots } from './Table.types';
defineOptions({ name: 'FTableCellLayout' });
const props = defineProps<TableCellLayoutProps>();
defineSlots<TableCellLayoutSlots>();
</script>
<template>
  <div
    :class="[
      'fui-TableCellLayout',
      {
        'fui-TableCellLayout--primary': props.appearance === 'primary',
        'fui-TableCellLayout--truncate': props.truncate,
      },
    ]"
  >
    <span v-if="$slots.media" class="fui-TableCellLayout__media"><slot name="media" /></span>
    <div class="fui-TableCellLayout__content">
      <span class="fui-TableCellLayout__main"><slot /></span
      ><span v-if="$slots.description" class="fui-TableCellLayout__description"
        ><slot name="description"
      /></span>
    </div>
  </div>
</template>

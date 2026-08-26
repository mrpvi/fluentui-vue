<script setup lang="ts">
import type { TableCellActionsProps, TableCellActionsSlots } from './Table.types';
defineOptions({ name: 'FTableCellActions' });
withDefaults(defineProps<TableCellActionsProps>(), { visible: false });
defineSlots<TableCellActionsSlots>();
</script>
<template>
  <div :class="['fui-TableCellActions', { 'fui-TableCellActions--visible': visible }]">
    <slot />
  </div>
</template>

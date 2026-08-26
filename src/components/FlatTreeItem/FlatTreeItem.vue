<script setup lang="ts">
import TreeItem from '../TreeItem/TreeItem.vue';
import type { TreeItemEmits, TreeItemSlots } from '../TreeItem';
import type { FlatTreeItemProps } from './FlatTreeItem.types';

defineOptions({ name: 'FFlatTreeItem' });
const props = defineProps<FlatTreeItemProps>();
const emit = defineEmits<TreeItemEmits>();
defineSlots<TreeItemSlots>();
</script>

<template>
  <TreeItem
    v-bind="props"
    class="fui-FlatTreeItem"
    :aria-level="level"
    :aria-posinset="position"
    :aria-setsize="setSize"
    :style="{ '--fui-tree-item-level': level }"
    @open-change="(event, data) => emit('openChange', event, data)"
  >
    <slot />
  </TreeItem>
</template>

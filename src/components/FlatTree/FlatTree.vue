<script setup lang="ts">
import Tree from '../Tree/Tree.vue';
import type { TreeEmits, TreeSlots } from '../Tree';
import type { FlatTreeProps } from './FlatTree.types';

defineOptions({ name: 'FFlatTree' });
const props = defineProps<FlatTreeProps>();
const emit = defineEmits<TreeEmits>();
defineSlots<TreeSlots>();
</script>

<template>
  <Tree
    v-bind="props"
    class="fui-FlatTree"
    @update:open-items="emit('update:openItems', $event)"
    @update:checked-items="emit('update:checkedItems', $event)"
    @open-change="(event, data) => emit('openChange', event, data)"
    @checked-change="(event, data) => emit('checkedChange', event, data)"
  >
    <slot />
  </Tree>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';
import type { MenuSplitGroupProps, MenuSplitGroupSlots } from './Menu.types';
defineOptions({ name: 'FMenuSplitGroup', inheritAttrs: false });
const props = withDefaults(defineProps<MenuSplitGroupProps>(), { as: 'div' });
defineSlots<MenuSplitGroupSlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-MenuSplitGroup"><slot /></component>
</template>

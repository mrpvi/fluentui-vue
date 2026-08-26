<script setup lang="ts">
import { useAttrs } from 'vue';
import type { MenuGroupProps, MenuGroupSlots } from './Menu.types';
defineOptions({ name: 'FMenuGroup', inheritAttrs: false });
const props = withDefaults(defineProps<MenuGroupProps>(), { as: 'div' });
defineSlots<MenuGroupSlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-MenuGroup" role="group"><slot /></component>
</template>

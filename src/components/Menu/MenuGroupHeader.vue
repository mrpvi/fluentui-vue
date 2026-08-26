<script setup lang="ts">
import { useAttrs } from 'vue';
import type { MenuGroupHeaderProps, MenuGroupHeaderSlots } from './Menu.types';
defineOptions({ name: 'FMenuGroupHeader', inheritAttrs: false });
const props = withDefaults(defineProps<MenuGroupHeaderProps>(), { as: 'div' });
defineSlots<MenuGroupHeaderSlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-MenuGroupHeader"><slot /></component>
</template>

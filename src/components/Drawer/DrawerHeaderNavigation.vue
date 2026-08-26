<script setup lang="ts">
import { useAttrs } from 'vue';
import type { DrawerHeaderNavigationProps, DrawerHeaderNavigationSlots } from './Drawer.types';

defineOptions({ name: 'FDrawerHeaderNavigation', inheritAttrs: false });
const props = withDefaults(defineProps<DrawerHeaderNavigationProps>(), { as: 'nav' });
defineSlots<DrawerHeaderNavigationSlots>();
const attrs = useAttrs();
</script>

<template>
  <component :is="props.as" v-bind="attrs" class="fui-DrawerHeaderNavigation"><slot /></component>
</template>

<style>
@import './drawer.css';
</style>

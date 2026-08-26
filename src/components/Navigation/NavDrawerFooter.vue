<script setup lang="ts">
import type { NavDrawerPartProps, NavDrawerPartSlots } from './Navigation.types';
import { FDrawerFooter } from '../Drawer';
defineOptions({ name: 'FNavDrawerFooter' });
defineProps<NavDrawerPartProps>();
defineSlots<NavDrawerPartSlots>();
</script>
<template>
  <FDrawerFooter class="fui-NavDrawerFooter"><slot /></FDrawerFooter>
</template>

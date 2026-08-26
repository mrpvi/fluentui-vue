<script setup lang="ts">
import type { NavDrawerPartProps, NavDrawerPartSlots } from './Navigation.types';
import { FDrawerHeader } from '../Drawer';
defineOptions({ name: 'FNavDrawerHeader' });
defineProps<NavDrawerPartProps>();
defineSlots<NavDrawerPartSlots>();
</script>
<template>
  <FDrawerHeader class="fui-NavDrawerHeader"><slot /></FDrawerHeader>
</template>

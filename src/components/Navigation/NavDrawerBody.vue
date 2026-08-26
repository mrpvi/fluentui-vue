<script setup lang="ts">
import type { NavDrawerPartProps, NavDrawerPartSlots } from './Navigation.types';
import { FDrawerBody } from '../Drawer';
defineOptions({ name: 'FNavDrawerBody' });
defineProps<NavDrawerPartProps>();
defineSlots<NavDrawerPartSlots>();
</script>
<template>
  <FDrawerBody class="fui-NavDrawerBody"><slot /></FDrawerBody>
</template>

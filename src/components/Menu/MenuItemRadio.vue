<script setup lang="ts">
import MenuItemSelectable from './MenuItemSelectable.vue';
import type { MenuItemRadioProps } from './Menu.types';
defineOptions({ name: 'FMenuItemRadio' });
const props = defineProps<MenuItemRadioProps>();
</script>
<template>
  <MenuItemSelectable v-bind="{ ...props, selectableRole: 'menuitemradio' }"
    ><slot
  /></MenuItemSelectable>
</template>
<style>
@import './menu.css';
</style>

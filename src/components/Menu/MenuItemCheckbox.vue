<script setup lang="ts">
import MenuItemSelectable from './MenuItemSelectable.vue';
import type { MenuItemCheckboxProps } from './Menu.types';
defineOptions({ name: 'FMenuItemCheckbox' });
defineProps<MenuItemCheckboxProps>();
</script>
<template>
  <MenuItemSelectable v-bind="{ ...$props, selectableRole: 'menuitemcheckbox' }"
    ><slot
  /></MenuItemSelectable>
</template>
<style>
@import './menu.css';
</style>

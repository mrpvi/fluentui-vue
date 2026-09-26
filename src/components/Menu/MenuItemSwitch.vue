<script setup lang="ts">
import MenuItemSelectable from './MenuItemSelectable.vue';
import type { MenuItemSwitchProps } from './Menu.types';
defineOptions({ name: 'FMenuItemSwitch' });
defineProps<MenuItemSwitchProps>();
</script>
<template>
  <MenuItemSelectable v-bind="{ ...$props, selectableRole: 'menuitemcheckbox' }"
    ><slot
  /></MenuItemSelectable>
</template>
<style>
@import './menu.css';
</style>

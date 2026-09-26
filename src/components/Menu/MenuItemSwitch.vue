<script setup lang="ts">
import MenuItemSelectable from './MenuItemSelectable.vue';
import type { MenuItemSwitchProps, MenuItemSelectableSlots } from './Menu.types';
defineOptions({ name: 'FMenuItemSwitch' });
defineProps<MenuItemSwitchProps>();
defineSlots<MenuItemSelectableSlots>();
</script>
<template>
  <MenuItemSelectable v-bind="{ ...$props, selectableRole: 'menuitemcheckbox' }">
    <slot />
    <template v-if="$slots.icon" #icon><slot name="icon" /></template>
    <template v-if="$slots.checkmark" #checkmark><slot name="checkmark" /></template>
    <template v-if="$slots.secondaryContent" #secondaryContent
      ><slot name="secondaryContent"
    /></template>
  </MenuItemSelectable>
</template>
<style>
@import './menu.css';
</style>

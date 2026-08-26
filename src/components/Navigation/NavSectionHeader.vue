<script setup lang="ts">
import { useAttrs } from 'vue';
import type { NavSectionHeaderProps, NavSectionHeaderSlots } from './Navigation.types';
defineOptions({ name: 'FNavSectionHeader', inheritAttrs: false });
const props = withDefaults(defineProps<NavSectionHeaderProps>(), { as: 'h2' });
defineSlots<NavSectionHeaderSlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-NavSectionHeader"><slot /></component>
</template>
<style>
@import './navigation.css';
</style>

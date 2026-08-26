<script setup lang="ts">
import { useAttrs } from 'vue';
import type { NavDividerProps, NavDividerSlots } from './Navigation.types';
defineOptions({ name: 'FNavDivider', inheritAttrs: false });
const props = withDefaults(defineProps<NavDividerProps>(), { as: 'div' });
defineSlots<NavDividerSlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-NavDivider" role="separator"
    ><slot
  /></component>
</template>
<style>
@import './navigation.css';
</style>

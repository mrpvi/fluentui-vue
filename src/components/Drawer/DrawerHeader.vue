<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type { DrawerHeaderProps, DrawerHeaderSlots } from './Drawer.types';
import { drawerContextKey } from './drawerContext';

defineOptions({ name: 'FDrawerHeader', inheritAttrs: false });
const props = withDefaults(defineProps<DrawerHeaderProps>(), { as: 'header' });
defineSlots<DrawerHeaderSlots>();
const attrs = useAttrs();
const context = inject(drawerContextKey);
</script>

<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-DrawerHeader"
    :data-scroll-state="context?.scrollState.value"
  >
    <slot />
  </component>
</template>

<style>
@import './drawer.css';
</style>

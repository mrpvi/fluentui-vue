<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type { DrawerFooterProps, DrawerFooterSlots } from './Drawer.types';
import { drawerContextKey } from './drawerContext';

defineOptions({ name: 'FDrawerFooter', inheritAttrs: false });
const props = withDefaults(defineProps<DrawerFooterProps>(), { as: 'footer' });
defineSlots<DrawerFooterSlots>();
const attrs = useAttrs();
const context = inject(drawerContextKey);
</script>

<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-DrawerFooter"
    :data-scroll-state="context?.scrollState.value"
    ><slot
  /></component>
</template>

<style>
@import './drawer.css';
</style>

<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type { DrawerBodyProps, DrawerBodySlots } from './Drawer.types';
import { drawerContextKey } from './drawerContext';

defineOptions({ name: 'FDrawerBody', inheritAttrs: false });
const props = withDefaults(defineProps<DrawerBodyProps>(), { as: 'div' });
defineSlots<DrawerBodySlots>();
const attrs = useAttrs();
const context = inject(drawerContextKey);
</script>

<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-DrawerBody"
    :data-scroll-state="context?.scrollState.value"
    ><slot
  /></component>
</template>

<style>
@import './drawer.css';
</style>

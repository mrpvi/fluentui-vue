<script setup lang="ts">
import { inject, onMounted, ref, useAttrs } from 'vue';
import type { InlineDrawerProps } from './Drawer.types';
import { drawerContextKey } from './drawerContext';

const props = withDefaults(defineProps<InlineDrawerProps>(), {
  position: 'start',
  size: 'small',
  separator: false,
});
defineOptions({ name: 'FInlineDrawer', inheritAttrs: false });
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const context = inject(drawerContextKey);
if (!context) throw new Error('FInlineDrawer must be used inside FDrawer.');
onMounted(() => context.registerSurface(root.value));
</script>

<template>
  <aside
    ref="root"
    v-bind="attrs"
    class="fui-DrawerSurface fui-DrawerSurface--inline"
    :class="[
      `fui-DrawerSurface--${context.position.value}`,
      `fui-DrawerSurface--${context.size.value}`,
      { 'fui-DrawerSurface--separator': props.separator },
    ]"
    :aria-labelledby="context.titleId.value"
  >
    <slot />
  </aside>
</template>

<style>
@import './drawer.css';
</style>

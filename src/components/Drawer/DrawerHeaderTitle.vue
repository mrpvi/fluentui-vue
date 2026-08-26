<script setup lang="ts">
import { inject, useAttrs, useId } from 'vue';
import type { DrawerHeaderTitleProps, DrawerHeaderTitleSlots } from './Drawer.types';
import { drawerContextKey } from './drawerContext';

defineOptions({ name: 'FDrawerHeaderTitle', inheritAttrs: false });
const props = withDefaults(defineProps<DrawerHeaderTitleProps>(), { as: 'h2' });
defineSlots<DrawerHeaderTitleSlots>();
const attrs = useAttrs();
const context = inject(drawerContextKey);
const titleId = `fui-drawer-title-${useId()}`;
context?.registerTitle(titleId);
</script>

<template>
  <div class="fui-DrawerHeaderTitle">
    <component :is="props.as" :id="titleId" v-bind="attrs" class="fui-DrawerHeaderTitle__heading">
      <slot />
    </component>
    <div v-if="$slots.action" class="fui-DrawerHeaderTitle__action"><slot name="action" /></div>
  </div>
</template>

<style>
@import './drawer.css';
</style>

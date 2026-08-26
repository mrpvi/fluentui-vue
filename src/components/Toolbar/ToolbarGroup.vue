<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type { ToolbarGroupProps, ToolbarGroupSlots } from './Toolbar.types';
import { toolbarContextKey } from './toolbarContext';
defineOptions({ name: 'FToolbarGroup', inheritAttrs: false });
const props = withDefaults(defineProps<ToolbarGroupProps>(), { as: 'div' });
defineSlots<ToolbarGroupSlots>();
const attrs = useAttrs();
const context = inject(toolbarContextKey);
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    :class="[
      'fui-ToolbarGroup',
      { 'fui-ToolbarGroup--vertical': context?.vertical.value },
      attrs.class,
    ]"
    ><slot
  /></component>
</template>
<style>
@import './toolbar.css';
</style>

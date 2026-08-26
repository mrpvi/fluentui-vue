<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type { ToolbarDividerProps } from './Toolbar.types';
import { toolbarContextKey } from './toolbarContext';
defineOptions({ name: 'FToolbarDivider', inheritAttrs: false });
const props = defineProps<ToolbarDividerProps>();
const attrs = useAttrs();
const context = inject(toolbarContextKey);
const vertical = computed(() => props.vertical ?? !context?.vertical.value);
</script>
<template>
  <div
    v-bind="attrs"
    :class="['fui-ToolbarDivider', { 'fui-ToolbarDivider--vertical': vertical }, attrs.class]"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  />
</template>
<style>
@import './toolbar.css';
</style>

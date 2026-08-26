<script setup lang="ts">
import { useAttrs } from 'vue';
import type { ToolbarRadioGroupProps, ToolbarRadioGroupSlots } from './Toolbar.types';
defineOptions({ name: 'FToolbarRadioGroup', inheritAttrs: false });
const props = withDefaults(defineProps<ToolbarRadioGroupProps>(), { as: 'div' });
defineSlots<ToolbarRadioGroupSlots>();
const attrs = useAttrs();
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    :class="['fui-ToolbarRadioGroup', attrs.class]"
    role="radiogroup"
    ><slot
  /></component>
</template>
<style>
@import './toolbar.css';
</style>

<script setup lang="ts">
import { useAttrs } from 'vue';
import type { AppItemProps, AppItemSlots } from './Navigation.types';
defineOptions({ name: 'FAppItem', inheritAttrs: false });
const props = withDefaults(defineProps<AppItemProps>(), { as: 'a' });
defineSlots<AppItemSlots>();
const attrs = useAttrs();
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-AppItem"
    :href="props.href"
    :target="props.target"
    ><span v-if="$slots.icon" class="fui-NavItem__icon"><slot name="icon" /></span
    ><span><slot /></span
  ></component>
</template>
<style>
@import './navigation.css';
</style>

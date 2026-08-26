<script setup lang="ts">
import { useAttrs } from 'vue';
import type { AppItemStaticProps, AppItemStaticSlots } from './Navigation.types';
defineOptions({ name: 'FAppItemStatic', inheritAttrs: false });
const props = withDefaults(defineProps<AppItemStaticProps>(), { as: 'div' });
defineSlots<AppItemStaticSlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-AppItem fui-AppItem--static"
    ><span v-if="$slots.icon" class="fui-NavItem__icon"><slot name="icon" /></span
    ><span><slot /></span
  ></component>
</template>
<style>
@import './navigation.css';
</style>

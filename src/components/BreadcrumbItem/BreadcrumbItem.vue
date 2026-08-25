<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { breadcrumbContextKey } from '../Breadcrumb/breadcrumbContext';
import type { BreadcrumbItemSlots } from './BreadcrumbItem.types';

defineOptions({
  name: 'FBreadcrumbItem',
  inheritAttrs: false,
});

defineSlots<BreadcrumbItemSlots>();
const attrs = useAttrs();
const breadcrumb = inject(breadcrumbContextKey);
if (!breadcrumb) {
  throw new Error('FBreadcrumbItem must be used inside FBreadcrumb.');
}
</script>

<template>
  <li
    v-bind="attrs"
    :class="['fui-BreadcrumbItem', `fui-BreadcrumbItem--${breadcrumb.size.value}`, attrs.class]"
    :style="attrs.style"
  >
    <slot />
  </li>
</template>

<style>
@import './breadcrumbItem.css';
</style>

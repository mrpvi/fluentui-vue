<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import { breadcrumbContextKey } from '../Breadcrumb/breadcrumbContext';
import type { BreadcrumbDividerSlots } from './BreadcrumbDivider.types';

defineOptions({
  name: 'FBreadcrumbDivider',
  inheritAttrs: false,
});

defineSlots<BreadcrumbDividerSlots>();
const attrs = useAttrs();
const breadcrumb = inject(breadcrumbContextKey);
if (!breadcrumb) {
  throw new Error('FBreadcrumbDivider must be used inside FBreadcrumb.');
}
</script>

<template>
  <li
    v-bind="attrs"
    :class="[
      'fui-BreadcrumbDivider',
      `fui-BreadcrumbDivider--${breadcrumb.size.value}`,
      attrs.class,
    ]"
    :style="attrs.style"
    aria-hidden="true"
  >
    <slot>
      <svg class="fui-BreadcrumbDivider__icon" viewBox="0 0 20 20" focusable="false">
        <path
          d="M7.2 4.6a.75.75 0 0 1 1.06 0l4.87 4.87a.75.75 0 0 1 0 1.06L8.26 15.4a.75.75 0 1 1-1.06-1.06L11.54 10 7.2 5.66a.75.75 0 0 1 0-1.06Z"
        />
      </svg>
    </slot>
  </li>
</template>

<style>
@import './breadcrumbDivider.css';
</style>

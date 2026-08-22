<script setup lang="ts">
import { computed, useAttrs, useTemplateRef } from 'vue';
import type { CardFooterSlots } from './CardFooter.types';

defineOptions({
  name: 'FCardFooter',
  inheritAttrs: false,
});

defineSlots<CardFooterSlots>();
const attrs = useAttrs();
const root = useTemplateRef<HTMLElement>('root');
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

defineExpose({
  element: root,
});
</script>

<template>
  <div ref="root" v-bind="rootAttrs" :class="['fui-CardFooter', attrs.class]" :style="attrs.style">
    <slot />
    <div v-if="$slots.action" class="fui-CardFooter__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style>
@import './cardFooter.css';
</style>

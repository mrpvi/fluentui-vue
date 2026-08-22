<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { BadgeProps, BadgeSlots } from './Badge.types';

defineOptions({
  name: 'FBadge',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BadgeProps>(), {
  appearance: 'filled',
  color: 'brand',
  iconPosition: 'before',
  shape: 'circular',
  size: 'medium',
});

const slots = defineSlots<BadgeSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const hasContent = computed(() => Boolean(slots.default));

const classes = computed(() => [
  'fui-Badge',
  `fui-Badge--${props.appearance}`,
  `fui-Badge--${props.color}`,
  `fui-Badge--${props.shape}`,
  `fui-Badge--size-${props.size}`,
  `fui-Badge--icon-${props.iconPosition}`,
  {
    'fui-Badge--has-content': hasContent.value,
    'fui-Badge--has-icon': Boolean(slots.icon),
  },
  attrs.class,
]);

const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

defineExpose({
  element: root,
});
</script>

<template>
  <div ref="root" v-bind="rootAttrs" :class="classes" :style="attrs.style">
    <span v-if="$slots.icon && iconPosition === 'before'" class="fui-Badge__icon">
      <slot name="icon" />
    </span>
    <slot />
    <span v-if="$slots.icon && iconPosition === 'after'" class="fui-Badge__icon">
      <slot name="icon" />
    </span>
  </div>
</template>

<style>
@import './badge.css';
</style>

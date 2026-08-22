<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { CounterBadgeProps, CounterBadgeSlots } from './CounterBadge.types';

defineOptions({
  name: 'FCounterBadge',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CounterBadgeProps>(), {
  appearance: 'filled',
  color: 'brand',
  count: 0,
  dot: false,
  iconPosition: 'before',
  overflowCount: 99,
  shape: 'circular',
  showZero: false,
  size: 'medium',
});

const slots = defineSlots<CounterBadgeSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const hasCustomContent = computed(() => Boolean(slots.default));
const generatedContent = computed(() => {
  if (hasCustomContent.value || props.dot || (props.count === 0 && !props.showZero)) {
    return undefined;
  }

  return props.count > props.overflowCount ? `${props.overflowCount}+` : `${props.count}`;
});
const hasContent = computed(() => hasCustomContent.value || generatedContent.value !== undefined);
const hidden = computed(() => !hasContent.value && !props.dot);

const classes = computed(() => [
  'fui-Badge',
  'fui-CounterBadge',
  `fui-Badge--${props.appearance}`,
  `fui-Badge--${props.color}`,
  `fui-Badge--${props.shape}`,
  `fui-Badge--size-${props.size}`,
  `fui-Badge--icon-${props.iconPosition}`,
  {
    'fui-Badge--has-content': hasContent.value,
    'fui-Badge--has-icon': Boolean(slots.icon),
    'fui-CounterBadge--dot': props.dot,
    'fui-CounterBadge--hidden': hidden.value,
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
    <span
      v-if="$slots.icon && iconPosition === 'before'"
      class="fui-Badge__icon fui-CounterBadge__icon"
    >
      <slot name="icon" />
    </span>
    <slot v-if="hasCustomContent" />
    <template v-else-if="generatedContent !== undefined">{{ generatedContent }}</template>
    <span
      v-if="$slots.icon && iconPosition === 'after'"
      class="fui-Badge__icon fui-CounterBadge__icon"
    >
      <slot name="icon" />
    </span>
  </div>
</template>

<style>
@import '../Badge/badge.css';
@import './counterBadge.css';
</style>

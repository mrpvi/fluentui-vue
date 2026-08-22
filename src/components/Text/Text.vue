<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { TextProps, TextSlots } from './Text.types';

defineOptions({
  name: 'FText',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<TextProps>(), {
  as: 'span',
  align: 'start',
  block: false,
  font: 'base',
  italic: false,
  size: 300,
  strikethrough: false,
  truncate: false,
  underline: false,
  weight: 'regular',
  wrap: true,
});

defineSlots<TextSlots>();

const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);

const classes = computed(() => [
  'fui-Text',
  `fui-Text--align-${props.align}`,
  `fui-Text--font-${props.font}`,
  `fui-Text--size-${props.size}`,
  `fui-Text--weight-${props.weight}`,
  {
    'fui-Text--block': props.block,
    'fui-Text--italic': props.italic,
    'fui-Text--strikethrough': props.strikethrough,
    'fui-Text--truncate': props.truncate,
    'fui-Text--underline': props.underline,
    'fui-Text--nowrap': !props.wrap,
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
  <component :is="as" ref="root" v-bind="rootAttrs" :class="classes" :style="attrs.style">
    <slot />
  </component>
</template>

<style>
@import './text.css';
</style>

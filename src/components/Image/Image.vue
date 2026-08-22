<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { ImageProps } from './Image.types';

defineOptions({
  name: 'FImage',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ImageProps>(), {
  block: false,
  bordered: false,
  fit: 'default',
  shadow: false,
  shape: 'square',
});

const attrs = useAttrs();
const root = ref<HTMLImageElement | null>(null);

const hasExplicitSize = computed(() => 'width' in attrs || 'height' in attrs);

const classes = computed(() => [
  'fui-Image',
  `fui-Image--shape-${props.shape}`,
  `fui-Image--fit-${props.fit}`,
  {
    'fui-Image--block': props.block,
    'fui-Image--bordered': props.bordered,
    'fui-Image--shadow': props.shadow,
    'fui-Image--fit-fill': props.fit !== 'default' && !hasExplicitSize.value,
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
  <img ref="root" v-bind="rootAttrs" :class="classes" :style="attrs.style" />
</template>

<style>
@import './image.css';
</style>

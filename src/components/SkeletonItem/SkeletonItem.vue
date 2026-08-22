<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import { skeletonContextKey } from '../Skeleton/skeletonContext';
import type {
  SkeletonItemAnimation,
  SkeletonItemAppearance,
  SkeletonItemProps,
  SkeletonItemShape,
  SkeletonItemSize,
  SkeletonItemSlots,
} from './SkeletonItem.types';

defineOptions({
  name: 'FSkeletonItem',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SkeletonItemProps>(), {
  as: 'div',
});

defineSlots<SkeletonItemSlots>();

const attrs = useAttrs();
const skeletonContext = inject(skeletonContextKey, undefined);
const root = ref<HTMLElement | null>(null);

const animation = computed<SkeletonItemAnimation>(
  () => props.animation ?? skeletonContext?.animation.value ?? 'wave',
);
const appearance = computed<SkeletonItemAppearance>(
  () => props.appearance ?? skeletonContext?.appearance.value ?? 'opaque',
);
const size = computed<SkeletonItemSize>(() => props.size ?? skeletonContext?.size.value ?? 16);
const shape = computed<SkeletonItemShape>(
  () => props.shape ?? skeletonContext?.shape.value ?? 'rectangle',
);

const classes = computed(() => [
  'fui-SkeletonItem',
  `fui-SkeletonItem--${animation.value}`,
  `fui-SkeletonItem--${appearance.value}`,
  `fui-SkeletonItem--size-${size.value}`,
  `fui-SkeletonItem--${shape.value}`,
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
@import './skeletonItem.css';
</style>

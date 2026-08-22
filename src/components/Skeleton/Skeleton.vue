<script setup lang="ts">
import { computed, inject, provide, readonly, ref, useAttrs } from 'vue';
import { skeletonContextKey } from './skeletonContext';
import type {
  SkeletonAnimation,
  SkeletonAppearance,
  SkeletonProps,
  SkeletonSlots,
} from './Skeleton.types';

defineOptions({
  name: 'FSkeleton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SkeletonProps>(), {
  as: 'div',
});

defineSlots<SkeletonSlots>();

const attrs = useAttrs();
const parentContext = inject(skeletonContextKey, undefined);
const root = ref<HTMLElement | null>(null);

const animation = computed<SkeletonAnimation>(
  () => props.animation ?? parentContext?.animation.value ?? 'wave',
);
const appearance = computed<SkeletonAppearance>(
  () => props.appearance ?? parentContext?.appearance.value ?? 'opaque',
);
const size = computed(() => props.size);
const shape = computed(() => props.shape);

provide(skeletonContextKey, {
  animation: readonly(animation),
  appearance: readonly(appearance),
  size: readonly(size),
  shape: readonly(shape),
});

const classes = computed(() => ['fui-Skeleton', attrs.class]);

const rootAttrs = computed(() => {
  const { class: _class, style: _style, role: _role, 'aria-busy': _ariaBusy, ...rest } = attrs;
  return rest;
});

const rootRole = computed(() => attrs.role ?? 'progressbar');
const rootAriaBusy = computed(() => attrs['aria-busy'] ?? true);
const deprecatedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
);
const rootStyle = computed(() => [
  attrs.style,
  deprecatedWidth.value === undefined ? undefined : { width: deprecatedWidth.value },
]);

defineExpose({
  element: root,
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="rootStyle"
    :role="rootRole"
    :aria-busy="rootAriaBusy"
  >
    <slot />
  </component>
</template>

<style>
@import './skeleton.css';
</style>

<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { avatarGroupContextKey } from './avatarGroupContext';
import type { AvatarGroupProps, AvatarGroupSlots } from './AvatarGroup.types';

defineOptions({
  name: 'FAvatarGroup',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  layout: 'spread',
  shape: 'circular',
  size: 32,
});
defineSlots<AvatarGroupSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, role: _role, ...rest } = attrs;
  return rest;
});
const classes = computed(() => [
  'fui-AvatarGroup',
  `fui-AvatarGroup--${props.layout}`,
  `fui-AvatarGroup--size-${props.size}`,
  attrs.class,
]);

provide(avatarGroupContextKey, {
  isOverflow: computed(() => false),
  layout: computed(() => props.layout),
  shape: computed(() => props.shape),
  size: computed(() => props.size),
});

defineExpose({
  element: root,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :role="(attrs.role as string | undefined) ?? 'group'"
    :style="[
      attrs.style,
      {
        '--fui-avatar-size': `${size}px`,
      },
    ]"
  >
    <slot />
  </div>
</template>

<style>
@import './avatarGroup.css';
</style>

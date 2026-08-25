<script setup lang="ts">
import { computed, inject, ref, useAttrs, useSlots } from 'vue';
import Avatar from '../Avatar/Avatar.vue';
import { avatarGroupContextKey } from '../AvatarGroup/avatarGroupContext';
import type { AvatarGroupItemProps, AvatarGroupItemSlots } from './AvatarGroupItem.types';

defineOptions({
  name: 'FAvatarGroupItem',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AvatarGroupItemProps>(), {
  active: 'unset',
  activeAppearance: 'ring',
  color: 'colorful',
});
defineSlots<AvatarGroupItemSlots>();
const attrs = useAttrs();
const slots = useSlots();
const group = inject(avatarGroupContextKey);
if (!group) {
  throw new Error('FAvatarGroupItem must be used inside FAvatarGroup.');
}
const root = ref<HTMLElement | null>(null);
const rootTag = computed(() => (group.isOverflow.value ? 'li' : 'div'));
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const label = computed(() => props.overflowLabel ?? props.name);

defineExpose({
  element: root,
});
</script>

<template>
  <component
    :is="rootTag"
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-AvatarGroupItem',
      { 'fui-AvatarGroupItem--overflow': group.isOverflow.value },
      attrs.class,
    ]"
    :style="attrs.style"
  >
    <slot name="avatar">
      <Avatar
        :active="active"
        :active-appearance="activeAppearance"
        :color="color"
        :id-for-color="idForColor"
        :image="image"
        :name="name"
        :presence="presence"
        :shape="shape ?? group.shape.value"
        :size="group.size.value"
      >
        <template v-if="slots.initials" #initials><slot name="initials" /></template>
        <template v-if="slots.icon" #icon><slot name="icon" /></template>
        <template v-if="slots.image" #image><slot name="image" /></template>
        <template v-if="slots.badge" #badge><slot name="badge" /></template>
      </Avatar>
    </slot>
    <span
      v-if="group.isOverflow.value"
      class="fui-AvatarGroupItem__overflowLabel"
      aria-hidden="true"
    >
      <slot name="overflow-label" :avatar-name="name">{{ label }}</slot>
    </span>
  </component>
</template>

<style>
@import './avatarGroupItem.css';
</style>

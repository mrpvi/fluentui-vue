<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import type { LabelProps, LabelSlots } from './Label.types';

defineOptions({
  name: 'FLabel',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<LabelProps>(), {
  disabled: false,
  required: false,
  size: 'medium',
  weight: 'regular',
});

const slots = defineSlots<LabelSlots>();
const attrs = useAttrs();
const root = ref<HTMLLabelElement | null>(null);

const hasRequiredIndicator = computed(() => {
  if (slots.required) {
    return true;
  }

  return typeof props.required === 'string' ? props.required.length > 0 : props.required;
});

const requiredContent = computed(() => (props.required === true ? '*' : props.required || ''));

const classes = computed(() => [
  'fui-Label',
  `fui-Label--${props.size}`,
  `fui-Label--${props.weight}`,
  {
    'fui-Label--disabled': props.disabled,
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
  <label
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
  >
    <slot />
    <span
      v-if="hasRequiredIndicator"
      class="fui-Label__required"
      aria-hidden="true"
    >
      <slot name="required">{{ requiredContent }}</slot>
    </span>
  </label>
</template>

<style>
@import './label.css';
</style>

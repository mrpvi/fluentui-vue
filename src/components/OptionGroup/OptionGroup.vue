<script setup lang="ts">
import { computed, ref, useAttrs, useId, useSlots } from 'vue';
import type { OptionGroupProps, OptionGroupSlots } from './OptionGroup.types';

defineOptions({
  name: 'FOptionGroup',
  inheritAttrs: false,
});

const props = defineProps<OptionGroupProps>();
defineSlots<OptionGroupSlots>();
const attrs = useAttrs();
const slots = useSlots();
const root = ref<HTMLDivElement | null>(null);
const labelId = `fui-option-group-label-${useId()}`;
const hasLabel = computed(() => Boolean(slots.label || props.label !== undefined));
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-labelledby': _ariaLabelledBy,
    ...rest
  } = attrs;
  return rest;
});

defineExpose({
  element: root,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="['fui-OptionGroup', attrs.class]"
    :style="attrs.style"
    role="group"
    :aria-labelledby="hasLabel ? labelId : undefined"
  >
    <span v-if="hasLabel" :id="labelId" class="fui-OptionGroup__label" role="presentation">
      <slot name="label">{{ label }}</slot>
    </span>
    <slot />
  </div>
</template>

<style>
@import './optionGroup.css';
</style>

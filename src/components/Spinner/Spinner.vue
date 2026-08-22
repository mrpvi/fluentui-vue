<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue';
import type { SpinnerProps, SpinnerSlots } from './Spinner.types';

defineOptions({
  name: 'FSpinner',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SpinnerProps>(), {
  as: 'div',
  appearance: 'primary',
  delay: 0,
  labelPosition: 'after',
  size: 'medium',
});

const slots = defineSlots<SpinnerSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const isMounted = ref(false);
const isVisible = ref(props.delay <= 0);
const generatedLabelId = `fui-spinner-${useId()}__label`;
let delayTimer: ReturnType<typeof setTimeout> | undefined;

const hasLabel = computed(() => Boolean(slots.label) || props.label !== undefined);
const isLabelBeforeIndicator = computed(
  () => props.labelPosition === 'above' || props.labelPosition === 'before',
);

const classes = computed(() => [
  'fui-Spinner',
  `fui-Spinner--${props.appearance}`,
  `fui-Spinner--size-${props.size}`,
  `fui-Spinner--label-${props.labelPosition}`,
  {
    'fui-Spinner--vertical': props.labelPosition === 'above' || props.labelPosition === 'below',
  },
  attrs.class,
]);

const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-labelledby': _ariaLabelledby,
    ...rest
  } = attrs;

  return rest;
});

const labelledBy = computed(() => {
  const consumerLabelledBy = attrs['aria-labelledby'];
  if (typeof consumerLabelledBy === 'string' && consumerLabelledBy.length > 0) {
    return consumerLabelledBy;
  }

  return hasLabel.value ? generatedLabelId : undefined;
});

function clearDelayTimer() {
  if (delayTimer !== undefined) {
    clearTimeout(delayTimer);
    delayTimer = undefined;
  }
}

function updateVisibility() {
  clearDelayTimer();

  if (props.delay <= 0) {
    isVisible.value = true;
    return;
  }

  isVisible.value = false;
  if (!isMounted.value) {
    return;
  }

  delayTimer = setTimeout(() => {
    delayTimer = undefined;
    isVisible.value = true;
  }, props.delay);
}

watch(() => props.delay, updateVisibility);

onMounted(() => {
  isMounted.value = true;
  updateVisibility();
});

onBeforeUnmount(() => {
  isMounted.value = false;
  clearDelayTimer();
});

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
    :style="attrs.style"
    role="progressbar"
    :aria-labelledby="labelledBy"
  >
    <span
      v-if="isVisible && hasLabel && isLabelBeforeIndicator"
      :id="generatedLabelId"
      class="fui-Spinner__label"
    >
      <slot name="label">{{ label }}</slot>
    </span>

    <span v-if="isVisible" class="fui-Spinner__spinner" aria-hidden="true">
      <slot name="indicator">
        <span class="fui-Spinner__spinnerTail"></span>
      </slot>
    </span>

    <span
      v-if="isVisible && hasLabel && !isLabelBeforeIndicator"
      :id="generatedLabelId"
      class="fui-Spinner__label"
    >
      <slot name="label">{{ label }}</slot>
    </span>
  </component>
</template>

<style>
@import './spinner.css';
</style>

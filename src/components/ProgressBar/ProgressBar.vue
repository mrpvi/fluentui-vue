<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import { fieldContextKey } from '../Field/fieldContext';
import type { ProgressBarColor, ProgressBarProps } from './ProgressBar.types';

defineOptions({
  name: 'FProgressBar',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ProgressBarProps>(), {
  max: 1,
  shape: 'rounded',
  thickness: 'medium',
  indeterminateMotion: true,
});

const attrs = useAttrs();
const field = inject(fieldContextKey, undefined);
const root = ref<HTMLDivElement | null>(null);

function warnInvalidMax(max: number) {
  if (import.meta.env.DEV && max <= 0) {
    console.error(`[FProgressBar] The prop 'max' must be greater than 0. Received max: ${max}`);
  }
}

function warnInvalidValue(value: number | undefined, max: number) {
  if (!import.meta.env.DEV || value === undefined) {
    return;
  }

  if (value < 0) {
    console.error(
      `[FProgressBar] The prop 'value' must be greater than or equal to zero. Received value: ${value}`,
    );
  }

  if (value > max) {
    console.error(
      `[FProgressBar] The prop 'value' must be less than or equal to 'max'. Received value: ${value}, max: ${max}`,
    );
  }
}

const normalizedMax = computed(() => {
  warnInvalidMax(props.max);
  return props.max <= 0 ? 1 : props.max;
});

const normalizedValue = computed(() => {
  const max = normalizedMax.value;
  warnInvalidValue(props.value, max);

  if (props.value === undefined) {
    return undefined;
  }

  return Math.min(max, Math.max(0, props.value));
});

const isDeterminate = computed(() => normalizedValue.value !== undefined);
const percentComplete = computed(() =>
  isDeterminate.value ? (normalizedValue.value! / normalizedMax.value) * 100 : undefined,
);
const fieldColor = computed<ProgressBarColor>(() => {
  const validationState = field?.validationState.value;
  return validationState === 'error' ||
    validationState === 'warning' ||
    validationState === 'success'
    ? validationState
    : 'brand';
});
const effectiveColor = computed(() => props.color ?? fieldColor.value);
const rootClasses = computed(() => [
  'fui-ProgressBar',
  `fui-ProgressBar--${props.shape}`,
  `fui-ProgressBar--${props.thickness}`,
  attrs.class,
]);
const barClasses = computed(() => [
  'fui-ProgressBar__bar',
  isDeterminate.value
    ? `fui-ProgressBar__bar--${effectiveColor.value}`
    : 'fui-ProgressBar__bar--indeterminate',
  {
    'fui-ProgressBar__bar--determinate-transition':
      isDeterminate.value && normalizedValue.value! > 0.01,
  },
]);
const barStyle = computed(() =>
  isDeterminate.value ? { width: `${percentComplete.value}%` } : undefined,
);

function mergeIdRefs(...values: unknown[]): string | undefined {
  const ids = values
    .flatMap((value) => (typeof value === 'string' ? value.split(/\s+/) : []))
    .filter(Boolean);
  const uniqueIds = [...new Set(ids)];

  return uniqueIds.length > 0 ? uniqueIds.join(' ') : undefined;
}

const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    id: consumerId,
    'aria-labelledby': consumerLabelledBy,
    'aria-describedby': consumerDescribedBy,
    'aria-valuemin': _ariaValueMin,
    'aria-valuemax': _ariaValueMax,
    'aria-valuenow': _ariaValueNow,
    ...rest
  } = attrs;

  const fieldDescribedBy = mergeIdRefs(
    field?.validationMessageId.value,
    field?.hintId.value,
    consumerDescribedBy,
  );

  return {
    ...rest,
    id: typeof consumerId === 'string' ? consumerId : field?.generatedControlId,
    'aria-labelledby':
      typeof consumerLabelledBy === 'string' ? consumerLabelledBy : field?.labelId.value,
    'aria-describedby': fieldDescribedBy,
  };
});

defineExpose({
  element: root,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="attrs.style"
    role="progressbar"
    :aria-valuemin="isDeterminate ? 0 : undefined"
    :aria-valuemax="isDeterminate ? normalizedMax : undefined"
    :aria-valuenow="normalizedValue"
  >
    <div v-if="!isDeterminate && indeterminateMotion" class="fui-ProgressBar__indeterminateMotion">
      <div :class="barClasses"></div>
    </div>
    <div v-else :class="barClasses" :style="barStyle"></div>
  </div>
</template>

<style>
@import './progressBar.css';
</style>

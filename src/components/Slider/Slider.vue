<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { SliderEmits, SliderProps, SliderSize } from './Slider.types';

defineOptions({
  name: 'FSlider',
  inheritAttrs: false,
});

// Ported from @fluentui/react-slider 9.6.5 (gitHead
// 2dd2a9a96210919c35b210a1aa8e873ab67dbada), primarily Slider.types.ts,
// useSlider.ts, useSliderState.tsx, and useSliderStyles.styles.ts.
// Fluent's public API has min/max/step, small/medium size, disabled and vertical
// variants, but no marks API. Vue uses modelValue/defaultValue and additionally
// exposes native input events while retaining the upstream input/rail/thumb DOM.
const props = withDefaults(defineProps<SliderProps>(), {
  disabled: false,
  max: 100,
  min: 0,
  size: 'medium',
  step: 1,
  vertical: false,
});

const emit = defineEmits<SliderEmits>();
const attrs = useAttrs();
const input = ref<HTMLInputElement | null>(null);
const generatedId = useId();
const initialValue = props.defaultValue ?? 0;
const internalValue = ref(initialValue);
const initialNormalizedValue = normalizeValue(initialValue);
const isControlled = useIsPropProvided('modelValue');
const isSizeProvided = useIsPropProvided('size');
let form: HTMLFormElement | null = null;

function clamp(value: number): number {
  return Math.min(Math.max(value, props.min), props.max);
}

function normalizeValue(value: number): number {
  const clamped = clamp(value);

  if (!(props.step > 0) || props.max <= props.min) {
    return clamped;
  }

  const precision = Math.max(
    decimalPlaces(props.min),
    decimalPlaces(props.max),
    decimalPlaces(props.step),
  );
  const steps = Math.round((clamped - props.min) / props.step);
  return clamp(Number((props.min + steps * props.step).toFixed(precision)));
}

function decimalPlaces(value: number): number {
  const exponent = value.toString().match(/e-(\d+)$/i);
  if (exponent) {
    return Number(exponent[1]);
  }

  return value.toString().split('.')[1]?.length ?? 0;
}

const currentValue = computed(() =>
  normalizeValue(isControlled ? (props.modelValue ?? 0) : internalValue.value),
);
const progress = computed(() =>
  props.max === props.min ? 0 : ((currentValue.value - props.min) / (props.max - props.min)) * 100,
);
const stepPercent = computed(() => {
  const range = props.max - props.min;
  return props.step > 0 && range > 0 ? `${(props.step * 100) / range}%` : undefined;
});

const fieldControlProps = useFieldControlProps(
  () => ({
    ...attrs,
    disabled: props.disabled,
    ...(isSizeProvided ? { size: props.size } : {}),
  }),
  {
    supportsLabelFor: true,
    supportsRequired: false,
    supportsSize: true,
  },
);
const effectiveSize = computed(
  () => (fieldControlProps.value.size as SliderSize | undefined) ?? props.size,
);
const inputId = computed(
  () => (fieldControlProps.value.id as string | undefined) ?? `fui-slider-${generatedId}`,
);
const isInvalid = computed(
  () =>
    fieldControlProps.value['aria-invalid'] === true ||
    fieldControlProps.value['aria-invalid'] === 'true',
);

const rootClasses = computed(() => [
  'fui-Slider',
  `fui-Slider--${effectiveSize.value}`,
  props.vertical ? 'fui-Slider--vertical' : 'fui-Slider--horizontal',
  {
    'fui-Slider--disabled': props.disabled,
    'fui-Slider--invalid': isInvalid.value,
  },
  attrs.class,
]);
const rootStyle = computed(() => [
  {
    '--fui-Slider--progress': `${progress.value}%`,
    ...(stepPercent.value ? { '--fui-Slider--steps-percent': stepPercent.value } : {}),
  },
  attrs.style,
]);
const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    size: _size,
    value: _value,
    type: _type,
    min: _min,
    max: _max,
    step: _step,
    disabled: _disabled,
    orient: _orient,
    onInput: _onInput,
    onChange: _onChange,
    ...rest
  } = fieldControlProps.value;
  return rest;
});

function syncNativeValue() {
  if (input.value) {
    input.value.value = String(currentValue.value);
  }
}

function handleFormReset() {
  setTimeout(() => {
    if (!input.value) {
      return;
    }

    if (isControlled) {
      syncNativeValue();
      return;
    }

    internalValue.value = initialNormalizedValue;
    syncNativeValue();
  });
}

onMounted(() => {
  if (!input.value) {
    return;
  }

  input.value.defaultValue = String(initialNormalizedValue);
  syncNativeValue();
  form = input.value.form;
  form?.addEventListener('reset', handleFormReset);
});
onBeforeUnmount(() => form?.removeEventListener('reset', handleFormReset));
watch(currentValue, syncNativeValue, { flush: 'post' });

function readEventValue(event: Event): number {
  return (event.target as HTMLInputElement).valueAsNumber;
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = normalizeValue(readEventValue(event));

  target.value = String(value);

  if (isControlled) {
    target.value = String(currentValue.value);
  } else {
    internalValue.value = value;
  }

  emit('update:modelValue', value);
  emit('input', event, { value });
}

function handleChange(event: Event) {
  const value = readEventValue(event);

  if (isControlled) {
    void nextTick(syncNativeValue);
  }

  emit('change', event, { value });
}

defineExpose({
  element: input,
  focus: () => input.value?.focus(),
});
</script>

<template>
  <div :class="rootClasses" :style="rootStyle">
    <input
      v-bind="inputAttrs"
      :id="inputId"
      ref="input"
      class="fui-Slider__input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :orient="vertical ? 'vertical' : undefined"
      :value="currentValue"
      @input="handleInput"
      @change="handleChange"
    />
    <div class="fui-Slider__rail" aria-hidden="true" />
    <div class="fui-Slider__thumb" aria-hidden="true" />
  </div>
</template>

<style>
@import './slider.css';
</style>

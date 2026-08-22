<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  SpinButtonChangeData,
  SpinButtonChangeEvent,
  SpinButtonEmits,
  SpinButtonProps,
  SpinButtonSize,
  SpinButtonValue,
} from './SpinButton.types';

defineOptions({ name: 'FSpinButton', inheritAttrs: false });

const props = withDefaults(defineProps<SpinButtonProps>(), {
  appearance: 'outline',
  size: 'medium',
  step: 1,
  stepPage: 1,
  disabled: false,
  readOnly: false,
});
const emit = defineEmits<SpinButtonEmits>();
const attrs = useAttrs();
const input = ref<HTMLInputElement | null>(null);
const isControlled = useIsPropProvided('modelValue') || useIsPropProvided('model-value');
const isSizeProvided = useIsPropProvided('size');
const initialValue: SpinButtonValue = props.defaultValue === undefined ? 0 : props.defaultValue;
const internalValue = ref<SpinButtonValue>(initialValue);
const textValue = ref<string>();
const previousTextValue = ref<string>();
const keyboardSpinState = ref<'rest' | 'up' | 'down'>('rest');
let spinState: 'rest' | 'up' | 'down' = 'rest';
let spinTime = 0;
let spinDelay = 150;
let spinTimeout: ReturnType<typeof setTimeout> | undefined;
let form: HTMLFormElement | null = null;
let resetTimeout: ReturnType<typeof setTimeout> | undefined;

const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, ...(isSizeProvided ? { size: props.size } : {}) }),
  { supportsLabelFor: true, supportsRequired: true, supportsSize: true },
);
const effectiveSize = computed(
  () => (fieldControlProps.value.size as SpinButtonSize | undefined) ?? props.size,
);
const disabled = computed(
  () =>
    props.disabled ||
    fieldControlProps.value.disabled === true ||
    fieldControlProps.value.disabled === '',
);
const readonly = computed(
  () =>
    props.readOnly ||
    fieldControlProps.value.readonly === true ||
    fieldControlProps.value.readOnly === true ||
    fieldControlProps.value.readonly === '' ||
    fieldControlProps.value.readOnly === '',
);
const precision = computed(() => props.precision ?? Math.max(calculatePrecision(props.step), 0));
const currentValue = computed<SpinButtonValue>(() =>
  isControlled ? (props.modelValue === undefined ? null : props.modelValue) : internalValue.value,
);
const roundedValue = computed<SpinButtonValue>(() =>
  currentValue.value === null ? null : precisionRound(currentValue.value, precision.value),
);
const valueToDisplay = computed(() => {
  if (textValue.value !== undefined) return textValue.value;
  if (roundedValue.value === null) return isControlled ? (props.displayValue ?? '') : '';
  if (isControlled) return props.displayValue ?? String(roundedValue.value);
  return String(roundedValue.value);
});
const atBound = computed(() => getBound(roundedValue.value, props.min, props.max));
const incrementDisabled = computed(
  () => disabled.value || readonly.value || atBound.value === 'max' || atBound.value === 'both',
);
const decrementDisabled = computed(
  () => disabled.value || readonly.value || atBound.value === 'min' || atBound.value === 'both',
);
const isInvalid = computed(
  () =>
    fieldControlProps.value['aria-invalid'] === true ||
    fieldControlProps.value['aria-invalid'] === 'true',
);
const rootClasses = computed(() => [
  'fui-SpinButton',
  `fui-SpinButton--${props.appearance}`,
  `fui-SpinButton--${effectiveSize.value}`,
  {
    'fui-SpinButton--disabled': disabled.value,
    'fui-SpinButton--readonly': readonly.value,
    'fui-SpinButton--invalid': isInvalid.value,
  },
  attrs.class,
]);
const ariaValueText = computed(() => {
  const explicit = fieldControlProps.value['aria-valuetext'];
  if (typeof explicit === 'string') return explicit;
  return isControlled && props.displayValue ? props.displayValue : undefined;
});
const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    value: _value,
    defaultValue: _defaultValue,
    size: _size,
    min: _min,
    max: _max,
    step: _step,
    type: _type,
    role: _role,
    disabled: _disabled,
    readonly: _readonly,
    readOnly: _readOnly,
    onInput: _onInput,
    onChange: _onChange,
    onBlur: _onBlur,
    onKeydown: _onKeydown,
    onKeyDown: _onKeyDown,
    onKeyup: _onKeyup,
    onKeyUp: _onKeyUp,
    onWheel: _onWheel,
    'aria-valuemin': _ariaValueMin,
    'aria-valuemax': _ariaValueMax,
    'aria-valuenow': _ariaValueNow,
    ...rest
  } = fieldControlProps.value;
  return rest;
});

function calculatePrecision(value: number): number {
  const groups = /[1-9]([0]+$)|\.([0-9]*)/.exec(String(value));
  if (!groups) return 0;
  if (groups[1]) return -groups[1].length;
  return groups[2]?.length ?? 0;
}
function precisionRound(value: number, places: number): number {
  const exponent = 10 ** places;
  return Math.round(value * exponent) / exponent;
}
function clamp(value: number): number {
  if (props.min !== undefined && props.max !== undefined && props.min > props.max) return value;
  return Math.min(props.max ?? Infinity, Math.max(props.min ?? -Infinity, value));
}
function getBound(value: SpinButtonValue, min?: number, max?: number) {
  if (value === null) return 'none';
  if (min !== undefined && value === min) return max === min ? 'both' : 'min';
  if (max !== undefined && value === max) return 'max';
  return 'none';
}
function syncNativeValue() {
  if (input.value && input.value.value !== valueToDisplay.value) {
    input.value.value = valueToDisplay.value;
  }
}
function emitCommit(
  event: SpinButtonChangeEvent,
  data: SpinButtonChangeData,
  modelValue: SpinButtonValue,
) {
  emit('update:modelValue', modelValue);
  emit('change', event, data);
}
function commitNumeric(event: SpinButtonChangeEvent, value: number) {
  const nextValue = precisionRound(value, precision.value);
  const changed = currentValue.value !== nextValue;
  textValue.value = undefined;
  previousTextValue.value = undefined;
  if (!changed) {
    nextTick(syncNativeValue);
    return;
  }
  if (!isControlled) internalValue.value = nextValue;
  emitCommit(event, { value: nextValue }, nextValue);
  if (isControlled) nextTick(syncNativeValue);
}
function commitText(event: SpinButtonChangeEvent) {
  if (textValue.value === undefined) return;
  const displayValue = textValue.value;
  const changed = previousTextValue.value !== undefined && previousTextValue.value !== displayValue;
  textValue.value = undefined;
  previousTextValue.value = undefined;
  if (!changed) {
    nextTick(syncNativeValue);
    return;
  }
  const parsed = parseFloat(displayValue);
  const parsedValue: SpinButtonValue = Number.isNaN(parsed)
    ? currentValue.value
    : precisionRound(parsed, precision.value);
  if (!isControlled && !Number.isNaN(parsed)) internalValue.value = parsedValue;
  emitCommit(event, { displayValue }, parsedValue);
  if (isControlled) nextTick(syncNativeValue);
}
function stopSpinning() {
  if (spinTimeout !== undefined) clearTimeout(spinTimeout);
  spinTimeout = undefined;
  spinState = 'rest';
  spinDelay = 150;
  spinTime = 0;
}
function stepValue(
  event: SpinButtonChangeEvent,
  direction: 'up' | 'down' | 'upPage' | 'downPage',
  startFrom?: string,
) {
  let startValue = currentValue.value;
  if (startFrom !== undefined) {
    const parsed = parseFloat(startFrom);
    if (!Number.isNaN(parsed)) startValue = parsed;
  }
  const sign = direction === 'up' || direction === 'upPage' ? 1 : -1;
  const amount = direction === 'upPage' || direction === 'downPage' ? props.stepPage : props.step;
  if (startValue === null) startValue = props.min ?? 0;
  commitNumeric(event, clamp(startValue + amount * sign));
  if (spinState !== 'rest') {
    spinTimeout = setTimeout(() => {
      spinTime += spinDelay;
      spinDelay = 150 + (80 - 150) * (spinTime / 1000);
      stepValue(event, direction);
    }, spinDelay);
  }
}
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  if (previousTextValue.value === undefined) previousTextValue.value = valueToDisplay.value;
  textValue.value = target.value;
  target.setAttribute('aria-valuenow', target.value);
}
function handleBlur(event: FocusEvent) {
  commitText(event);
}
function handleKeydown(event: KeyboardEvent) {
  if (readonly.value) return;
  let nextState: 'rest' | 'up' | 'down' = 'rest';
  let handled = false;
  if (event.key === 'ArrowUp') {
    stepValue(event, 'up', textValue.value);
    nextState = 'up';
    handled = true;
  } else if (event.key === 'ArrowDown') {
    stepValue(event, 'down', textValue.value);
    nextState = 'down';
    handled = true;
  } else if (event.key === 'PageUp') {
    stepValue(event, 'upPage', textValue.value);
    nextState = 'up';
    handled = true;
  } else if (event.key === 'PageDown') {
    stepValue(event, 'downPage', textValue.value);
    nextState = 'down';
    handled = true;
  } else if (!event.shiftKey && event.key === 'Home' && props.min !== undefined) {
    commitNumeric(event, props.min);
    nextState = 'down';
    handled = true;
  } else if (!event.shiftKey && event.key === 'End' && props.max !== undefined) {
    commitNumeric(event, props.max);
    nextState = 'up';
    handled = true;
  } else if (event.key === 'Enter') {
    commitText(event);
  } else if (event.key === 'Escape' && previousTextValue.value !== undefined) {
    textValue.value = undefined;
    previousTextValue.value = undefined;
    nextTick(syncNativeValue);
  }
  if (handled) event.preventDefault();
  keyboardSpinState.value = nextState;
}
function handleKeyup() {
  keyboardSpinState.value = 'rest';
  spinState = 'rest';
}
function handleIncrementMouseDown(event: MouseEvent) {
  if (incrementDisabled.value || event.button !== 0) return;
  const startFrom = textValue.value;
  textValue.value = undefined;
  previousTextValue.value = undefined;
  spinState = 'up';
  stepValue(event, 'up', startFrom);
}
function handleDecrementMouseDown(event: MouseEvent) {
  if (decrementDisabled.value || event.button !== 0) return;
  const startFrom = textValue.value;
  textValue.value = undefined;
  previousTextValue.value = undefined;
  spinState = 'down';
  stepValue(event, 'down', startFrom);
}
function handleButtonMouseDown(event: MouseEvent, direction: 'up' | 'down') {
  event.preventDefault();
  if (direction === 'up') handleIncrementMouseDown(event);
  else handleDecrementMouseDown(event);
}
function handleWheel(event: WheelEvent) {
  // Released SpinButton uses a text input and intentionally does not change values with the wheel.
  if (document.activeElement === input.value) event.stopPropagation();
}
function handleFormReset() {
  resetTimeout = setTimeout(() => {
    textValue.value = undefined;
    previousTextValue.value = undefined;
    if (!isControlled) internalValue.value = initialValue;
    syncNativeValue();
  });
}

watch(valueToDisplay, syncNativeValue, { flush: 'post' });
onMounted(() => {
  if (!input.value) return;
  input.value.defaultValue = valueToDisplay.value;
  syncNativeValue();
  form = input.value.form;
  form?.addEventListener('reset', handleFormReset);
});
onBeforeUnmount(() => {
  stopSpinning();
  form?.removeEventListener('reset', handleFormReset);
  if (resetTimeout !== undefined) clearTimeout(resetTimeout);
});

defineExpose({ element: input, focus: () => input.value?.focus() });
</script>

<template>
  <span :class="rootClasses" :style="attrs.style">
    <input
      ref="input"
      v-bind="inputAttrs"
      class="fui-SpinButton__input"
      type="text"
      role="spinbutton"
      autocomplete="off"
      :value="valueToDisplay"
      :disabled="disabled"
      :readonly="readonly"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="roundedValue ?? undefined"
      :aria-valuetext="ariaValueText"
      @input="handleInput"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      @wheel="handleWheel"
    />
    <button
      class="fui-SpinButton__incrementButton"
      :class="{ 'fui-SpinButton__button--active': keyboardSpinState === 'up' }"
      type="button"
      tabindex="-1"
      aria-label="Increment value"
      :disabled="incrementDisabled"
      @mousedown="handleButtonMouseDown($event, 'up')"
      @mouseup="stopSpinning"
      @mouseleave="stopSpinning"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16">
        <path d="M4 10.5 8 6l4 4.5-.75.7L8 7.55 4.75 11.2z" />
      </svg>
    </button>
    <button
      class="fui-SpinButton__decrementButton"
      :class="{ 'fui-SpinButton__button--active': keyboardSpinState === 'down' }"
      type="button"
      tabindex="-1"
      aria-label="Decrement value"
      :disabled="decrementDisabled"
      @mousedown="handleButtonMouseDown($event, 'down')"
      @mouseup="stopSpinning"
      @mouseleave="stopSpinning"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16">
        <path d="m4 5.5.75-.7L8 8.45l3.25-3.65.75.7L8 10z" />
      </svg>
    </button>
  </span>
</template>

<style>
@import './spinButton.css';
</style>

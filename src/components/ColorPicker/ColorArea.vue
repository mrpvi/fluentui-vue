<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  ColorAreaEmits,
  ColorAreaProps,
  ColorPickerShape,
  HsvColor,
} from './ColorPicker.types';
import { colorPickerContextKey } from './colorPickerContext';
import { colorToCss, hueToCss, normalizeColor, roundChannel } from './colorUtils';

defineOptions({ name: 'FColorArea', inheritAttrs: false });

const props = withDefaults(defineProps<ColorAreaProps>(), {
  disabled: false,
  saturationLabel: 'Saturation',
  valueLabel: 'Brightness',
});
const emit = defineEmits<ColorAreaEmits>();
const attrs = useAttrs();
const context = inject(colorPickerContextKey, null);
const isControlled = useIsPropProvided('modelValue');
const internalColor = ref(normalizeColor(props.defaultValue));
const area = ref<HTMLDivElement | null>(null);
const inputX = ref<HTMLInputElement | null>(null);
const inputY = ref<HTMLInputElement | null>(null);
const activeAxis = ref<'x' | 'y' | null>(null);
let pointerId: number | null = null;

const currentColor = computed(() =>
  normalizeColor(isControlled ? props.modelValue : (context?.color.value ?? internalColor.value)),
);
const currentShape = computed<ColorPickerShape>(
  () => props.shape ?? context?.shape.value ?? 'rounded',
);
const saturation = computed(() => Math.round(currentColor.value.s * 100));
const brightness = computed(() => Math.round(currentColor.value.v * 100));
const rootClasses = computed(() => [
  'fui-ColorArea',
  `fui-ColorArea--${currentShape.value}`,
  { 'fui-ColorArea--disabled': props.disabled },
  attrs.class,
]);
const rootStyle = computed(() => [
  {
    '--fui-ColorArea--x': `${saturation.value}%`,
    '--fui-ColorArea--y': `${brightness.value}%`,
    '--fui-ColorArea--hue': hueToCss(currentColor.value.h),
    '--fui-ColorArea--thumb-color': colorToCss(currentColor.value),
  },
  attrs.style,
]);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, onKeydown: _onKeydown, ...rest } = attrs;
  return rest;
});

function commit(event: Event, color: HsvColor) {
  const normalized = normalizeColor(color);
  if (!isControlled && !context) {
    internalColor.value = normalized;
  }

  if (context && !isControlled) {
    context.requestChange(event, normalized);
  } else {
    emit('update:modelValue', normalized);
    emit('change', event, { color: normalized });
  }
}

function isRtl(): boolean {
  return area.value?.closest('[dir="rtl"]') !== null;
}

function colorFromPointer(event: PointerEvent): HsvColor | null {
  const rect = area.value?.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const physicalX = roundChannel((event.clientX - rect.left) / rect.width);
  return {
    ...currentColor.value,
    s: isRtl() ? roundChannel(1 - physicalX) : physicalX,
    v: roundChannel(1 - (event.clientY - rect.top) / rect.height),
  };
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled || event.button !== 0) {
    return;
  }

  event.preventDefault();
  pointerId = event.pointerId;
  area.value?.setPointerCapture?.(event.pointerId);
  const color = colorFromPointer(event);
  if (color) {
    commit(event, color);
  }
  (activeAxis.value === 'y' ? inputY.value : inputX.value)?.focus();
}

function handlePointerMove(event: PointerEvent) {
  if (props.disabled || pointerId !== event.pointerId) {
    return;
  }

  const color = colorFromPointer(event);
  if (color) {
    commit(event, color);
  }
}

function finishPointer(event: PointerEvent) {
  if (pointerId === event.pointerId) {
    area.value?.releasePointerCapture?.(event.pointerId);
    pointerId = null;
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  const rtl = isRtl();
  const largeStep = event.shiftKey ? 0.1 : 0.01;
  let saturationDelta = 0;
  let valueDelta = 0;

  switch (event.key) {
    case 'ArrowLeft':
      saturationDelta = rtl ? largeStep : -largeStep;
      activeAxis.value = 'x';
      break;
    case 'ArrowRight':
      saturationDelta = rtl ? -largeStep : largeStep;
      activeAxis.value = 'x';
      break;
    case 'ArrowUp':
      valueDelta = largeStep;
      activeAxis.value = 'y';
      break;
    case 'ArrowDown':
      valueDelta = -largeStep;
      activeAxis.value = 'y';
      break;
    case 'Home':
      activeAxis.value = 'x';
      commit(event, { ...currentColor.value, s: 0 });
      event.preventDefault();
      return;
    case 'End':
      activeAxis.value = 'x';
      commit(event, { ...currentColor.value, s: 1 });
      event.preventDefault();
      return;
    default:
      return;
  }

  event.preventDefault();
  commit(event, {
    ...currentColor.value,
    s: roundChannel(currentColor.value.s + saturationDelta),
    v: roundChannel(currentColor.value.v + valueDelta),
  });
}

function handleInput(event: Event, axis: 'x' | 'y') {
  const value = Number((event.target as HTMLInputElement).value) / 100;
  activeAxis.value = axis;
  commit(event, {
    ...currentColor.value,
    ...(axis === 'x' ? { s: value } : { v: value }),
  });
}

onBeforeUnmount(() => {
  pointerId = null;
});

defineExpose({
  element: area,
  focus: () => (activeAxis.value === 'y' ? inputY.value : inputX.value)?.focus(),
});
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="area"
    :class="rootClasses"
    :style="rootStyle"
    @keydown="handleKeydown"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="finishPointer"
    @pointercancel="finishPointer"
  >
    <div class="fui-ColorArea__thumb" aria-hidden="true" />
    <input
      ref="inputX"
      class="fui-ColorArea__input fui-ColorArea__inputX"
      type="range"
      min="0"
      max="100"
      step="1"
      :value="saturation"
      :disabled="disabled"
      :tabindex="activeAxis === 'y' ? -1 : 0"
      :aria-label="saturationLabel"
      @input="handleInput($event, 'x')"
    />
    <input
      ref="inputY"
      class="fui-ColorArea__input fui-ColorArea__inputY"
      type="range"
      min="0"
      max="100"
      step="1"
      :value="brightness"
      :disabled="disabled"
      :tabindex="activeAxis === 'y' ? 0 : -1"
      :aria-label="valueLabel"
      @input="handleInput($event, 'y')"
    />
  </div>
</template>

<style>
@import './colorPicker.css';
</style>

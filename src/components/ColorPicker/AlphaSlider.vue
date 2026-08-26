<script setup lang="ts">
import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  AlphaSliderEmits,
  AlphaSliderProps,
  ColorPickerShape,
  HsvColor,
} from './ColorPicker.types';
import { colorPickerContextKey } from './colorPickerContext';
import { colorToCss, normalizeColor } from './colorUtils';

defineOptions({ name: 'FAlphaSlider', inheritAttrs: false });

const props = withDefaults(defineProps<AlphaSliderProps>(), {
  disabled: false,
  transparency: false,
  vertical: false,
});
const emit = defineEmits<AlphaSliderEmits>();
const attrs = useAttrs();
const context = inject(colorPickerContextKey, null);
const isControlled = useIsPropProvided('modelValue');
const internalColor = ref(normalizeColor(props.defaultValue));
const input = ref<HTMLInputElement | null>(null);

const currentColor = computed(() =>
  normalizeColor(isControlled ? props.modelValue : (context?.color.value ?? internalColor.value)),
);
const currentShape = computed<ColorPickerShape>(
  () => props.shape ?? context?.shape.value ?? 'rounded',
);
const opacityPercent = computed(() => Math.round((currentColor.value.a ?? 1) * 100));
const displayedValue = computed(() =>
  props.transparency ? 100 - opacityPercent.value : opacityPercent.value,
);
const solidColor = computed(() => colorToCss(currentColor.value, 1));
const thumbColor = computed(() => colorToCss(currentColor.value));
const rootClasses = computed(() => [
  'fui-ColorSlider',
  'fui-AlphaSlider',
  `fui-ColorSlider--${currentShape.value}`,
  props.vertical ? 'fui-ColorSlider--vertical' : 'fui-ColorSlider--horizontal',
  { 'fui-ColorSlider--disabled': props.disabled },
  attrs.class,
]);
const rootStyle = computed(() => [
  {
    '--fui-ColorSlider--progress': `${displayedValue.value}%`,
    '--fui-ColorSlider--rail-color': solidColor.value,
    '--fui-ColorSlider--thumb-color': thumbColor.value,
  },
  attrs.style,
]);
const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    value: _value,
    min: _min,
    max: _max,
    step: _step,
    type: _type,
    disabled: _disabled,
    onInput: _onInput,
    onChange: _onChange,
    ...rest
  } = attrs;
  return rest;
});

function commit(event: Event, color: HsvColor) {
  if (!isControlled && !context) {
    internalColor.value = color;
  }

  if (context && !isControlled) {
    context.requestChange(event, color);
  } else {
    emit('update:modelValue', color);
    emit('change', event, { color });
  }
}

function syncNativeValue() {
  if (input.value) {
    input.value.value = String(displayedValue.value);
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const rawValue = Math.min(Math.max(target.valueAsNumber, 0), 100);
  const opacity = (props.transparency ? 100 - rawValue : rawValue) / 100;
  commit(event, normalizeColor({ ...currentColor.value, a: opacity }));
  if (isControlled || context) {
    void nextTick(syncNativeValue);
  }
}

watch(displayedValue, syncNativeValue, { flush: 'post' });

defineExpose({ element: input, focus: () => input.value?.focus() });
</script>

<template>
  <div :class="rootClasses" :style="rootStyle" role="group">
    <input
      v-bind="inputAttrs"
      ref="input"
      class="fui-ColorSlider__input fui-AlphaSlider__input"
      type="range"
      min="0"
      max="100"
      step="1"
      :value="displayedValue"
      :disabled="disabled"
      :aria-orientation="vertical ? 'vertical' : 'horizontal'"
      :orient="vertical ? 'vertical' : undefined"
      @input="handleInput"
    />
    <div class="fui-ColorSlider__rail fui-AlphaSlider__rail" aria-hidden="true" />
    <div class="fui-ColorSlider__thumb fui-AlphaSlider__thumb" aria-hidden="true" />
  </div>
</template>

<style>
@import './colorPicker.css';
</style>

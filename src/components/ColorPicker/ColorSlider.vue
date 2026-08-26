<script setup lang="ts">
import { computed, inject, nextTick, ref, useAttrs, watch } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  ColorPickerShape,
  ColorSliderEmits,
  ColorSliderProps,
  HsvColor,
} from './ColorPicker.types';
import { colorPickerContextKey } from './colorPickerContext';
import { colorToCss, hueToCss, normalizeColor } from './colorUtils';

defineOptions({ name: 'FColorSlider', inheritAttrs: false });

const props = withDefaults(defineProps<ColorSliderProps>(), {
  channel: 'hue',
  disabled: false,
  vertical: false,
});
const emit = defineEmits<ColorSliderEmits>();
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
const maximum = computed(() => (props.channel === 'hue' ? 360 : 100));
const channelValue = computed(() => {
  if (props.channel === 'hue') {
    return currentColor.value.h;
  }
  return Math.round(currentColor.value[props.channel === 'saturation' ? 's' : 'v'] * 100);
});
const railColor = computed(() => hueToCss(currentColor.value.h));
const thumbColor = computed(() => colorToCss(currentColor.value));
const rootClasses = computed(() => [
  'fui-ColorSlider',
  `fui-ColorSlider--${props.channel}`,
  `fui-ColorSlider--${currentShape.value}`,
  props.vertical ? 'fui-ColorSlider--vertical' : 'fui-ColorSlider--horizontal',
  { 'fui-ColorSlider--disabled': props.disabled },
  attrs.class,
]);
const rootStyle = computed(() => [
  {
    '--fui-ColorSlider--progress': `${(channelValue.value / maximum.value) * 100}%`,
    '--fui-ColorSlider--rail-color': railColor.value,
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

function colorForValue(value: number): HsvColor {
  if (props.channel === 'hue') {
    return normalizeColor({ ...currentColor.value, h: value });
  }

  return normalizeColor({
    ...currentColor.value,
    [props.channel === 'saturation' ? 's' : 'v']: value / 100,
  });
}

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
    input.value.value = String(channelValue.value);
  }
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const color = colorForValue(target.valueAsNumber);
  commit(event, color);
  if (isControlled || context) {
    void nextTick(syncNativeValue);
  }
}

watch(channelValue, syncNativeValue, { flush: 'post' });

defineExpose({ element: input, focus: () => input.value?.focus() });
</script>

<template>
  <div :class="rootClasses" :style="rootStyle" role="group">
    <input
      v-bind="inputAttrs"
      ref="input"
      class="fui-ColorSlider__input"
      type="range"
      min="0"
      :max="maximum"
      step="1"
      :value="channelValue"
      :disabled="disabled"
      :aria-orientation="vertical ? 'vertical' : 'horizontal'"
      :orient="vertical ? 'vertical' : undefined"
      @input="handleInput"
    />
    <div class="fui-ColorSlider__rail" aria-hidden="true" />
    <div class="fui-ColorSlider__thumb" aria-hidden="true" />
  </div>
</template>

<style>
@import './colorPicker.css';
</style>

<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { ColorPickerEmits, ColorPickerProps } from './ColorPicker.types';
import { colorPickerContextKey } from './colorPickerContext';
import { normalizeColor } from './colorUtils';

defineOptions({ name: 'FColorPicker', inheritAttrs: false });

// Native Vue adaptation of @fluentui/react-color-picker-preview 0.3.1
// (gitHead 17389d335ea4e0e2ce7a9c730f02ed5c4273e546). React context and slot
// objects are translated to typed Vue provide/inject and a fixed root/default slot.
const props = withDefaults(defineProps<ColorPickerProps>(), {
  shape: 'rounded',
});
const emit = defineEmits<ColorPickerEmits>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const isControlled = useIsPropProvided('modelValue');
const internalColor = ref(normalizeColor(props.defaultValue));
const currentColor = computed(() =>
  normalizeColor(isControlled ? props.modelValue : internalColor.value),
);
const currentShape = computed(() => props.shape);

function requestChange(event: Event, color: ColorPickerProps['modelValue']) {
  const normalized = normalizeColor(color);
  if (!isControlled) {
    internalColor.value = normalized;
  }

  emit('update:modelValue', normalized);
  emit('change', event, { color: normalized });
}

provide(colorPickerContextKey, {
  color: currentColor,
  shape: currentShape,
  requestChange,
});

defineExpose({
  element: root,
});
</script>

<template>
  <div
    ref="root"
    :class="['fui-ColorPicker', attrs.class]"
    :style="attrs.style"
    v-bind="{ ...attrs, class: undefined, style: undefined }"
  >
    <slot :color="currentColor" />
  </div>
</template>

<style>
@import './colorPicker.css';
</style>

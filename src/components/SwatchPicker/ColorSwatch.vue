<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import type { ColorSwatchProps } from './SwatchPicker.types';
import { swatchPickerContextKey } from './swatchPickerContext';

defineOptions({ name: 'FColorSwatch', inheritAttrs: false });
const props = withDefaults(defineProps<ColorSwatchProps>(), { disabled: false });
const attrs = useAttrs();
const context = inject(swatchPickerContextKey, null);
const button = ref<HTMLButtonElement | null>(null);
let unregister: (() => void) | undefined;
const size = computed(() => props.size ?? context?.size.value ?? 'medium');
const shape = computed(() => props.shape ?? context?.shape.value ?? 'square');
const selected = computed(() => context?.selectedValue.value === props.value);
const role = computed(() => (context?.layout.value === 'grid' ? 'gridcell' : 'radio'));
const classes = computed(() => [
  'fui-Swatch',
  'fui-ColorSwatch',
  `fui-Swatch--${size.value}`,
  `fui-Swatch--${shape.value}`,
  { 'fui-Swatch--selected': selected.value, 'fui-Swatch--disabled': props.disabled },
  attrs.class,
]);
const styles = computed(() => [
  {
    '--fui-Swatch--color': props.color,
    '--fui-Swatch--border-color': props.borderColor ?? 'var(--fui-color-transparent-stroke)',
  },
  attrs.style,
]);
const buttonAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    type: _type,
    disabled: _disabled,
    onClick: _onClick,
    ...rest
  } = attrs;
  return rest;
});

function register() {
  unregister?.();
  if (context && button.value) {
    unregister = context.register({
      element: button.value,
      disabled: props.disabled,
      row: button.value.closest('[role="row"]'),
      selectedSwatch: props.color,
      value: props.value,
    });
  }
}

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    context?.requestSelection(event, { selectedValue: props.value, selectedSwatch: props.color });
  }
}

onMounted(register);
onBeforeUnmount(() => unregister?.());
watch(() => props.disabled, register);
watch(
  selected,
  (value) => {
    if (value) {
      void nextTick(() => {
        if (button.value) {
          button.value.tabIndex = 0;
        }
      });
    }
  },
  { immediate: true },
);
defineExpose({ element: button, focus: () => button.value?.focus() });
</script>

<template>
  <button
    v-bind="buttonAttrs"
    ref="button"
    :class="classes"
    :style="styles"
    type="button"
    :role="role"
    :disabled="disabled"
    :tabindex="selected ? 0 : -1"
    :aria-checked="role === 'radio' ? selected : undefined"
    :aria-selected="role === 'gridcell' ? selected : undefined"
    @click="handleClick"
  >
    <slot />
    <span v-if="$slots.icon" class="fui-Swatch__icon"><slot name="icon" /></span>
    <span v-if="disabled" class="fui-Swatch__disabledIcon" aria-hidden="true">
      <slot name="disabled-icon">×</slot>
    </span>
  </button>
</template>

<style>
@import './swatchPicker.css';
</style>

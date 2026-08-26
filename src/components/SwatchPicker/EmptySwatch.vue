<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import type { EmptySwatchProps } from './SwatchPicker.types';
import { swatchPickerContextKey } from './swatchPickerContext';

defineOptions({ name: 'FEmptySwatch', inheritAttrs: false });
const props = withDefaults(defineProps<EmptySwatchProps>(), { disabled: false });
const attrs = useAttrs();
const context = inject(swatchPickerContextKey, null);
const button = ref<HTMLButtonElement | null>(null);
let unregister: (() => void) | undefined;
const size = computed(() => props.size ?? context?.size.value ?? 'medium');
const shape = computed(() => props.shape ?? context?.shape.value ?? 'square');
const role = computed(() => (context?.layout.value === 'grid' ? 'gridcell' : 'radio'));
const classes = computed(() => [
  'fui-Swatch',
  'fui-EmptySwatch',
  `fui-Swatch--${size.value}`,
  `fui-Swatch--${shape.value}`,
  { 'fui-Swatch--disabled': props.disabled },
  attrs.class,
]);
const buttonAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    type: _type,
    disabled: _disabled,
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
      selectedSwatch: '',
    });
  }
}
onMounted(register);
onBeforeUnmount(() => unregister?.());
watch(() => props.disabled, register);
defineExpose({ element: button, focus: () => button.value?.focus() });
</script>

<template>
  <button
    v-bind="buttonAttrs"
    ref="button"
    :class="classes"
    :style="attrs.style"
    type="button"
    :role="role"
    :disabled="disabled"
    tabindex="-1"
    :aria-checked="role === 'radio' ? false : undefined"
  >
    <slot />
  </button>
</template>

<style>
@import './swatchPicker.css';
</style>

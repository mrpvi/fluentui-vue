<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { swatchPickerContextKey } from './swatchPickerContext';

defineOptions({ name: 'FSwatchPickerRow', inheritAttrs: false });
const attrs = useAttrs();
const context = inject(swatchPickerContextKey, null);
const spacing = computed(() => context?.spacing.value ?? 'medium');
</script>

<template>
  <div
    v-bind="{ ...attrs, class: undefined }"
    :class="['fui-SwatchPickerRow', `fui-SwatchPickerRow--spacing-${spacing}`, attrs.class]"
    role="row"
  >
    <slot />
  </div>
</template>

<style>
@import './swatchPicker.css';
</style>

<script setup lang="ts">
import { useId } from 'vue';
import type { TagPickerOptionGroupProps } from './TagPicker.types';
defineOptions({ name: 'FTagPickerOptionGroup' });
defineProps<TagPickerOptionGroupProps>();
const labelId = `fui-tag-picker-option-group-${useId()}`;
</script>
<template>
  <div class="fui-TagPickerOptionGroup" role="group" :aria-labelledby="labelId">
    <div :id="labelId" class="fui-TagPickerOptionGroup__label">{{ label }}</div>
    <slot />
  </div>
</template>

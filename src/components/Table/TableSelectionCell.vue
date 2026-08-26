<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { tableContextKey } from './tableContext';
import type {
  TableSelectionCellEmits,
  TableSelectionCellProps,
  TableSelectionCellSlots,
} from './Table.types';

defineOptions({ name: 'FTableSelectionCell', inheritAttrs: false });
const props = withDefaults(defineProps<TableSelectionCellProps>(), {
  type: 'checkbox',
  checked: false,
  subtle: false,
  invisible: false,
  disabled: false,
});
const emit = defineEmits<TableSelectionCellEmits>();
defineSlots<TableSelectionCellSlots>();
const attrs = useAttrs();
const table = inject(tableContextKey);
const noNativeElements = computed(
  () => props.noNativeElements ?? table?.noNativeElements.value ?? false,
);
function handleChange(event: Event) {
  const input = event.target as HTMLInputElement;
  emit('update:checked', input.checked);
  emit('change', event, { checked: input.checked });
}
</script>

<template>
  <component
    :is="noNativeElements ? 'div' : header ? 'th' : 'td'"
    v-bind="attrs"
    :class="[
      'fui-TableSelectionCell',
      { 'fui-TableSelectionCell--subtle': subtle, 'fui-TableSelectionCell--invisible': invisible },
      attrs.class,
    ]"
    :role="noNativeElements ? (header ? 'columnheader' : 'gridcell') : attrs.role"
  >
    <slot :checked="checked" :disabled="disabled">
      <input
        class="fui-TableSelectionCell__input"
        :type="type"
        :checked="checked === true"
        :disabled="disabled"
        :aria-label="ariaLabel ?? (type === 'radio' ? 'Select row' : 'Select row')"
        :aria-checked="checked === 'mixed' ? 'mixed' : undefined"
        @change="handleChange"
      />
    </slot>
  </component>
</template>

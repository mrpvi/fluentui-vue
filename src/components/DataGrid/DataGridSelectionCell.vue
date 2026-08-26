<script setup lang="ts">
import { computed, inject } from 'vue';
import { dataGridContextKey, dataGridRowIdKey } from './dataGridContext';
import FTableSelectionCell from '../Table/TableSelectionCell.vue';
import type { DataGridSelectionCellProps, DataGridSelectionCellSlots } from './DataGrid.types';
defineOptions({ name: 'FDataGridSelectionCell' });
const props = withDefaults(defineProps<DataGridSelectionCellProps>(), { disabled: false });
defineSlots<DataGridSelectionCellSlots>();
const injectedGrid = inject(dataGridContextKey);
if (!injectedGrid) throw new Error('FDataGridSelectionCell must be used inside FDataGrid.');
const grid = injectedGrid;
const rowContext = inject(dataGridRowIdKey, undefined);
const header = computed(() => !rowContext);
const rowId = computed(() => rowContext?.value);
const selected = computed(() =>
  header.value ? grid.allSelected.value : grid.isSelected(rowId.value!),
);
function change(event: Event) {
  if (props.disabled) return;
  if (header.value) grid.toggleAll(event);
  else grid.toggleRow(rowId.value!, event);
}
</script>
<template>
  <FTableSelectionCell
    :header="header"
    :type="grid.selectionMode.value === 'single' ? 'radio' : 'checkbox'"
    :checked="selected"
    :subtle="subtle ?? grid.subtleSelection.value"
    :disabled="disabled"
    :aria-label="ariaLabel ?? (header ? 'Select all rows' : 'Select row')"
    :no-native-elements="noNativeElements ?? grid.noNativeElements.value"
    @change="change"
    ><template v-if="$slots.default" #default
      ><slot :selected="selected === true" :disabled="disabled" /></template
  ></FTableSelectionCell>
</template>

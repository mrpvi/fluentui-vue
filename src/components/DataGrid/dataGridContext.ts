import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { TableRowAppearance, TableSize } from '../Table';
import type {
  DataGridColumn,
  DataGridColumnId,
  DataGridFocusMode,
  DataGridRowId,
  DataGridSelectionMode,
  DataGridSortState,
} from './DataGrid.types';

export interface DataGridContextValue {
  root: Ref<HTMLElement | null>;
  size: ComputedRef<TableSize>;
  noNativeElements: ComputedRef<boolean>;
  focusMode: ComputedRef<DataGridFocusMode>;
  selectionMode: ComputedRef<DataGridSelectionMode | undefined>;
  subtleSelection: ComputedRef<boolean>;
  selectionAppearance: ComputedRef<TableRowAppearance>;
  sortState: ComputedRef<DataGridSortState | undefined>;
  columns: ComputedRef<DataGridColumn[]>;
  isSelected: (rowId: DataGridRowId) => boolean;
  toggleRow: (rowId: DataGridRowId, event: Event) => void;
  toggleAll: (event: Event) => void;
  allSelected: ComputedRef<boolean | 'mixed'>;
  requestSort: (columnId: DataGridColumnId, event: Event) => void;
  getColumnWidth: (columnId: DataGridColumnId) => number | undefined;
  resizeColumn: (columnId: DataGridColumnId, width: number, event: Event) => void;
  moveFocus: (cell: HTMLElement, key: string) => void;
}
export const dataGridContextKey: InjectionKey<DataGridContextValue> = Symbol('fui-data-grid');
export const dataGridRowIdKey: InjectionKey<ComputedRef<DataGridRowId | undefined>> =
  Symbol('fui-data-grid-row-id');

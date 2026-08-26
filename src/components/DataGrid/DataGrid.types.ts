import type { TableRowAppearance, TableSize, TableSortDirection } from '../Table';

export type DataGridRowId = string | number;
export type DataGridColumnId = string | number;
export type DataGridSelectionMode = 'single' | 'multiselect';
export type DataGridFocusMode = 'none' | 'cell' | 'row' | 'composite';
export type DataGridCellFocusMode = 'group' | 'none' | 'cell';

export interface DataGridSortState {
  sortColumn: DataGridColumnId;
  sortDirection: TableSortDirection;
}

export interface DataGridColumn<TItem = unknown> {
  columnId: DataGridColumnId;
  compare?: (a: TItem, b: TItem) => number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface DataGridProps<TItem = unknown> {
  items?: TItem[];
  columns?: DataGridColumn<TItem>[];
  getRowId?: (item: TItem, index: number) => DataGridRowId;
  size?: TableSize;
  noNativeElements?: boolean;
  focusMode?: DataGridFocusMode;
  selectionMode?: DataGridSelectionMode;
  modelValue?: DataGridRowId[];
  defaultSelectedItems?: DataGridRowId[];
  sortState?: DataGridSortState;
  defaultSortState?: DataGridSortState;
  subtleSelection?: boolean;
  selectionAppearance?: TableRowAppearance;
  resizableColumns?: boolean;
}

export interface DataGridEmits {
  'update:modelValue': [selectedItems: DataGridRowId[]];
  selectionChange: [event: Event, data: { selectedItems: DataGridRowId[] }];
  'update:sortState': [sortState: DataGridSortState];
  sortChange: [event: Event, data: DataGridSortState];
  columnResize: [event: Event, data: { columnId: DataGridColumnId; width: number }];
}

export interface DataGridSlots {
  default?: () => unknown;
}
export interface DataGridSectionProps {
  noNativeElements?: boolean;
}
export interface DataGridSectionSlots {
  default?: (props: { item?: unknown; rowId?: DataGridRowId; index?: number }) => unknown;
}
export interface DataGridRowProps {
  rowId?: DataGridRowId;
  appearance?: TableRowAppearance;
  noNativeElements?: boolean;
}
export interface DataGridRowSlots {
  default?: () => unknown;
  'selection-cell'?: (props: { selected: boolean }) => unknown;
}
export interface DataGridCellProps {
  focusMode?: DataGridCellFocusMode;
  noNativeElements?: boolean;
}
export interface DataGridCellSlots {
  default?: () => unknown;
}
export interface DataGridHeaderCellProps extends DataGridCellProps {
  columnId: DataGridColumnId;
  sortable?: boolean;
}
export interface DataGridHeaderCellSlots {
  default?: () => unknown;
  aside?: () => unknown;
  'sort-icon'?: (props: { direction?: TableSortDirection }) => unknown;
}
export interface DataGridSelectionCellProps extends DataGridCellProps {
  ariaLabel?: string;
  subtle?: boolean;
  disabled?: boolean;
}
export interface DataGridSelectionCellSlots {
  default?: (props: { selected: boolean; disabled: boolean }) => unknown;
}

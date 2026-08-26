export type TableSize = 'extra-small' | 'small' | 'medium';
export type TableSortDirection = 'ascending' | 'descending';
export type TableRowAppearance = 'brand' | 'neutral' | 'none';
export type TableSelectionType = 'checkbox' | 'radio';

export interface TableProps {
  size?: TableSize;
  noNativeElements?: boolean;
  sortable?: boolean;
}

export interface TableSlots {
  default?: () => unknown;
}

export interface TableSectionProps {
  noNativeElements?: boolean;
}

export interface TableSectionSlots {
  default?: () => unknown;
}

export interface TableRowProps {
  appearance?: TableRowAppearance;
  noNativeElements?: boolean;
}

export interface TableRowSlots {
  default?: () => unknown;
}

export interface TableHeaderCellProps {
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  noNativeElements?: boolean;
}

export interface TableHeaderCellEmits {
  sort: [event: MouseEvent | KeyboardEvent];
}

export interface TableHeaderCellSlots {
  default?: () => unknown;
  aside?: () => unknown;
  'sort-icon'?: (props: { direction?: TableSortDirection }) => unknown;
}

export interface TableCellProps {
  noNativeElements?: boolean;
}

export interface TableCellSlots {
  default?: () => unknown;
}

export interface TableSelectionCellProps extends TableCellProps {
  header?: boolean;
  type?: TableSelectionType;
  checked?: boolean | 'mixed';
  subtle?: boolean;
  invisible?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface TableSelectionCellEmits {
  'update:checked': [checked: boolean];
  change: [event: Event, data: { checked: boolean }];
}

export interface TableSelectionCellSlots {
  default?: (props: { checked: boolean | 'mixed'; disabled: boolean }) => unknown;
}

export interface TableCellLayoutProps {
  appearance?: 'primary';
  truncate?: boolean;
}

export interface TableCellLayoutSlots {
  default?: () => unknown;
  media?: () => unknown;
  description?: () => unknown;
}

export interface TableCellActionsProps {
  visible?: boolean;
}

export interface TableCellActionsSlots {
  default?: () => unknown;
}

export interface TableResizeHandleProps {
  columnId?: string | number;
  minWidth?: number;
  maxWidth?: number;
  width?: number;
  ariaLabel?: string;
}

export interface TableResizeHandleEmits {
  resize: [
    event: MouseEvent | KeyboardEvent,
    data: { columnId?: string | number; width: number; delta: number },
  ];
  resizeEnd: [
    event: MouseEvent | KeyboardEvent,
    data: { columnId?: string | number; width: number },
  ];
}

export type ListElement = 'ul' | 'ol' | 'div';
export type ListNavigationMode = 'items' | 'composite';
export type ListSelectionMode = 'single' | 'multiselect';
export type ListValue = string | number;

export interface ListProps {
  as?: ListElement;
  navigationMode?: ListNavigationMode;
  selectionMode?: ListSelectionMode;
  /** Controlled selected item values used by v-model. */
  modelValue?: readonly ListValue[];
  /** Initial selected item values for uncontrolled usage. */
  defaultSelectedItems?: readonly ListValue[];
  role?: string;
}

export interface ListSelectionChangeData {
  selectedItems: ListValue[];
}

export interface ListEmits {
  'update:modelValue': [selectedItems: ListValue[]];
  selectionChange: [event: Event, data: ListSelectionChangeData];
}

export interface ListSlots {
  default?: () => unknown;
}

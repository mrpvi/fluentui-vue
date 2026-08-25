export type TabValue = string | number | boolean;

export type TabListAppearance = 'transparent' | 'subtle' | 'subtle-circular' | 'filled-circular';

export type TabListSize = 'small' | 'medium' | 'large';

export interface TabListProps {
  appearance?: TabListAppearance;
  modelValue?: TabValue;
  defaultSelectedValue?: TabValue;
  disabled?: boolean;
  reserveSelectedTabSpace?: boolean;
  selectTabOnFocus?: boolean;
  size?: TabListSize;
  vertical?: boolean;
}

export interface TabSelectData {
  value: TabValue;
}

export interface TabListEmits {
  'update:modelValue': [value: TabValue];
  tabSelect: [event: MouseEvent | FocusEvent | KeyboardEvent, data: TabSelectData];
}

export interface TabListSlots {
  default?: () => unknown;
}

import type { ButtonIconPosition, ButtonSize } from '../Button/Button.types';

export type ToolbarSize = ButtonSize;
export type ToolbarAppearance = 'primary' | 'subtle' | 'transparent';
export type ToolbarCheckedValues = Record<string, string[]>;

export interface ToolbarProps {
  size?: ToolbarSize;
  vertical?: boolean;
  checkedValues?: ToolbarCheckedValues;
  defaultCheckedValues?: ToolbarCheckedValues;
  /** Enables circular arrow-key focus movement through toolbar controls. */
  circularNavigation?: boolean;
}
export interface ToolbarCheckedValueChangeData {
  name: string;
  checkedItems: string[];
}
export interface ToolbarEmits {
  'update:checkedValues': [values: ToolbarCheckedValues];
  checkedValueChange: [event: MouseEvent, data: ToolbarCheckedValueChangeData];
}
export interface ToolbarSlots {
  default?: () => unknown;
}

export interface ToolbarButtonProps {
  appearance?: ToolbarAppearance;
  size?: ToolbarSize;
  disabled?: boolean;
  disabledFocusable?: boolean;
  iconPosition?: ButtonIconPosition;
  vertical?: boolean;
}
export interface ToolbarButtonEmits {
  click: [event: MouseEvent];
}
export interface ToolbarButtonSlots {
  default?: () => unknown;
  icon?: () => unknown;
}

export interface ToolbarToggleButtonProps extends ToolbarButtonProps {
  name: string;
  value: string;
}
export type ToolbarToggleButtonSlots = ToolbarButtonSlots;

export interface ToolbarRadioButtonProps extends ToolbarButtonProps {
  name: string;
  value: string;
}
export type ToolbarRadioButtonSlots = ToolbarButtonSlots;

export interface ToolbarRadioGroupProps {
  as?: string;
}
export interface ToolbarRadioGroupSlots {
  default?: () => unknown;
}
export interface ToolbarGroupProps {
  as?: string;
}
export interface ToolbarGroupSlots {
  default?: () => unknown;
}
export interface ToolbarDividerProps {
  vertical?: boolean;
}

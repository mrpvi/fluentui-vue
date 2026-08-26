import type { ButtonAppearance, ButtonShape, ButtonSize } from '../Button/Button.types';

export type SplitButtonAppearance = ButtonAppearance;
export type SplitButtonShape = ButtonShape;
export type SplitButtonSize = ButtonSize;

export interface SplitButtonProps {
  appearance?: SplitButtonAppearance;
  shape?: SplitButtonShape;
  size?: SplitButtonSize;
  disabled?: boolean;
  disabledFocusable?: boolean;
  menuButtonDisabled?: boolean;
  menuButtonDisabledFocusable?: boolean;
  /** Controlled menu-open state. */
  modelValue?: boolean;
  /** Initial menu-open state for uncontrolled usage. */
  defaultOpen?: boolean;
}

export interface SplitButtonEmits {
  'update:modelValue': [open: boolean];
  click: [event: MouseEvent];
  menuClick: [event: MouseEvent];
}

export interface SplitButtonSlots {
  default?: () => unknown;
  /** Decorative primary-action icon. */
  icon?: () => unknown;
  /** Decorative menu indicator. */
  'menu-icon'?: () => unknown;
}

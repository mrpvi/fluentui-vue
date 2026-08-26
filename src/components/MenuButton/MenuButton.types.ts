import type { ButtonAppearance, ButtonShape, ButtonSize } from '../Button/Button.types';

export type MenuButtonAppearance = ButtonAppearance;
export type MenuButtonShape = ButtonShape;
export type MenuButtonSize = ButtonSize;

export interface MenuButtonProps {
  appearance?: MenuButtonAppearance;
  shape?: MenuButtonShape;
  size?: MenuButtonSize;
  disabled?: boolean;
  disabledFocusable?: boolean;
  /** Controlled menu-open state. */
  modelValue?: boolean;
  /** Initial menu-open state for uncontrolled usage. */
  defaultOpen?: boolean;
  menuIcon?: boolean;
}

export interface MenuButtonEmits {
  'update:modelValue': [open: boolean];
  click: [event: MouseEvent];
}

export interface MenuButtonSlots {
  default?: () => unknown;
  /** Decorative leading content. */
  icon?: () => unknown;
  /** Decorative menu indicator. */
  'menu-icon'?: () => unknown;
}

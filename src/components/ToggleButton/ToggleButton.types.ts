import type {
  ButtonAppearance,
  ButtonIconPosition,
  ButtonShape,
  ButtonSize,
} from '../Button/Button.types';

export type ToggleButtonAppearance = ButtonAppearance;
export type ToggleButtonShape = ButtonShape;
export type ToggleButtonSize = ButtonSize;
export type ToggleButtonIconPosition = ButtonIconPosition;

export interface ToggleButtonProps {
  appearance?: ToggleButtonAppearance;
  shape?: ToggleButtonShape;
  size?: ToggleButtonSize;
  disabled?: boolean;
  disabledFocusable?: boolean;
  iconPosition?: ToggleButtonIconPosition;
  /** Initial pressed state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Controlled pressed state used by v-model. An explicitly bound undefined is controlled and unchecked. */
  modelValue?: boolean;
  /** Uses the higher-contrast selected treatment from Fluent UI React. */
  isAccessible?: boolean;
}

export interface ToggleButtonEmits {
  'update:modelValue': [checked: boolean];
  click: [event: MouseEvent];
}

export interface ToggleButtonSlots {
  default?: () => unknown;
  /** Decorative content hidden from assistive technology. */
  icon?: () => unknown;
}

import type {
  ButtonAppearance,
  ButtonIconPosition,
  ButtonShape,
  ButtonSize,
  ButtonTag,
} from '../Button/Button.types';

export type CompoundButtonAppearance = ButtonAppearance;
export type CompoundButtonShape = ButtonShape;
export type CompoundButtonSize = ButtonSize;
export type CompoundButtonIconPosition = ButtonIconPosition;
export type CompoundButtonTag = ButtonTag;

export interface CompoundButtonProps {
  as?: CompoundButtonTag;
  appearance?: CompoundButtonAppearance;
  shape?: CompoundButtonShape;
  size?: CompoundButtonSize;
  disabled?: boolean;
  disabledFocusable?: boolean;
  iconPosition?: CompoundButtonIconPosition;
  href?: string;
  /** Second line of text that describes the action. The named slot takes precedence. */
  secondaryContent?: string | number;
}

export interface CompoundButtonEmits {
  click: [event: MouseEvent];
}

export interface CompoundButtonSlots {
  /** Primary action content. */
  default?: () => unknown;
  /** Second line of content that describes the action. */
  'secondary-content'?: () => unknown;
  /** Decorative content hidden from assistive technology. */
  icon?: () => unknown;
}

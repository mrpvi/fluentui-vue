export type ButtonAppearance = 'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent';
export type ButtonShape = 'rounded' | 'circular' | 'square';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonIconPosition = 'before' | 'after';
export type ButtonTag = 'button' | 'a';

export interface ButtonProps {
  as?: ButtonTag;
  appearance?: ButtonAppearance;
  shape?: ButtonShape;
  size?: ButtonSize;
  disabled?: boolean;
  disabledFocusable?: boolean;
  iconPosition?: ButtonIconPosition;
  href?: string;
}

export interface ButtonEmits {
  click: [event: MouseEvent];
}

export interface ButtonSlots {
  default?: () => unknown;
  /** Decorative content hidden from assistive technology. */
  icon?: () => unknown;
}

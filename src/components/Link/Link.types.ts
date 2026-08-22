export type LinkAppearance = 'default' | 'subtle';
export type LinkTag = 'a' | 'button' | 'span';

export interface LinkProps {
  as?: LinkTag;
  appearance?: LinkAppearance;
  disabled?: boolean;
  disabledFocusable?: boolean;
  href?: string;
  inline?: boolean;
}

export interface LinkEmits {
  click: [event: MouseEvent];
  keydown: [event: KeyboardEvent];
}

export interface LinkSlots {
  default?: () => unknown;
}

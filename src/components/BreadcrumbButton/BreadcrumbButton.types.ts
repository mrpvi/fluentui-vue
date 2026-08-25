export type BreadcrumbButtonElement = 'a' | 'button';
export type BreadcrumbButtonTabIndex = string | number;

export interface BreadcrumbButtonProps {
  as?: BreadcrumbButtonElement;
  current?: boolean;
  disabled?: boolean;
  disabledFocusable?: boolean;
  href?: string;
  type?: HTMLButtonElement['type'];
  role?: string;
  tabindex?: BreadcrumbButtonTabIndex;
  ariaCurrent?: string;
  ariaDisabled?: 'true' | 'false';
}

export interface BreadcrumbButtonEmits {
  click: [event: MouseEvent];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
}

export interface BreadcrumbButtonSlots {
  default?: () => unknown;
  icon?: () => unknown;
}

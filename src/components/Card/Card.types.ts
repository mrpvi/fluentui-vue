export type CardAppearance = 'filled' | 'filled-alternative' | 'outline' | 'subtle';
export type CardFocusMode = 'off' | 'no-tab' | 'tab-exit' | 'tab-only';
export type CardOrientation = 'horizontal' | 'vertical';
export type CardSize = 'small' | 'medium' | 'large';
export type CardElement = 'div' | 'article' | 'section' | 'button' | 'a';

export interface CardProps {
  /** Native root element. Selectable cards always use a div to preserve valid checkbox markup. */
  as?: CardElement;
  appearance?: CardAppearance;
  /** Defaults to no-tab for interactive cards and off otherwise. */
  focusMode?: CardFocusMode;
  orientation?: CardOrientation;
  size?: CardSize;
  /** Controlled selected state used by v-model. An explicitly bound undefined is controlled and unselected. */
  modelValue?: boolean;
  /** Initial selected state for uncontrolled usage. Providing this prop makes the card selectable. */
  defaultSelected?: boolean;
  disabled?: boolean;
}

export interface CardSelectionData {
  selected: boolean;
}

export interface CardEmits {
  'update:modelValue': [selected: boolean];
  selectionChange: [event: MouseEvent | KeyboardEvent | Event, data: CardSelectionData];
  click: [event: MouseEvent];
  keydown: [event: KeyboardEvent];
}

export interface CardSlots {
  default?: () => unknown;
  /** Floating selection control or action, rendered before the card content. */
  'floating-action'?: () => unknown;
}

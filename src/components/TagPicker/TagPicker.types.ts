import type { TagAppearance, TagSize } from '../Tag/Tag.types';

export type TagPickerAppearance = 'filled-darker' | 'filled-lighter' | 'outline' | 'underline';
export type TagPickerPositioning = 'above' | 'auto' | 'below';
export type TagPickerSize = 'extra-large' | 'large' | 'medium';

export interface TagPickerProps {
  appearance?: TagPickerAppearance;
  defaultOpen?: boolean;
  defaultSelectedOptions?: string[];
  disableAutoFocus?: boolean;
  disabled?: boolean;
  inlinePopup?: boolean;
  mountNode?: string | HTMLElement;
  noPopover?: boolean;
  open?: boolean;
  positioning?: TagPickerPositioning;
  selectedOptions?: string[];
  size?: TagPickerSize;
}

export interface TagPickerEmits {
  'update:open': [open: boolean];
  'update:selectedOptions': [values: string[]];
  openChange: [event: MouseEvent | KeyboardEvent | FocusEvent, data: { open: boolean }];
  optionSelect: [
    event: MouseEvent | KeyboardEvent,
    data: { selectedOptions: string[]; value: string },
  ];
}

export interface TagPickerInputProps {
  clearable?: boolean;
  disabled?: boolean;
  modelValue?: string;
  placeholder?: string;
}
export interface TagPickerInputEmits {
  'update:modelValue': [value: string];
  input: [event: InputEvent, data: { value: string }];
}
export interface TagPickerButtonProps {
  disabled?: boolean;
  placeholder?: string;
}
export interface TagPickerControlSlots {
  default?: () => unknown;
  'expand-icon'?: (props: { open: boolean }) => unknown;
  'secondary-action'?: () => unknown;
}
export interface TagPickerOptionProps {
  disabled?: boolean;
  text?: string;
  value: string;
}
export interface TagPickerOptionSlots {
  default?: () => unknown;
  media?: () => unknown;
  'secondary-content'?: () => unknown;
}
export interface TagPickerOptionGroupProps {
  label: string;
}
export interface TagPickerGroupProps {
  appearance?: TagAppearance;
  size?: TagSize;
}

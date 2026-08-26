export type ComboboxAppearance = 'filled-darker' | 'filled-lighter' | 'outline' | 'underline';
export type ComboboxSize = 'small' | 'medium' | 'large';
export type ComboboxPositioning = 'above' | 'auto' | 'below';

export interface ComboboxProps {
  modelValue?: string;
  defaultValue?: string;
  selectedOptions?: string[];
  defaultSelectedOptions?: string[];
  open?: boolean;
  defaultOpen?: boolean;
  appearance?: ComboboxAppearance;
  clearable?: boolean;
  disableAutoFocus?: boolean;
  disabled?: boolean;
  inlinePopup?: boolean;
  mountNode?: string | HTMLElement;
  multiselect?: boolean;
  placeholder?: string;
  positioning?: ComboboxPositioning;
  size?: ComboboxSize;
}

export interface ComboboxOpenChangeData {
  open: boolean;
}

export interface ComboboxOptionSelectData {
  optionText: string | undefined;
  optionValue: string | undefined;
  selectedOptions: string[];
}

export interface ComboboxOptionData {
  disabled: boolean;
  id: string;
  text: string;
  value: string;
}

export interface ComboboxActiveOptionChangeData {
  previousOption: ComboboxOptionData | null | undefined;
  nextOption: ComboboxOptionData | null | undefined;
}

export interface ComboboxEmits {
  'update:modelValue': [value: string];
  'update:selectedOptions': [selectedOptions: string[]];
  'update:open': [open: boolean];
  openChange: [event: MouseEvent | KeyboardEvent | FocusEvent, data: ComboboxOpenChangeData];
  optionSelect: [event: MouseEvent | KeyboardEvent, data: ComboboxOptionSelectData];
  activeOptionChange: [event: Event, data: ComboboxActiveOptionChangeData];
  input: [event: InputEvent, data: { value: string }];
}

export interface ComboboxSlots {
  default?: () => unknown;
  'expand-icon'?: (props: { open: boolean }) => unknown;
  'clear-button'?: () => unknown;
}

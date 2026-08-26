export type DropdownAppearance = 'filled-darker' | 'filled-lighter' | 'outline' | 'underline';
export type DropdownSize = 'small' | 'medium' | 'large';
export type DropdownPositioning = 'above' | 'auto' | 'below';

export interface DropdownProps {
  /** Controlled string displayed by the trigger. Explicitly binding undefined keeps it controlled and empty. */
  modelValue?: string;
  /** Initial displayed trigger string in uncontrolled usage. Read once during setup. */
  defaultValue?: string;
  /** Controlled selected option values. Explicitly binding undefined keeps selection controlled and empty. */
  selectedOptions?: string[];
  /** Initial option values selected in uncontrolled usage. Read once during setup. */
  defaultSelectedOptions?: string[];
  /** Controlled popup visibility. Explicitly binding undefined keeps it controlled and closed. */
  open?: boolean;
  /** Initial popup visibility in uncontrolled usage. Read once during setup. */
  defaultOpen?: boolean;
  appearance?: DropdownAppearance;
  clearable?: boolean;
  disableAutoFocus?: boolean;
  disabled?: boolean;
  /** Renders the popup beside the trigger rather than teleporting it to the document body. */
  inlinePopup?: boolean;
  /** Teleport target used when inlinePopup is false. */
  mountNode?: string | HTMLElement;
  multiselect?: boolean;
  placeholder?: string;
  positioning?: DropdownPositioning;
  size?: DropdownSize;
}

export interface DropdownOpenChangeData {
  open: boolean;
}

export interface DropdownOptionSelectData {
  optionText: string | undefined;
  optionValue: string | undefined;
  selectedOptions: string[];
}

export interface DropdownOptionData {
  disabled: boolean;
  id: string;
  text: string;
  value: string;
}

export interface DropdownActiveOptionChangeData {
  previousOption: DropdownOptionData | null | undefined;
  nextOption: DropdownOptionData | null | undefined;
}

export interface DropdownEmits {
  'update:modelValue': [value: string];
  'update:selectedOptions': [selectedOptions: string[]];
  'update:open': [open: boolean];
  openChange: [event: MouseEvent | KeyboardEvent | FocusEvent, data: DropdownOpenChangeData];
  optionSelect: [event: MouseEvent | KeyboardEvent, data: DropdownOptionSelectData];
  activeOptionChange: [event: Event, data: DropdownActiveOptionChangeData];
}

export interface DropdownSlots {
  /** FOption and FOptionGroup content rendered in the popup. */
  default?: () => unknown;
  /** Trigger content override. The native button and combobox semantics remain managed by FDropdown. */
  button?: (props: { open: boolean; placeholderVisible: boolean; value: string }) => unknown;
  /** Decorative dropdown indicator. */
  'expand-icon'?: (props: { open: boolean }) => unknown;
  /** Clear-button content. The native clear button and accessible name remain managed by FDropdown. */
  'clear-button'?: () => unknown;
}

export interface ListboxProps {
  /** Controlled selected option values. Explicitly binding undefined keeps the selection controlled and empty. */
  modelValue?: string[];
  /** Initial option values selected in uncontrolled usage. Read once during setup. */
  defaultSelectedOptions?: string[];
  /** Prevents automatic activation of the first or initially selected option after mount. */
  disableAutoFocus?: boolean;
  /** Enables released multiple-selection menu semantics and checkbox option indicators. */
  multiselect?: boolean;
}

export interface ListboxOptionSelectData {
  optionText: string | undefined;
  optionValue: string | undefined;
  selectedOptions: string[];
}

export interface ListboxEmits {
  'update:modelValue': [selectedOptions: string[]];
  optionSelect: [event: MouseEvent | KeyboardEvent, data: ListboxOptionSelectData];
}

export interface ListboxSlots {
  default?: () => unknown;
}

export interface OptionProps {
  /** Prevents selection while retaining active-descendant keyboard navigation. */
  disabled?: boolean;
  /** Display and typeahead text. Required when the default slot is not plain text. */
  text?: string;
  /** Unique selection value. Defaults to the text prop or rendered text content. */
  value?: string;
}

export interface OptionEmits {
  click: [event: MouseEvent];
}

export interface OptionSlots {
  default?: () => unknown;
  /** Decorative selected or checkbox indicator. */
  'check-icon'?: (props: { disabled: boolean; multiselect: boolean; selected: boolean }) => unknown;
}

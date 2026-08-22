import type { InputAppearance, InputSize } from '../Input';

export type SearchBoxAppearance = InputAppearance;
export type SearchBoxSize = InputSize;

export interface SearchBoxProps {
  modelValue?: string;
  defaultValue?: string;
  appearance?: SearchBoxAppearance;
  size?: SearchBoxSize;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface SearchBoxValueData {
  value: string;
}

export interface SearchBoxEmits {
  'update:modelValue': [value: string];
  input: [event: Event, data: SearchBoxValueData];
  change: [event: Event, data: SearchBoxValueData];
  search: [event: Event, data: SearchBoxValueData];
  clear: [event: MouseEvent | KeyboardEvent, data: SearchBoxValueData];
}

export interface SearchBoxSlots {
  /** Content before the text. The default is a decorative search icon. */
  'content-before'?: () => unknown;
  /** Content shown after the text while focus is within the SearchBox. */
  'content-after'?: () => unknown;
  /** Clear-button content. The default is a decorative dismiss icon. */
  dismiss?: () => unknown;
}

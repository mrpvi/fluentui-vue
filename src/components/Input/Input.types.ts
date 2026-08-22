export type InputAppearance =
  | 'outline'
  | 'underline'
  | 'filled-darker'
  | 'filled-lighter'
  | 'filled-darker-shadow'
  | 'filled-lighter-shadow';

export type InputSize = 'small' | 'medium' | 'large';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'month'
  | 'number'
  | 'time'
  | 'week';

export interface InputProps {
  modelValue?: string;
  defaultValue?: string;
  appearance?: InputAppearance;
  size?: InputSize;
  type?: InputType;
}

export interface InputValueData {
  value: string;
}

export interface InputEmits {
  'update:modelValue': [value: string];
  input: [event: Event, data: InputValueData];
  change: [event: Event, data: InputValueData];
}

export interface InputSlots {
  'content-before'?: () => unknown;
  'content-after'?: () => unknown;
}

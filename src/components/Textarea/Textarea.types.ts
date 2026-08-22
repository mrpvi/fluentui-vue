export type TextareaAppearance =
  | 'outline'
  | 'filled-darker'
  | 'filled-lighter'
  | 'filled-darker-shadow'
  | 'filled-lighter-shadow';

export type TextareaResize = 'none' | 'horizontal' | 'vertical' | 'both';
export type TextareaSize = 'small' | 'medium' | 'large';

export interface TextareaProps {
  modelValue?: string;
  defaultValue?: string;
  appearance?: TextareaAppearance;
  resize?: TextareaResize;
  size?: TextareaSize;
}

export interface TextareaValueData {
  value: string;
}

export interface TextareaEmits {
  'update:modelValue': [value: string];
  input: [event: Event, data: TextareaValueData];
  change: [event: Event, data: TextareaValueData];
}

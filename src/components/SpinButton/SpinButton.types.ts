export type SpinButtonAppearance = 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';
export type SpinButtonSize = 'small' | 'medium';
export type SpinButtonValue = number | null;

export interface SpinButtonProps {
  /** Controlled numeric value. Prop presence, including an explicit undefined, enables controlled mode. */
  modelValue?: SpinButtonValue;
  /** Initial uncontrolled value. Later updates are ignored. */
  defaultValue?: SpinButtonValue;
  /** Controlled string representation of modelValue. Ignored in uncontrolled mode. */
  displayValue?: string;
  min?: number;
  max?: number;
  step?: number;
  stepPage?: number;
  precision?: number;
  appearance?: SpinButtonAppearance;
  size?: SpinButtonSize;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface SpinButtonChangeData {
  /** Present for step, Page, Home, and End commits. */
  value?: SpinButtonValue;
  /** Present for direct text commits. */
  displayValue?: string;
}

export type SpinButtonChangeEvent = MouseEvent | Event | FocusEvent | KeyboardEvent;

export interface SpinButtonEmits {
  'update:modelValue': [value: SpinButtonValue];
  change: [event: SpinButtonChangeEvent, data: SpinButtonChangeData];
}

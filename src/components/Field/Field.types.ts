export type FieldOrientation = 'vertical' | 'horizontal';
export type FieldSize = 'small' | 'medium' | 'large';
export type FieldValidationState = 'none' | 'error' | 'warning' | 'success';

export interface FieldProps {
  label?: string;
  hint?: string;
  validationMessage?: string;
  validationState?: FieldValidationState;
  orientation?: FieldOrientation;
  required?: boolean;
  size?: FieldSize;
}

export interface FieldControlProps {
  id?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
  required?: boolean;
}

export interface FieldSlots {
  default?: (props: FieldControlProps) => unknown;
  label?: () => unknown;
  hint?: () => unknown;
  'validation-message'?: () => unknown;
  /** Decorative status icon hidden from assistive technology. */
  'validation-message-icon'?: (props: { validationState: FieldValidationState }) => unknown;
}

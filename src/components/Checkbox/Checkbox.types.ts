export type CheckboxValue = boolean | 'mixed';
export type CheckboxLabelPosition = 'before' | 'after';
export type CheckboxShape = 'square' | 'circular';
export type CheckboxSize = 'medium' | 'large';

export interface CheckboxProps {
  modelValue?: CheckboxValue;
  defaultChecked?: CheckboxValue;
  label?: string;
  labelPosition?: CheckboxLabelPosition;
  shape?: CheckboxShape;
  size?: CheckboxSize;
  disabled?: boolean;
}

export interface CheckboxValueData {
  checked: CheckboxValue;
}

export interface CheckboxEmits {
  'update:modelValue': [checked: CheckboxValue];
  change: [event: Event, data: CheckboxValueData];
}

export interface CheckboxSlots {
  label?: () => unknown;
  /** Decorative content hidden from assistive technology. */
  indicator?: (props: { checked: CheckboxValue }) => unknown;
}

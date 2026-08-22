export type SwitchLabelPosition = 'above' | 'after' | 'before';
export type SwitchSize = 'small' | 'medium';

export interface SwitchProps {
  modelValue?: boolean;
  defaultChecked?: boolean;
  label?: string;
  labelPosition?: SwitchLabelPosition;
  size?: SwitchSize;
  disabled?: boolean;
  disabledFocusable?: boolean;
}

export interface SwitchChangeData {
  checked: boolean;
}

export interface SwitchEmits {
  'update:modelValue': [checked: boolean];
  change: [event: Event, data: SwitchChangeData];
}

export interface SwitchSlots {
  label?: () => unknown;
  /** Decorative track and thumb content hidden from assistive technology. */
  indicator?: (props: { checked: boolean }) => unknown;
}

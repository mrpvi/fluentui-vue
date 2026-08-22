export type RadioGroupLayout = 'vertical' | 'horizontal' | 'horizontal-stacked';

export interface RadioGroupProps {
  modelValue?: string;
  defaultValue?: string;
  name?: string;
  layout?: RadioGroupLayout;
  disabled?: boolean;
  required?: boolean;
}

export interface RadioGroupValueData {
  value: string;
}

export interface RadioGroupEmits {
  'update:modelValue': [value: string];
  change: [event: Event, data: RadioGroupValueData];
}

export interface RadioGroupSlots {
  default?: () => unknown;
}

export type RadioLabelPosition = 'after' | 'below';

export interface RadioProps {
  /** The value submitted by the radio and selected by an enclosing RadioGroup. */
  value: string;
  /** Controlled selected state for a standalone radio. */
  modelValue?: boolean;
  /** Initial selected state for an uncontrolled standalone radio. */
  defaultChecked?: boolean;
  label?: string;
  labelPosition?: RadioLabelPosition;
  disabled?: boolean;
}

export interface RadioValueData {
  value: string;
}

export interface RadioEmits {
  'update:modelValue': [checked: boolean];
  change: [event: Event, data: RadioValueData];
}

export interface RadioSlots {
  label?: () => unknown;
  /** Decorative content hidden from assistive technology. */
  indicator?: (props: { checked: boolean }) => unknown;
}

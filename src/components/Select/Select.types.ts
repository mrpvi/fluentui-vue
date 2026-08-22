export type SelectAppearance = 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';

export type SelectSize = 'small' | 'medium' | 'large';

export interface SelectProps {
  modelValue?: string;
  defaultValue?: string;
  appearance?: SelectAppearance;
  size?: SelectSize;
}

export interface SelectValueData {
  value: string;
}

export interface SelectEmits {
  'update:modelValue': [value: string];
  change: [event: Event, data: SelectValueData];
}

export interface SelectSlots {
  /** Native option and optgroup content for the primary select control. */
  default?: () => unknown;
  /** Decorative indicator rendered aria-hidden and made noninteractive. */
  icon?: () => unknown;
}

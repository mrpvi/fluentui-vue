export type LabelSize = 'small' | 'medium' | 'large';
export type LabelWeight = 'regular' | 'semibold';

export interface LabelProps {
  disabled?: boolean;
  required?: string | boolean;
  size?: LabelSize;
  weight?: LabelWeight;
}

export interface LabelSlots {
  default?: () => unknown;
  /** Decorative required indicator hidden from assistive technology. */
  required?: () => unknown;
}

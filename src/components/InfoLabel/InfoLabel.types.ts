import type { LabelSize, LabelWeight } from '../Label';

export type InfoButtonSize = 'small' | 'medium' | 'large';

export interface InfoButtonProps {
  info?: string;
  size?: InfoButtonSize;
  inline?: boolean;
  mountNode?: string | HTMLElement;
  ariaLabel?: string;
}

export interface InfoButtonEmits {
  'update:open': [open: boolean];
  openChange: [event: Event, data: { open: boolean }];
}

export interface InfoButtonSlots {
  default?: () => unknown;
  info?: () => unknown;
}

export interface InfoLabelProps {
  info?: string;
  size?: LabelSize;
  weight?: LabelWeight;
  required?: string | boolean;
  disabled?: boolean;
  for?: string;
  inline?: boolean;
  mountNode?: string | HTMLElement;
}

export interface InfoLabelSlots {
  default?: () => unknown;
  info?: () => unknown;
  infoButton?: () => unknown;
  required?: () => unknown;
}

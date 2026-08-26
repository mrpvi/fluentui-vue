export type PopoverPositioning = 'above' | 'below' | 'before' | 'after' | 'auto';

export interface PopoverProps {
  defaultOpen?: boolean;
  modelValue?: boolean;
  inlinePopup?: boolean;
  mountNode?: string | HTMLElement;
  positioning?: PopoverPositioning;
  trapFocus?: boolean;
  dismissOnOutsideClick?: boolean;
}

export interface PopoverOpenChangeData {
  open: boolean;
  reason: 'click' | 'escape' | 'outside' | 'programmatic';
}

export interface PopoverEmits {
  'update:modelValue': [open: boolean];
  openChange: [event: Event, data: PopoverOpenChangeData];
}

export interface PopoverSlots {
  default?: () => unknown;
}

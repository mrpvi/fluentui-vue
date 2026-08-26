export type DialogModalType = 'modal' | 'non-modal' | 'alert';
export type DialogTriggerAction = 'open' | 'close';
export type DialogActionsPosition = 'start' | 'end';
export type DialogBackdropAppearance = 'dimmed' | 'transparent';

export interface DialogProps {
  defaultOpen?: boolean;
  modelValue?: boolean;
  open?: boolean;
  modalType?: DialogModalType;
  inertTrapFocus?: boolean;
  unmountOnClose?: boolean;
  mountNode?: string | HTMLElement;
}

export interface DialogOpenChangeData {
  open: boolean;
  type: 'escapeKeyDown' | 'backdropClick' | 'triggerClick' | 'programmatic';
  event: Event;
}

export interface DialogEmits {
  'update:modelValue': [open: boolean];
  'update:open': [open: boolean];
  openChange: [event: Event, data: DialogOpenChangeData];
}

export interface DialogSlots {
  default?: () => unknown;
}

export interface DialogTriggerProps {
  action?: DialogTriggerAction;
  as?: string;
}

export interface DialogTriggerSlots {
  default?: () => unknown;
}

export interface DialogSurfaceProps {
  as?: string;
  backdropAppearance?: DialogBackdropAppearance;
}

export interface DialogSurfaceSlots {
  default?: () => unknown;
  backdrop?: () => unknown;
}

export interface DialogBodyProps {
  as?: string;
}

export interface DialogBodySlots {
  default?: () => unknown;
}

export interface DialogContentProps {
  as?: string;
}

export interface DialogContentSlots {
  default?: () => unknown;
}

export interface DialogTitleProps {
  as?: string;
}

export interface DialogTitleSlots {
  default?: () => unknown;
  action?: () => unknown;
}

export interface DialogActionsProps {
  as?: string;
  position?: DialogActionsPosition;
  fluid?: boolean;
}

export interface DialogActionsSlots {
  default?: () => unknown;
}

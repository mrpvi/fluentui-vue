export type DrawerPosition = 'start' | 'end' | 'bottom';
export type DrawerSize = 'small' | 'medium' | 'large' | 'full';
export type DrawerType = 'overlay' | 'inline';
export type DrawerModalType = 'modal' | 'non-modal' | 'alert';
export type DrawerScrollState = 'none' | 'top' | 'middle' | 'bottom';

export interface DrawerBaseProps {
  position?: DrawerPosition;
  size?: DrawerSize;
  open?: boolean;
  modelValue?: boolean;
  defaultOpen?: boolean;
  unmountOnClose?: boolean;
}

export interface OverlayDrawerProps extends DrawerBaseProps {
  modalType?: DrawerModalType;
  inertTrapFocus?: boolean;
  mountNode?: string | HTMLElement;
}

export interface InlineDrawerProps extends DrawerBaseProps {
  separator?: boolean;
}

export interface DrawerProps extends DrawerBaseProps {
  type?: DrawerType;
  modalType?: DrawerModalType;
  inertTrapFocus?: boolean;
  mountNode?: string | HTMLElement;
  separator?: boolean;
}

export interface DrawerOpenChangeData {
  open: boolean;
  type: 'escapeKeyDown' | 'backdropClick' | 'programmatic';
  event: Event;
}

export interface DrawerEmits {
  'update:modelValue': [open: boolean];
  'update:open': [open: boolean];
  openChange: [event: Event, data: DrawerOpenChangeData];
}

export interface DrawerSlots {
  default?: () => unknown;
}

export interface DrawerHeaderProps {
  as?: string;
}
export interface DrawerHeaderSlots {
  default?: () => unknown;
}
export interface DrawerHeaderTitleProps {
  as?: string;
}
export interface DrawerHeaderTitleSlots {
  default?: () => unknown;
  action?: () => unknown;
}
export interface DrawerHeaderNavigationProps {
  as?: string;
}
export interface DrawerHeaderNavigationSlots {
  default?: () => unknown;
}
export interface DrawerBodyProps {
  as?: string;
}
export interface DrawerBodySlots {
  default?: () => unknown;
}
export interface DrawerFooterProps {
  as?: string;
}
export interface DrawerFooterSlots {
  default?: () => unknown;
}

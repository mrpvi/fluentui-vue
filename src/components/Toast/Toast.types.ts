import type { VNodeChild } from 'vue';
import type { AriaLivePoliteness } from '../AriaLiveAnnouncer';

export type ToastIntent = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition =
  'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
export type ToastId = string | number;
export type ToastStatus = 'queued' | 'visible' | 'dismissed' | 'unmounted';

export interface ToastOptions {
  toastId?: ToastId;
  intent?: ToastIntent;
  position?: ToastPosition;
  timeout?: number;
  pauseOnHover?: boolean;
  pauseOnWindowBlur?: boolean;
  politeness?: AriaLivePoliteness;
  priority?: number;
}

export interface ToastRecord extends Required<
  Pick<
    ToastOptions,
    'intent' | 'position' | 'timeout' | 'pauseOnHover' | 'pauseOnWindowBlur' | 'priority'
  >
> {
  toastId: ToastId;
  content: VNodeChild | (() => VNodeChild);
  politeness?: AriaLivePoliteness;
}

export interface ToasterProps {
  inline?: boolean;
  mountNode?: string | HTMLElement;
  position?: ToastPosition;
  timeout?: number;
  pauseOnHover?: boolean;
  pauseOnWindowBlur?: boolean;
  limit?: number;
}

export interface ToasterSlots {
  default?: () => unknown;
}

export interface ToastProps {
  intent?: ToastIntent;
  toastId?: ToastId;
  timeout?: number;
  pauseOnHover?: boolean;
  pauseOnWindowBlur?: boolean;
  politeness?: AriaLivePoliteness;
}

export interface ToastEmits {
  dismiss: [
    event: Event | undefined,
    data: { toastId?: ToastId; reason: 'timeout' | 'trigger' | 'escape' | 'programmatic' },
  ];
}

export interface ToastSlots {
  default?: () => unknown;
}

export interface ToastTriggerProps {
  as?: string;
}

export interface ToastTriggerSlots {
  default?: () => unknown;
}

export interface ToastPartProps {
  as?: string;
}

export interface ToastPartSlots {
  default?: () => unknown;
}

export interface ToastTitleSlots extends ToastPartSlots {
  media?: () => unknown;
  action?: () => unknown;
}

export interface ToastBodySlots extends ToastPartSlots {
  subtitle?: () => unknown;
}

export interface ToastController {
  dispatchToast: (content: VNodeChild | (() => VNodeChild), options?: ToastOptions) => ToastId;
  dismissToast: (toastId: ToastId) => void;
  dismissAllToasts: () => void;
  updateToast: (
    toastId: ToastId,
    content: VNodeChild | (() => VNodeChild),
    options?: ToastOptions,
  ) => void;
}

import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { DialogOpenChangeData, DialogProps } from './Dialog.types';

export interface DialogContextValue {
  open: ComputedRef<boolean>;
  modalType: ComputedRef<DialogProps['modalType']>;
  unmountOnClose: ComputedRef<boolean>;
  mountNode: ComputedRef<string | HTMLElement>;
  surfaceId: string;
  titleId: Ref<string | undefined>;
  surface: Ref<HTMLElement | null>;
  trigger: Ref<HTMLElement | null>;
  requestOpen: (next: boolean, event: Event, type: DialogOpenChangeData['type']) => void;
  registerSurface: (element: HTMLElement | null) => void;
  registerTrigger: (element: HTMLElement | null) => void;
}

export const dialogContextKey: InjectionKey<DialogContextValue> = Symbol('fui-dialog');

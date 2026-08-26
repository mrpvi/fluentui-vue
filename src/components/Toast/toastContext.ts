import type { InjectionKey, Ref } from 'vue';
import type { ToastController, ToastId, ToastIntent } from './Toast.types';

export interface ToastContextValue {
  intent: Ref<ToastIntent>;
  toastId: Ref<ToastId | undefined>;
  titleId: string;
  bodyId: string;
  hasTitle: Ref<boolean>;
  hasBody: Ref<boolean>;
  registerTitle: (present: boolean) => void;
  registerBody: (present: boolean) => void;
  dismiss: (event?: Event, reason?: 'timeout' | 'trigger' | 'escape' | 'programmatic') => void;
}

export const toastContextKey: InjectionKey<ToastContextValue> = Symbol('fui-toast');
export const toastControllerContextKey: InjectionKey<ToastController> = Symbol('fui-toaster');

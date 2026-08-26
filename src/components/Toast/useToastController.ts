import { inject } from 'vue';
import type { ToastController } from './Toast.types';
import { toastControllerContextKey } from './toastContext';

export function useToastController(): ToastController {
  const controller = inject(toastControllerContextKey, undefined);
  if (!controller) throw new Error('useToastController must be used within FToaster.');
  return controller;
}

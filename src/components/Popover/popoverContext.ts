import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { PopoverOpenChangeData } from './Popover.types';

export interface PopoverContextValue {
  open: ComputedRef<boolean>;
  surfaceId: string;
  triggerId: string;
  trapFocus: ComputedRef<boolean>;
  inlinePopup: ComputedRef<boolean>;
  mountNode: ComputedRef<string | HTMLElement>;
  surfaceStyle: Ref<Record<string, string>>;
  requestOpen: (next: boolean, event: Event, reason?: PopoverOpenChangeData['reason']) => void;
  registerTrigger: (element: HTMLElement | null) => void;
  registerSurface: (element: HTMLElement | null) => void;
  trigger: Ref<HTMLElement | null>;
  surface: Ref<HTMLElement | null>;
}

export const popoverContextKey: InjectionKey<PopoverContextValue> = Symbol('fui-popover');

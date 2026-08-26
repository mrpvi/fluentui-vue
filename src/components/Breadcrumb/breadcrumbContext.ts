import type { ComputedRef, InjectionKey } from 'vue';
import type { BreadcrumbFocusMode, BreadcrumbSize } from './Breadcrumb.types';

export interface BreadcrumbContextValue {
  focusMode: ComputedRef<BreadcrumbFocusMode>;
  size: ComputedRef<BreadcrumbSize>;
  registerControl: (element: HTMLElement, isNavigable: () => boolean) => () => void;
  currentControl: ComputedRef<HTMLElement | null>;
  controlVersion: ComputedRef<number>;
  notifyControlsChanged: () => void;
  rememberControl: (element: HTMLElement) => void;
  clearControl: (element: HTMLElement) => void;
  moveControlFocus: (element: HTMLElement, key: string) => void;
}

export const breadcrumbContextKey: InjectionKey<BreadcrumbContextValue> = Symbol('fui-breadcrumb');

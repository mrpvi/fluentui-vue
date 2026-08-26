import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type {
  DrawerModalType,
  DrawerOpenChangeData,
  DrawerPosition,
  DrawerSize,
  DrawerScrollState,
} from './Drawer.types';

export interface DrawerContextValue {
  open: ComputedRef<boolean>;
  position: ComputedRef<DrawerPosition>;
  size: ComputedRef<DrawerSize>;
  modalType: ComputedRef<DrawerModalType>;
  unmountOnClose: ComputedRef<boolean>;
  mountNode: ComputedRef<string | HTMLElement>;
  scrollState: Ref<DrawerScrollState>;
  titleId: Ref<string | undefined>;
  surface: Ref<HTMLElement | null>;
  requestOpen: (next: boolean, event: Event, type: DrawerOpenChangeData['type']) => void;
  registerSurface: (element: HTMLElement | null) => void;
  registerTitle: (id: string | undefined) => void;
}

export const drawerContextKey: InjectionKey<DrawerContextValue> = Symbol('fui-drawer');

import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { MenuOpenChangeData } from './Menu.types';

export interface MenuItemRecord {
  id: string;
  element: HTMLElement;
  disabled: boolean;
  text: string;
  activate: (event: MouseEvent | KeyboardEvent) => void;
}

export interface MenuContextValue {
  open: ComputedRef<boolean>;
  inline: ComputedRef<boolean>;
  positioning: ComputedRef<string>;
  mountNode: ComputedRef<string | HTMLElement>;
  surfaceStyle: Ref<Record<string, string>>;
  openOnHover: ComputedRef<boolean>;
  openOnContext: ComputedRef<boolean>;
  hoverDelay: ComputedRef<number>;
  closeOnScroll: ComputedRef<boolean>;
  persistOnItemClick: ComputedRef<boolean>;
  hasIcons: ComputedRef<boolean>;
  hasCheckmarks: ComputedRef<boolean>;
  trigger: Ref<HTMLElement | null>;
  popover: Ref<HTMLElement | null>;
  list: Ref<HTMLElement | null>;
  requestOpen: (next: boolean, event: Event, type: MenuOpenChangeData['type']) => void;
  registerTrigger: (element: HTMLElement | null) => void;
  registerPopover: (element: HTMLElement | null) => void;
  registerList: (element: HTMLElement | null) => void;
  registerItem: (item: MenuItemRecord) => () => void;
  items: Ref<MenuItemRecord[]>;
  activeItemId: Ref<string | undefined>;
  setActiveItem: (id: string | undefined, focus?: boolean) => void;
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: (current?: HTMLElement | null) => void;
  focusPrevious: (current?: HTMLElement | null) => void;
  focusByCharacter: (character: string) => void;
  checkedValues: ComputedRef<Record<string, string[]>>;
  toggleChecked: (event: Event, name: string, value: string, checked: boolean) => void;
  closeAfterItem: (event: Event, persist?: boolean) => void;
}

export const menuContextKey: InjectionKey<MenuContextValue> = Symbol('fui-menu');

export interface MenuListContextValue {
  checkedValues: ComputedRef<Record<string, string[]>>;
  toggleChecked: (event: Event, name: string, value: string, checked: boolean) => void;
}
export const menuListContextKey: InjectionKey<MenuListContextValue> = Symbol('fui-menu-list');

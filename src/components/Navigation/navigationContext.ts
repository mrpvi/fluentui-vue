import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { NavDensity, NavItemSelectData, NavItemValue } from './Navigation.types';
export interface NavItemRecord {
  value: string;
  element: HTMLElement;
  disabled: boolean;
  categoryValue?: string;
}
export interface NavContextValue {
  selectedValue: ComputedRef<string | undefined>;
  selectedCategoryValue: ComputedRef<string | undefined>;
  openCategories: ComputedRef<string[]>;
  density: ComputedRef<NavDensity>;
  multiple: ComputedRef<boolean>;
  tabbable: ComputedRef<boolean>;
  items: Ref<NavItemRecord[]>;
  registerItem: (item: NavItemRecord) => () => void;
  select: (event: Event, data: NavItemSelectData) => void;
  toggleCategory: (event: Event, value: NavItemValue) => void;
  focusMove: (current: HTMLElement, direction: 1 | -1 | 'first' | 'last') => void;
}
export const navContextKey: InjectionKey<NavContextValue> = Symbol('fui-nav');
export interface NavCategoryContextValue {
  value: string;
  open: ComputedRef<boolean>;
}
export const navCategoryContextKey: InjectionKey<NavCategoryContextValue> =
  Symbol('fui-nav-category');

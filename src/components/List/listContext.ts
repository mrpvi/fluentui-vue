import type { ComputedRef, InjectionKey } from 'vue';
import type { ListNavigationMode, ListValue } from './List.types';

export interface ListContextValue {
  navigationMode: ComputedRef<ListNavigationMode | undefined>;
  itemRole: ComputedRef<string>;
  selectable: ComputedRef<boolean>;
  isSelected: (value: ListValue) => boolean;
  requestToggle: (value: ListValue, event: Event) => void;
  registerItem: (element: HTMLElement, isNavigable: () => boolean) => () => void;
  moveItemFocus: (element: HTMLElement, key: string) => void;
  moveActionFocus: (element: HTMLElement, current: HTMLElement, direction: 1 | -1) => boolean;
  enterItem: (element: HTMLElement) => void;
  leaveItem: (element: HTMLElement) => void;
}

export const listContextKey: InjectionKey<ListContextValue> = Symbol('fui-list');

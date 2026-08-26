import type { ComputedRef, InjectionKey } from 'vue';
import type { TabListAppearance, TabListSize, TabValue } from './TabList.types';

export interface TabListContextValue {
  appearance: ComputedRef<TabListAppearance>;
  disabled: ComputedRef<boolean>;
  reserveSelectedTabSpace: ComputedRef<boolean>;
  selectedValue: ComputedRef<TabValue | undefined>;
  selectTabOnFocus: ComputedRef<boolean>;
  size: ComputedRef<TabListSize>;
  vertical: ComputedRef<boolean>;
  registerTab: (value: TabValue, element: HTMLButtonElement) => () => void;
  requestSelect: (value: TabValue, event: MouseEvent | FocusEvent | KeyboardEvent) => void;
  moveTabFocus: (element: HTMLButtonElement, key: string) => void;
}

export const tabListContextKey: InjectionKey<TabListContextValue> = Symbol('fui-tab-list');

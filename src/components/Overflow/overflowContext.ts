import type { InjectionKey } from 'vue';

export interface OverflowItemRecord {
  element: HTMLElement;
  groupId?: string;
  id: string;
  pinned: boolean;
  priority: number;
  type: 'divider' | 'item';
}

export interface OverflowContextValue {
  registerItem: (record: OverflowItemRecord) => () => void;
  updateOverflow: () => void;
}

export const overflowContextKey: InjectionKey<OverflowContextValue> = Symbol('fui-overflow');

import type { ComputedRef, InjectionKey } from 'vue';
import type { TableSize } from './Table.types';

export interface TableContextValue {
  size: ComputedRef<TableSize>;
  noNativeElements: ComputedRef<boolean>;
  sortable: ComputedRef<boolean>;
}

export const tableContextKey: InjectionKey<TableContextValue> = Symbol('fui-table');
export const tableHeaderContextKey: InjectionKey<ComputedRef<boolean>> = Symbol('fui-table-header');

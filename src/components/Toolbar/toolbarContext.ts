import type { ComputedRef, InjectionKey } from 'vue';
import type { ToolbarCheckedValues, ToolbarSize } from './Toolbar.types';

export interface ToolbarContextValue {
  size: ComputedRef<ToolbarSize>;
  vertical: ComputedRef<boolean>;
  checkedValues: ComputedRef<ToolbarCheckedValues>;
  toggle: (event: MouseEvent, name: string, value: string) => void;
  selectRadio: (event: MouseEvent, name: string, value: string) => void;
}

export const toolbarContextKey: InjectionKey<ToolbarContextValue> = Symbol('FToolbar');

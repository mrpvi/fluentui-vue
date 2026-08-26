import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type {
  TreeAppearance,
  TreeItemType,
  TreeItemValue,
  TreeNavigationMode,
  TreeSelectionMode,
  TreeSelectionValue,
  TreeSize,
} from './Tree.types';

export interface TreeItemRecord {
  element: HTMLElement;
  getDisabled: () => boolean;
  getItemType: () => TreeItemType;
  getLevel: () => number;
  getOpen: () => boolean;
  getParentValue: () => TreeItemValue | undefined;
  value: TreeItemValue;
}

export interface TreeContextValue {
  appearance: ComputedRef<TreeAppearance>;
  checkedItems: ComputedRef<Map<TreeItemValue, TreeSelectionValue>>;
  revision: Ref<number>;
  getVisibleItems: () => TreeItemRecord[];
  isOpen: (value: TreeItemValue) => boolean;
  navigationMode: ComputedRef<TreeNavigationMode>;
  registerItem: (record: TreeItemRecord) => () => void;
  requestChecked: (value: TreeItemValue, event: Event) => void;
  requestOpen: (
    value: TreeItemValue,
    event: MouseEvent | KeyboardEvent,
    type: 'click' | 'expandIconClick' | 'ArrowRight' | 'ArrowLeft',
  ) => void;
  selectionMode: ComputedRef<TreeSelectionMode | undefined>;
  size: ComputedRef<TreeSize>;
}

export const treeContextKey: InjectionKey<TreeContextValue> = Symbol('fui-tree');

export interface TreeLevelContextValue {
  level: ComputedRef<number>;
  parentValue: ComputedRef<TreeItemValue | undefined>;
}

export const treeLevelContextKey: InjectionKey<TreeLevelContextValue> = Symbol('fui-tree-level');
export const treeRootLevelContextKey: InjectionKey<TreeLevelContextValue> =
  Symbol('fui-tree-root-level');

export interface TreeItemContextValue {
  checked: ComputedRef<TreeSelectionValue>;
  itemType: ComputedRef<TreeItemType>;
  level: ComputedRef<number>;
  open: ComputedRef<boolean>;
  selectionMode: ComputedRef<TreeSelectionMode | undefined>;
  toggleChecked: (event: Event) => void;
  toggleOpen: (
    event: MouseEvent | KeyboardEvent,
    type: 'click' | 'expandIconClick' | 'ArrowRight' | 'ArrowLeft',
  ) => void;
  value: ComputedRef<TreeItemValue>;
}

export const treeItemContextKey: InjectionKey<TreeItemContextValue> = Symbol('fui-tree-item');

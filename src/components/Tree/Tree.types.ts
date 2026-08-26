export type TreeItemValue = string | number;
export type TreeItemType = 'leaf' | 'branch';
export type TreeAppearance = 'subtle' | 'subtle-alpha' | 'transparent';
export type TreeSize = 'small' | 'medium';
export type TreeNavigationMode = 'tree' | 'treegrid';
export type TreeSelectionMode = 'single' | 'multiselect';
export type TreeSelectionValue = boolean | 'mixed';
export type TreeOpenChangeType = 'click' | 'expandIconClick' | 'ArrowRight' | 'ArrowLeft';

export interface TreeOpenChangeData {
  open: boolean;
  openItems: TreeItemValue[];
  value: TreeItemValue;
  target: HTMLElement;
  type: TreeOpenChangeType;
}

export interface TreeCheckedChangeData {
  checked: TreeSelectionValue;
  checkedItems: Map<TreeItemValue, TreeSelectionValue>;
  selectionMode: TreeSelectionMode;
  target: HTMLElement;
  value: TreeItemValue;
}

export interface TreeProps {
  appearance?: TreeAppearance;
  checkedItems?: Iterable<TreeItemValue | [TreeItemValue, TreeSelectionValue]>;
  defaultCheckedItems?: Iterable<TreeItemValue | [TreeItemValue, TreeSelectionValue]>;
  defaultOpenItems?: Iterable<TreeItemValue>;
  navigationMode?: TreeNavigationMode;
  openItems?: Iterable<TreeItemValue>;
  selectionMode?: TreeSelectionMode;
  size?: TreeSize;
}

export interface TreeEmits {
  'update:openItems': [openItems: TreeItemValue[]];
  openChange: [event: MouseEvent | KeyboardEvent, data: TreeOpenChangeData];
  'update:checkedItems': [checkedItems: Map<TreeItemValue, TreeSelectionValue>];
  checkedChange: [event: Event, data: TreeCheckedChangeData];
}

export interface TreeSlots {
  default?: () => unknown;
}

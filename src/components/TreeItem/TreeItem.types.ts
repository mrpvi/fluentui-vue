import type { TreeItemType, TreeItemValue } from '../Tree';

export interface TreeItemProps {
  disabled?: boolean;
  itemType: TreeItemType;
  open?: boolean;
  parentValue?: TreeItemValue;
  value?: TreeItemValue;
}

export interface TreeItemEmits {
  openChange: [
    event: MouseEvent | KeyboardEvent,
    data: { open: boolean; value: TreeItemValue; target: HTMLElement },
  ];
}

export interface TreeItemSlots {
  default?: () => unknown;
}

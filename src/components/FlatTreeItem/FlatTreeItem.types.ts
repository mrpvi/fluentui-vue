import type { TreeItemProps } from '../TreeItem';
import type { TreeItemValue } from '../Tree';

export interface FlatTreeItemProps extends TreeItemProps {
  level: number;
  parentValue?: TreeItemValue;
  position: number;
  setSize: number;
  value: TreeItemValue;
}

import type { TreeProps, TreeItemValue } from '../Tree';

export type FlatTreeProps = TreeProps;

export interface FlatTreeItemMetadata {
  level: number;
  parentValue?: TreeItemValue;
  position?: number;
  setSize?: number;
}

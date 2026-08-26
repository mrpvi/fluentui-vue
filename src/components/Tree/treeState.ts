import type { TreeItemValue, TreeSelectionValue } from './Tree.types';

export function normalizeTreeValues(values?: Iterable<TreeItemValue>): TreeItemValue[] {
  return values ? Array.from(values) : [];
}

export function normalizeCheckedItems(
  values?: Iterable<TreeItemValue | [TreeItemValue, TreeSelectionValue]>,
): Map<TreeItemValue, TreeSelectionValue> {
  const result = new Map<TreeItemValue, TreeSelectionValue>();
  if (!values) {
    return result;
  }

  for (const entry of values) {
    if (Array.isArray(entry)) {
      result.set(entry[0], entry[1]);
    } else {
      result.set(entry, true);
    }
  }
  return result;
}

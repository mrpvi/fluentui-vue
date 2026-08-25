import type { AvatarGroupLayout } from '../AvatarGroup';

export interface PartitionAvatarGroupItemsOptions<T> {
  items: readonly T[];
  layout?: AvatarGroupLayout;
  maxInlineItems?: number;
}

export interface PartitionedAvatarGroupItems<T> {
  inlineItems: T[];
  overflowItems?: T[];
}

export function partitionAvatarGroupItems<T>({
  items,
  layout,
  maxInlineItems = 5,
}: PartitionAvatarGroupItemsOptions<T>): PartitionedAvatarGroupItems<T> {
  if (layout === 'pie') {
    return {
      inlineItems: items.slice(0, 3),
      overflowItems: items.length > 0 ? [...items] : undefined,
    };
  }

  const inlineCount = -(maxInlineItems - (items.length > maxInlineItems ? 1 : 0));
  const overflowItems = items.slice(0, inlineCount);

  return {
    inlineItems: items.slice(inlineCount),
    overflowItems: overflowItems.length > 0 ? overflowItems : undefined,
  };
}

export interface PartitionBreadcrumbItemsOptions<T> {
  items: readonly T[];
  maxDisplayedItems?: number;
  overflowIndex?: number;
}

export interface PartitionBreadcrumbItems<T> {
  startDisplayedItems: readonly T[];
  overflowItems?: readonly T[];
  endDisplayedItems?: readonly T[];
}

const defaultOverflowIndex = 1;
const defaultMaxDisplayedItems = 6;
const defaultNameLength = 30;
const defaultTooltipLength = 80;

export function partitionBreadcrumbItems<T>({
  items = [],
  maxDisplayedItems: requestedMaximum,
  overflowIndex: requestedOverflowIndex,
}: PartitionBreadcrumbItemsOptions<T>): PartitionBreadcrumbItems<T> {
  const itemCount = items.length;
  const maxDisplayedItems =
    requestedMaximum && requestedMaximum >= 0 ? requestedMaximum : defaultMaxDisplayedItems;
  let overflowIndex = requestedOverflowIndex ?? defaultOverflowIndex;
  let startDisplayedItems = items.slice(0, overflowIndex);
  let overflowItems: readonly T[] | undefined;
  let endDisplayedItems: readonly T[] | undefined;
  const itemsToHide = itemCount - maxDisplayedItems;

  if (itemsToHide > 0) {
    overflowIndex = overflowIndex >= maxDisplayedItems ? maxDisplayedItems - 1 : overflowIndex;
    const overflowEndIndex = overflowIndex + itemsToHide;
    startDisplayedItems = startDisplayedItems.slice(0, overflowIndex);
    overflowItems = items.slice(overflowIndex, overflowEndIndex);
    if (overflowEndIndex < itemCount) {
      endDisplayedItems = items.slice(overflowEndIndex);
    }
  } else if (overflowIndex < itemCount) {
    endDisplayedItems = items.slice(overflowIndex);
  }

  return { startDisplayedItems, overflowItems, endDisplayedItems };
}

export function isTruncatableBreadcrumbContent(content: string, maxLength: number) {
  return content.length > maxLength;
}

function truncateBreadcrumb(content: string, maxLength: number) {
  return isTruncatableBreadcrumbContent(content, maxLength)
    ? `${content.trim().slice(0, maxLength)}...`
    : content;
}

export function truncateBreadcrumbLongName(content: string, maxLength?: number) {
  return truncateBreadcrumb(content, maxLength || defaultNameLength);
}

export function truncateBreadcrumLongTooltip(content: string, maxLength?: number) {
  return truncateBreadcrumb(content, maxLength || defaultTooltipLength);
}

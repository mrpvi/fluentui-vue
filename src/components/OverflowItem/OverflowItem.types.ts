export interface OverflowItemProps {
  groupId?: string;
  id: string;
  pinned?: boolean;
  priority?: number;
}

export interface OverflowItemSlots {
  default?: () => unknown;
}

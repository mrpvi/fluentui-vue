export type AvatarGroupPopoverIndicator = 'count' | 'icon';

export interface AvatarGroupPopoverProps {
  count?: number;
  defaultOpen?: boolean;
  indicator?: AvatarGroupPopoverIndicator;
  modelValue?: boolean;
}

export interface AvatarGroupPopoverOpenChangeData {
  open: boolean;
}

export interface AvatarGroupPopoverEmits {
  'update:modelValue': [open: boolean];
  openChange: [event: Event, data: AvatarGroupPopoverOpenChangeData];
}

export interface AvatarGroupPopoverSlots {
  default?: () => unknown;
  trigger?: (props: { count: number; open: boolean }) => unknown;
  indicator?: (props: { count: number; open: boolean }) => unknown;
}

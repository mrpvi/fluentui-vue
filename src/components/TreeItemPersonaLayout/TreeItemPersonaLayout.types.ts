import type { AvatarProps } from '../Avatar';

export interface TreeItemPersonaLayoutProps {
  actionsVisible?: boolean;
  avatar?: AvatarProps;
  name?: string;
}

export interface TreeItemPersonaLayoutSlots {
  actions?: () => unknown;
  aside?: () => unknown;
  avatar?: () => unknown;
  default?: () => unknown;
  description?: () => unknown;
  expandIcon?: () => unknown;
  selector?: (props: { checked: boolean | 'mixed'; disabled: boolean }) => unknown;
}

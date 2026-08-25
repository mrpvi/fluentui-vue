import type { AvatarShape, AvatarSize } from '../Avatar';

export type AvatarGroupLayout = 'spread' | 'stack' | 'pie';

export interface AvatarGroupProps {
  layout?: AvatarGroupLayout;
  shape?: AvatarShape;
  size?: AvatarSize;
}

export interface AvatarGroupSlots {
  default?: () => unknown;
}

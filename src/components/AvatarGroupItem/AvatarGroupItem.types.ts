import type { AvatarActive, AvatarActiveAppearance, AvatarColor, AvatarShape } from '../Avatar';
import type { PresenceBadgeProps } from '../PresenceBadge';

export interface AvatarGroupItemProps {
  active?: AvatarActive;
  activeAppearance?: AvatarActiveAppearance;
  color?: AvatarColor;
  idForColor?: string;
  image?: string;
  name?: string;
  overflowLabel?: string;
  presence?: PresenceBadgeProps;
  shape?: AvatarShape;
}

export interface AvatarGroupItemSlots {
  avatar?: () => unknown;
  initials?: () => unknown;
  icon?: () => unknown;
  image?: () => unknown;
  badge?: () => unknown;
  'overflow-label'?: (props: { avatarName?: string }) => unknown;
}

import type { PresenceBadgeProps } from '../PresenceBadge';

export type AvatarActive = 'active' | 'inactive' | 'unset';
export type AvatarActiveAppearance = 'ring' | 'shadow' | 'ring-shadow';
export type AvatarShape = 'circular' | 'square';
export type AvatarSize = 16 | 20 | 24 | 28 | 32 | 36 | 40 | 48 | 56 | 64 | 72 | 96 | 120 | 128;

export type AvatarNamedColor =
  | 'dark-red'
  | 'cranberry'
  | 'red'
  | 'pumpkin'
  | 'peach'
  | 'marigold'
  | 'gold'
  | 'brass'
  | 'brown'
  | 'forest'
  | 'seafoam'
  | 'dark-green'
  | 'light-teal'
  | 'teal'
  | 'steel'
  | 'blue'
  | 'royal-blue'
  | 'cornflower'
  | 'navy'
  | 'lavender'
  | 'purple'
  | 'grape'
  | 'lilac'
  | 'pink'
  | 'magenta'
  | 'plum'
  | 'beige'
  | 'mink'
  | 'platinum'
  | 'anchor';

export type AvatarColor = 'neutral' | 'brand' | 'colorful' | AvatarNamedColor;

export interface AvatarProps {
  active?: AvatarActive;
  activeAppearance?: AvatarActiveAppearance;
  color?: AvatarColor;
  idForColor?: string;
  image?: string;
  name?: string;
  presence?: PresenceBadgeProps;
  shape?: AvatarShape;
  size?: AvatarSize;
}

export interface AvatarSlots {
  /** Custom initials. Supplying this slot takes precedence over generated initials. */
  initials?: () => unknown;
  /** Custom fallback icon shown when no image or initials are available. */
  icon?: () => unknown;
  /** Custom image content. The image must remain decorative. */
  image?: () => unknown;
  /** Presence content positioned over the avatar. */
  badge?: () => unknown;
}

import type { AvatarProps, AvatarSlots } from '../Avatar';
import type { PresenceBadgeProps, PresenceBadgeSlots } from '../PresenceBadge';

export type PersonaSize = 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge';

export type PersonaTextPosition = 'after' | 'before' | 'below';
export type PersonaTextAlignment = 'center' | 'start';

export interface PersonaProps {
  /** Props forwarded to the default Avatar. Its name, presence, and size default from Persona. */
  avatar?: AvatarProps;
  /** Name used by the default Avatar and as the default primary text. */
  name?: string;
  /** Presence rendered on the Avatar, or independently when presenceOnly is enabled. */
  presence?: PresenceBadgeProps;
  /** Replaces the Avatar with a standalone presence badge. */
  presenceOnly?: boolean;
  /** Controls Avatar or presence dimensions, typography, and media spacing. */
  size?: PersonaSize;
  /** Aligns the media to the start or center of the text block. */
  textAlignment?: PersonaTextAlignment;
  /** Places the media after, before, or below the text. */
  textPosition?: PersonaTextPosition;
}

export interface PersonaSlots {
  /** Custom Avatar content. */
  avatar?: () => unknown;
  /** Custom content for the Avatar initials. */
  avatarInitials?: AvatarSlots['initials'];
  /** Custom fallback content for the Avatar icon. */
  avatarIcon?: AvatarSlots['icon'];
  /** Custom image content for the Avatar. */
  avatarImage?: AvatarSlots['image'];
  /** Custom standalone presence content used in presence-only mode. */
  presence?: () => unknown;
  /** Custom icon content for the default standalone presence badge. */
  presenceIcon?: PresenceBadgeSlots['icon'];
  /** Primary text. Defaults to the name prop. */
  primaryText?: () => unknown;
  /** Secondary text. */
  secondaryText?: () => unknown;
  /** Tertiary text. */
  tertiaryText?: () => unknown;
  /** Quaternary text. */
  quaternaryText?: () => unknown;
}

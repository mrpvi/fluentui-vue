import type { BadgeSize } from '../Badge';

export type PresenceBadgeStatus =
  | 'busy'
  | 'out-of-office'
  | 'away'
  | 'available'
  | 'offline'
  | 'do-not-disturb'
  | 'unknown'
  | 'blocked';

export interface PresenceBadgeProps {
  /** Modifies the selected status to indicate that the user is out of office. */
  outOfOffice?: boolean;
  /** Controls the dimensions and fallback icon selected for the badge. */
  size?: BadgeSize;
  /** Current user presence status. */
  status?: PresenceBadgeStatus;
}

export interface PresenceBadgeSlots {
  /** Custom icon content that replaces the private Fluent fallback SVG. */
  icon?: () => unknown;
}

import type { BadgeIconPosition, BadgeSize } from '../Badge';

export type CounterBadgeAppearance = 'filled' | 'ghost';
export type CounterBadgeColor = 'brand' | 'danger' | 'important' | 'informative';
export type CounterBadgeShape = 'circular' | 'rounded';

export interface CounterBadgeProps {
  /** Controls whether the counter is filled or uses a transparent ghost appearance. */
  appearance?: CounterBadgeAppearance;
  /** Applies one of the supported counter semantic colors. */
  color?: CounterBadgeColor;
  /** Numeric value generated when the default slot is not supplied. */
  count?: number;
  /** Displays a 6px dot and suppresses the generated count. */
  dot?: boolean;
  /** Positions the icon before or after content. */
  iconPosition?: BadgeIconPosition;
  /** Highest count displayed before the value is formatted with a plus suffix. */
  overflowCount?: number;
  /** Controls the counter corner shape. */
  shape?: CounterBadgeShape;
  /** Shows a generated zero count. */
  showZero?: boolean;
  /** Controls the counter dimensions and typography. */
  size?: BadgeSize;
}

export interface CounterBadgeSlots {
  /** Custom content that takes precedence over the generated count. */
  default?: () => unknown;
  /** Optional icon content. Consumer icons are not automatically hidden from assistive technology. */
  icon?: () => unknown;
}

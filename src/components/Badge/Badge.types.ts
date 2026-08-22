export type BadgeAppearance = 'filled' | 'ghost' | 'outline' | 'tint';
export type BadgeColor =
  'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning';
export type BadgeIconPosition = 'before' | 'after';
export type BadgeShape = 'circular' | 'rounded' | 'square';
export type BadgeSize = 'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large';

export interface BadgeProps {
  /** Controls how the badge background, foreground, and border are emphasized. */
  appearance?: BadgeAppearance;
  /** Applies one of Fluent's semantic badge colors. */
  color?: BadgeColor;
  /** Positions the icon before or after the default content. */
  iconPosition?: BadgeIconPosition;
  /** Controls the badge corner shape. */
  shape?: BadgeShape;
  /** Controls the badge dimensions and typography. */
  size?: BadgeSize;
}

export interface BadgeSlots {
  /** Primary badge content. */
  default?: () => unknown;
  /** Optional icon content. Consumer icons are not automatically hidden from assistive technology. */
  icon?: () => unknown;
}

import type { RatingColor, RatingSize } from '../Rating/Rating.types';

export interface RatingDisplayProps {
  /** Color applied to the filled rating items. */
  color?: RatingColor;
  /** Renders one filled icon instead of the full scale. */
  compact?: boolean;
  /** Number of ratings represented by the value. */
  count?: number;
  /** Number of rating items. Must be a whole number greater than one. */
  max?: number;
  /** Size of rating items and adjacent text. */
  size?: RatingSize;
  /** Displayed rating value. */
  value?: number;
}

export interface RatingDisplaySlots {
  /** Decorative icon used by all rating items. */
  icon?: (props: { value: number; fill: number }) => unknown;
  /** Visible, non-interactive value text using the normalized display value. */
  'value-text'?: (props: { value: number }) => unknown;
  /** Visible, non-interactive formatted count text. */
  'count-text'?: (props: {
    count: number | undefined;
    formattedCount: string | undefined;
  }) => unknown;
}

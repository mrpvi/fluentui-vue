export type RatingColor = 'brand' | 'marigold' | 'neutral';
export type RatingSize = 'small' | 'medium' | 'large' | 'extra-large';
export type RatingStep = 0.5 | 1;

export interface RatingProps {
  /** The selected value. Explicitly binding `undefined` keeps the component controlled and empty. */
  modelValue?: number;
  /** Initial value for uncontrolled usage. Read once during setup. */
  defaultValue?: number;
  /** Color applied to selected rating items. */
  color?: RatingColor;
  /** Number of rating items. Must be a whole number greater than one. */
  max?: number;
  /** Shared name for the native radio inputs. */
  name?: string;
  /** Precision of selectable values. */
  step?: RatingStep;
  /** Size of each rating item. */
  size?: RatingSize;
  /** Generates the accessible name of each selectable radio. */
  itemLabel?: (value: number) => string;
  /** Prevents selection while retaining the current display. */
  readOnly?: boolean;
  /** Disables the native radio controls. */
  disabled?: boolean;
}

export interface RatingEmits {
  'update:modelValue': [value: number];
  change: [event: Event, data: { value: number }];
}

export interface RatingSlots {
  /** Replaces generated items. FRatingItem descendants consume the rating context. */
  default?: () => unknown;
  /** Decorative selected icon, scoped by item value. */
  'selected-icon'?: (props: { value: number; fill: number }) => unknown;
  /** Decorative unselected icon, scoped by item value. */
  'unselected-icon'?: (props: { value: number; fill: number }) => unknown;
}

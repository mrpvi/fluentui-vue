export interface RatingItemProps {
  /** Positive whole-number position represented by this item. */
  value?: number;
}

export interface RatingItemSlots {
  /** Decorative selected icon. */
  'selected-icon'?: (props: { value: number; fill: number }) => unknown;
  /** Decorative unselected icon. */
  'unselected-icon'?: (props: { value: number; fill: number }) => unknown;
}

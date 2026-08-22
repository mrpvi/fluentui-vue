export type SpinnerElement = 'div' | 'span';
export type SpinnerAppearance = 'primary' | 'inverted';
export type SpinnerLabelPosition = 'above' | 'below' | 'before' | 'after';
export type SpinnerSize =
  'extra-tiny' | 'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge';

export interface SpinnerProps {
  /** Native element rendered for the progressbar root. */
  as?: SpinnerElement;
  /** Controls the spinner and label colors. */
  appearance?: SpinnerAppearance;
  /** Time in milliseconds after client mount before the indicator and label are shown. */
  delay?: number;
  /** Optional visible label. The label slot takes precedence when both are provided. */
  label?: string;
  /** Positions the label relative to the indicator. */
  labelPosition?: SpinnerLabelPosition;
  /** Controls the indicator dimensions and label typography. */
  size?: SpinnerSize;
}

export interface SpinnerSlots {
  /** Optional visible label. Slot content takes precedence over the label prop. */
  label?: () => unknown;
  /** Decorative indicator content. The slot wrapper is always hidden from assistive technology. */
  indicator?: () => unknown;
}

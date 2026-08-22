export type ProgressBarColor = 'brand' | 'error' | 'warning' | 'success';
export type ProgressBarShape = 'rounded' | 'square';
export type ProgressBarThickness = 'medium' | 'large';

export interface ProgressBarProps {
  /**
   * A number between zero and `max` indicating task completion.
   * When omitted, the ProgressBar is indeterminate.
   */
  value?: number;
  /** The value at which the task is complete. Values less than or equal to zero normalize to one. */
  max?: number;
  /** The determinate bar color. Indeterminate bars remain brand-colored for Fluent parity. */
  color?: ProgressBarColor;
  /** The shape of the bar and track. */
  shape?: ProgressBarShape;
  /** The height of the bar and track. */
  thickness?: ProgressBarThickness;
  /** Whether the default indeterminate animation wrapper is rendered. */
  indeterminateMotion?: boolean;
}

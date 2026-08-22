export type CardFooterProps = object;

export interface CardFooterSlots {
  default?: () => unknown;
  /** Actions rendered at the far edge of the footer. */
  action?: () => unknown;
}

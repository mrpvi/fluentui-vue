export type CardHeaderProps = object;

export interface CardHeaderSlots {
  /** Element related to the card, such as an image or avatar. */
  image?: () => unknown;
  /** Main title content. */
  header?: () => unknown;
  /** Short description related to the title. */
  description?: () => unknown;
  /** Actions rendered at the far edge of the header. */
  action?: () => unknown;
}

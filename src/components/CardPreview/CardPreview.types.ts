export type CardPreviewProps = object;

export interface CardPreviewSlots {
  /** Preview content, typically an image. */
  default?: () => unknown;
  /** Logo positioned over the preview at the logical bottom-start corner. */
  logo?: () => unknown;
}

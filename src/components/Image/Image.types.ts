export type ImageFit = 'default' | 'none' | 'center' | 'contain' | 'cover';
export type ImageShape = 'square' | 'rounded' | 'circular';

export interface ImageProps {
  /** Makes the image take up the width of its container. */
  block?: boolean;
  /** Adds a rectangular border around the image. */
  bordered?: boolean;
  /** Controls how the image is resized and positioned within its bounds. */
  fit?: ImageFit;
  /** Adds an elevation shadow to the image. */
  shadow?: boolean;
  /** Controls the image corner shape. */
  shape?: ImageShape;
}

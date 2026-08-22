export type SkeletonElement = 'div' | 'span';
export type SkeletonAnimation = 'wave' | 'pulse';
export type SkeletonAppearance = 'opaque' | 'translucent';
export type SkeletonShape = 'circle' | 'square' | 'rectangle';
export type SkeletonSize =
  | 8
  | 12
  | 14
  | 16
  | 20
  | 22
  | 24
  | 28
  | 32
  | 36
  | 40
  | 48
  | 52
  | 56
  | 64
  | 72
  | 92
  | 96
  | 120
  | 128;

export interface SkeletonProps {
  /** Native element rendered for the skeleton group root. */
  as?: SkeletonElement;
  /** Animation inherited by nested skeletons and skeleton items. */
  animation?: SkeletonAnimation;
  /** Appearance inherited by nested skeletons and skeleton items. */
  appearance?: SkeletonAppearance;
  /** Optional size inherited by nested skeleton items. */
  size?: SkeletonSize;
  /** Optional shape inherited by nested skeleton items. */
  shape?: SkeletonShape;
  /**
   * Sets an inline width on the skeleton group root.
   * @deprecated Use class or style instead.
   */
  width?: string | number;
}

export interface SkeletonSlots {
  default?: () => unknown;
}

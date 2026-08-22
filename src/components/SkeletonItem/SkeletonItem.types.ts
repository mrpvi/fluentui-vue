import type {
  SkeletonAnimation,
  SkeletonAppearance,
  SkeletonElement,
  SkeletonShape,
  SkeletonSize,
} from '../Skeleton/Skeleton.types';

export type SkeletonItemElement = SkeletonElement;
export type SkeletonItemAnimation = SkeletonAnimation;
export type SkeletonItemAppearance = SkeletonAppearance;
export type SkeletonItemShape = SkeletonShape;
export type SkeletonItemSize = SkeletonSize;

export interface SkeletonItemProps {
  /** Native element rendered for the skeleton item root. */
  as?: SkeletonItemElement;
  /** Overrides the nearest skeleton animation. */
  animation?: SkeletonItemAnimation;
  /** Overrides the nearest skeleton appearance. */
  appearance?: SkeletonItemAppearance;
  /** Overrides the nearest skeleton size. */
  size?: SkeletonItemSize;
  /** Overrides the nearest skeleton shape. */
  shape?: SkeletonItemShape;
}

export interface SkeletonItemSlots {
  default?: () => unknown;
}

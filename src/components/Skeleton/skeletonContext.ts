import type { InjectionKey, Ref } from 'vue';
import type {
  SkeletonAnimation,
  SkeletonAppearance,
  SkeletonShape,
  SkeletonSize,
} from './Skeleton.types';

export interface SkeletonContextValue {
  readonly animation: Readonly<Ref<SkeletonAnimation>>;
  readonly appearance: Readonly<Ref<SkeletonAppearance>>;
  readonly size: Readonly<Ref<SkeletonSize | undefined>>;
  readonly shape: Readonly<Ref<SkeletonShape | undefined>>;
}

export const skeletonContextKey: InjectionKey<SkeletonContextValue> = Symbol('FSkeleton');

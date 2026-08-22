import type { ComputedRef, InjectionKey } from 'vue';
import type { RatingColor, RatingSize, RatingStep } from './Rating.types';

export interface RatingItemContextValue {
  color: ComputedRef<RatingColor>;
  size: ComputedRef<RatingSize>;
  step: ComputedRef<RatingStep>;
  value: ComputedRef<number>;
  previewValue: ComputedRef<number | undefined>;
  name: ComputedRef<string>;
  interactive: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
  readOnly: ComputedRef<boolean>;
  compact: ComputedRef<boolean>;
  itemLabel: ComputedRef<(value: number) => string>;
}

export const ratingItemContextKey: InjectionKey<RatingItemContextValue> = Symbol('FRatingItem');

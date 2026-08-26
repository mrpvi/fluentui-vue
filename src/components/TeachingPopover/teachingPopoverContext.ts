import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { TeachingPopoverOpenChangeData } from './TeachingPopover.types';
export interface TeachingPopoverContextValue {
  open: ComputedRef<boolean>;
  appearance: ComputedRef<'brand' | 'inverted'>;
  inlinePopup: ComputedRef<boolean>;
  mountNode: ComputedRef<string | HTMLElement>;
  surfaceId: string;
  triggerId: string;
  surfaceStyle: Ref<Record<string, string>>;
  trigger: Ref<HTMLElement | null>;
  surface: Ref<HTMLElement | null>;
  requestOpen: (
    next: boolean,
    event: Event,
    reason: TeachingPopoverOpenChangeData['reason'],
  ) => void;
  registerTrigger: (element: HTMLElement | null) => void;
  registerSurface: (element: HTMLElement | null) => void;
}
export const teachingPopoverContextKey: InjectionKey<TeachingPopoverContextValue> =
  Symbol('fui-teaching-popover');
export interface TeachingCarouselContextValue {
  value: ComputedRef<string | null>;
  values: Ref<string[]>;
  select: (value: string, event: Event) => void;
  move: (direction: 'prev' | 'next', event: Event) => void;
  register: (value: string) => () => void;
  finish: (event: Event) => void;
}
export const teachingCarouselContextKey: InjectionKey<TeachingCarouselContextValue> =
  Symbol('fui-teaching-carousel');
export interface TeachingCarouselNavContextValue {
  nextValue: () => string | undefined;
}
export const teachingCarouselNavContextKey: InjectionKey<TeachingCarouselNavContextValue> = Symbol(
  'fui-teaching-carousel-nav',
);

import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { CarouselAlign, CarouselAppearance, CarouselIndexChangeData } from './Carousel.types';

export interface CarouselCardRecord {
  id: string;
  element: HTMLElement;
}

export interface CarouselContextValue {
  activeIndex: ComputedRef<number>;
  align: ComputedRef<CarouselAlign>;
  appearance: ComputedRef<CarouselAppearance>;
  circular: ComputedRef<boolean>;
  motion: ComputedRef<'slide' | 'fade'>;
  total: ComputedRef<number>;
  playing: Ref<boolean>;
  groups: ComputedRef<number[][]>;
  viewport: Ref<HTMLElement | null>;
  slider: Ref<HTMLElement | null>;
  cards: Ref<CarouselCardRecord[]>;
  registerViewport: (element: HTMLElement | null) => void;
  registerSlider: (element: HTMLElement | null) => void;
  registerCard: (card: CarouselCardRecord) => () => void;
  select: (index: number, event: Event, reason: CarouselIndexChangeData['reason']) => void;
  move: (
    direction: 'prev' | 'next',
    event: Event,
    reason?: CarouselIndexChangeData['reason'],
  ) => void;
  setPlaying: (playing: boolean) => void;
}

export const carouselContextKey: InjectionKey<CarouselContextValue> = Symbol('fui-carousel');

export interface CarouselNavContextValue {
  registerButton: () => number;
}
export const carouselNavContextKey: InjectionKey<CarouselNavContextValue> =
  Symbol('fui-carousel-nav');

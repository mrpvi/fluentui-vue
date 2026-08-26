export type CarouselAppearance = 'flat' | 'elevated';
export type CarouselAlign = 'start' | 'center' | 'end';
export type CarouselNavLayout =
  'inline' | 'inline-wide' | 'overlay' | 'overlay-wide' | 'overlay-expanded';

export interface CarouselIndexChangeData {
  index: number;
  reason: 'next' | 'prev' | 'nav' | 'keyboard' | 'autoplay' | 'programmatic';
}

export interface CarouselProps {
  modelValue?: number;
  activeIndex?: number;
  defaultActiveIndex?: number;
  align?: CarouselAlign;
  appearance?: CarouselAppearance;
  circular?: boolean;
  groupSize?: number | 'auto';
  draggable?: boolean;
  whitespace?: boolean;
  motion?: 'slide' | 'fade';
  autoplayInterval?: number;
  announcement?: (index: number, totalSlides: number, groups: number[][]) => string;
  ariaLabel?: string;
}
export interface CarouselEmits {
  'update:modelValue': [index: number];
  'update:activeIndex': [index: number];
  activeIndexChange: [event: Event, data: CarouselIndexChangeData];
}
export interface CarouselSlots {
  default?: () => unknown;
}
export interface CarouselViewportProps {
  as?: string;
}
export interface CarouselViewportSlots {
  default?: () => unknown;
}
export interface CarouselSliderProps {
  as?: string;
  cardFocus?: boolean;
}
export interface CarouselSliderSlots {
  default?: () => unknown;
}
export interface CarouselCardProps {
  as?: string;
  autoSize?: boolean;
}
export interface CarouselCardSlots {
  default?: () => unknown;
}
export interface CarouselButtonProps {
  as?: string;
  navType?: 'prev' | 'next';
  disabled?: boolean;
  ariaLabel?: string;
}
export interface CarouselButtonSlots {
  default?: () => unknown;
  icon?: () => unknown;
}
export interface CarouselAutoplayButtonProps {
  as?: string;
  defaultPlaying?: boolean;
  ariaLabelPlay?: string;
  ariaLabelPause?: string;
}
export interface CarouselAutoplayButtonEmits {
  'update:playing': [playing: boolean];
  playingChange: [event: Event, playing: boolean];
}
export interface CarouselAutoplayButtonSlots {
  default?: (props: { playing: boolean }) => unknown;
  icon?: (props: { playing: boolean }) => unknown;
}
export interface CarouselNavProps {
  as?: string;
  appearance?: 'brand';
  ariaLabel?: string;
}
export interface CarouselNavSlots {
  default?: (props: { total: number; activeIndex: number }) => unknown;
}
export interface CarouselNavButtonProps {
  as?: string;
  index?: number;
  ariaLabel?: string;
}
export interface CarouselNavButtonSlots {
  default?: (props: { selected: boolean; index: number }) => unknown;
}
export interface CarouselNavImageButtonProps extends CarouselNavButtonProps {
  src: string;
  alt?: string;
}
export interface CarouselNavImageButtonSlots extends CarouselNavButtonSlots {
  image?: () => unknown;
}
export interface CarouselNavContainerProps {
  as?: string;
  layout?: CarouselNavLayout;
}
export interface CarouselNavContainerSlots {
  default?: () => unknown;
  prev?: () => unknown;
  next?: () => unknown;
  autoplay?: () => unknown;
  nav?: () => unknown;
}

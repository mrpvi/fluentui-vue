export interface TeachingPopoverOpenChangeData {
  open: boolean;
  reason: 'click' | 'escape' | 'outside' | 'dismiss' | 'programmatic';
}
export interface TeachingPopoverProps {
  modelValue?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  inlinePopup?: boolean;
  mountNode?: string | HTMLElement;
  positioning?: 'above' | 'below' | 'before' | 'after' | 'auto';
  trapFocus?: boolean;
  dismissOnOutsideClick?: boolean;
  appearance?: 'brand' | 'inverted';
}
export interface TeachingPopoverEmits {
  'update:modelValue': [open: boolean];
  'update:open': [open: boolean];
  openChange: [event: Event, data: TeachingPopoverOpenChangeData];
}
export interface TeachingPopoverSlots {
  default?: () => unknown;
}
export interface TeachingPopoverTriggerProps {
  as?: string;
}
export interface TeachingPopoverTriggerSlots {
  default?: () => unknown;
}
export interface TeachingPopoverSurfaceProps {
  as?: string;
  role?: string;
  ariaLabel?: string;
}
export interface TeachingPopoverSurfaceSlots {
  default?: () => unknown;
}
export interface TeachingPopoverHeaderProps {
  as?: string;
  dismissLabel?: string;
  hideDismiss?: boolean;
}
export interface TeachingPopoverHeaderSlots {
  default?: () => unknown;
  icon?: () => unknown;
  dismiss?: () => unknown;
}
export interface TeachingPopoverTitleProps {
  as?: string;
  dismissLabel?: string;
  showDismiss?: boolean;
}
export interface TeachingPopoverTitleSlots {
  default?: () => unknown;
  dismiss?: () => unknown;
}
export interface TeachingPopoverBodyProps {
  as?: string;
  mediaLength?: 'short' | 'medium' | 'tall';
}
export interface TeachingPopoverBodySlots {
  default?: () => unknown;
  media?: () => unknown;
}
export interface TeachingPopoverFooterProps {
  as?: string;
  footerLayout?: 'horizontal' | 'vertical';
  primaryText?: string;
  secondaryText?: string;
  dismissOnPrimary?: boolean;
  dismissOnSecondary?: boolean;
}
export interface TeachingPopoverFooterEmits {
  primaryClick: [event: MouseEvent];
  secondaryClick: [event: MouseEvent];
}
export interface TeachingPopoverFooterSlots {
  default?: () => unknown;
  primary?: () => unknown;
  secondary?: () => unknown;
}
export interface TeachingPopoverCarouselProps {
  modelValue?: string;
  defaultValue?: string;
  announcement?: (value: string) => string;
}
export interface TeachingPopoverCarouselEmits {
  'update:modelValue': [value: string];
  valueChange: [event: Event, value: string];
  finish: [event: Event, value: string];
}
export interface TeachingPopoverCarouselSlots {
  default?: () => unknown;
}
export interface TeachingPopoverCarouselCardProps {
  value: string;
  as?: string;
}
export interface TeachingPopoverCarouselCardSlots {
  default?: () => unknown;
}
export interface TeachingPopoverCarouselNavProps {
  as?: string;
  ariaLabel?: string;
}
export interface TeachingPopoverCarouselNavSlots {
  default?: (props: { values: string[]; value: string | null }) => unknown;
}
export interface TeachingPopoverCarouselNavButtonProps {
  value?: string;
  as?: string;
  ariaLabel?: string;
}
export interface TeachingPopoverCarouselNavButtonSlots {
  default?: (props: { selected: boolean }) => unknown;
}
export interface TeachingPopoverCarouselPageCountProps {
  as?: string;
}
export interface TeachingPopoverCarouselPageCountSlots {
  default?: (props: { currentPage: number; totalPages: number }) => unknown;
}
export interface TeachingPopoverCarouselFooterProps {
  as?: string;
  layout?: 'offset' | 'centered';
  initialStepText: string;
  finalStepText: string;
}
export interface TeachingPopoverCarouselFooterSlots {
  default?: () => unknown;
  previous?: (props: { disabled: boolean }) => unknown;
  next?: (props: { final: boolean }) => unknown;
}
export interface TeachingPopoverCarouselFooterButtonProps {
  as?: string;
  navType: 'prev' | 'next';
  altText: string;
}
export interface TeachingPopoverCarouselFooterButtonSlots {
  default?: (props: { final: boolean; disabled: boolean }) => unknown;
}

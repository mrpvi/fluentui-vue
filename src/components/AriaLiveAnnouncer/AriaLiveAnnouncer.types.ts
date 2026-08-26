export type AriaLivePoliteness = 'polite' | 'assertive';

export interface AriaLiveAnnouncementOptions {
  politeness?: AriaLivePoliteness;
}

export interface AriaLiveAnnouncerProps {
  messageDuration?: number;
}

export interface AriaLiveAnnouncerSlots {
  default?: () => unknown;
}

export interface AriaLiveAnnouncerExpose {
  announce: (message: string, options?: AriaLiveAnnouncementOptions) => void;
  clear: () => void;
}

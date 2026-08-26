import type { InjectionKey } from 'vue';
import type { AriaLiveAnnouncementOptions } from './AriaLiveAnnouncer.types';

export interface AriaLiveAnnouncerContextValue {
  announce: (message: string, options?: AriaLiveAnnouncementOptions) => void;
}

export const ariaLiveAnnouncerContextKey: InjectionKey<AriaLiveAnnouncerContextValue> =
  Symbol('fui-aria-live-announcer');

import type { InjectionKey, Ref } from 'vue';
import type { MessageBarLayout } from './MessageBar.types';

export interface MessageBarContextValue {
  layout: Ref<MessageBarLayout>;
  titleId: string;
  registerBody: (element: HTMLElement | null) => void;
  registerActions: (element: HTMLElement | null) => void;
}

export const messageBarContextKey: InjectionKey<MessageBarContextValue> = Symbol('fui-message-bar');

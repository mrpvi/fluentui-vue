export type MessageBarIntent = 'info' | 'success' | 'warning' | 'error';
export type MessageBarLayout = 'auto' | 'singleline' | 'multiline';
export type MessageBarShape = 'rounded' | 'square';
export type MessageBarPoliteness = 'polite' | 'assertive';

export interface MessageBarProps {
  intent?: MessageBarIntent;
  layout?: MessageBarLayout;
  politeness?: MessageBarPoliteness;
  shape?: MessageBarShape;
}

export interface MessageBarSlots {
  default?: () => unknown;
  icon?: () => unknown;
}

export interface MessageBarPartProps {
  as?: string;
}

export interface MessageBarPartSlots {
  default?: () => unknown;
}

export interface MessageBarActionsSlots extends MessageBarPartSlots {
  containerAction?: () => unknown;
}

export interface MessageBarGroupProps {
  animate?: 'exit-only' | 'both';
}

export interface MessageBarGroupSlots {
  default?: () => unknown;
}

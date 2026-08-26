export type TagAppearance = 'brand' | 'filled' | 'outline';
export type TagShape = 'circular' | 'rounded';
export type TagSize = 'extra-small' | 'medium' | 'small';
export type TagValue = string;

export interface TagProps {
  appearance?: TagAppearance;
  disabled?: boolean;
  dismissible?: boolean;
  selected?: boolean;
  shape?: TagShape;
  size?: TagSize;
  value?: TagValue;
}

export interface TagSlots {
  default?: () => unknown;
  media?: () => unknown;
  icon?: () => unknown;
  'secondary-text'?: () => unknown;
  'dismiss-icon'?: () => unknown;
}

export interface TagGroupProps {
  appearance?: TagAppearance;
  defaultSelectedValues?: TagValue[];
  disabled?: boolean;
  dismissible?: boolean;
  modelValue?: TagValue[];
  role?: 'listbox' | 'toolbar';
  size?: TagSize;
}

export interface TagGroupEmits {
  'update:modelValue': [values: TagValue[]];
  dismiss: [event: MouseEvent | KeyboardEvent, data: { value: TagValue }];
  tagSelect: [
    event: MouseEvent | KeyboardEvent,
    data: { value: TagValue; selectedValues: TagValue[] },
  ];
}

export interface InteractionTagProps {
  appearance?: TagAppearance;
  disabled?: boolean;
  selected?: boolean;
  shape?: TagShape;
  size?: TagSize;
  value?: TagValue;
}

export interface InteractionTagPrimaryProps {
  hasSecondaryAction?: boolean;
}

export interface InteractionTagPrimarySlots {
  default?: () => unknown;
  media?: () => unknown;
  icon?: () => unknown;
  'secondary-text'?: () => unknown;
}

export interface InteractionTagSecondarySlots {
  default?: () => unknown;
}

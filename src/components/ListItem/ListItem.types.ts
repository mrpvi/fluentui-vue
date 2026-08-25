import type { ListValue } from '../List/List.types';

export type ListItemElement = 'li' | 'div';

export interface ListItemProps {
  as?: ListItemElement;
  value?: ListValue;
  disabledSelection?: boolean;
  role?: string;
  tabindex?: string | number;
}

export interface ListItemActionData {
  value: ListValue;
}

export interface ListItemEmits {
  action: [event: CustomEvent, data: ListItemActionData];
  click: [event: MouseEvent];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
}

export interface ListItemSlots {
  default?: () => unknown;
  checkmark?: (props: { selected: boolean; disabled: boolean }) => unknown;
}

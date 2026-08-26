import type { TabValue } from '../TabList/TabList.types';

export interface TabProps {
  disabled?: boolean;
  value: TabValue;
}

export interface TabEmits {
  click: [event: MouseEvent];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
}

export interface TabSlots {
  default?: () => unknown;
  icon?: (props: { selected: boolean }) => unknown;
}

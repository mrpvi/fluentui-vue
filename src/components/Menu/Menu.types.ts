export type MenuOpenChangeType =
  | 'menuTriggerClick'
  | 'menuTriggerContextMenu'
  | 'menuTriggerKeyDown'
  | 'menuTriggerMouseEnter'
  | 'menuTriggerMouseLeave'
  | 'menuItemClick'
  | 'clickOutside'
  | 'scrollOutside'
  | 'menuPopoverKeyDown';

export interface MenuOpenChangeData {
  open: boolean;
  type: MenuOpenChangeType;
  event: Event;
  bubble?: boolean;
}

export interface MenuProps {
  modelValue?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  mountNode?: string | HTMLElement;
  inline?: boolean;
  positioning?: 'above' | 'below' | 'before' | 'after' | 'auto';
  hoverDelay?: number;
  openOnHover?: boolean;
  openOnContext?: boolean;
  closeOnScroll?: boolean;
  persistOnItemClick?: boolean;
  hasIcons?: boolean;
  hasCheckmarks?: boolean;
  checkedValues?: Record<string, string[]>;
  defaultCheckedValues?: Record<string, string[]>;
}

export interface MenuEmits {
  'update:modelValue': [open: boolean];
  'update:open': [open: boolean];
  openChange: [event: Event, data: MenuOpenChangeData];
  'update:checkedValues': [values: Record<string, string[]>];
  checkedValueChange: [event: Event, data: MenuCheckedValueChangeData];
}

export interface MenuCheckedValueChangeData {
  name: string;
  value: string;
  checked: boolean;
  checkedValues: Record<string, string[]>;
}

export interface MenuSlots {
  default?: () => unknown;
}
export interface MenuTriggerProps {
  as?: string;
  disableButtonEnhancement?: boolean;
}
export interface MenuTriggerSlots {
  default?: () => unknown;
}
export interface MenuPopoverProps {
  as?: string;
}
export interface MenuPopoverSlots {
  default?: () => unknown;
}
export interface MenuListProps {
  as?: string;
}
export interface MenuListSlots {
  default?: () => unknown;
}

export interface MenuItemProps {
  as?: string;
  disabled?: boolean;
  hasSubmenu?: boolean;
  persistOnClick?: boolean;
  text?: string;
  secondaryContent?: string;
  subText?: string;
}
export interface MenuItemSlots {
  default?: () => unknown;
  icon?: () => unknown;
  checkmark?: () => unknown;
  submenuIndicator?: () => unknown;
  secondaryContent?: () => unknown;
  subText?: () => unknown;
}

export interface MenuItemLinkProps extends MenuItemProps {
  href?: string;
  target?: string;
}
export type MenuItemLinkSlots = MenuItemSlots;
export interface MenuItemSelectableProps extends MenuItemProps {
  name: string;
  value: string;
  defaultChecked?: boolean;
  checked?: boolean;
  selectableRole?: 'menuitemcheckbox' | 'menuitemradio';
}
export type MenuItemCheckboxProps = MenuItemSelectableProps;
export type MenuItemRadioProps = MenuItemSelectableProps;
export type MenuItemSwitchProps = MenuItemSelectableProps;
export type MenuItemSelectableSlots = MenuItemSlots;
export interface MenuDividerProps {
  as?: string;
}
export interface MenuDividerSlots {
  default?: () => unknown;
}
export interface MenuGroupProps {
  as?: string;
}
export interface MenuGroupSlots {
  default?: () => unknown;
}
export interface MenuGroupHeaderProps {
  as?: string;
}
export interface MenuGroupHeaderSlots {
  default?: () => unknown;
}
export interface MenuSplitGroupProps {
  as?: string;
}
export interface MenuSplitGroupSlots {
  default?: () => unknown;
}

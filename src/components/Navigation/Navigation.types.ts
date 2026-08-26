import type { DrawerModalType, DrawerPosition, DrawerSize } from '../Drawer/Drawer.types';
export type NavDensity = 'small' | 'medium';
export type NavItemValue = string;
export interface NavItemSelectData {
  value: NavItemValue;
  categoryValue?: NavItemValue;
}
export interface NavProps {
  modelValue?: NavItemValue;
  selectedValue?: NavItemValue;
  defaultSelectedValue?: NavItemValue;
  selectedCategoryValue?: NavItemValue;
  openCategories?: NavItemValue[];
  defaultOpenCategories?: NavItemValue[];
  multiple?: boolean;
  density?: NavDensity;
  tabbable?: boolean;
  ariaLabel?: string;
}
export interface NavEmits {
  'update:modelValue': [value: NavItemValue];
  'update:selectedValue': [value: NavItemValue];
  'update:openCategories': [values: NavItemValue[]];
  navItemSelect: [event: Event, data: NavItemSelectData];
  navCategoryItemToggle: [event: Event, data: NavItemSelectData & { open: boolean }];
}
export interface NavSlots {
  default?: () => unknown;
}
export interface NavItemProps {
  as?: string;
  href?: string;
  value: NavItemValue;
  disabled?: boolean;
  target?: string;
}
export interface NavItemSlots {
  default?: () => unknown;
  icon?: () => unknown;
}
export type NavSubItemProps = NavItemProps;
export type NavSubItemSlots = NavItemSlots;
export interface NavCategoryProps {
  value: NavItemValue;
}
export interface NavCategorySlots {
  default?: () => unknown;
}
export interface NavCategoryItemProps {
  as?: string;
  disabled?: boolean;
}
export interface NavCategoryItemSlots {
  default?: () => unknown;
  icon?: () => unknown;
  expandIcon?: (props: { open: boolean }) => unknown;
}
export interface NavSubItemGroupProps {
  as?: string;
}
export interface NavSubItemGroupSlots {
  default?: () => unknown;
}
export interface NavSectionHeaderProps {
  as?: string;
}
export interface NavSectionHeaderSlots {
  default?: () => unknown;
}
export interface NavDividerProps {
  as?: string;
}
export interface NavDividerSlots {
  default?: () => unknown;
}
export interface NavDrawerProps extends NavProps {
  open?: boolean;
  defaultOpen?: boolean;
  type?: 'inline' | 'overlay';
  position?: DrawerPosition;
  size?: DrawerSize;
  modalType?: DrawerModalType;
  mountNode?: string | HTMLElement;
}
export interface NavDrawerEmits extends NavEmits {
  'update:open': [open: boolean];
  openChange: [event: Event, data: { open: boolean; type: string; event: Event }];
}
export interface NavDrawerSlots {
  default?: () => unknown;
}
export interface NavDrawerPartProps {
  as?: string;
}
export interface NavDrawerPartSlots {
  default?: () => unknown;
}
export interface HamburgerProps {
  as?: string;
  open?: boolean;
  ariaLabel?: string;
}
export interface HamburgerEmits {
  click: [event: MouseEvent];
}
export interface HamburgerSlots {
  default?: () => unknown;
}
export interface AppItemProps {
  as?: string;
  href?: string;
  target?: string;
}
export interface AppItemSlots {
  default?: () => unknown;
  icon?: () => unknown;
}
export interface AppItemStaticProps {
  as?: string;
}
export type AppItemStaticSlots = AppItemSlots;
export interface SplitNavItemProps {
  as?: string;
  value?: string;
  href?: string;
}
export interface SplitNavItemSlots {
  default?: () => unknown;
  icon?: () => unknown;
  action?: () => unknown;
}

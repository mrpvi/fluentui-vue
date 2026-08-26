export interface TreeItemLayoutProps {
  actionsVisible?: boolean;
}

export interface TreeItemLayoutSlots {
  default?: () => unknown;
  actions?: () => unknown;
  aside?: () => unknown;
  expandIcon?: () => unknown;
  iconAfter?: () => unknown;
  iconBefore?: () => unknown;
  selector?: (props: { checked: boolean | 'mixed'; disabled: boolean }) => unknown;
}

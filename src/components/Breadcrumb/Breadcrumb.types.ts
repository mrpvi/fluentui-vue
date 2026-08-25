export type BreadcrumbFocusMode = 'arrow' | 'tab';
export type BreadcrumbSize = 'small' | 'medium' | 'large';

export interface BreadcrumbProps {
  focusMode?: BreadcrumbFocusMode;
  size?: BreadcrumbSize;
}

export interface BreadcrumbSlots {
  default?: () => unknown;
}

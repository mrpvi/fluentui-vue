export type OverflowAxis = 'horizontal' | 'vertical';
export type OverflowDirection = 'start' | 'end';
export type OverflowGroupState = 'visible' | 'hidden' | 'partially-visible';

export interface OverflowState {
  groupVisibility: Record<string, OverflowGroupState>;
  hasOverflow: boolean;
  itemVisibility: Record<string, boolean>;
  overflowCount: number;
}

export interface OverflowProps {
  hasHiddenItems?: boolean;
  minimumVisible?: number;
  overflowAxis?: OverflowAxis;
  overflowDirection?: OverflowDirection;
  padding?: number;
}

export interface OverflowEmits {
  overflowChange: [state: OverflowState];
}

export interface OverflowSlots {
  default?: (state: OverflowState) => unknown;
}

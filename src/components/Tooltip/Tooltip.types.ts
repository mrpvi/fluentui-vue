export type TooltipAppearance = 'normal' | 'inverted';
export type TooltipPositioning = 'above' | 'below' | 'before' | 'after' | 'auto';
export type TooltipRelationship = 'label' | 'description' | 'inaccessible';

export interface TooltipProps {
  content?: string;
  appearance?: TooltipAppearance;
  hideDelay?: number;
  positioning?: TooltipPositioning;
  relationship?: TooltipRelationship;
  showDelay?: number;
  visible?: boolean;
  modelValue?: boolean;
  withArrow?: boolean;
  mountNode?: string | HTMLElement;
  inlinePopup?: boolean;
}

export interface TooltipVisibleChangeData {
  visible: boolean;
}

export interface TooltipEmits {
  'update:visible': [visible: boolean];
  'update:modelValue': [visible: boolean];
  visibleChange: [event: Event | undefined, data: TooltipVisibleChangeData];
}

export interface TooltipSlots {
  default?: () => unknown;
  content?: () => unknown;
}

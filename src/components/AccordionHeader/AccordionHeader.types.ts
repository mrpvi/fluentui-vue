export type AccordionHeaderSize = 'small' | 'medium' | 'large' | 'extra-large';
export type AccordionHeaderExpandIconPosition = 'start' | 'end';
export type AccordionHeaderElement = 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface AccordionHeaderProps {
  as?: AccordionHeaderElement;
  expandIconPosition?: AccordionHeaderExpandIconPosition;
  inline?: boolean;
  size?: AccordionHeaderSize;
}

export interface AccordionHeaderEmits {
  click: [event: MouseEvent];
}

export interface AccordionHeaderSlots {
  default?: () => unknown;
  /** Decorative expand icon. */
  'expand-icon'?: (props: { open: boolean }) => unknown;
  /** Leading content; it is not hidden from assistive technology. */
  icon?: () => unknown;
}

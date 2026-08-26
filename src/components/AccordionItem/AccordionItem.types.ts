import type { AccordionItemValue } from '../Accordion/Accordion.types';

export interface AccordionItemProps {
  value: AccordionItemValue;
  disabled?: boolean;
}

export interface AccordionItemSlots {
  default?: () => unknown;
}

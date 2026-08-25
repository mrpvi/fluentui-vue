import type { ComputedRef, InjectionKey } from 'vue';
import type { AccordionItemValue } from '../Accordion/Accordion.types';

export interface AccordionItemContextValue {
  value: AccordionItemValue;
  open: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
  headerId: ComputedRef<string>;
  panelId: ComputedRef<string>;
}

export const accordionItemContextKey: InjectionKey<AccordionItemContextValue> =
  Symbol('fui-accordion-item');

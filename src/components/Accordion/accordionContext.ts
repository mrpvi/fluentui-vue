import type { ComputedRef, InjectionKey } from 'vue';
import type { AccordionItemValue, AccordionNavigation } from './Accordion.types';

export interface AccordionContextValue {
  openItems: ComputedRef<AccordionItemValue[]>;
  collapsible: ComputedRef<boolean>;
  multiple: ComputedRef<boolean>;
  navigation: ComputedRef<AccordionNavigation | undefined>;
  requestToggle: (value: AccordionItemValue, event: MouseEvent | KeyboardEvent) => void;
  registerHeader: (element: HTMLButtonElement) => () => void;
  moveHeaderFocus: (element: HTMLButtonElement, direction: 1 | -1) => void;
}

export const accordionContextKey: InjectionKey<AccordionContextValue> = Symbol('fui-accordion');

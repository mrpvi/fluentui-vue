export type AccordionItemValue = string | number;
export type AccordionNavigation = 'linear' | 'circular';

export interface AccordionProps {
  /** Controlled list of open item values used by v-model. Explicit undefined is controlled and closes all items. */
  modelValue?: AccordionItemValue[];
  /** Initial open item values for uncontrolled usage. */
  defaultOpenItems?: AccordionItemValue | AccordionItemValue[];
  /** Allows the final open item to be collapsed. */
  collapsible?: boolean;
  /** Allows more than one item to be open. */
  multiple?: boolean;
  /** Deprecated upstream-compatible arrow navigation mode. Prefer normal Tab navigation. */
  navigation?: AccordionNavigation;
}

export interface AccordionToggleData {
  value: AccordionItemValue;
  openItems: AccordionItemValue[];
}

export interface AccordionEmits {
  'update:modelValue': [openItems: AccordionItemValue[]];
  toggle: [event: MouseEvent | KeyboardEvent, data: AccordionToggleData];
}

export interface AccordionSlots {
  default?: () => unknown;
}

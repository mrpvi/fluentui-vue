export interface OptionGroupProps {
  /** Static group label. The label slot takes precedence when both are provided. */
  label?: string;
}

export interface OptionGroupSlots {
  default?: () => unknown;
  /** Static label rendered before the group options. */
  label?: () => unknown;
}

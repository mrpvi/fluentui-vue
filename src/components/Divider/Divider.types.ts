export type DividerAlignContent = 'start' | 'center' | 'end';
export type DividerAppearance = 'brand' | 'default' | 'strong' | 'subtle';

export interface DividerProps {
  /** Alignment of content within the divider. */
  alignContent?: DividerAlignContent;
  /** Color emphasis applied to the divider line and content. */
  appearance?: DividerAppearance;
  /** Adds spacing at the beginning and end of the divider. */
  inset?: boolean;
  /** Renders a vertical divider instead of a horizontal divider. */
  vertical?: boolean;
}

export interface DividerSlots {
  /** Content that names the separator when present. */
  default?: () => unknown;
}

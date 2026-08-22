export type TextTag =
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'pre'
  | 'strong'
  | 'b'
  | 'em'
  | 'i';

export type TextAlign = 'start' | 'center' | 'end' | 'justify';
export type TextFont = 'base' | 'monospace' | 'numeric';
export type TextSize = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps {
  as?: TextTag;
  align?: TextAlign;
  block?: boolean;
  font?: TextFont;
  italic?: boolean;
  size?: TextSize;
  strikethrough?: boolean;
  truncate?: boolean;
  underline?: boolean;
  weight?: TextWeight;
  wrap?: boolean;
}

export interface TextSlots {
  default?: () => unknown;
}

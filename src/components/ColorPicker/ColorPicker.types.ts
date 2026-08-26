export interface HsvColor {
  h: number;
  s: number;
  v: number;
  a?: number;
}

export type ColorPickerShape = 'rounded' | 'square';
export type ColorSliderChannel = 'hue' | 'saturation' | 'value';

export interface ColorPickerProps {
  modelValue?: HsvColor;
  defaultValue?: HsvColor;
  shape?: ColorPickerShape;
}

export interface ColorPickerChangeData {
  color: HsvColor;
}

export interface ColorPickerEmits {
  'update:modelValue': [color: HsvColor];
  change: [event: Event, data: ColorPickerChangeData];
}

export interface ColorAreaProps {
  modelValue?: HsvColor;
  defaultValue?: HsvColor;
  disabled?: boolean;
  saturationLabel?: string;
  shape?: ColorPickerShape;
  valueLabel?: string;
}

export type ColorAreaEmits = ColorPickerEmits;

export interface ColorSliderProps {
  modelValue?: HsvColor;
  defaultValue?: HsvColor;
  channel?: ColorSliderChannel;
  disabled?: boolean;
  shape?: ColorPickerShape;
  vertical?: boolean;
}

export type ColorSliderEmits = ColorPickerEmits;

export interface AlphaSliderProps {
  modelValue?: HsvColor;
  defaultValue?: HsvColor;
  disabled?: boolean;
  shape?: ColorPickerShape;
  transparency?: boolean;
  vertical?: boolean;
}

export type AlphaSliderEmits = ColorPickerEmits;

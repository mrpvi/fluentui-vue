export type SwatchPickerLayout = 'row' | 'grid';
export type SwatchPickerSize = 'extra-small' | 'small' | 'medium' | 'large';
export type SwatchPickerShape = 'rounded' | 'square' | 'circular';
export type SwatchPickerSpacing = 'small' | 'medium';

export interface SwatchPickerProps {
  modelValue?: string;
  defaultValue?: string;
  layout?: SwatchPickerLayout;
  size?: SwatchPickerSize;
  shape?: SwatchPickerShape;
  spacing?: SwatchPickerSpacing;
}

export interface SwatchPickerSelectionData {
  selectedValue: string;
  selectedSwatch: string;
}

export interface SwatchPickerEmits {
  'update:modelValue': [value: string];
  selectionChange: [event: MouseEvent | KeyboardEvent, data: SwatchPickerSelectionData];
}

export interface ColorSwatchProps {
  borderColor?: string;
  color: string;
  disabled?: boolean;
  size?: SwatchPickerSize;
  shape?: SwatchPickerShape;
  value: string;
}

export interface ImageSwatchProps {
  disabled?: boolean;
  size?: SwatchPickerSize;
  shape?: SwatchPickerShape;
  src: string;
  value: string;
}

export interface EmptySwatchProps {
  disabled?: boolean;
  size?: SwatchPickerSize;
  shape?: SwatchPickerShape;
}

import type { InjectionKey, Ref } from 'vue';
import type { ColorPickerShape, HsvColor } from './ColorPicker.types';

export interface ColorPickerContextValue {
  color: Readonly<Ref<HsvColor>>;
  shape: Readonly<Ref<ColorPickerShape>>;
  requestChange: (event: Event, color: HsvColor) => void;
}

export const colorPickerContextKey: InjectionKey<ColorPickerContextValue> = Symbol('FColorPicker');

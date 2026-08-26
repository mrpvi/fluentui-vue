import type { InjectionKey, Ref } from 'vue';
import type {
  SwatchPickerLayout,
  SwatchPickerShape,
  SwatchPickerSize,
  SwatchPickerSpacing,
} from './SwatchPicker.types';

export interface SwatchRegistration {
  element: HTMLButtonElement;
  disabled: boolean;
  row: HTMLElement | null;
  selectedSwatch: string;
  value?: string;
}

export interface SwatchPickerContextValue {
  layout: Readonly<Ref<SwatchPickerLayout>>;
  selectedValue: Readonly<Ref<string>>;
  shape: Readonly<Ref<SwatchPickerShape>>;
  size: Readonly<Ref<SwatchPickerSize>>;
  spacing: Readonly<Ref<SwatchPickerSpacing>>;
  register: (registration: SwatchRegistration) => () => void;
  requestSelection: (
    event: MouseEvent | KeyboardEvent,
    data: { selectedValue: string; selectedSwatch: string },
  ) => void;
}

export const swatchPickerContextKey: InjectionKey<SwatchPickerContextValue> =
  Symbol('FSwatchPicker');

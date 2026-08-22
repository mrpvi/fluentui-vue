export type SliderSize = 'small' | 'medium';

export interface SliderProps {
  modelValue?: number;
  defaultValue?: number;
  disabled?: boolean;
  max?: number;
  min?: number;
  size?: SliderSize;
  step?: number;
  vertical?: boolean;
}

export interface SliderValueData {
  value: number;
}

export interface SliderEmits {
  'update:modelValue': [value: number];
  input: [event: Event, data: SliderValueData];
  change: [event: Event, data: SliderValueData];
}

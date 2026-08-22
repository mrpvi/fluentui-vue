import type { ComputedRef, InjectionKey } from 'vue';
import type { RadioGroupLayout } from './RadioGroup.types';

export interface RadioGroupContextValue {
  name: ComputedRef<string>;
  value: ComputedRef<string | undefined>;
  defaultValue: string | undefined;
  isControlled: boolean;
  disabled: ComputedRef<boolean>;
  required: ComputedRef<boolean>;
  layout: ComputedRef<RadioGroupLayout>;
  describedBy: ComputedRef<string | undefined>;
  invalid: ComputedRef<boolean>;
  select: (value: string) => void;
}

export const radioGroupContextKey: InjectionKey<RadioGroupContextValue> = Symbol('FRadioGroup');

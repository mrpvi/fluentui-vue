import type { ComputedRef, InjectionKey } from 'vue';
import type { FieldSize, FieldValidationState } from './Field.types';

export interface FieldContextValue {
  generatedControlId: string;
  labelFor: ComputedRef<string | undefined>;
  labelId: ComputedRef<string | undefined>;
  validationMessageId: ComputedRef<string | undefined>;
  hintId: ComputedRef<string | undefined>;
  required: ComputedRef<boolean>;
  size: ComputedRef<FieldSize>;
  validationState: ComputedRef<FieldValidationState>;
}

export const fieldContextKey: InjectionKey<FieldContextValue> = Symbol('FField');

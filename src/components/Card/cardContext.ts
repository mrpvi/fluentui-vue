import type { InjectionKey, Ref } from 'vue';

export interface CardContextValue {
  referenceId: Ref<string | undefined>;
  referenceLabel: Ref<string | undefined>;
  setReferenceId: (value: string | undefined) => void;
  setReferenceLabel: (value: string | undefined) => void;
}

export const cardContextKey: InjectionKey<CardContextValue> = Symbol('FCard');

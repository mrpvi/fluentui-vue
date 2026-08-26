import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type { TagAppearance, TagShape, TagSize, TagValue } from './Tag.types';

export interface TagGroupContext {
  appearance: ComputedRef<TagAppearance>;
  disabled: ComputedRef<boolean>;
  dismissible: ComputedRef<boolean>;
  role: ComputedRef<'listbox' | 'toolbar'>;
  selectedValues: ComputedRef<TagValue[]>;
  size: ComputedRef<TagSize>;
  dismissTag: (event: MouseEvent | KeyboardEvent, value: TagValue) => void;
  selectTag: (event: MouseEvent | KeyboardEvent, value: TagValue) => void;
}

export interface InteractionTagContext {
  appearance: ComputedRef<TagAppearance>;
  disabled: ComputedRef<boolean>;
  primaryId: string;
  selected: ComputedRef<boolean>;
  shape: ComputedRef<TagShape>;
  size: ComputedRef<TagSize>;
  value: ComputedRef<TagValue>;
  dismiss: (event: MouseEvent | KeyboardEvent) => void;
  select: (event: MouseEvent | KeyboardEvent) => void;
}

export const tagGroupContextKey: InjectionKey<TagGroupContext> = Symbol('fui-tag-group');
export const interactionTagContextKey: InjectionKey<InteractionTagContext> =
  Symbol('fui-interaction-tag');

export function getFocusableTags(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return [
    ...root.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex]:not([tabindex="-1"])'),
  ].filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

export function focusAdjacentTag(root: Ref<HTMLElement | null>, current: EventTarget | null) {
  const focusable = getFocusableTags(root.value);
  const index = current instanceof HTMLElement ? focusable.indexOf(current) : -1;
  const next = focusable[index + 1] ?? focusable[index - 1];
  next?.focus();
}

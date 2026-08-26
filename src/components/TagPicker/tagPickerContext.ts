import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type {
  OptionCollectionItem,
  OptionCollectionRegistration,
} from '../../composables/useOptionCollection';
import type { TagPickerAppearance, TagPickerPositioning, TagPickerSize } from './TagPicker.types';

export interface TagPickerContext {
  activeOptionId: Ref<string | undefined>;
  appearance: ComputedRef<TagPickerAppearance>;
  disabled: ComputedRef<boolean>;
  filterText: Ref<string>;
  inlinePopup: ComputedRef<boolean>;
  listboxId: string;
  mountNode: ComputedRef<string | HTMLElement>;
  noPopover: ComputedRef<boolean>;
  open: ComputedRef<boolean>;
  positioning: ComputedRef<TagPickerPositioning>;
  selectedOptions: ComputedRef<string[]>;
  size: ComputedRef<TagPickerSize>;
  trigger: Ref<HTMLInputElement | HTMLButtonElement | null>;
  control: Ref<HTMLElement | null>;
  popup: Ref<HTMLElement | null>;
  getOptionById: (id: string) => OptionCollectionItem | undefined;
  getOptions: () => OptionCollectionItem[];
  moveActiveOption: (action: 'first' | 'last' | 'next' | 'previous', scroll?: boolean) => void;
  registerOption: (registration: OptionCollectionRegistration) => () => void;
  requestOpen: (open: boolean, event: MouseEvent | KeyboardEvent | FocusEvent) => void;
  removeOption: (event: MouseEvent | KeyboardEvent, value: string) => void;
  selectOption: (event: MouseEvent | KeyboardEvent, option: OptionCollectionItem) => void;
  setActiveOption: (id: string | undefined, scroll?: boolean) => void;
  setFilterText: (value: string) => void;
}

export const tagPickerContextKey: InjectionKey<TagPickerContext> = Symbol('fui-tag-picker');

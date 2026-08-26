import type { ComputedRef, InjectionKey, Ref } from 'vue';
import type {
  OptionCollectionItem,
  OptionCollectionRegistration,
} from '../../composables/useOptionCollection';

export interface ListboxContextValue {
  activeOptionId: Ref<string | undefined>;
  filterText?: Ref<string>;
  focusVisible: Ref<boolean>;
  multiselect: ComputedRef<boolean>;
  selectedOptions: ComputedRef<string[]>;
  getOptionById: (id: string) => OptionCollectionItem | undefined;
  getOptionsMatchingText: (matcher: (text: string) => boolean) => OptionCollectionItem[];
  getOptionsMatchingValue: (matcher: (value: string) => boolean) => OptionCollectionItem[];
  registerOption: (registration: OptionCollectionRegistration) => () => void;
  selectOption: (event: MouseEvent | KeyboardEvent, option: OptionCollectionItem) => void;
  setActiveOption: (id: string | undefined, scroll?: boolean) => void;
}

export const listboxContextKey: InjectionKey<ListboxContextValue> = Symbol('fui-listbox');

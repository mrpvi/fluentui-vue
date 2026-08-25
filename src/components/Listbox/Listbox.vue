<script setup lang="ts">
import { computed, onMounted, provide, ref, useAttrs } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import {
  useOptionCollection,
  type OptionCollectionItem,
} from '../../composables/useOptionCollection';
import { listboxContextKey } from './listboxContext';
import type { ListboxEmits, ListboxProps, ListboxSlots } from './Listbox.types';

defineOptions({
  name: 'FListbox',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ListboxProps>(), {
  disableAutoFocus: false,
  multiselect: false,
});
const emit = defineEmits<ListboxEmits>();
defineSlots<ListboxSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const internalSelectedOptions = ref([...(props.defaultSelectedOptions ?? [])]);
const isControlled = useIsPropProvided('modelValue');
const selectedOptions = computed(() =>
  isControlled ? [...(props.modelValue ?? [])] : internalSelectedOptions.value,
);
const multiselect = computed(() => props.multiselect);
const focusVisible = ref(false);
const pointerFocus = ref(false);
const collection = useOptionCollection();
const activeOptionId = collection.activeOptionId;
const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, id: attrs.id as string | undefined }),
  { supportsRequired: false },
);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    tabindex: _tabindex,
    onBlur: _onBlur,
    onFocus: _onFocus,
    onKeydown: _onKeydown,
    onPointerdown: _onPointerdown,
    'aria-activedescendant': _ariaActiveDescendant,
    'aria-multiselectable': _ariaMultiselectable,
    ...rest
  } = fieldControlProps.value;
  return rest;
});

function selectOption(event: MouseEvent | KeyboardEvent, option: OptionCollectionItem) {
  if (option.disabled || event.defaultPrevented) {
    return;
  }

  const current = selectedOptions.value;
  let next = [option.value];

  if (props.multiselect) {
    const selectedIndex = current.indexOf(option.value);
    next =
      selectedIndex >= 0
        ? [...current.slice(0, selectedIndex), ...current.slice(selectedIndex + 1)]
        : [...current, option.value];
  }

  if (!isControlled) {
    internalSelectedOptions.value = next;
  }
  emit('update:modelValue', next);
  emit('optionSelect', event, {
    optionText: option.text,
    optionValue: option.value,
    selectedOptions: next,
  });
}

function invokeConsumerHandler(eventName: string, event: Event) {
  const handler = attrs[eventName];
  const handlers = Array.isArray(handler) ? handler : [handler];

  for (const current of handlers) {
    if (typeof current === 'function') {
      current(event);
    }
  }
}

function handleKeydown(event: KeyboardEvent) {
  invokeConsumerHandler('onKeydown', event);
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  let action: 'first' | 'last' | 'next' | 'previous' | undefined;
  if (event.key === 'ArrowDown') {
    action = 'next';
  } else if (event.key === 'ArrowUp') {
    action = 'previous';
  } else if (event.key === 'Home' || event.key === 'PageUp') {
    action = 'first';
  } else if (event.key === 'End' || event.key === 'PageDown') {
    action = 'last';
  }

  if (action) {
    event.preventDefault();
    focusVisible.value = true;
    collection.moveActiveOption(action);
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    const activeOption = collection.activeOptionId.value
      ? collection.getOptionById(collection.activeOptionId.value)
      : undefined;
    if (activeOption) {
      selectOption(event, activeOption);
      event.preventDefault();
    }
  }
}

function handlePointerdown(event: PointerEvent) {
  invokeConsumerHandler('onPointerdown', event);
  if (event.defaultPrevented) {
    return;
  }

  pointerFocus.value = true;
  focusVisible.value = false;
}

function handleFocus(event: FocusEvent) {
  invokeConsumerHandler('onFocus', event);
  if (event.defaultPrevented) {
    return;
  }

  focusVisible.value = !pointerFocus.value;
  pointerFocus.value = false;

  if (focusVisible.value && collection.activeOptionId.value) {
    collection.setActiveOption(collection.activeOptionId.value, true);
  }
}

function handleBlur(event: FocusEvent) {
  invokeConsumerHandler('onBlur', event);
  if (event.defaultPrevented) {
    return;
  }

  focusVisible.value = false;
  pointerFocus.value = false;
}

provide(listboxContextKey, {
  activeOptionId: collection.activeOptionId,
  focusVisible,
  multiselect,
  selectedOptions,
  getOptionById: collection.getOptionById,
  getOptionsMatchingText: collection.getOptionsMatchingText,
  getOptionsMatchingValue: collection.getOptionsMatchingValue,
  registerOption: collection.registerOption,
  selectOption,
  setActiveOption: collection.setActiveOption,
});

onMounted(() => {
  if (props.disableAutoFocus) {
    return;
  }

  if (!props.multiselect && selectedOptions.value.length > 0) {
    const selected = collection
      .getOptionsMatchingValue((value) => value === selectedOptions.value[0])
      .at(-1);
    if (selected) {
      collection.setActiveOption(selected.id);
      return;
    }
  }

  collection.moveActiveOption('first', false);
});

defineExpose({
  activeOptionId: collection.activeOptionId,
  element: root,
  focus: () => root.value?.focus(),
  selectedOptions,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="['fui-Listbox', { 'fui-Listbox--multiselect': multiselect }, attrs.class]"
    :style="attrs.style"
    :role="multiselect ? 'menu' : 'listbox'"
    tabindex="0"
    :aria-activedescendant="activeOptionId"
    @blur="handleBlur"
    @focus="handleFocus"
    @keydown="handleKeydown"
    @pointerdown="handlePointerdown"
  >
    <slot />
  </div>
</template>

<style>
@import './listbox.css';
</style>

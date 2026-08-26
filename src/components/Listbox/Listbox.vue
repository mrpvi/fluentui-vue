<script setup lang="ts">
import { computed, inject, onMounted, provide, ref, useAttrs } from 'vue';
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
const parentListbox = inject(listboxContextKey, undefined);
const root = ref<HTMLDivElement | null>(null);
const internalSelectedOptions = ref([...(props.defaultSelectedOptions ?? [])]);
const isControlled = useIsPropProvided('modelValue');
const localSelectedOptions = computed(() =>
  isControlled ? [...(props.modelValue ?? [])] : internalSelectedOptions.value,
);
const localMultiselect = computed(() => props.multiselect);
const localFocusVisible = ref(false);
const pointerFocus = ref(false);
const collection = useOptionCollection();
const managedContext = computed(() => (props.popup ? parentListbox : undefined));
const selectedOptions = computed(
  () => managedContext.value?.selectedOptions.value ?? localSelectedOptions.value,
);
const multiselect = computed(
  () => managedContext.value?.multiselect.value ?? localMultiselect.value,
);
const focusVisible = computed({
  get: () => managedContext.value?.focusVisible.value ?? localFocusVisible.value,
  set: (value: boolean) => {
    if (managedContext.value) {
      managedContext.value.focusVisible.value = value;
    } else {
      localFocusVisible.value = value;
    }
  },
});
const activeOptionId = computed(
  () => managedContext.value?.activeOptionId.value ?? collection.activeOptionId.value,
);
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
  if (managedContext.value) {
    managedContext.value.selectOption(event, option);
    return;
  }

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
    if (managedContext.value) {
      const options = collection.getOptions();
      const currentIndex = options.findIndex((option) => option.id === activeOptionId.value);
      const nextIndex =
        action === 'first'
          ? 0
          : action === 'last'
            ? options.length - 1
            : currentIndex < 0
              ? 0
              : action === 'next'
                ? Math.min(currentIndex + 1, options.length - 1)
                : Math.max(currentIndex - 1, 0);
      managedContext.value.setActiveOption(options[nextIndex]?.id, true);
    } else {
      collection.moveActiveOption(action);
    }
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    const activeOption = activeOptionId.value
      ? collection.getOptionById(activeOptionId.value)
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

  if (focusVisible.value && activeOptionId.value) {
    (
      managedContext.value ?? {
        setActiveOption: collection.setActiveOption,
      }
    ).setActiveOption(activeOptionId.value, true);
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
  activeOptionId: managedContext.value?.activeOptionId ?? collection.activeOptionId,
  focusVisible,
  multiselect,
  selectedOptions,
  getOptionById: managedContext.value?.getOptionById ?? collection.getOptionById,
  getOptionsMatchingText:
    managedContext.value?.getOptionsMatchingText ?? collection.getOptionsMatchingText,
  getOptionsMatchingValue:
    managedContext.value?.getOptionsMatchingValue ?? collection.getOptionsMatchingValue,
  registerOption: managedContext.value?.registerOption ?? collection.registerOption,
  selectOption,
  setActiveOption: managedContext.value?.setActiveOption ?? collection.setActiveOption,
});

onMounted(() => {
  if (props.popup) {
    return;
  }

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
    :tabindex="popup ? undefined : 0"
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

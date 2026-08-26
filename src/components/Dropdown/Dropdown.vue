<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  Teleport,
  useAttrs,
  useId,
  watch,
  watchEffect,
} from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import {
  useOptionCollection,
  type OptionCollectionItem,
} from '../../composables/useOptionCollection';
import FListbox from '../Listbox/Listbox.vue';
import { listboxContextKey } from '../Listbox/listboxContext';
import type {
  DropdownEmits,
  DropdownOptionData,
  DropdownProps,
  DropdownSize,
  DropdownSlots,
} from './Dropdown.types';

function toDropdownOptionData(
  option: OptionCollectionItem | undefined,
): DropdownOptionData | undefined {
  return option
    ? {
        disabled: option.disabled,
        id: option.id,
        text: option.text,
        value: option.value,
      }
    : undefined;
}

defineOptions({
  name: 'FDropdown',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DropdownProps>(), {
  appearance: 'outline',
  clearable: false,
  defaultOpen: false,
  disableAutoFocus: false,
  disabled: false,
  inlinePopup: false,
  multiselect: false,
  positioning: 'auto',
  size: 'medium',
});
const emit = defineEmits<DropdownEmits>();
defineSlots<DropdownSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const popup = ref<{ element?: HTMLElement | null } | null>(null);
const collection = useOptionCollection();
const listboxId = `fui-dropdown-listbox-${useId()}`;
const internalOpen = ref(props.defaultOpen);
const internalSelectedOptions = ref([...(props.defaultSelectedOptions ?? [])]);
const internalValue = ref<string | undefined>();
const defaultValue = props.defaultValue;
const focusVisible = ref(false);
const hasFocus = ref(false);
const pointerFocus = ref(false);
const popupStyle = ref<Record<string, string>>({});
const typeahead = ref('');
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;
let resizeObserver: ResizeObserver | undefined;
let pendingOpenEvent: MouseEvent | KeyboardEvent | FocusEvent | undefined;
let pendingTypeahead = false;
const isOpenControlled = useIsPropProvided('open');
const isSelectionControlled = useIsPropProvided('selectedOptions');
const isValueControlled = useIsPropProvided('modelValue');
const isSizeProvided = useIsPropProvided('size');
const open = computed(() => (isOpenControlled ? Boolean(props.open) : internalOpen.value));
const selectedOptions = computed(() =>
  isSelectionControlled ? [...(props.selectedOptions ?? [])] : internalSelectedOptions.value,
);
const multiselect = computed(() => props.multiselect);
const fieldControlProps = useFieldControlProps(
  () => ({
    ...attrs,
    id: attrs.id as string | undefined,
    ...(isSizeProvided ? { size: props.size } : {}),
    disabled: props.disabled || Boolean(attrs.disabled),
  }),
  {
    supportsLabelFor: false,
    supportsRequired: false,
    supportsSize: true,
  },
);
const effectiveSize = computed(
  () => (fieldControlProps.value.size as DropdownSize | undefined) ?? props.size,
);
const disabled = computed(() => Boolean(fieldControlProps.value.disabled));
const selectedTextByValue = new Map<string, string>();
const selectedText = computed(() => {
  const options = collection.getOptions();
  for (const option of options) {
    selectedTextByValue.set(option.value, option.text);
  }
  const texts = selectedOptions.value
    .map((value) => selectedTextByValue.get(value))
    .filter((text): text is string => text !== undefined);
  return props.multiselect ? texts.join(', ') : (texts[0] ?? '');
});
const displayedValue = computed(() => {
  if (isValueControlled) {
    return props.modelValue ?? '';
  }
  return internalValue.value ?? (selectedText.value || defaultValue || '');
});
const placeholderVisible = computed(
  () => displayedValue.value.length === 0 && Boolean(props.placeholder),
);
const showClearButton = computed(
  () =>
    props.clearable && !props.multiselect && !disabled.value && selectedOptions.value.length > 0,
);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    size: _size,
    disabled: _disabled,
    onBlur: _onBlur,
    onClick: _onClick,
    onFocus: _onFocus,
    onKeydown: _onKeydown,
    onPointerdown: _onPointerdown,
    'aria-activedescendant': _ariaActiveDescendant,
    'aria-controls': _ariaControls,
    'aria-expanded': _ariaExpanded,
    'aria-haspopup': _ariaHasPopup,
    'aria-owns': _ariaOwns,
    ...rest
  } = fieldControlProps.value;
  return rest;
});
const rootClasses = computed(() => [
  'fui-Dropdown',
  `fui-Dropdown--${props.appearance}`,
  `fui-Dropdown--${effectiveSize.value}`,
  {
    'fui-Dropdown--disabled': disabled.value,
    'fui-Dropdown--invalid':
      fieldControlProps.value['aria-invalid'] === true ||
      fieldControlProps.value['aria-invalid'] === 'true',
    'fui-Dropdown--open': open.value,
  },
  attrs.class,
]);
const teleportTarget = computed(() => props.mountNode ?? 'body');
const shouldRenderPopup = computed(() => open.value || hasFocus.value || props.inlinePopup);

function invokeConsumerHandler(eventName: string, event: Event) {
  const handler = attrs[eventName];
  const handlers = Array.isArray(handler) ? handler : [handler];
  for (const current of handlers) {
    if (typeof current === 'function') {
      current(event);
    }
  }
}

function setActiveOption(id: string | undefined, scroll = false, event?: Event) {
  const previous = collection.activeOptionId.value
    ? collection.getOptionById(collection.activeOptionId.value)
    : undefined;
  collection.setActiveOption(id, scroll);
  const next = id ? collection.getOptionById(id) : undefined;
  if (previous?.id !== next?.id && event) {
    emit('activeOptionChange', event, {
      previousOption: previous ? toDropdownOptionData(previous) : null,
      nextOption: next ? toDropdownOptionData(next) : null,
    });
  }
}

function activateInitialOption(event?: Event) {
  const options = collection.getOptions();
  if (options.length === 0) {
    return false;
  }
  if (!props.multiselect && selectedOptions.value.length > 0) {
    const selected = collection
      .getOptionsMatchingValue((value) => value === selectedOptions.value[0])
      .at(-1);
    if (selected) {
      setActiveOption(selected.id, false, event);
      return true;
    }
  }
  if (!props.disableAutoFocus) {
    setActiveOption(options[0]?.id, false, event);
  }
  return true;
}

function requestOpen(nextOpen: boolean, event: MouseEvent | KeyboardEvent | FocusEvent) {
  if (disabled.value || nextOpen === open.value) {
    return;
  }
  emit('update:open', nextOpen);
  emit('openChange', event, { open: nextOpen });
  pendingOpenEvent = nextOpen ? event : undefined;
  if (!isOpenControlled) {
    internalOpen.value = nextOpen;
  }
}

function updateDisplayedValue(next: string) {
  emit('update:modelValue', next);
  if (!isValueControlled) {
    internalValue.value = next;
  }
}

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
  if (!isSelectionControlled) {
    internalSelectedOptions.value = next;
  }
  emit('update:selectedOptions', next);
  emit('optionSelect', event, {
    optionText: option.text,
    optionValue: option.value,
    selectedOptions: next,
  });
  const nextValue = props.multiselect
    ? collection
        .getOptionsMatchingValue((value) => next.includes(value))
        .map((item) => item.text)
        .join(', ')
    : option.text;
  updateDisplayedValue(nextValue);
  if (!props.multiselect) {
    requestOpen(false, event);
  }
  nextTick(() => trigger.value?.focus());
}

function clearSelection(event: MouseEvent) {
  invokeConsumerHandler('onClear', event);
  if (event.defaultPrevented || disabled.value) {
    return;
  }
  if (!isSelectionControlled) {
    internalSelectedOptions.value = [];
  }
  emit('update:selectedOptions', []);
  emit('optionSelect', event, {
    optionText: undefined,
    optionValue: undefined,
    selectedOptions: [],
  });
  updateDisplayedValue('');
  setActiveOption(undefined, false, event);
  nextTick(() => trigger.value?.focus());
}

function moveActive(
  action: 'first' | 'last' | 'next' | 'page-next' | 'page-previous' | 'previous',
  event: KeyboardEvent,
) {
  const previousId = collection.activeOptionId.value;
  collection.moveActiveOption(action);
  if (previousId !== collection.activeOptionId.value) {
    const previous = previousId ? collection.getOptionById(previousId) : undefined;
    const next = collection.activeOptionId.value
      ? collection.getOptionById(collection.activeOptionId.value)
      : undefined;
    emit('activeOptionChange', event, {
      previousOption: previous ? toDropdownOptionData(previous) : null,
      nextOption: next ? toDropdownOptionData(next) : null,
    });
  }
}

function allCharactersSame(value: string) {
  return [...value].every((character) => character === value[0]);
}

function moveToTypeaheadMatch(event: KeyboardEvent) {
  const options = collection.getOptions();
  if (options.length === 0) {
    return;
  }
  const normalized = typeahead.value.toLocaleLowerCase();
  const activeIndex = options.findIndex((option) => option.id === collection.activeOptionId.value);
  const startsAt = normalized.length === 1 ? activeIndex + 1 : Math.max(activeIndex, 0);
  const ordered = [...options.slice(startsAt), ...options.slice(0, startsAt)];
  let match = ordered.find((option) => option.text.toLocaleLowerCase().startsWith(normalized));
  if (!match && allCharactersSame(normalized)) {
    match = ordered.find((option) =>
      option.text.toLocaleLowerCase().startsWith(normalized[0] ?? ''),
    );
  }
  setActiveOption(match?.id, true, event);
}

function handleTypeahead(event: KeyboardEvent) {
  if (
    event.key.length !== 1 ||
    event.key === ' ' ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  ) {
    return false;
  }
  if (typeaheadTimer !== undefined) {
    clearTimeout(typeaheadTimer);
  }
  const character = event.key.toLocaleLowerCase();
  typeahead.value =
    typeahead.value.length === 1 && typeahead.value === character
      ? character
      : typeahead.value + character;
  typeaheadTimer = setTimeout(() => {
    typeahead.value = '';
    typeaheadTimer = undefined;
  }, 500);
  if (open.value) {
    moveToTypeaheadMatch(event);
  } else {
    pendingOpenEvent = event;
    pendingTypeahead = true;
    requestOpen(true, event);
  }
  return true;
}

function handleKeydown(event: KeyboardEvent) {
  invokeConsumerHandler('onKeydown', event);
  if (event.defaultPrevented || disabled.value || handleTypeahead(event)) {
    return;
  }
  const active = collection.activeOptionId.value
    ? collection.getOptionById(collection.activeOptionId.value)
    : undefined;
  if (!open.value) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      focusVisible.value = true;
      requestOpen(true, event);
    }
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    requestOpen(false, event);
    return;
  }
  if (event.altKey && event.key === 'ArrowUp') {
    event.preventDefault();
    requestOpen(false, event);
    return;
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveActive('next', event);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveActive('previous', event);
  } else if (event.key === 'Home') {
    event.preventDefault();
    moveActive('first', event);
  } else if (event.key === 'End') {
    event.preventDefault();
    moveActive('last', event);
  } else if (event.key === 'PageDown') {
    event.preventDefault();
    moveActive('page-next', event);
  } else if (event.key === 'PageUp') {
    event.preventDefault();
    moveActive('page-previous', event);
  } else if (event.key === 'Enter' || event.key === ' ') {
    if (active) {
      selectOption(event, active);
      if (active.disabled && !props.multiselect) {
        requestOpen(false, event);
      }
    }
    event.preventDefault();
  } else if (event.key === 'Tab' && !props.multiselect && active) {
    selectOption(event, active);
  }
}

function handleTriggerClick(event: MouseEvent) {
  invokeConsumerHandler('onClick', event);
  if (!event.defaultPrevented) {
    requestOpen(!open.value, event);
  }
}

function handlePointerdown(event: PointerEvent) {
  invokeConsumerHandler('onPointerdown', event);
  if (!event.defaultPrevented) {
    pointerFocus.value = true;
    focusVisible.value = false;
  }
}

function handleFocus(event: FocusEvent) {
  invokeConsumerHandler('onFocus', event);
  if (event.defaultPrevented) {
    return;
  }
  hasFocus.value = true;
  focusVisible.value = !pointerFocus.value;
  pointerFocus.value = false;
}

function handleBlur(event: FocusEvent) {
  invokeConsumerHandler('onBlur', event);
  if (event.defaultPrevented) {
    return;
  }
  const next = event.relatedTarget as Node | null;
  if (next && (root.value?.contains(next) || popup.value?.element?.contains(next))) {
    return;
  }
  hasFocus.value = false;
  focusVisible.value = false;
  pointerFocus.value = false;
  requestOpen(false, event);
}

function handlePopupPointerdown(event: PointerEvent) {
  event.preventDefault();
}

function handlePopupClick() {
  nextTick(() => trigger.value?.focus());
}

function handleDocumentPointerdown(event: PointerEvent) {
  const target = event.target as Node;
  if (!open.value || root.value?.contains(target) || popup.value?.element?.contains(target)) {
    return;
  }
  requestOpen(false, event);
}

function updatePosition() {
  if (!open.value || props.inlinePopup || !root.value) {
    return;
  }
  const rect = root.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const popupHeight = popup.value?.element?.offsetHeight ?? 0;
  const shouldPlaceAbove =
    props.positioning === 'above' ||
    (props.positioning === 'auto' && rect.bottom + popupHeight + 2 > viewportHeight);
  popupStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    top: shouldPlaceAbove ? 'auto' : `${rect.bottom + 2}px`,
    bottom: shouldPlaceAbove ? `${viewportHeight - rect.top + 2}px` : 'auto',
    width: `${rect.width}px`,
  };
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
  setActiveOption,
});

watch(open, async (isOpen) => {
  if (!isOpen) {
    pendingOpenEvent = undefined;
    pendingTypeahead = false;
    setActiveOption(undefined);
    return;
  }
  await nextTick();
  updatePosition();
});

watchEffect(() => {
  if (!open.value || collection.activeOptionId.value) {
    return;
  }
  const options = collection.getOptions();
  if (options.length === 0) {
    return;
  }
  const event = pendingOpenEvent;
  if (pendingTypeahead && event instanceof KeyboardEvent) {
    moveToTypeaheadMatch(event);
  } else {
    activateInitialOption(event);
  }
  pendingOpenEvent = undefined;
  pendingTypeahead = false;
});

watch(
  () => props.multiselect,
  (isMultiselect) => {
    if (import.meta.env.DEV && isMultiselect && props.clearable) {
      console.warn('FDropdown does not support `clearable` in multiselect mode.');
    }
  },
  { immediate: true },
);

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerdown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(root.value);
  }
  if (open.value) {
    nextTick(() => {
      activateInitialOption();
      updatePosition();
    });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerdown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
  resizeObserver?.disconnect();
  if (typeaheadTimer !== undefined) {
    clearTimeout(typeaheadTimer);
  }
});

defineExpose({
  activeOptionId: collection.activeOptionId,
  element: root,
  focus: () => trigger.value?.focus(),
  open,
  popup,
  selectedOptions,
  trigger,
  value: displayedValue,
});
</script>

<template>
  <div
    ref="root"
    :class="rootClasses"
    :style="attrs.style"
    :aria-owns="!inlinePopup && open ? listboxId : undefined"
  >
    <button
      ref="trigger"
      v-bind="rootAttrs"
      class="fui-Dropdown__button"
      type="button"
      role="combobox"
      :disabled="disabled"
      :aria-controls="open ? listboxId : undefined"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-activedescendant="open ? collection.activeOptionId.value : undefined"
      @blur="handleBlur"
      @click="handleTriggerClick"
      @focus="handleFocus"
      @keydown="handleKeydown"
      @pointerdown="handlePointerdown"
    >
      <span
        class="fui-Dropdown__content"
        :class="{ 'fui-Dropdown__content--placeholder': placeholderVisible }"
      >
        <slot
          v-if="$slots.button"
          name="button"
          :open="open"
          :placeholder-visible="placeholderVisible"
          :value="displayedValue"
        />
        <template v-else>{{ displayedValue || placeholder }}</template>
      </span>
      <span v-if="!showClearButton" class="fui-Dropdown__expandIcon" aria-hidden="true">
        <slot name="expand-icon" :open="open">
          <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
            <path
              d="M5.65 7.65a.5.5 0 0 1 .7 0L10 11.29l3.65-3.64a.5.5 0 0 1 .7.7l-4 4a.5.5 0 0 1-.7 0l-4-4a.5.5 0 0 1 0-.7Z"
            />
          </svg>
        </slot>
      </span>
    </button>
    <button
      v-if="showClearButton"
      class="fui-Dropdown__clearButton"
      type="button"
      aria-label="Clear selection"
      @click="clearSelection"
    >
      <slot name="clear-button">
        <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
          <path
            d="M4.15 4.15a.5.5 0 0 1 .7 0L10 9.29l5.15-5.14a.5.5 0 0 1 .7.7L10.71 10l5.14 5.15a.5.5 0 0 1-.7.7L10 10.71l-5.15 5.14a.5.5 0 0 1-.7-.7L9.29 10 4.15 4.85a.5.5 0 0 1 0-.7Z"
          />
        </svg>
      </slot>
    </button>

    <component :is="inlinePopup ? 'div' : Teleport" v-if="shouldRenderPopup" :to="teleportTarget">
      <FListbox
        :id="listboxId"
        ref="popup"
        class="fui-Dropdown__listbox"
        :class="{
          'fui-Dropdown__listbox--closed': !open,
          'fui-Dropdown__listbox--inline': inlinePopup,
        }"
        :style="inlinePopup ? undefined : popupStyle"
        :model-value="selectedOptions"
        :multiselect="multiselect"
        popup
        @click="handlePopupClick"
        @pointerdown="handlePopupPointerdown"
      >
        <slot />
      </FListbox>
    </component>
  </div>
</template>

<style>
@import './dropdown.css';
</style>

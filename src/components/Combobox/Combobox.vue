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
  ComboboxActiveOptionChangeData,
  ComboboxEmits,
  ComboboxOptionData,
  ComboboxProps,
  ComboboxSize,
  ComboboxSlots,
} from './Combobox.types';

function toOptionData(option: OptionCollectionItem | undefined): ComboboxOptionData | undefined {
  return option
    ? { disabled: option.disabled, id: option.id, text: option.text, value: option.value }
    : undefined;
}

defineOptions({ name: 'FCombobox', inheritAttrs: false });

const props = withDefaults(defineProps<ComboboxProps>(), {
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
const emit = defineEmits<ComboboxEmits>();
defineSlots<ComboboxSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const popup = ref<{ element?: HTMLElement | null } | null>(null);
const listboxId = `fui-combobox-listbox-${useId()}`;
const collection = useOptionCollection();
const internalOpen = ref(props.defaultOpen);
const internalSelectedOptions = ref([...(props.defaultSelectedOptions ?? [])]);
const internalValue = ref(props.defaultValue ?? '');
const filterText = ref('');
const hasFocus = ref(false);
const pointerFocus = ref(false);
const focusVisible = ref(false);
const popupStyle = ref<Record<string, string>>({});
let resizeObserver: ResizeObserver | undefined;
let pendingOpenEvent: MouseEvent | KeyboardEvent | FocusEvent | undefined;

const isOpenControlled = useIsPropProvided('open');
const isSelectionControlled = useIsPropProvided('selectedOptions');
const isValueControlled = useIsPropProvided('modelValue');
const isSizeProvided = useIsPropProvided('size');
const open = computed(() => (isOpenControlled ? Boolean(props.open) : internalOpen.value));
const selectedOptions = computed(() =>
  isSelectionControlled ? [...(props.selectedOptions ?? [])] : internalSelectedOptions.value,
);
const value = computed(() => (isValueControlled ? (props.modelValue ?? '') : internalValue.value));
const fieldControlProps = useFieldControlProps(
  () => ({
    ...attrs,
    id: attrs.id as string | undefined,
    ...(isSizeProvided ? { size: props.size } : {}),
    disabled: props.disabled || Boolean(attrs.disabled),
  }),
  { supportsLabelFor: false, supportsRequired: false, supportsSize: true },
);
const effectiveSize = computed(
  () => (fieldControlProps.value.size as ComboboxSize | undefined) ?? props.size,
);
const disabled = computed(() => Boolean(fieldControlProps.value.disabled));
const selectedTextByValue = new Map<string, string>();
const selectedText = computed(() => {
  for (const option of collection.getOptions()) {
    selectedTextByValue.set(option.value, option.text);
  }
  return selectedOptions.value
    .map((selected) => selectedTextByValue.get(selected))
    .filter((text): text is string => text !== undefined)
    .join(', ');
});
const displayValue = computed(() =>
  isValueControlled
    ? (props.modelValue ?? '')
    : props.multiselect
      ? selectedText.value
      : value.value,
);
const showClearButton = computed(
  () =>
    props.clearable && !props.multiselect && !disabled.value && selectedOptions.value.length > 0,
);
const rootClasses = computed(() => [
  'fui-Combobox',
  `fui-Combobox--${props.appearance}`,
  `fui-Combobox--${effectiveSize.value}`,
  {
    'fui-Combobox--disabled': disabled.value,
    'fui-Combobox--invalid':
      fieldControlProps.value['aria-invalid'] === true ||
      fieldControlProps.value['aria-invalid'] === 'true',
    'fui-Combobox--open': open.value,
  },
  attrs.class,
]);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    size: _size,
    disabled: _disabled,
    value: _value,
    onBlur: _onBlur,
    onClick: _onClick,
    onFocus: _onFocus,
    onInput: _onInput,
    onKeydown: _onKeydown,
    onPointerdown: _onPointerdown,
    'aria-activedescendant': _active,
    'aria-controls': _controls,
    'aria-expanded': _expanded,
    'aria-haspopup': _hasPopup,
    'aria-owns': _owns,
    ...rest
  } = fieldControlProps.value;
  return rest;
});
const teleportTarget = computed(() => props.mountNode ?? 'body');
const shouldRenderPopup = computed(() => open.value || hasFocus.value || props.inlinePopup);

function invokeConsumerHandler(name: string, event: Event) {
  const handlers = Array.isArray(attrs[name]) ? attrs[name] : [attrs[name]];
  for (const handler of handlers) {
    if (typeof handler === 'function') handler(event);
  }
}

function setActiveOption(id: string | undefined, scroll = false, event?: Event) {
  const previous = collection.activeOptionId.value
    ? collection.getOptionById(collection.activeOptionId.value)
    : undefined;
  collection.setActiveOption(id, scroll);
  const next = id ? collection.getOptionById(id) : undefined;
  if (event && previous?.id !== next?.id) {
    const data: ComboboxActiveOptionChangeData = {
      previousOption: previous ? toOptionData(previous) : null,
      nextOption: next ? toOptionData(next) : null,
    };
    emit('activeOptionChange', event, data);
  }
}

function requestOpen(nextOpen: boolean, event: MouseEvent | KeyboardEvent | FocusEvent) {
  if (disabled.value || nextOpen === open.value) return;
  emit('update:open', nextOpen);
  emit('openChange', event, { open: nextOpen });
  pendingOpenEvent = nextOpen ? event : undefined;
  if (!isOpenControlled) internalOpen.value = nextOpen;
}

function updateValue(next: string, event: InputEvent) {
  if (!isValueControlled) internalValue.value = next;
  emit('update:modelValue', next);
  emit('input', event, { value: next });
}

function selectOption(event: MouseEvent | KeyboardEvent, option: OptionCollectionItem) {
  if (option.disabled || event.defaultPrevented) return;
  const next = props.multiselect
    ? selectedOptions.value.includes(option.value)
      ? selectedOptions.value.filter((value) => value !== option.value)
      : [...selectedOptions.value, option.value]
    : [option.value];
  if (!isSelectionControlled) internalSelectedOptions.value = next;
  emit('update:selectedOptions', next);
  emit('optionSelect', event, {
    optionText: option.text,
    optionValue: option.value,
    selectedOptions: next,
  });
  if (!props.multiselect) {
    updateValue(option.text, event as unknown as InputEvent);
    requestOpen(false, event);
    nextTick(() => input.value?.focus());
  }
}

function activateInitialOption(event?: Event) {
  const options = collection.getOptions();
  if (!options.length || props.disableAutoFocus) return;
  const selected = selectedOptions.value[0]
    ? collection.getOptionsMatchingValue((value) => value === selectedOptions.value[0]).at(-1)
    : undefined;
  setActiveOption(selected?.id ?? options[0]?.id, false, event);
}

function handleInput(event: Event) {
  const inputEvent = event as InputEvent;
  const target = event.target as HTMLInputElement;
  filterText.value = target.value;
  updateValue(target.value, inputEvent);
  if (!open.value) requestOpen(true, inputEvent as unknown as KeyboardEvent);
  nextTick(() => {
    if (!open.value) return;
    const query = filterText.value.trim().toLocaleLowerCase();
    const match = collection
      .getOptionsMatchingText((text) => text.toLocaleLowerCase().startsWith(query))
      .find((option) => !option.disabled);
    setActiveOption(match?.id, true, inputEvent);
  });
}

function handleKeydown(event: KeyboardEvent) {
  invokeConsumerHandler('onKeydown', event);
  if (event.defaultPrevented || disabled.value) return;
  const active = collection.activeOptionId.value
    ? collection.getOptionById(collection.activeOptionId.value)
    : undefined;
  if (!open.value && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
    event.preventDefault();
    requestOpen(true, event);
    return;
  }
  if (!open.value) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    requestOpen(false, event);
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    collection.moveActiveOption(event.key === 'ArrowDown' ? 'next' : 'previous');
  } else if (event.key === 'Enter' || event.key === 'Tab') {
    if (active) selectOption(event, active);
    event.preventDefault();
  }
}

function handleFocus(event: FocusEvent) {
  invokeConsumerHandler('onFocus', event);
  if (event.defaultPrevented) return;
  hasFocus.value = true;
  focusVisible.value = !pointerFocus.value;
  pointerFocus.value = false;
}
function handleBlur(event: FocusEvent) {
  invokeConsumerHandler('onBlur', event);
  if (event.defaultPrevented) return;
  const next = event.relatedTarget as Node | null;
  if (next && (root.value?.contains(next) || popup.value?.element?.contains(next))) return;
  hasFocus.value = false;
  requestOpen(false, event);
}
function handlePointerdown(event: PointerEvent) {
  invokeConsumerHandler('onPointerdown', event);
  if (!event.defaultPrevented) pointerFocus.value = true;
}
function clearSelection(event: MouseEvent) {
  if (event.defaultPrevented || disabled.value) return;
  if (!isSelectionControlled) internalSelectedOptions.value = [];
  emit('update:selectedOptions', []);
  updateValue('', event as unknown as InputEvent);
  nextTick(() => input.value?.focus());
}
function handleDocumentPointerdown(event: PointerEvent) {
  const target = event.target as Node;
  if (!open.value || root.value?.contains(target) || popup.value?.element?.contains(target)) return;
  requestOpen(false, event);
}
function updatePosition() {
  if (!open.value || props.inlinePopup || !root.value) return;
  const rect = root.value.getBoundingClientRect();
  const height = popup.value?.element?.offsetHeight ?? 0;
  const above =
    props.positioning === 'above' ||
    (props.positioning === 'auto' && rect.bottom + height + 2 > window.innerHeight);
  popupStyle.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    top: above ? 'auto' : `${rect.bottom + 2}px`,
    bottom: above ? `${window.innerHeight - rect.top + 2}px` : 'auto',
    width: `${rect.width}px`,
  };
}

provide(listboxContextKey, {
  activeOptionId: collection.activeOptionId,
  filterText,
  focusVisible,
  multiselect: computed(() => props.multiselect),
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
    setActiveOption(undefined);
    pendingOpenEvent = undefined;
    return;
  }
  await nextTick();
  updatePosition();
});
watchEffect(() => {
  if (!open.value || collection.activeOptionId.value || !collection.getOptions().length) return;
  activateInitialOption(pendingOpenEvent);
  pendingOpenEvent = undefined;
});
onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerdown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(root.value);
  }
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerdown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
  resizeObserver?.disconnect();
});

defineExpose({
  element: root,
  focus: () => input.value?.focus(),
  input,
  open,
  selectedOptions,
  value,
});
</script>

<template>
  <div
    ref="root"
    :class="rootClasses"
    :style="attrs.style"
    :aria-owns="!inlinePopup && open ? listboxId : undefined"
  >
    <input
      ref="input"
      v-bind="rootAttrs"
      class="fui-Combobox__input"
      type="text"
      role="combobox"
      :value="displayValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :aria-controls="open ? listboxId : undefined"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-activedescendant="open ? collection.activeOptionId.value : undefined"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @keydown="handleKeydown"
      @pointerdown="handlePointerdown"
    />
    <span v-if="!showClearButton" class="fui-Combobox__expandIcon" aria-hidden="true">
      <slot name="expand-icon" :open="open">
        <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
          <path
            d="M5.65 7.65a.5.5 0 0 1 .7 0L10 11.29l3.65-3.64a.5.5 0 0 1 .7.7l-4 4a.5.5 0 0 1-.7.7l-4-4a.5.5 0 0 1 0-.7Z"
          />
        </svg>
      </slot>
    </span>
    <button
      v-if="showClearButton"
      class="fui-Combobox__clearButton"
      type="button"
      aria-label="Clear selection"
      @click="clearSelection"
    >
      <slot name="clear-button"><span aria-hidden="true">×</span></slot>
    </button>
    <component :is="inlinePopup ? 'div' : Teleport" v-if="shouldRenderPopup" :to="teleportTarget">
      <FListbox
        :id="listboxId"
        ref="popup"
        class="fui-Combobox__listbox"
        :class="{
          'fui-Combobox__listbox--closed': !open,
          'fui-Combobox__listbox--inline': inlinePopup,
        }"
        :style="inlinePopup ? undefined : popupStyle"
        :model-value="selectedOptions"
        :multiselect="multiselect"
        popup
        @click="nextTick(() => input?.focus())"
        @pointerdown="(event: PointerEvent) => event.preventDefault()"
      >
        <slot />
      </FListbox>
    </component>
  </div>
</template>

<style>
@import './combobox.css';
</style>

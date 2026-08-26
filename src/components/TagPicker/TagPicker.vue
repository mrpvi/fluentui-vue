<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useId, watch } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import {
  useOptionCollection,
  type OptionCollectionItem,
} from '../../composables/useOptionCollection';
import { tagPickerContextKey } from './tagPickerContext';
import type { TagPickerEmits, TagPickerProps } from './TagPicker.types';

defineOptions({ name: 'FTagPicker' });
const props = withDefaults(defineProps<TagPickerProps>(), {
  appearance: 'outline',
  defaultOpen: false,
  disableAutoFocus: false,
  disabled: false,
  inlinePopup: false,
  noPopover: false,
  positioning: 'auto',
  size: 'medium',
});
const emit = defineEmits<TagPickerEmits>();
const collection = useOptionCollection();
const internalOpen = ref(props.defaultOpen);
const internalSelected = ref([...(props.defaultSelectedOptions ?? [])]);
const filterText = ref('');
const trigger = ref<HTMLInputElement | HTMLButtonElement | null>(null);
const control = ref<HTMLElement | null>(null);
const popup = ref<HTMLElement | null>(null);
const listboxId = `fui-tag-picker-listbox-${useId()}`;
const controlledOpen = useIsPropProvided('open');
const controlledSelected = useIsPropProvided('selectedOptions');
const open = computed(() => (controlledOpen ? Boolean(props.open) : internalOpen.value));
const selectedOptions = computed(() =>
  controlledSelected ? [...(props.selectedOptions ?? [])] : internalSelected.value,
);
const disabled = computed(() => props.disabled);
function requestOpen(value: boolean, event: MouseEvent | KeyboardEvent | FocusEvent) {
  if (disabled.value || props.noPopover || value === open.value) return;
  emit('update:open', value);
  emit('openChange', event, { open: value });
  if (!controlledOpen) internalOpen.value = value;
  if (value && !props.disableAutoFocus) nextTick(() => collection.moveActiveOption('first'));
  if (!value) collection.setActiveOption(undefined);
}
function updateSelection(event: MouseEvent | KeyboardEvent, value: string, next: string[]) {
  if (!controlledSelected) internalSelected.value = next;
  emit('update:selectedOptions', next);
  emit('optionSelect', event, { selectedOptions: next, value });
}
function removeOption(event: MouseEvent | KeyboardEvent, value: string) {
  if (event.defaultPrevented) return;
  updateSelection(
    event,
    value,
    selectedOptions.value.filter((item) => item !== value),
  );
  nextTick(() => trigger.value?.focus());
}
function selectOption(event: MouseEvent | KeyboardEvent, option: OptionCollectionItem) {
  if (option.disabled || event.defaultPrevented) return;
  if (!selectedOptions.value.includes(option.value)) {
    updateSelection(event, option.value, [...selectedOptions.value, option.value]);
  } else {
    emit('optionSelect', event, { selectedOptions: selectedOptions.value, value: option.value });
  }
  filterText.value = '';
  requestOpen(false, event);
  nextTick(() => trigger.value?.focus());
}
function handlePointerdown(event: PointerEvent) {
  const target = event.target as Node;
  if (open.value && !control.value?.contains(target) && !popup.value?.contains(target))
    requestOpen(false, event);
}
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault();
    requestOpen(false, event);
    trigger.value?.focus();
  }
}
onMounted(() => {
  document.addEventListener('pointerdown', handlePointerdown);
  document.addEventListener('keydown', handleEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePointerdown);
  document.removeEventListener('keydown', handleEscape);
});
watch(open, (value) => {
  if (!value) collection.setActiveOption(undefined);
});
provide(tagPickerContextKey, {
  activeOptionId: collection.activeOptionId,
  appearance: computed(() => props.appearance),
  disabled,
  filterText,
  inlinePopup: computed(() => props.inlinePopup),
  listboxId,
  mountNode: computed(() => props.mountNode ?? 'body'),
  noPopover: computed(() => props.noPopover),
  open,
  positioning: computed(() => props.positioning),
  selectedOptions,
  size: computed(() => props.size),
  trigger,
  control,
  popup,
  getOptionById: collection.getOptionById,
  getOptions: collection.getOptions,
  moveActiveOption: collection.moveActiveOption,
  registerOption: collection.registerOption,
  requestOpen,
  removeOption,
  selectOption,
  setActiveOption: collection.setActiveOption,
  setFilterText: (value) => {
    filterText.value = value;
  },
});
defineExpose({ open, selectedOptions, trigger });
</script>

<template>
  <div class="fui-TagPicker"><slot /></div>
</template>
<style>
@import './tagPicker.css';
</style>

<script setup lang="ts">
import { computed, inject, nextTick, ref, useAttrs } from 'vue';
import { tagPickerContextKey } from './tagPickerContext';
import type { TagPickerInputEmits, TagPickerInputProps } from './TagPicker.types';
defineOptions({ name: 'FTagPickerInput', inheritAttrs: false });
const props = withDefaults(defineProps<TagPickerInputProps>(), {
  clearable: false,
  disabled: false,
  modelValue: '',
});
const emit = defineEmits<TagPickerInputEmits>();
const attrs = useAttrs();
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    disabled: _disabled,
    value: _value,
    role: _role,
    onFocus: _focus,
    onInput: _input,
    onKeydown: _keydown,
    'aria-controls': _controls,
    'aria-expanded': _expanded,
    'aria-haspopup': _haspopup,
    'aria-activedescendant': _active,
    ...rest
  } = attrs;
  return rest;
});
const injectedContext = inject(tagPickerContextKey);
if (!injectedContext) throw new Error('FTagPickerInput must be used inside FTagPicker.');
const context = injectedContext;
const root = ref<HTMLInputElement | null>(null);
function assign(element: unknown) {
  root.value = element as HTMLInputElement | null;
  context.trigger.value = element as HTMLInputElement | null;
}
function update(value: string, event: InputEvent) {
  context.setFilterText(value);
  emit('update:modelValue', value);
  emit('input', event, { value });
  if (!context.open.value) context.requestOpen(true, event as unknown as KeyboardEvent);
  nextTick(() => {
    const query = value.trim().toLocaleLowerCase();
    const match = context
      .getOptions()
      .find((item) => !item.disabled && item.text.toLocaleLowerCase().includes(query));
    context.setActiveOption(match?.id, true);
  });
}
function keydown(event: KeyboardEvent) {
  const handler = attrs.onKeydown;
  if (typeof handler === 'function') handler(event);
  if (event.defaultPrevented || context.disabled.value || props.disabled) return;
  const active = context.activeOptionId.value
    ? context.getOptionById(context.activeOptionId.value)
    : undefined;
  if (!context.open.value && ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
    event.preventDefault();
    context.requestOpen(true, event);
    if (event.key === 'ArrowUp') nextTick(() => context.moveActiveOption('last'));
    return;
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    context.moveActiveOption(event.key === 'ArrowDown' ? 'next' : 'previous');
  } else if (event.key === 'Enter' && active) {
    event.preventDefault();
    context.selectOption(event, active);
  } else if (
    (event.key === 'ArrowLeft' || event.key === 'Backspace') &&
    root.value?.selectionStart === 0 &&
    root.value.selectionEnd === 0
  ) {
    const tags = context.control.value?.querySelectorAll<HTMLElement>('.fui-TagPickerGroup button');
    tags?.item(tags.length - 1)?.focus();
  }
}
defineExpose({ element: root, focus: () => root.value?.focus() });
</script>
<template>
  <input
    :ref="assign"
    v-bind="rootAttrs"
    class="fui-TagPickerInput"
    type="text"
    role="combobox"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled || context.disabled.value"
    :aria-controls="context.open.value ? context.listboxId : undefined"
    :aria-expanded="context.open.value"
    aria-haspopup="listbox"
    :aria-activedescendant="context.open.value ? context.activeOptionId.value : undefined"
    @focus="
      (e) => {
        if (!context.open.value && context.filterText.value) context.requestOpen(true, e);
      }
    "
    @input="(e) => update((e.target as HTMLInputElement).value, e as InputEvent)"
    @keydown="keydown"
  />
</template>

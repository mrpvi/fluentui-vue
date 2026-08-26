<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import { tagPickerContextKey } from './tagPickerContext';
import type { TagPickerButtonProps } from './TagPicker.types';
defineOptions({ name: 'FTagPickerButton', inheritAttrs: false });
withDefaults(defineProps<TagPickerButtonProps>(), {
  disabled: false,
  placeholder: '',
});
const attrs = useAttrs();
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    disabled: _disabled,
    role: _role,
    onClick: _click,
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
if (!injectedContext) throw new Error('FTagPickerButton must be used inside FTagPicker.');
const context = injectedContext;
const root = ref<HTMLButtonElement | null>(null);
function assign(element: unknown) {
  root.value = element as HTMLButtonElement | null;
  context.trigger.value = element as HTMLButtonElement | null;
}
function click(event: MouseEvent) {
  const handler = attrs.onClick;
  if (typeof handler === 'function') handler(event);
  if (!event.defaultPrevented) context.requestOpen(!context.open.value, event);
}
function keydown(event: KeyboardEvent) {
  const active = context.activeOptionId.value
    ? context.getOptionById(context.activeOptionId.value)
    : undefined;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!context.open.value) context.requestOpen(true, event);
    else context.moveActiveOption(event.key === 'ArrowDown' ? 'next' : 'previous');
  } else if (event.key === 'Enter' && context.open.value && active) {
    event.preventDefault();
    context.selectOption(event, active);
  }
}
const text = computed(() =>
  context.selectedOptions.value
    .map((value) => context.getOptions().find((item) => item.value === value)?.text ?? value)
    .join(', '),
);
defineExpose({ element: root, focus: () => root.value?.focus() });
</script>
<template>
  <button
    :ref="assign"
    v-bind="rootAttrs"
    type="button"
    class="fui-TagPickerButton"
    :class="{ 'fui-TagPickerButton--placeholder': !text }"
    :disabled="disabled || context.disabled.value"
    role="combobox"
    :aria-controls="context.open.value ? context.listboxId : undefined"
    :aria-expanded="context.open.value"
    aria-haspopup="listbox"
    :aria-activedescendant="context.open.value ? context.activeOptionId.value : undefined"
    @click="click"
    @keydown="keydown"
  >
    <slot :value="text">{{ text || placeholder }}</slot>
  </button>
</template>

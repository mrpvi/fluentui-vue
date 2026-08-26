<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import { tagPickerContextKey } from './tagPickerContext';
import type { TagPickerControlSlots } from './TagPicker.types';
defineOptions({ name: 'FTagPickerControl', inheritAttrs: false });
defineSlots<TagPickerControlSlots>();
const attrs = useAttrs();
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    onMousedown: _mousedown,
    'aria-owns': _owns,
    ...rest
  } = attrs;
  return rest;
});
const injectedContext = inject(tagPickerContextKey);
if (!injectedContext) throw new Error('FTagPickerControl must be used inside FTagPicker.');
const context = injectedContext;
const root = ref<HTMLDivElement | null>(null);
function handleMousedown(event: MouseEvent) {
  const handler = attrs.onMousedown;
  if (typeof handler === 'function') handler(event);
  if (event.defaultPrevented || context.disabled.value) return;
  if (
    event.target === root.value ||
    (event.target as HTMLElement).closest('.fui-TagPickerControl__expandIcon')
  ) {
    event.preventDefault();
    context.requestOpen(!context.open.value, event);
    context.trigger.value?.focus();
  }
}
function assign(element: unknown) {
  context.control.value = element as HTMLElement | null;
  root.value = element as HTMLDivElement | null;
}
defineExpose({ element: root });
</script>
<template>
  <div
    :ref="assign"
    v-bind="rootAttrs"
    :class="[
      'fui-TagPickerControl',
      `fui-TagPickerControl--${context.appearance.value}`,
      `fui-TagPickerControl--${context.size.value}`,
      { 'fui-TagPickerControl--disabled': context.disabled.value },
      attrs.class,
    ]"
    :style="attrs.style"
    :aria-owns="context.open.value && !context.inlinePopup.value ? context.listboxId : undefined"
    @mousedown="handleMousedown"
  >
    <slot />
    <span
      v-if="$slots['secondary-action'] || !context.noPopover.value"
      class="fui-TagPickerControl__aside"
    >
      <span v-if="$slots['secondary-action']" class="fui-TagPickerControl__secondaryAction"
        ><slot name="secondary-action"
      /></span>
      <span
        v-if="!context.noPopover.value"
        class="fui-TagPickerControl__expandIcon"
        role="button"
        :aria-expanded="context.open.value"
        :aria-disabled="context.disabled.value || undefined"
        aria-label="Show suggestions"
      >
        <slot name="expand-icon" :open="context.open.value"
          ><svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M5.65 7.65a.5.5 0 0 1 .7 0L10 11.29l3.65-3.64a.5.5 0 0 1 .7.7l-4 4a.5.5 0 0 1-.7.7l-4-4a.5.5 0 0 1 0-.7Z"
            /></svg
        ></slot>
      </span>
    </span>
  </div>
</template>

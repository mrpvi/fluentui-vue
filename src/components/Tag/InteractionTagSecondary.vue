<script setup lang="ts">
import { computed, inject, ref, useAttrs, useId } from 'vue';
import { interactionTagContextKey } from './tagContext';
import type { InteractionTagSecondarySlots } from './Tag.types';

defineOptions({ name: 'FInteractionTagSecondary', inheritAttrs: false });
defineSlots<InteractionTagSecondarySlots>();
const attrs = useAttrs();
const injectedContext = inject(interactionTagContextKey);
if (!injectedContext)
  throw new Error('FInteractionTagSecondary must be used inside FInteractionTag.');
const context = injectedContext;
const root = ref<HTMLButtonElement | null>(null);
const id = `fui-interaction-tag-secondary-${useId()}`;
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    onClick: _click,
    onKeydown: _key,
    ...rest
  } = attrs;
  return rest;
});
function invoke(name: string, event: Event) {
  const handler = attrs[name];
  if (typeof handler === 'function') handler(event);
}
function handleClick(event: MouseEvent) {
  invoke('onClick', event);
  if (!event.defaultPrevented) context.dismiss(event);
}
function handleKeydown(event: KeyboardEvent) {
  invoke('onKeydown', event);
  if (!event.defaultPrevented && (event.key === 'Delete' || event.key === 'Backspace')) {
    event.preventDefault();
    context.dismiss(event);
  }
}
defineExpose({ element: root });
</script>

<template>
  <button
    :id="String(attrs.id ?? id)"
    ref="root"
    v-bind="rootAttrs"
    type="button"
    :disabled="context.disabled.value"
    :aria-labelledby="`${context.primaryId} ${String(attrs.id ?? id)}`"
    :class="[
      'fui-InteractionTagSecondary',
      `fui-InteractionTagSecondary--${context.appearance.value}`,
      `fui-InteractionTagSecondary--${context.shape.value}`,
      `fui-InteractionTagSecondary--${context.size.value}`,
      { 'fui-InteractionTagSecondary--selected': context.selected.value },
      attrs.class,
    ]"
    :style="attrs.style"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot>
      <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
        <path
          d="M4.15 4.15a.5.5 0 0 1 .7 0L8 7.29l3.15-3.14a.5.5 0 1 1 .7.7L8.71 8l3.14 3.15a.5.5 0 0 1-.7.7L8 8.71l-3.15 3.14a.5.5 0 0 1-.7-.7L7.29 8 4.15 4.85a.5.5 0 0 1 0-.7Z"
        />
      </svg>
    </slot>
  </button>
</template>

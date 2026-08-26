<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import { interactionTagContextKey } from './tagContext';
import type { InteractionTagPrimaryProps, InteractionTagPrimarySlots } from './Tag.types';

defineOptions({ name: 'FInteractionTagPrimary', inheritAttrs: false });
withDefaults(defineProps<InteractionTagPrimaryProps>(), { hasSecondaryAction: false });
defineSlots<InteractionTagPrimarySlots>();
const attrs = useAttrs();
const injectedContext = inject(interactionTagContextKey);
if (!injectedContext)
  throw new Error('FInteractionTagPrimary must be used inside FInteractionTag.');
const context = injectedContext;
const root = ref<HTMLButtonElement | null>(null);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, onClick: _click, ...rest } = attrs;
  return rest;
});
function handleClick(event: MouseEvent) {
  const handler = attrs.onClick;
  if (typeof handler === 'function') handler(event);
  if (!event.defaultPrevented) context.select(event);
}
defineExpose({ element: root });
</script>

<template>
  <button
    :id="context.primaryId"
    ref="root"
    v-bind="rootAttrs"
    type="button"
    :disabled="context.disabled.value"
    :aria-pressed="context.selected.value"
    :class="[
      'fui-InteractionTagPrimary',
      `fui-InteractionTagPrimary--${context.appearance.value}`,
      `fui-InteractionTagPrimary--${context.shape.value}`,
      `fui-InteractionTagPrimary--${context.size.value}`,
      {
        'fui-InteractionTagPrimary--selected': context.selected.value,
        'fui-InteractionTagPrimary--withSecondary': hasSecondaryAction,
      },
      attrs.class,
    ]"
    :style="attrs.style"
    @click="handleClick"
  >
    <span v-if="$slots.media" class="fui-InteractionTagPrimary__media"><slot name="media" /></span>
    <span v-else-if="$slots.icon" class="fui-InteractionTagPrimary__icon"
      ><slot name="icon"
    /></span>
    <span class="fui-InteractionTagPrimary__primaryText"><slot /></span>
    <span v-if="$slots['secondary-text']" class="fui-InteractionTagPrimary__secondaryText"
      ><slot name="secondary-text"
    /></span>
  </button>
</template>

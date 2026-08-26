<script setup lang="ts">
import { computed, inject, provide, useAttrs, useId } from 'vue';
import { accordionContextKey } from '../Accordion/accordionContext';
import { accordionItemContextKey } from './accordionItemContext';
import type { AccordionItemProps, AccordionItemSlots } from './AccordionItem.types';

defineOptions({
  name: 'FAccordionItem',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AccordionItemProps>(), {
  disabled: false,
});
defineSlots<AccordionItemSlots>();
const attrs = useAttrs();
const accordion = inject(accordionContextKey);
if (!accordion) {
  throw new Error('FAccordionItem must be used inside FAccordion.');
}
const id = useId();
const open = computed(() => accordion.openItems.value.includes(props.value));
const disabled = computed(() => props.disabled);
const headerId = computed(() => `fui-accordion-header-${id}`);
const panelId = computed(() => `fui-accordion-panel-${id}`);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

provide(accordionItemContextKey, {
  value: props.value,
  open,
  disabled,
  headerId,
  panelId,
});
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="[
      'fui-AccordionItem',
      { 'fui-AccordionItem--open': open, 'fui-AccordionItem--disabled': disabled },
      attrs.class,
    ]"
    :style="attrs.style"
    :data-open="open || undefined"
    :data-disabled="disabled || undefined"
  >
    <slot />
  </div>
</template>

<style>
@import './accordionItem.css';
</style>

<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import { accordionItemContextKey } from '../AccordionItem/accordionItemContext';
import type { AccordionPanelSlots } from './AccordionPanel.types';

defineOptions({
  name: 'FAccordionPanel',
  inheritAttrs: false,
});

defineSlots<AccordionPanelSlots>();
const attrs = useAttrs();
const item = inject(accordionItemContextKey);
if (!item) {
  throw new Error('FAccordionPanel must be used inside FAccordionItem.');
}
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <div
    v-if="item.open.value"
    :id="item.panelId.value"
    v-bind="rootAttrs"
    :class="['fui-AccordionPanel', attrs.class]"
    :style="attrs.style"
    role="region"
    :aria-labelledby="item.headerId.value"
  >
    <slot />
  </div>
</template>

<style>
@import './accordionPanel.css';
</style>

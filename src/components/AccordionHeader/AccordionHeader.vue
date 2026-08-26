<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import { accordionContextKey } from '../Accordion/accordionContext';
import { accordionItemContextKey } from '../AccordionItem/accordionItemContext';
import type {
  AccordionHeaderEmits,
  AccordionHeaderProps,
  AccordionHeaderSlots,
} from './AccordionHeader.types';

defineOptions({
  name: 'FAccordionHeader',
  inheritAttrs: false,
});

withDefaults(defineProps<AccordionHeaderProps>(), {
  as: 'div',
  expandIconPosition: 'start',
  inline: false,
  size: 'medium',
});
const emit = defineEmits<AccordionHeaderEmits>();
defineSlots<AccordionHeaderSlots>();
const attrs = useAttrs();
const injectedAccordion = inject(accordionContextKey);
const injectedItem = inject(accordionItemContextKey);
if (!injectedAccordion || !injectedItem) {
  throw new Error('FAccordionHeader must be used inside FAccordionItem.');
}
const accordion = injectedAccordion;
const item = injectedItem;
const button = ref<HTMLButtonElement | null>(null);
let unregister: (() => void) | undefined;
const disabledFocusable = computed(
  () => !accordion.collapsible.value && accordion.openItems.value.length === 1 && item.open.value,
);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

function handleClick(event: MouseEvent) {
  emit('click', event);
  if (!event.defaultPrevented && !item.disabled.value && !disabledFocusable.value) {
    accordion.requestToggle(item.value, event);
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!accordion.navigation.value || !button.value) {
    return;
  }
  const direction =
    event.key === 'ArrowDown' || event.key === 'ArrowRight'
      ? 1
      : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
        ? -1
        : 0;
  if (direction) {
    event.preventDefault();
    accordion.moveHeaderFocus(button.value, direction);
  }
}

onMounted(() => {
  if (button.value) {
    unregister = accordion.registerHeader(button.value);
  }
});
onBeforeUnmount(() => unregister?.());

defineExpose({
  element: button,
  focus: () => button.value?.focus(),
});
</script>

<template>
  <component
    :is="as"
    v-bind="rootAttrs"
    :class="[
      'fui-AccordionHeader',
      `fui-AccordionHeader--${size}`,
      `fui-AccordionHeader--expand-${expandIconPosition}`,
      {
        'fui-AccordionHeader--inline': inline,
        'fui-AccordionHeader--disabled': item.disabled.value,
      },
      attrs.class,
    ]"
    :style="attrs.style"
  >
    <button
      :id="item.headerId.value"
      ref="button"
      class="fui-AccordionHeader__button fui-focus-outline"
      type="button"
      :disabled="item.disabled.value"
      :aria-disabled="disabledFocusable || undefined"
      :aria-expanded="item.open.value"
      :aria-controls="item.panelId.value"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <span
        v-if="expandIconPosition === 'start'"
        class="fui-AccordionHeader__expandIcon fui-AccordionHeader__expandIcon--start"
        aria-hidden="true"
      >
        <slot name="expand-icon" :open="item.open.value">
          <svg class="fui-AccordionHeader__chevron" viewBox="0 0 20 20" focusable="false">
            <path
              d="M7.2 4.6a.75.75 0 0 1 1.06 0l4.87 4.87a.75.75 0 0 1 0 1.06L8.26 15.4a.75.75 0 1 1-1.06-1.06L11.54 10 7.2 5.66a.75.75 0 0 1 0-1.06Z"
            />
          </svg>
        </slot>
      </span>
      <span v-if="$slots.icon" class="fui-AccordionHeader__icon"><slot name="icon" /></span>
      <span class="fui-AccordionHeader__content"><slot /></span>
      <span
        v-if="expandIconPosition === 'end'"
        class="fui-AccordionHeader__expandIcon fui-AccordionHeader__expandIcon--end"
        aria-hidden="true"
      >
        <slot name="expand-icon" :open="item.open.value">
          <svg class="fui-AccordionHeader__chevron" viewBox="0 0 20 20" focusable="false">
            <path
              d="M7.2 4.6a.75.75 0 0 1 1.06 0l4.87 4.87a.75.75 0 0 1 0 1.06L8.26 15.4a.75.75 0 1 1-1.06-1.06L11.54 10 7.2 5.66a.75.75 0 0 1 0-1.06Z"
            />
          </svg>
        </slot>
      </span>
    </button>
  </component>
</template>

<style>
@import './accordionHeader.css';
</style>

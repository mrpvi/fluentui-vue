<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { accordionContextKey } from './accordionContext';
import type {
  AccordionEmits,
  AccordionItemValue,
  AccordionProps,
  AccordionSlots,
} from './Accordion.types';

defineOptions({
  name: 'FAccordion',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AccordionProps>(), {
  collapsible: false,
  multiple: false,
});
const emit = defineEmits<AccordionEmits>();
defineSlots<AccordionSlots>();
const attrs = useAttrs();
const isControlled = useIsPropProvided('modelValue');
const initialOpenItems = normalizeOpenItems(props.defaultOpenItems, props.multiple);
const internalOpenItems = ref<AccordionItemValue[]>(initialOpenItems);
const headers = new Set<HTMLButtonElement>();
const openItems = computed(() =>
  isControlled ? normalizeOpenItems(props.modelValue, props.multiple) : internalOpenItems.value,
);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

function normalizeOpenItems(
  value: AccordionItemValue | AccordionItemValue[] | undefined,
  multiple: boolean,
): AccordionItemValue[] {
  if (value === undefined) {
    return [];
  }
  const values = Array.isArray(value) ? value : [value];
  return multiple ? [...values] : values.slice(0, 1);
}

function requestToggle(value: AccordionItemValue, event: MouseEvent | KeyboardEvent) {
  const previous = openItems.value;
  const isOpen = previous.includes(value);
  let next = previous;

  if (props.multiple) {
    if (isOpen) {
      if (props.collapsible || previous.length > 1) {
        next = previous.filter((item) => item !== value);
      }
    } else {
      next = [...previous, value];
    }
  } else if (isOpen && props.collapsible) {
    next = [];
  } else if (!isOpen) {
    next = [value];
  }

  if (
    next === previous ||
    (next.length === previous.length && next.every((item, index) => item === previous[index]))
  ) {
    return;
  }
  if (!isControlled) {
    internalOpenItems.value = next;
  }
  emit('update:modelValue', [...next]);
  emit('toggle', event, { value, openItems: [...next] });
}

function registerHeader(element: HTMLButtonElement) {
  headers.add(element);
  return () => headers.delete(element);
}

function moveHeaderFocus(element: HTMLButtonElement, direction: 1 | -1) {
  const available = Array.from(headers).filter((header) => !header.disabled && header.isConnected);
  const currentIndex = available.indexOf(element);
  if (currentIndex < 0) {
    return;
  }
  const requested = currentIndex + direction;
  const nextIndex =
    props.navigation === 'circular'
      ? (requested + available.length) % available.length
      : Math.min(Math.max(requested, 0), available.length - 1);
  available[nextIndex]?.focus();
}

provide(accordionContextKey, {
  openItems,
  collapsible: computed(() => props.collapsible),
  multiple: computed(() => props.multiple),
  navigation: computed(() => props.navigation),
  requestToggle,
  registerHeader,
  moveHeaderFocus,
});
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="['fui-Accordion', attrs.class]"
    :style="attrs.style"
    :data-navigation="navigation"
  >
    <slot />
  </div>
</template>

<style>
@import './accordion.css';
</style>

<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { listContextKey } from './listContext';
import type { ListElement, ListEmits, ListProps, ListSlots, ListValue } from './List.types';

defineOptions({
  name: 'FList',
  inheritAttrs: false,
});

const props = defineProps<ListProps>();
const emit = defineEmits<ListEmits>();
defineSlots<ListSlots>();
const attrs = useAttrs();
const isControlled = useIsPropProvided('modelValue');
const internalSelectedItems = ref<ListValue[]>([...(props.defaultSelectedItems ?? [])]);
const selectedItems = computed(() =>
  isControlled ? [...(props.modelValue ?? [])] : internalSelectedItems.value,
);
const rootTag = computed<ListElement>(
  () => props.as ?? (props.navigationMode === 'composite' ? 'div' : 'ul'),
);
const rootRole = computed(
  () =>
    props.role ??
    (props.navigationMode === 'composite' ? 'grid' : props.selectionMode ? 'listbox' : 'list'),
);
const itemRole = computed(() => {
  switch (rootRole.value) {
    case 'grid':
      return 'row';
    case 'listbox':
      return 'option';
    default:
      return 'listitem';
  }
});
const selectable = computed(() => Boolean(props.selectionMode));
const items = new Map<HTMLElement, () => boolean>();
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-multiselectable': _ariaMultiselectable,
    ...rest
  } = attrs;
  return rest;
});

function getAvailableItems() {
  return Array.from(items)
    .flatMap(([element, isNavigable]) => (element.isConnected && isNavigable() ? [element] : []))
    .sort((first, second) => {
      const position = first.compareDocumentPosition(second);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }
      if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      }
      return 0;
    });
}

function registerItem(element: HTMLElement, isNavigable: () => boolean) {
  items.set(element, isNavigable);
  return () => items.delete(element);
}

function moveItemFocus(element: HTMLElement, key: string) {
  const available = getAvailableItems();
  const currentIndex = available.indexOf(element);
  if (currentIndex < 0 || available.length === 0) {
    return;
  }

  const nextIndex =
    key === 'ArrowDown'
      ? Math.min(currentIndex + 1, available.length - 1)
      : key === 'ArrowUp'
        ? Math.max(currentIndex - 1, 0)
        : key === 'Home' || key === 'PageUp'
          ? 0
          : key === 'End' || key === 'PageDown'
            ? available.length - 1
            : undefined;

  if (nextIndex !== undefined) {
    available[nextIndex]?.focus();
  }
}

function getFocusableDescendants(element: HTMLElement) {
  return Array.from(
    element.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((candidate) => candidate.getAttribute('aria-hidden') !== 'true');
}

function moveActionFocus(element: HTMLElement, current: HTMLElement, direction: 1 | -1) {
  if (props.navigationMode !== 'composite') {
    return false;
  }

  const actions = getFocusableDescendants(element);
  const currentIndex = actions.indexOf(current);
  const next = actions[currentIndex + direction];
  if (!next) {
    return false;
  }

  next.focus();
  return true;
}

function enterItem(element: HTMLElement) {
  if (props.navigationMode === 'composite') {
    getFocusableDescendants(element)[0]?.focus();
  }
}

function leaveItem(element: HTMLElement) {
  if (props.navigationMode === 'composite') {
    element.focus();
  }
}

function isSelected(value: ListValue) {
  return selectedItems.value.includes(value);
}

function requestToggle(value: ListValue, event: Event) {
  if (!props.selectionMode) {
    return;
  }

  const current = selectedItems.value;
  const next =
    props.selectionMode === 'single'
      ? [value]
      : current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

  if (!isControlled) {
    internalSelectedItems.value = next;
  }
  emit('update:modelValue', next);
  emit('selectionChange', event, { selectedItems: next });
}

provide(listContextKey, {
  navigationMode: computed(() => props.navigationMode),
  itemRole,
  selectable,
  isSelected,
  requestToggle,
  registerItem,
  moveItemFocus,
  moveActionFocus,
  enterItem,
  leaveItem,
});

defineExpose({
  selectedItems,
});
</script>

<template>
  <component
    :is="rootTag"
    v-bind="rootAttrs"
    :class="['fui-List', attrs.class]"
    :style="attrs.style"
    :role="rootRole"
    :aria-multiselectable="selectionMode === 'multiselect' ? 'true' : undefined"
  >
    <slot />
  </component>
</template>

<style>
@import './list.css';
</style>

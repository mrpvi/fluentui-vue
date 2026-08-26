<script setup lang="ts">
import { computed, inject, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { normalizeCheckedItems, normalizeTreeValues } from './treeState';
import {
  treeContextKey,
  treeLevelContextKey,
  treeRootLevelContextKey,
  type TreeItemRecord,
} from './treeContext';
import type { TreeEmits, TreeProps, TreeSelectionValue, TreeSlots } from './Tree.types';

defineOptions({ name: 'FTree', inheritAttrs: false });

const props = withDefaults(defineProps<TreeProps>(), {
  appearance: 'subtle',
  navigationMode: 'tree',
  size: 'medium',
});
const emit = defineEmits<TreeEmits>();
defineSlots<TreeSlots>();
const attrs = useAttrs();
const inheritedTree = inject(treeContextKey, undefined);
const inheritedRootLevel = inject(treeRootLevelContextKey, undefined);
const nested = Boolean(inheritedTree && inheritedRootLevel);
const openItemsProvided = useIsPropProvided('openItems');
const checkedItemsProvided = useIsPropProvided('checkedItems');
const internalOpenItems = ref(normalizeTreeValues(props.defaultOpenItems));
const internalCheckedItems = ref(normalizeCheckedItems(props.defaultCheckedItems));
const openItems = computed(() =>
  openItemsProvided ? normalizeTreeValues(props.openItems) : internalOpenItems.value,
);
const checkedItems = computed(() =>
  checkedItemsProvided ? normalizeCheckedItems(props.checkedItems) : internalCheckedItems.value,
);
const records = new Map<HTMLElement, TreeItemRecord>();
const revision = ref(0);
const root = ref<HTMLElement | null>(null);
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

function isOpen(value: TreeItemRecord['value']) {
  return inheritedTree?.isOpen(value) ?? openItems.value.includes(value);
}

function getVisibleItems() {
  if (inheritedTree) return inheritedTree.getVisibleItems();
  const element = root.value;
  if (!element) return [];
  return Array.from(element.querySelectorAll<HTMLElement>('[role="treeitem"]')).flatMap(
    (itemElement) => {
      const record = records.get(itemElement);
      if (!record || itemElement.closest('[hidden]')) return [];
      return [record];
    },
  );
}

function registerItem(record: TreeItemRecord) {
  if (inheritedTree) return inheritedTree.registerItem(record);
  records.set(record.element, record);
  return () => records.delete(record.element);
}

function requestOpen(
  value: TreeItemRecord['value'],
  event: MouseEvent | KeyboardEvent,
  type: 'click' | 'expandIconClick' | 'ArrowRight' | 'ArrowLeft',
) {
  if (inheritedTree) {
    inheritedTree.requestOpen(value, event, type);
    return;
  }
  const record = Array.from(records.values()).find((item) => item.value === value);
  if (!record || record.getDisabled() || record.getItemType() !== 'branch') return;
  const nextOpen = !record.getOpen();
  const next = nextOpen
    ? [...openItems.value, record.value]
    : openItems.value.filter((itemValue) => itemValue !== record.value);
  if (!openItemsProvided) internalOpenItems.value = next;
  revision.value += 1;
  emit('update:openItems', next);
  emit('openChange', event, {
    open: nextOpen,
    openItems: next,
    value: record.value,
    target: record.element,
    type,
  });
}

function requestChecked(value: TreeItemRecord['value'], event: Event) {
  if (inheritedTree) {
    inheritedTree.requestChecked(value, event);
    return;
  }
  const record = Array.from(records.values()).find((item) => item.value === value);
  if (!record || !props.selectionMode || record.getDisabled()) return;
  const next = new Map(checkedItems.value);
  const current = next.get(record.value) ?? false;
  const checked: TreeSelectionValue = current === true ? false : true;
  if (props.selectionMode === 'single') next.clear();
  if (checked) next.set(record.value, checked);
  else next.delete(record.value);
  if (!checkedItemsProvided) internalCheckedItems.value = next;
  revision.value += 1;
  emit('update:checkedItems', next);
  emit('checkedChange', event, {
    checked,
    checkedItems: next,
    selectionMode: props.selectionMode,
    target: record.element,
    value: record.value,
  });
}

provide(treeContextKey, {
  appearance: inheritedTree?.appearance ?? computed(() => props.appearance),
  checkedItems: inheritedTree?.checkedItems ?? checkedItems,
  revision: inheritedTree?.revision ?? revision,
  getVisibleItems,
  isOpen,
  navigationMode: inheritedTree?.navigationMode ?? computed(() => props.navigationMode),
  registerItem,
  requestChecked,
  requestOpen,
  selectionMode: inheritedTree?.selectionMode ?? computed(() => props.selectionMode),
  size: inheritedTree?.size ?? computed(() => props.size),
});
const rootLevelContext = inheritedRootLevel ?? {
  level: computed(() => 1),
  parentValue: computed(() => undefined),
};
provide(treeLevelContextKey, rootLevelContext);

defineExpose({
  checkedItems,
  element: root,
  openItems,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-Tree',
      `fui-Tree--${appearance}`,
      `fui-Tree--${size}`,
      { 'fui-Tree--treegrid': navigationMode === 'treegrid' },
      attrs.class,
    ]"
    :style="attrs.style"
    :role="nested ? 'group' : navigationMode === 'treegrid' ? 'treegrid' : 'tree'"
    :aria-multiselectable="!nested && selectionMode === 'multiselect' ? 'true' : undefined"
  >
    <slot />
  </div>
</template>

<style>
@import './tree.css';
</style>

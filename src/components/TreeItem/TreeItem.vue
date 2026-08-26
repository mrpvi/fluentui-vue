<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import {
  treeContextKey,
  treeItemContextKey,
  treeLevelContextKey,
  treeRootLevelContextKey,
  type TreeContextValue,
  type TreeItemRecord,
} from '../Tree/treeContext';
import type { TreeItemEmits, TreeItemProps, TreeItemSlots } from './TreeItem.types';

defineOptions({ name: 'FTreeItem', inheritAttrs: false });

const props = withDefaults(defineProps<TreeItemProps>(), { disabled: false });
const emit = defineEmits<TreeItemEmits>();
defineSlots<TreeItemSlots>();
const attrs = useAttrs();
const openProvided = useIsPropProvided('open');
const injectedTree = inject(treeContextKey);
const injectedParentLevel = inject(treeLevelContextKey);
if (!injectedTree || !injectedParentLevel) {
  throw new Error('FTreeItem must be used inside FTree or FFlatTree.');
}
const tree: TreeContextValue = injectedTree;
const parentLevel = injectedParentLevel;
const root = ref<HTMLElement | null>(null);
const generatedValue = `fui-tree-item-${useId()}`;
const value = computed(() => props.value ?? generatedValue);
const level = computed(() => {
  const attrLevel = Number(attrs['aria-level']);
  return Number.isFinite(attrLevel) && attrLevel > 0 ? attrLevel : parentLevel.level.value;
});
const parentValue = computed(() => props.parentValue ?? parentLevel.parentValue.value);
const open = computed(() => {
  void tree.revision.value;
  return openProvided ? Boolean(props.open) : tree.isOpen(value.value);
});
const checked = computed(() => {
  void tree.revision.value;
  return tree.checkedItems.value.get(value.value) ?? false;
});
const record = computed<TreeItemRecord>(() => ({
  element: root.value as HTMLElement,
  getDisabled: () => props.disabled,
  getItemType: () => props.itemType,
  getLevel: () => level.value,
  getOpen: () => open.value,
  getParentValue: () => parentValue.value,
  value: value.value,
}));
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    tabindex: _tabindex,
    'aria-expanded': _ariaExpanded,
    'aria-level': _ariaLevel,
    'aria-checked': _ariaChecked,
    'aria-selected': _ariaSelected,
    'aria-disabled': _ariaDisabled,
    onClick: _onClick,
    onKeydown: _onKeydown,
    ...rest
  } = attrs;
  return rest;
});
let unregister: (() => void) | undefined;

function requestOpen(
  event: MouseEvent | KeyboardEvent,
  type: 'click' | 'expandIconClick' | 'ArrowRight' | 'ArrowLeft',
) {
  const current = record.value;
  tree.requestOpen(value.value, event, type);
  emit('openChange', event, { open: !open.value, value: value.value, target: current.element });
}

function requestChecked(event: Event) {
  tree.requestChecked(value.value, event);
}

function focusRecord(item?: TreeItemRecord) {
  if (!item || item.getDisabled()) return;
  item.element.focus();
}

function handleClick(event: MouseEvent) {
  if (event.defaultPrevented || props.disabled) return;
  const target = event.target;
  if (target instanceof Element && target.closest('button, a, input, select, textarea')) return;
  if (props.itemType === 'branch') requestOpen(event, 'click');
}

function handleKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || props.disabled || !root.value) return;
  const items = tree.getVisibleItems();
  const currentIndex = items.findIndex((item) => item.element === root.value);
  if (currentIndex < 0) return;

  if (
    event.key === 'ArrowDown' ||
    event.key === 'ArrowUp' ||
    event.key === 'Home' ||
    event.key === 'End'
  ) {
    event.preventDefault();
    const next =
      event.key === 'ArrowDown'
        ? items.slice(currentIndex + 1).find((item) => !item.getDisabled())
        : event.key === 'ArrowUp'
          ? items
              .slice(0, currentIndex)
              .reverse()
              .find((item) => !item.getDisabled())
          : event.key === 'Home'
            ? items.find((item) => !item.getDisabled())
            : [...items].reverse().find((item) => !item.getDisabled());
    focusRecord(next);
    return;
  }

  if (event.key === 'ArrowRight') {
    if (props.itemType === 'branch' && !open.value) {
      event.preventDefault();
      requestOpen(event, 'ArrowRight');
    } else {
      const child = items
        .slice(currentIndex + 1)
        .find(
          (item) => item.getLevel() === level.value + 1 && item.getParentValue() === value.value,
        );
      if (child) {
        event.preventDefault();
        focusRecord(child);
      }
    }
    return;
  }

  if (event.key === 'ArrowLeft') {
    if (props.itemType === 'branch' && open.value) {
      event.preventDefault();
      requestOpen(event, 'ArrowLeft');
    } else {
      const parent = items.find((item) => item.value === parentValue.value);
      if (parent) {
        event.preventDefault();
        focusRecord(parent);
      }
    }
    return;
  }

  if (event.key === ' ' && tree.selectionMode.value) {
    event.preventDefault();
    requestChecked(event);
  } else if (event.key === 'Enter' && props.itemType === 'branch') {
    event.preventDefault();
    requestOpen(event, 'click');
  }
}

provide(treeItemContextKey, {
  checked,
  itemType: computed(() => props.itemType),
  level,
  open,
  selectionMode: tree.selectionMode,
  toggleChecked: requestChecked,
  toggleOpen: requestOpen,
  value,
});
provide(treeRootLevelContextKey, {
  level: computed(() => level.value + 1),
  parentValue: value,
});

onMounted(() => {
  if (root.value) unregister = tree.registerItem(record.value);
});
onBeforeUnmount(() => unregister?.());

defineExpose({ element: root, focus: () => root.value?.focus(), open, value });
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-TreeItem',
      `fui-TreeItem--${itemType}`,
      { 'fui-TreeItem--open': open, 'fui-TreeItem--disabled': disabled },
      attrs.class,
    ]"
    :style="[{ '--fui-tree-item-level': level }, attrs.style]"
    role="treeitem"
    :tabindex="disabled ? undefined : Number(attrs.tabindex) || 0"
    :aria-expanded="itemType === 'branch' ? open : undefined"
    :aria-level="level"
    :aria-checked="tree.selectionMode.value ? checked : undefined"
    :aria-selected="tree.selectionMode.value === 'single' ? checked === true : undefined"
    :aria-disabled="disabled || undefined"
    @click.self="handleClick"
    @keydown.self="handleKeydown"
  >
    <slot />
  </div>
</template>

<style>
@import './treeItem.css';
</style>

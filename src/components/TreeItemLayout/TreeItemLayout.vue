<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import { treeItemContextKey, type TreeItemContextValue } from '../Tree/treeContext';
import type { TreeItemLayoutProps, TreeItemLayoutSlots } from './TreeItemLayout.types';

defineOptions({ name: 'FTreeItemLayout', inheritAttrs: false });
withDefaults(defineProps<TreeItemLayoutProps>(), { actionsVisible: false });
defineSlots<TreeItemLayoutSlots>();
const attrs = useAttrs();
const injectedItem = inject(treeItemContextKey);
if (!injectedItem) throw new Error('FTreeItemLayout must be used inside FTreeItem.');
const item: TreeItemContextValue = injectedItem;
const root = ref<HTMLElement | null>(null);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

function handleExpand(event: MouseEvent) {
  event.stopPropagation();
  item.toggleOpen(event, 'expandIconClick');
}
function handleSelect(event: Event) {
  event.stopPropagation();
  item.toggleChecked(event);
}

defineExpose({ element: root });
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-TreeItemLayout',
      { 'fui-TreeItemLayout--actions-visible': actionsVisible },
      attrs.class,
    ]"
    :style="attrs.style"
  >
    <button
      v-if="item.itemType.value === 'branch'"
      class="fui-TreeItemLayout__expandIcon"
      type="button"
      tabindex="-1"
      :aria-label="item.open.value ? 'Collapse' : 'Expand'"
      :aria-expanded="item.open.value"
      @click="handleExpand"
    >
      <slot name="expandIcon">
        <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
          <path
            d="M5.65 3.15a.5.5 0 0 1 .7 0l4.5 4.5a.5.5 0 0 1 0 .7l-4.5 4.5a.5.5 0 0 1-.7-.7L9.79 8 5.65 3.85a.5.5 0 0 1 0-.7Z"
          />
        </svg>
      </slot>
    </button>
    <span v-else class="fui-TreeItemLayout__expandIcon fui-TreeItemLayout__expandIcon--empty" />

    <span
      v-if="item.selectionMode.value"
      class="fui-TreeItemLayout__selector"
      @click="handleSelect"
    >
      <slot name="selector" :checked="item.checked.value" :disabled="false">
        <span
          :role="item.selectionMode.value === 'single' ? 'radio' : 'checkbox'"
          :aria-checked="item.checked.value"
          tabindex="-1"
          class="fui-TreeItemLayout__selectorControl"
        >
          <span v-if="item.checked.value === true">✓</span>
          <span v-else-if="item.checked.value === 'mixed'">−</span>
        </span>
      </slot>
    </span>
    <span v-if="$slots.iconBefore" class="fui-TreeItemLayout__iconBefore"
      ><slot name="iconBefore"
    /></span>
    <span class="fui-TreeItemLayout__main"><slot /></span>
    <span v-if="$slots.iconAfter" class="fui-TreeItemLayout__iconAfter"
      ><slot name="iconAfter"
    /></span>
    <span v-if="$slots.aside" class="fui-TreeItemLayout__aside"><slot name="aside" /></span>
    <span v-if="$slots.actions" class="fui-TreeItemLayout__actions"><slot name="actions" /></span>
  </div>
</template>

<style>
@import './treeItemLayout.css';
</style>

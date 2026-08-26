<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs } from 'vue';
import { overflowContextKey, type OverflowItemRecord } from './overflowContext';
import type { OverflowEmits, OverflowProps, OverflowSlots, OverflowState } from './Overflow.types';

defineOptions({ name: 'FOverflow', inheritAttrs: false });
const props = withDefaults(defineProps<OverflowProps>(), {
  minimumVisible: 0,
  overflowAxis: 'horizontal',
  overflowDirection: 'end',
  padding: 0,
});
const emit = defineEmits<OverflowEmits>();
defineSlots<OverflowSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const records = new Map<HTMLElement, OverflowItemRecord>();
const state = ref<OverflowState>({
  groupVisibility: {},
  hasOverflow: false,
  itemVisibility: {},
  overflowCount: 0,
});
let resizeObserver: ResizeObserver | undefined;
let mutationObserver: MutationObserver | undefined;
let frame = 0;
let mounted = false;
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

function sortedRecords() {
  return Array.from(records.values()).sort((first, second) => {
    const position = first.element.compareDocumentPosition(second.element);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });
}

function measure(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const margin =
    props.overflowAxis === 'horizontal'
      ? Number.parseFloat(style.marginInlineStart) + Number.parseFloat(style.marginInlineEnd)
      : Number.parseFloat(style.marginBlockStart) + Number.parseFloat(style.marginBlockEnd);
  const fallback = props.overflowAxis === 'horizontal' ? element.offsetWidth : element.offsetHeight;
  const rectSize = props.overflowAxis === 'horizontal' ? rect.width : rect.height;
  return Math.max(rectSize || fallback, 0) + (Number.isFinite(margin) ? margin : 0);
}

function computeState() {
  const element = root.value;
  if (!element) return;
  const ordered = sortedRecords();
  const items = ordered.filter((record) => record.type === 'item');
  const dividers = ordered.filter((record) => record.type === 'divider');
  const available = Math.max(
    0,
    (props.overflowAxis === 'horizontal' ? element.clientWidth : element.clientHeight) -
      props.padding,
  );
  const sizes = new Map(ordered.map((record) => [record.id, measure(record.element)]));
  const visible = new Set(items.map((record) => record.id));
  const isDividerVisible = (divider: OverflowItemRecord) => {
    const index = ordered.indexOf(divider);
    const hasVisibleBefore = ordered
      .slice(0, index)
      .some((record) => record.type === 'item' && visible.has(record.id));
    const hasVisibleAfter = ordered
      .slice(index + 1)
      .some((record) => record.type === 'item' && visible.has(record.id));
    if (!hasVisibleBefore || !hasVisibleAfter) return false;
    if (!divider.groupId) return true;
    const groupItems = items.filter((item) => item.groupId === divider.groupId);
    return groupItems.length > 0 && groupItems.every((item) => visible.has(item.id));
  };
  const visibleDividerSize = () =>
    dividers.reduce(
      (sum, divider) => sum + (isDividerVisible(divider) ? (sizes.get(divider.id) ?? 0) : 0),
      0,
    );
  const occupiedSize = () =>
    items.reduce(
      (sum, record) => sum + (visible.has(record.id) ? (sizes.get(record.id) ?? 0) : 0),
      visibleDividerSize(),
    );
  const minimumVisible = Math.min(props.minimumVisible, items.length);
  const candidates = items
    .filter((record) => !record.pinned)
    .sort((first, second) => {
      if (first.priority !== second.priority) return first.priority - second.priority;
      const firstIndex = items.indexOf(first);
      const secondIndex = items.indexOf(second);
      return props.overflowDirection === 'end'
        ? secondIndex - firstIndex
        : firstIndex - secondIndex;
    });

  while (occupiedSize() > available && visible.size > minimumVisible && candidates.length) {
    const record = candidates.shift();
    if (!record) continue;
    visible.delete(record.id);
  }

  const itemVisibility = Object.fromEntries(
    items.map((record) => [record.id, visible.has(record.id)]),
  );
  const groupIds = new Set(ordered.flatMap((record) => (record.groupId ? [record.groupId] : [])));
  const groupVisibility: OverflowState['groupVisibility'] = {};
  for (const groupId of groupIds) {
    const groupItems = items.filter((record) => record.groupId === groupId);
    const visibleCount = groupItems.filter((record) => visible.has(record.id)).length;
    groupVisibility[groupId] =
      visibleCount === 0
        ? 'hidden'
        : visibleCount === groupItems.length
          ? 'visible'
          : 'partially-visible';
  }

  for (const record of items) {
    const isVisible = visible.has(record.id);
    record.element.hidden = !isVisible;
    record.element.setAttribute('data-overflowing', String(!isVisible));
  }
  for (const divider of dividers) {
    const isVisible = isDividerVisible(divider);
    divider.element.hidden = !isVisible;
    divider.element.setAttribute('data-overflowing', String(!isVisible));
  }

  const next: OverflowState = {
    groupVisibility,
    hasOverflow: props.hasHiddenItems || visible.size < items.length,
    itemVisibility,
    overflowCount: items.length - visible.size,
  };
  if (JSON.stringify(next) !== JSON.stringify(state.value)) {
    state.value = next;
    emit('overflowChange', next);
  }
}

function updateOverflow() {
  if (!mounted || typeof window === 'undefined') return;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(computeState);
}

function registerItem(record: OverflowItemRecord) {
  records.set(record.element, record);
  nextTick(updateOverflow);
  return () => {
    records.delete(record.element);
    updateOverflow();
  };
}

provide(overflowContextKey, { registerItem, updateOverflow });

onMounted(() => {
  mounted = true;
  if (!root.value) return;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(root.value);
  }
  if (typeof MutationObserver !== 'undefined') {
    mutationObserver = new MutationObserver(updateOverflow);
    mutationObserver.observe(root.value, { childList: true, subtree: true });
  }
  updateOverflow();
});
onBeforeUnmount(() => {
  mounted = false;
  resizeObserver?.disconnect();
  mutationObserver?.disconnect();
  if (typeof window !== 'undefined') cancelAnimationFrame(frame);
});

defineExpose({ element: root, state, updateOverflow });
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="['fui-Overflow', `fui-Overflow--${overflowAxis}`, attrs.class]"
    :style="attrs.style"
    :data-overflowing="state.hasOverflow ? 'true' : 'false'"
  >
    <slot v-bind="state" />
  </div>
</template>

<style>
@import './overflow.css';
</style>

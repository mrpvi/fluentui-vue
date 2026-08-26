<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { ToolbarEmits, ToolbarProps, ToolbarSlots } from './Toolbar.types';
import { toolbarContextKey } from './toolbarContext';

defineOptions({ name: 'FToolbar', inheritAttrs: false });
const props = withDefaults(defineProps<ToolbarProps>(), {
  size: 'medium',
  vertical: false,
  defaultCheckedValues: () => ({}),
  circularNavigation: true,
});
const emit = defineEmits<ToolbarEmits>();
defineSlots<ToolbarSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const controlled = useIsPropProvided('checkedValues');
const internalCheckedValues = ref({ ...props.defaultCheckedValues });
const size = computed(() => props.size);
const vertical = computed(() => props.vertical);
const checkedValues = computed(() =>
  controlled ? (props.checkedValues ?? {}) : internalCheckedValues.value,
);

function update(event: MouseEvent, name: string, checkedItems: string[]) {
  const next = { ...checkedValues.value, [name]: checkedItems };
  if (!controlled) internalCheckedValues.value = next;
  emit('update:checkedValues', next);
  emit('checkedValueChange', event, { name, checkedItems });
}
function toggle(event: MouseEvent, name: string, value: string) {
  const current = checkedValues.value[name] ?? [];
  update(
    event,
    name,
    current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
  );
}
function selectRadio(event: MouseEvent, name: string, value: string) {
  update(event, name, [value]);
}
function controls() {
  if (!root.value) return [];
  return Array.from(
    root.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])',
    ),
  ).filter((element) => element.getAttribute('aria-disabled') !== 'true');
}
function keydown(event: KeyboardEvent) {
  const previousKeys = props.vertical ? ['ArrowUp'] : ['ArrowLeft'];
  const nextKeys = props.vertical ? ['ArrowDown'] : ['ArrowRight'];
  if (![...previousKeys, ...nextKeys, 'Home', 'End'].includes(event.key)) return;
  const items = controls();
  if (!items.length) return;
  const current = items.indexOf(document.activeElement as HTMLElement);
  let next: number;
  if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = items.length - 1;
  else if (nextKeys.includes(event.key)) next = current + 1;
  else next = current - 1;
  if (props.circularNavigation) next = (next + items.length) % items.length;
  else next = Math.max(0, Math.min(items.length - 1, next));
  event.preventDefault();
  items[next]?.focus();
}

provide(toolbarContextKey, { size, vertical, checkedValues, toggle, selectRadio });
defineExpose({ element: root, checkedValues, focus: () => controls()[0]?.focus() });
</script>

<template>
  <div
    ref="root"
    v-bind="attrs"
    :class="[
      'fui-Toolbar',
      `fui-Toolbar--${size}`,
      { 'fui-Toolbar--vertical': vertical },
      attrs.class,
    ]"
    :style="attrs.style"
    role="toolbar"
    :aria-orientation="vertical ? 'vertical' : undefined"
    @keydown="keydown"
  >
    <slot />
  </div>
</template>

<style>
@import './toolbar.css';
</style>

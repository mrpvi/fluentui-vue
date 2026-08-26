<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { focusAdjacentTag, tagGroupContextKey } from './tagContext';
import type { TagGroupEmits, TagGroupProps } from './Tag.types';

defineOptions({ name: 'FTagGroup', inheritAttrs: false });
const props = withDefaults(defineProps<TagGroupProps>(), {
  appearance: 'filled',
  disabled: false,
  dismissible: false,
  role: 'toolbar',
  size: 'medium',
});
const emit = defineEmits<TagGroupEmits>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, role: _role, onKeydown: _keydown, ...rest } = attrs;
  return rest;
});
const internalSelectedValues = ref([...(props.defaultSelectedValues ?? [])]);
const controlled = useIsPropProvided('modelValue');
const selectedValues = computed(() =>
  controlled ? [...(props.modelValue ?? [])] : internalSelectedValues.value,
);

function dismissTag(event: MouseEvent | KeyboardEvent, value: string) {
  emit('dismiss', event, { value });
  if (!event.defaultPrevented && root.value?.contains(document.activeElement)) {
    queueMicrotask(() => focusAdjacentTag(root, event.currentTarget));
  }
}

function selectTag(event: MouseEvent | KeyboardEvent, value: string) {
  const next = selectedValues.value.includes(value)
    ? selectedValues.value.filter((item) => item !== value)
    : [...selectedValues.value, value];
  if (!controlled) internalSelectedValues.value = next;
  emit('update:modelValue', next);
  emit('tagSelect', event, { selectedValues: next, value });
}

function handleKeydown(event: KeyboardEvent) {
  const handler = attrs.onKeydown;
  if (typeof handler === 'function') handler(event);
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  const focusable = root.value
    ? [...root.value.querySelectorAll<HTMLElement>('button:not(:disabled)')]
    : [];
  const index = focusable.indexOf(document.activeElement as HTMLElement);
  let next: HTMLElement | undefined;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = focusable[(index + 1 + focusable.length) % focusable.length];
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = focusable[(index - 1 + focusable.length) % focusable.length];
  } else if (event.key === 'Home') {
    next = focusable[0];
  } else if (event.key === 'End') {
    next = focusable.at(-1);
  }
  if (next) {
    event.preventDefault();
    next.focus();
  }
}

provide(tagGroupContextKey, {
  appearance: computed(() => props.appearance),
  disabled: computed(() => props.disabled),
  dismissible: computed(() => props.dismissible),
  role: computed(() => props.role),
  selectedValues,
  size: computed(() => props.size),
  dismissTag,
  selectTag,
});

defineExpose({ element: root, selectedValues });
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="['fui-TagGroup', attrs.class]"
    :style="attrs.style"
    :role="role"
    :aria-disabled="disabled || undefined"
    :aria-multiselectable="role === 'listbox' ? 'true' : undefined"
    @keydown="handleKeydown"
  >
    <slot />
  </div>
</template>

<style>
@import './tag.css';
</style>

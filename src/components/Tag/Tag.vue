<script setup lang="ts">
import { computed, inject, ref, useAttrs, useId } from 'vue';
import { tagGroupContextKey } from './tagContext';
import type { TagProps, TagSlots } from './Tag.types';

defineOptions({ name: 'FTag', inheritAttrs: false });
const props = withDefaults(defineProps<TagProps>(), {
  appearance: undefined,
  disabled: false,
  dismissible: undefined,
  selected: false,
  shape: 'rounded',
  size: undefined,
});
defineSlots<TagSlots>();
const attrs = useAttrs();
const group = inject(tagGroupContextKey, undefined);
const root = ref<HTMLButtonElement | HTMLSpanElement | null>(null);
const id = `fui-tag-${useId()}`;
const value = computed(() => props.value ?? String(attrs.id ?? id));
const appearance = computed(() => props.appearance ?? group?.appearance.value ?? 'filled');
const size = computed(() => props.size ?? group?.size.value ?? 'medium');
const disabled = computed(() => Boolean(props.disabled || group?.disabled.value));
const dismissible = computed(() => props.dismissible ?? group?.dismissible.value ?? false);
const selected = computed(
  () => group?.selectedValues.value.includes(value.value) || props.selected,
);
const selectable = computed(() => group?.role.value === 'listbox');

function invoke(name: string, event: Event) {
  const handlers = Array.isArray(attrs[name]) ? attrs[name] : [attrs[name]];
  for (const handler of handlers) if (typeof handler === 'function') handler(event);
}
function handleClick(event: MouseEvent) {
  invoke('onClick', event);
  if (event.defaultPrevented || disabled.value) return;
  if (dismissible.value) group?.dismissTag(event, value.value);
  else if (selectable.value) group?.selectTag(event, value.value);
}
function handleKeydown(event: KeyboardEvent) {
  invoke('onKeydown', event);
  if (
    !event.defaultPrevented &&
    !disabled.value &&
    dismissible.value &&
    (event.key === 'Delete' || event.key === 'Backspace')
  ) {
    event.preventDefault();
    group?.dismissTag(event, value.value);
  }
}
const rootAttrs = computed(() => {
  const { class: _class, style: _style, onClick: _click, onKeydown: _key, ...rest } = attrs;
  return rest;
});

defineExpose({ element: root });
</script>

<template>
  <component
    :is="dismissible || selectable ? 'button' : 'span'"
    :id="String(attrs.id ?? id)"
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-Tag',
      `fui-Tag--${appearance}`,
      `fui-Tag--${shape}`,
      `fui-Tag--${size}`,
      { 'fui-Tag--disabled': disabled, 'fui-Tag--selected': selected },
      attrs.class,
    ]"
    :style="attrs.style"
    :type="dismissible || selectable ? 'button' : undefined"
    :disabled="dismissible || selectable ? disabled : undefined"
    :role="selectable ? 'option' : undefined"
    :aria-selected="selectable ? selected : undefined"
    :aria-pressed="!selectable && selected ? 'true' : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="$slots.media" class="fui-Tag__media"><slot name="media" /></span>
    <span v-else-if="$slots.icon" class="fui-Tag__icon"><slot name="icon" /></span>
    <span class="fui-Tag__primaryText"><slot /></span>
    <span v-if="$slots['secondary-text']" class="fui-Tag__secondaryText">
      <slot name="secondary-text" />
    </span>
    <span v-if="dismissible" class="fui-Tag__dismissIcon" aria-hidden="true">
      <slot name="dismiss-icon">
        <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
          <path
            d="M4.15 4.15a.5.5 0 0 1 .7 0L8 7.29l3.15-3.14a.5.5 0 1 1 .7.7L8.71 8l3.14 3.15a.5.5 0 0 1-.7.7L8 8.71l-3.15 3.14a.5.5 0 0 1-.7-.7L7.29 8 4.15 4.85a.5.5 0 0 1 0-.7Z"
          />
        </svg>
      </slot>
    </span>
  </component>
</template>

<style>
@import './tag.css';
</style>

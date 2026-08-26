<script setup lang="ts">
import { computed, inject, provide, ref, useAttrs, useId } from 'vue';
import { interactionTagContextKey, tagGroupContextKey } from './tagContext';
import type { InteractionTagProps } from './Tag.types';

defineOptions({ name: 'FInteractionTag', inheritAttrs: false });
const props = withDefaults(defineProps<InteractionTagProps>(), {
  appearance: undefined,
  disabled: false,
  selected: false,
  shape: 'rounded',
  size: undefined,
});
const attrs = useAttrs();
const group = inject(tagGroupContextKey, undefined);
const root = ref<HTMLDivElement | null>(null);
const id = `fui-interaction-tag-${useId()}`;
const primaryId = `fui-interaction-tag-primary-${useId()}`;
const value = computed(() => props.value ?? String(attrs.id ?? id));
const appearance = computed(() => props.appearance ?? group?.appearance.value ?? 'filled');
const size = computed(() => props.size ?? group?.size.value ?? 'medium');
const disabled = computed(() => Boolean(props.disabled || group?.disabled.value));
const selected = computed(
  () => group?.selectedValues.value.includes(value.value) || props.selected,
);
function dismiss(event: MouseEvent | KeyboardEvent) {
  if (!disabled.value) group?.dismissTag(event, value.value);
}
function select(event: MouseEvent | KeyboardEvent) {
  if (!disabled.value) group?.selectTag(event, value.value);
}
provide(interactionTagContextKey, {
  appearance,
  disabled,
  primaryId,
  selected,
  shape: computed(() => props.shape),
  size,
  value,
  dismiss,
  select,
});
defineExpose({ element: root });
</script>

<template>
  <div
    :id="String(attrs.id ?? id)"
    ref="root"
    v-bind="attrs"
    :class="[
      'fui-InteractionTag',
      `fui-InteractionTag--${appearance}`,
      `fui-InteractionTag--${shape}`,
      `fui-InteractionTag--${size}`,
      { 'fui-InteractionTag--disabled': disabled, 'fui-InteractionTag--selected': selected },
      attrs.class,
    ]"
    :style="attrs.style"
  >
    <slot />
  </div>
</template>

<style>
@import './tag.css';
</style>

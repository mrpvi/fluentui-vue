<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import type { ToolbarButtonEmits, ToolbarButtonProps, ToolbarButtonSlots } from './Toolbar.types';
import { toolbarContextKey } from './toolbarContext';

defineOptions({ name: 'FToolbarButton', inheritAttrs: false });
const props = withDefaults(defineProps<ToolbarButtonProps>(), {
  appearance: 'subtle',
  disabled: false,
  disabledFocusable: false,
  iconPosition: 'before',
});
const emit = defineEmits<ToolbarButtonEmits>();
const slots = defineSlots<ToolbarButtonSlots>();
const attrs = useAttrs();
const context = inject(toolbarContextKey);
const root = ref<HTMLButtonElement | null>(null);
const size = computed(() => props.size ?? context?.size.value ?? 'medium');
const vertical = computed(() => props.vertical ?? context?.vertical.value ?? false);
const iconOnly = computed(() => Boolean(slots.icon) && !slots.default);
const disabledFocusable = computed(() => props.disabledFocusable && !props.disabled);
function click(event: MouseEvent) {
  if (props.disabled || disabledFocusable.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  emit('click', event);
}
defineExpose({ element: root, focus: () => root.value?.focus() });
</script>

<template>
  <button
    ref="root"
    v-bind="attrs"
    :class="[
      'fui-Button',
      'fui-ToolbarButton',
      `fui-Button--${appearance}`,
      `fui-Button--${size}`,
      'fui-Button--rounded',
      {
        'fui-ToolbarButton--vertical': vertical,
        'fui-Button--with-icon': Boolean($slots.icon),
        'fui-Button--icon-only': iconOnly,
        [`fui-Button--icon-only-${size}`]: iconOnly,
        'fui-Button--disabled': disabled,
        'fui-Button--disabled-focusable': disabledFocusable,
      },
      attrs.class,
    ]"
    :style="attrs.style"
    :type="(attrs.type as HTMLButtonElement['type'] | undefined) ?? 'button'"
    :disabled="disabled ? true : undefined"
    :aria-disabled="disabledFocusable ? 'true' : undefined"
    @click="click"
  >
    <span
      v-if="$slots.icon && iconPosition === 'before'"
      :class="[
        'fui-Button__icon',
        `fui-Button__icon--${size}`,
        { 'fui-Button__icon--before': !iconOnly },
      ]"
      aria-hidden="true"
      ><slot name="icon"
    /></span>
    <slot v-if="!iconOnly" />
    <span
      v-if="$slots.icon && iconPosition === 'after'"
      :class="[
        'fui-Button__icon',
        `fui-Button__icon--${size}`,
        { 'fui-Button__icon--after': !iconOnly },
      ]"
      aria-hidden="true"
      ><slot name="icon"
    /></span>
  </button>
</template>

<style>
@import '../Button/button.css';
@import './toolbar.css';
</style>

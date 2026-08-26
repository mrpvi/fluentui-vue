<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import type { ToolbarRadioButtonProps, ToolbarRadioButtonSlots } from './Toolbar.types';
import { toolbarContextKey } from './toolbarContext';

defineOptions({ name: 'FToolbarRadioButton', inheritAttrs: false });
const props = withDefaults(defineProps<ToolbarRadioButtonProps>(), {
  appearance: 'subtle',
  disabled: false,
  disabledFocusable: false,
  iconPosition: 'before',
});
const slots = defineSlots<ToolbarRadioButtonSlots>();
const attrs = useAttrs();
const injectedContext = inject(toolbarContextKey);
if (!injectedContext) throw new Error('FToolbarRadioButton must be used inside FToolbar.');
const context = injectedContext;
const root = ref<HTMLButtonElement | null>(null);
const size = computed(() => props.size ?? context.size.value);
const checked = computed(
  () => context.checkedValues.value[props.name]?.includes(props.value) ?? false,
);
const iconOnly = computed(() => Boolean(slots.icon) && !slots.default);
const disabledFocusable = computed(() => props.disabledFocusable && !props.disabled);
function click(event: MouseEvent) {
  if (props.disabled || disabledFocusable.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  context.selectRadio(event, props.name, props.value);
}
defineExpose({ element: root, checked, focus: () => root.value?.focus() });
</script>

<template>
  <button
    ref="root"
    v-bind="attrs"
    :class="[
      'fui-Button',
      'fui-ToggleButton',
      'fui-ToolbarRadioButton',
      `fui-Button--${appearance}`,
      `fui-Button--${size}`,
      'fui-Button--rounded',
      `fui-ToggleButton--${appearance}`,
      {
        'fui-ToggleButton--checked': checked,
        'fui-ToolbarRadioButton--checked': checked,
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
    role="radio"
    :aria-checked="checked ? 'true' : 'false'"
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
@import '../ToggleButton/toggleButton.css';
@import './toolbar.css';
</style>

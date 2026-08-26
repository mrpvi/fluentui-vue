<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { menuContextKey } from '../Menu/menuContext';
import type { MenuButtonEmits, MenuButtonProps, MenuButtonSlots } from './MenuButton.types';

defineOptions({ name: 'FMenuButton', inheritAttrs: false });

const props = withDefaults(defineProps<MenuButtonProps>(), {
  appearance: 'secondary',
  shape: 'rounded',
  size: 'medium',
  disabled: false,
  disabledFocusable: false,
  defaultOpen: false,
  menuIcon: true,
});
const emit = defineEmits<MenuButtonEmits>();
const slots = defineSlots<MenuButtonSlots>();
const attrs = useAttrs();
const root = ref<HTMLButtonElement | null>(null);
const menuContext = inject(menuContextKey, null);
const controlled = useIsPropProvided('modelValue');
const internalOpen = ref(props.defaultOpen);
const open = computed(() =>
  menuContext
    ? menuContext.open.value
    : controlled
      ? Boolean(props.modelValue)
      : internalOpen.value,
);
const isDisabledFocusable = computed(() => props.disabledFocusable && !props.disabled);
const isDisabled = computed(() => props.disabled || isDisabledFocusable.value);
const iconOnly = computed(() => Boolean(slots.icon) && !slots.default);
const classes = computed(() => [
  'fui-Button',
  'fui-MenuButton',
  `fui-Button--${props.appearance}`,
  `fui-Button--${props.shape}`,
  `fui-Button--${props.size}`,
  {
    'fui-Button--with-icon': Boolean(slots.icon),
    'fui-Button--icon-only': iconOnly.value,
    [`fui-Button--icon-only-${props.size}`]: iconOnly.value,
    'fui-Button--disabled': props.disabled,
    'fui-Button--disabled-focusable': isDisabledFocusable.value,
    'fui-MenuButton--open': open.value,
  },
  attrs.class,
]);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    type: _type,
    role: _role,
    disabled: _disabled,
    'aria-disabled': _ariaDisabled,
    'aria-haspopup': _ariaHaspopup,
    'aria-expanded': _ariaExpanded,
    onClick: _onClick,
    ...rest
  } = attrs;
  return rest;
});

function requestOpen(next: boolean, event: Event) {
  if (menuContext) {
    menuContext.requestOpen(next, event, 'menuTriggerClick');
    return;
  }
  if (!controlled) internalOpen.value = next;
  emit('update:modelValue', next);
}
function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  emit('click', event);
  if (event.defaultPrevented) return;
  requestOpen(!open.value, event);
}
function handleKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return;
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (menuContext) menuContext.requestOpen(true, event, 'menuTriggerKeyDown');
  }
}
onMounted(() => {
  if (menuContext) menuContext.registerTrigger(root.value);
});

defineExpose({ element: root, open, focus: () => root.value?.focus() });
</script>

<template>
  <button
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    :type="(attrs.type as HTMLButtonElement['type'] | undefined) ?? 'button'"
    :disabled="disabled ? true : undefined"
    :aria-disabled="isDisabledFocusable ? 'true' : undefined"
    aria-haspopup="menu"
    :aria-expanded="open ? 'true' : 'false'"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span
      v-if="$slots.icon"
      :class="[
        'fui-Button__icon',
        `fui-Button__icon--${size}`,
        { 'fui-Button__icon--before': !iconOnly },
      ]"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
    <slot v-if="!iconOnly" />
    <span v-if="menuIcon" class="fui-MenuButton__menuIcon" aria-hidden="true">
      <slot name="menu-icon">
        <svg viewBox="0 0 12 12" focusable="false">
          <path d="M2.2 4.3 6 8l3.8-3.7.7.7L6 9.4 1.5 5z" />
        </svg>
      </slot>
    </span>
  </button>
</template>

<style>
@import '../Button/button.css';
@import './menuButton.css';
</style>

<script setup lang="ts">
import { computed, ref, useAttrs, watchEffect } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  ToggleButtonAppearance,
  ToggleButtonEmits,
  ToggleButtonProps,
  ToggleButtonShape,
  ToggleButtonSize,
  ToggleButtonSlots,
} from './ToggleButton.types';

defineOptions({
  name: 'FToggleButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  appearance: 'secondary',
  shape: 'rounded',
  size: 'medium',
  disabled: false,
  disabledFocusable: false,
  iconPosition: 'before',
  defaultChecked: false,
  isAccessible: false,
});

const emit = defineEmits<ToggleButtonEmits>();
const slots = defineSlots<ToggleButtonSlots>();
const attrs = useAttrs();
const root = ref<HTMLButtonElement | null>(null);
const isControlled = useIsPropProvided('modelValue');
const internalChecked = ref(props.defaultChecked);
const checked = computed(() =>
  isControlled ? (props.modelValue ?? false) : internalChecked.value,
);
const isDisabledFocusable = computed(() => props.disabledFocusable && !props.disabled);
const isDisabled = computed(() => props.disabled || isDisabledFocusable.value);
const iconOnly = computed(() => Boolean(slots.icon) && !slots.default);
const hasAccessibleName = computed(() => Boolean(attrs['aria-label'] || attrs['aria-labelledby']));

if (import.meta.env.DEV) {
  let warnedAboutMissingName = false;

  watchEffect(() => {
    if (iconOnly.value && !hasAccessibleName.value) {
      if (!warnedAboutMissingName) {
        console.warn(
          '[FToggleButton] Icon-only toggle buttons require an accessible name through aria-label or aria-labelledby.',
        );
        warnedAboutMissingName = true;
      }
    } else {
      warnedAboutMissingName = false;
    }
  });
}

const classes = computed(() => [
  'fui-Button',
  'fui-ToggleButton',
  `fui-Button--${props.appearance satisfies ToggleButtonAppearance}`,
  `fui-Button--${props.shape satisfies ToggleButtonShape}`,
  `fui-Button--${props.size satisfies ToggleButtonSize}`,
  `fui-ToggleButton--${props.appearance satisfies ToggleButtonAppearance}`,
  {
    'fui-Button--with-icon': Boolean(slots.icon),
    'fui-Button--icon-only': iconOnly.value,
    [`fui-Button--icon-only-${props.size}`]: iconOnly.value,
    'fui-Button--disabled': props.disabled,
    'fui-Button--disabled-focusable': isDisabledFocusable.value,
    'fui-ToggleButton--checked': checked.value,
    'fui-ToggleButton--accessible': props.isAccessible,
    'fui-ToggleButton--disabled': props.disabled,
    'fui-ToggleButton--disabled-focusable': isDisabledFocusable.value,
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
    'aria-pressed': _ariaPressed,
    'aria-checked': _ariaChecked,
    onClick: _onClick,
    onKeydown: _onKeydown,
    onKeyup: _onKeyup,
    ...rest
  } = attrs;
  return rest;
});

const rootType = computed(() => (attrs.type as HTMLButtonElement['type'] | undefined) ?? 'button');

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }

  emit('click', event);

  if (event.defaultPrevented) {
    return;
  }

  const nextChecked = !checked.value;
  if (!isControlled) {
    internalChecked.value = nextChecked;
  }
  emit('update:modelValue', nextChecked);
}

function handleKeydown(event: KeyboardEvent) {
  if (isDisabledFocusable.value && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
  }
}

defineExpose({
  element: root,
  focus: () => root.value?.focus(),
});
</script>

<template>
  <button
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    :type="rootType"
    :disabled="disabled ? true : undefined"
    :aria-disabled="isDisabledFocusable ? 'true' : undefined"
    :aria-pressed="checked ? 'true' : 'false'"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span
      v-if="$slots.icon && iconPosition === 'before'"
      :class="[
        'fui-Button__icon',
        'fui-ToggleButton__icon',
        `fui-Button__icon--${size}`,
        { 'fui-Button__icon--before': !iconOnly },
      ]"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>

    <slot v-if="!iconOnly" />

    <span
      v-if="$slots.icon && iconPosition === 'after'"
      :class="[
        'fui-Button__icon',
        'fui-ToggleButton__icon',
        `fui-Button__icon--${size}`,
        { 'fui-Button__icon--after': !iconOnly },
      ]"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
  </button>
</template>

<style>
@import '../Button/button.css';
@import './toggleButton.css';
</style>

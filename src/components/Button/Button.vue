<script setup lang="ts">
import { computed, ref, useAttrs, watchEffect } from 'vue';
import type {
  ButtonAppearance,
  ButtonEmits,
  ButtonProps,
  ButtonShape,
  ButtonSize,
  ButtonSlots,
} from './Button.types';

defineOptions({
  name: 'FButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
  appearance: 'secondary',
  shape: 'rounded',
  size: 'medium',
  disabled: false,
  disabledFocusable: false,
  iconPosition: 'before',
});

const emit = defineEmits<ButtonEmits>();
const slots = defineSlots<ButtonSlots>();
const attrs = useAttrs();
const root = ref<HTMLButtonElement | HTMLAnchorElement | null>(null);

const isDisabled = computed(() => props.disabled || props.disabledFocusable);
const iconOnly = computed(() => Boolean(slots.icon) && !slots.default);
const hasAccessibleName = computed(() => Boolean(attrs['aria-label'] || attrs['aria-labelledby']));

if (import.meta.env.DEV) {
  let warnedAboutMissingName = false;

  watchEffect(() => {
    if (iconOnly.value && !hasAccessibleName.value) {
      if (!warnedAboutMissingName) {
        console.warn(
          '[FButton] Icon-only buttons require an accessible name through aria-label or aria-labelledby.',
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
  `fui-Button--${props.appearance satisfies ButtonAppearance}`,
  `fui-Button--${props.shape satisfies ButtonShape}`,
  `fui-Button--${props.size satisfies ButtonSize}`,
  {
    'fui-Button--with-icon': Boolean(slots.icon),
    'fui-Button--icon-only': iconOnly.value,
    [`fui-Button--icon-only-${props.size}`]: iconOnly.value,
    'fui-Button--disabled': props.disabled,
    'fui-Button--disabled-focusable': props.disabledFocusable,
  },
  attrs.class,
]);

const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    type: _type,
    href: _href,
    role: _role,
    tabindex: _tabindex,
    disabled: _disabled,
    'aria-disabled': _ariaDisabled,
    onClick: _onClick,
    onKeydown: _onKeydown,
    onKeyup: _onKeyup,
    ...rest
  } = attrs;
  return rest;
});

const rootType = computed(() => {
  if (props.as !== 'button') {
    return undefined;
  }

  return (attrs.type as HTMLButtonElement['type'] | undefined) ?? 'button';
});

const rootHref = computed(() => {
  if (props.as !== 'a' || isDisabled.value) {
    return undefined;
  }

  return props.href;
});

const rootRole = computed(() => {
  if (props.as === 'a' && !props.href) {
    return 'button';
  }

  return undefined;
});

const rootTabIndex = computed(() => {
  if (props.disabled) {
    return -1;
  }

  if (props.as === 'a' && (!props.href || props.disabledFocusable)) {
    return 0;
  }

  return undefined;
});

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
}

function handleKeydown(event: KeyboardEvent) {
  if (props.as !== 'a' || props.href || isDisabled.value) {
    if (isDisabled.value && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
    }
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    root.value?.click();
  } else if (event.key === ' ') {
    event.preventDefault();
  }
}

function handleKeyup(event: KeyboardEvent) {
  if (props.as === 'a' && !props.href && !isDisabled.value && event.key === ' ') {
    event.preventDefault();
    root.value?.click();
  }
}

defineExpose({
  element: root,
  focus: () => root.value?.focus(),
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    :type="rootType"
    :href="rootHref"
    :role="rootRole"
    :tabindex="rootTabIndex"
    :disabled="as === 'button' && disabled ? true : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <span
      v-if="$slots.icon && iconPosition === 'before'"
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

    <span
      v-if="$slots.icon && iconPosition === 'after'"
      :class="[
        'fui-Button__icon',
        `fui-Button__icon--${size}`,
        { 'fui-Button__icon--after': !iconOnly },
      ]"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
  </component>
</template>

<style>
@import './button.css';
</style>

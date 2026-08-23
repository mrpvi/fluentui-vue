<script setup lang="ts">
import { computed, ref, useAttrs, watchEffect } from 'vue';
import type {
  CompoundButtonAppearance,
  CompoundButtonEmits,
  CompoundButtonProps,
  CompoundButtonShape,
  CompoundButtonSize,
  CompoundButtonSlots,
} from './CompoundButton.types';

defineOptions({
  name: 'FCompoundButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CompoundButtonProps>(), {
  as: 'button',
  appearance: 'secondary',
  shape: 'rounded',
  size: 'medium',
  disabled: false,
  disabledFocusable: false,
  iconPosition: 'before',
});

const emit = defineEmits<CompoundButtonEmits>();
const slots = defineSlots<CompoundButtonSlots>();
const attrs = useAttrs();
const root = ref<HTMLButtonElement | HTMLAnchorElement | null>(null);

const isDisabledFocusable = computed(() => props.disabledFocusable && !props.disabled);
const isDisabled = computed(() => props.disabled || isDisabledFocusable.value);
const hasPrimaryContent = computed(() => Boolean(slots.default));
const hasSecondaryContent = computed(
  () => Boolean(slots['secondary-content']) || props.secondaryContent !== undefined,
);
const iconOnly = computed(
  () => Boolean(slots.icon) && !hasPrimaryContent.value && !hasSecondaryContent.value,
);
const hasAccessibleName = computed(() => Boolean(attrs['aria-label'] || attrs['aria-labelledby']));

if (import.meta.env.DEV) {
  let warnedAboutMissingName = false;

  watchEffect(() => {
    if (iconOnly.value && !hasAccessibleName.value) {
      if (!warnedAboutMissingName) {
        console.warn(
          '[FCompoundButton] Icon-only buttons require an accessible name through aria-label or aria-labelledby.',
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
  'fui-CompoundButton',
  `fui-Button--${props.appearance satisfies CompoundButtonAppearance}`,
  `fui-Button--${props.shape satisfies CompoundButtonShape}`,
  `fui-Button--${props.size satisfies CompoundButtonSize}`,
  `fui-CompoundButton--${props.appearance satisfies CompoundButtonAppearance}`,
  `fui-CompoundButton--${props.size satisfies CompoundButtonSize}`,
  {
    'fui-Button--with-icon': Boolean(slots.icon),
    'fui-CompoundButton--with-icon': Boolean(slots.icon),
    'fui-CompoundButton--icon-only': iconOnly.value,
    [`fui-CompoundButton--icon-only-${props.size}`]: iconOnly.value,
    'fui-Button--disabled': props.disabled,
    'fui-Button--disabled-focusable': isDisabledFocusable.value,
    'fui-CompoundButton--disabled': props.disabled,
    'fui-CompoundButton--disabled-focusable': isDisabledFocusable.value,
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

const rootAriaDisabled = computed(() => {
  if (props.as === 'button') {
    return isDisabledFocusable.value ? 'true' : undefined;
  }

  return isDisabled.value ? 'true' : undefined;
});

const rootTabIndex = computed(() => {
  if (props.disabled) {
    return -1;
  }

  if (props.as === 'a' && (!props.href || isDisabledFocusable.value)) {
    return 0;
  }

  return undefined;
});

type NativeHandler = ((event: Event) => void) | NativeHandler[];

function invokeNativeHandler(handler: unknown, event: Event) {
  if (Array.isArray(handler)) {
    for (const callback of handler as NativeHandler[]) {
      invokeNativeHandler(callback, event);
    }
  } else if (typeof handler === 'function') {
    handler(event);
  }
}

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

    invokeNativeHandler(attrs.onKeydown, event);
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    root.value?.click();
  } else if (event.key === ' ') {
    event.preventDefault();
  }

  invokeNativeHandler(attrs.onKeydown, event);
}

function handleKeyup(event: KeyboardEvent) {
  if (props.as === 'a' && !props.href && !isDisabled.value && event.key === ' ') {
    event.preventDefault();
    root.value?.click();
  }

  invokeNativeHandler(attrs.onKeyup, event);
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
    :aria-disabled="rootAriaDisabled"
    @click="handleClick"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <span
      v-if="$slots.icon && iconPosition === 'before'"
      :class="['fui-CompoundButton__icon', { 'fui-CompoundButton__icon--before': !iconOnly }]"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>

    <span v-if="!iconOnly" class="fui-CompoundButton__contentContainer">
      <slot />
      <span
        v-if="hasSecondaryContent"
        :class="[
          'fui-CompoundButton__secondaryContent',
          `fui-CompoundButton__secondaryContent--${size}`,
        ]"
      >
        <slot name="secondary-content">{{ secondaryContent }}</slot>
      </span>
    </span>

    <span
      v-if="$slots.icon && iconPosition === 'after'"
      :class="['fui-CompoundButton__icon', { 'fui-CompoundButton__icon--after': !iconOnly }]"
      aria-hidden="true"
    >
      <slot name="icon" />
    </span>
  </component>
</template>

<style>
@import '../Button/button.css';
@import './compoundButton.css';
</style>

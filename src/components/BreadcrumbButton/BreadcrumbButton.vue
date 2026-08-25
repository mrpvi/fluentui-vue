<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
  watchEffect,
} from 'vue';
import { breadcrumbContextKey } from '../Breadcrumb/breadcrumbContext';
import type {
  BreadcrumbButtonElement,
  BreadcrumbButtonEmits,
  BreadcrumbButtonProps,
  BreadcrumbButtonSlots,
} from './BreadcrumbButton.types';

defineOptions({
  name: 'FBreadcrumbButton',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BreadcrumbButtonProps>(), {
  current: false,
  disabled: false,
  disabledFocusable: false,
});
const emit = defineEmits<BreadcrumbButtonEmits>();
defineSlots<BreadcrumbButtonSlots>();
const attrs = useAttrs();
const injectedBreadcrumb = inject(breadcrumbContextKey);
if (!injectedBreadcrumb) {
  throw new Error('FBreadcrumbButton must be used inside FBreadcrumb.');
}
const breadcrumb = injectedBreadcrumb;
const root = ref<HTMLButtonElement | HTMLAnchorElement | null>(null);
let unregister: (() => void) | undefined;
const rootTag = computed<BreadcrumbButtonElement>(() => props.as ?? (props.href ? 'a' : 'button'));
const isDisabled = computed(() => props.current || props.disabled || props.disabledFocusable);
const isNavigable = computed(
  () => !props.disabled && (props.current || props.disabledFocusable || !isDisabled.value),
);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    href: _href,
    type: _type,
    role: _role,
    tabindex: _tabindex,
    disabled: _disabled,
    ariaCurrent: _ariaCurrent,
    ariaDisabled: _ariaDisabled,
    onClick: _onClick,
    onFocus: _onFocus,
    onKeydown: _onKeydown,
    onKeyup: _onKeyup,
    ...rest
  } = attrs;
  return rest;
});
const rootHref = computed(() => {
  if (rootTag.value !== 'a' || isDisabled.value) {
    return undefined;
  }
  return props.href;
});
const rootType = computed(() =>
  rootTag.value === 'button' ? (props.type ?? 'button') : undefined,
);
const rootRole = computed(() => {
  if (rootTag.value === 'a' && !props.href) {
    return props.role ?? 'button';
  }
  return props.role;
});
const rootTabIndex = computed(() => {
  if (breadcrumb.focusMode.value === 'arrow') {
    return root.value && root.value === breadcrumb.currentControl.value ? 0 : -1;
  }
  if (props.tabindex !== undefined) {
    return props.tabindex;
  }
  if (rootTag.value === 'a' && (!props.href || isDisabled.value)) {
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

function handleFocus(event: FocusEvent) {
  emit('focus', event);
  if (!event.defaultPrevented && root.value) {
    breadcrumb.rememberControl(root.value);
  }
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event);
  if (event.defaultPrevented || !root.value) {
    return;
  }
  if (isDisabled.value && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    breadcrumb.moveControlFocus(root.value, event.key);
    return;
  }
  if (rootTag.value === 'a' && !props.href) {
    if (event.key === 'Enter') {
      event.preventDefault();
      root.value.click();
    } else if (event.key === ' ') {
      event.preventDefault();
    }
  }
}

function handleKeyup(event: KeyboardEvent) {
  emit('keyup', event);
  if (
    !event.defaultPrevented &&
    rootTag.value === 'a' &&
    !props.href &&
    !isDisabled.value &&
    event.key === ' '
  ) {
    event.preventDefault();
    root.value?.click();
  }
}

watchEffect(() => {
  const element = root.value;
  if (
    breadcrumb.focusMode.value === 'arrow' &&
    element &&
    element === breadcrumb.currentControl.value &&
    !isNavigable.value
  ) {
    breadcrumb.clearControl(element);
    breadcrumb.notifyControlsChanged();
  }
});

watch(
  breadcrumb.controlVersion,
  () => {
    if (breadcrumb.focusMode.value !== 'arrow' || breadcrumb.currentControl.value || !root.value) {
      return;
    }
    if (isNavigable.value) {
      breadcrumb.rememberControl(root.value);
    }
  },
  { flush: 'sync' },
);

onMounted(() => {
  if (root.value) {
    unregister = breadcrumb.registerControl(root.value, () => isNavigable.value);
  }
});
onBeforeUnmount(() => unregister?.());

defineExpose({
  element: root,
  focus: () => root.value?.focus(),
});
</script>

<template>
  <component
    :is="rootTag"
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-BreadcrumbButton',
      `fui-BreadcrumbButton--${breadcrumb.size.value}`,
      {
        'fui-BreadcrumbButton--current': current,
        'fui-BreadcrumbButton--disabled': disabled,
        'fui-BreadcrumbButton--disabled-focusable': disabledFocusable,
        'fui-BreadcrumbButton--with-icon': Boolean($slots.icon),
      },
      attrs.class,
    ]"
    :style="attrs.style"
    :href="rootHref"
    :type="rootType"
    :role="rootRole"
    :tabindex="rootTabIndex"
    :disabled="rootTag === 'button' && disabled ? true : undefined"
    :aria-current="current ? (ariaCurrent ?? 'page') : undefined"
    :aria-disabled="isDisabled ? (ariaDisabled ?? 'true') : undefined"
    @click="handleClick"
    @focus="handleFocus"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <span v-if="$slots.icon" class="fui-BreadcrumbButton__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </component>
</template>

<style>
@import './breadcrumbButton.css';
</style>

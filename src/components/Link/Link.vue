<script setup lang="ts">
import { computed, getCurrentInstance, ref, useAttrs } from 'vue';
import type { LinkEmits, LinkProps, LinkSlots, LinkTag } from './Link.types';

defineOptions({
  name: 'FLink',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<LinkProps>(), {
  appearance: 'default',
  disabled: false,
  disabledFocusable: false,
  inline: false,
});

const emit = defineEmits<LinkEmits>();
defineSlots<LinkSlots>();

const attrs = useAttrs();
const instance = getCurrentInstance();
const root = ref<HTMLElement | null>(null);

const rootTag = computed<LinkTag>(() => props.as ?? (props.href ? 'a' : 'button'));
const isDisabled = computed(() => props.disabled || props.disabledFocusable);

const classes = computed(() => [
  'fui-Link',
  `fui-Link--${props.appearance}`,
  {
    'fui-Link--inline': props.inline,
    'fui-Link--disabled': props.disabled,
    'fui-Link--disabled-focusable': props.disabledFocusable,
  },
  attrs.class,
]);

const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    href: _href,
    type: _type,
    role: _role,
    tabindex: _tabindex,
    tabIndex: _tabIndex,
    disabled: _disabled,
    'aria-disabled': _ariaDisabled,
    onClick: _onClick,
    onKeydown: _onKeydown,
    ...rest
  } = attrs;

  return Object.fromEntries(
    Object.entries(rest).filter(
      ([name]) =>
        !/^onClick(?:Capture|Once|Passive)/.test(name) &&
        !/^onKey[dD]own(?:Capture|Once|Passive)?$/.test(name),
    ),
  );
});

const explicitRole = computed(() => attrs.role as string | undefined);
const explicitTabIndex = computed(
  () => (attrs.tabindex ?? attrs.tabIndex) as string | number | null | undefined,
);
const vnodeProps = computed(() => instance?.vnode.props ?? {});
const onceListenersCalled = new Set<string>();

function findManualListener(
  name: 'click' | 'keydown',
): [string, (event: Event) => void] | undefined {
  const pattern =
    name === 'click'
      ? /^onClick(?:Capture|Passive)+(?:Once)?$/
      : /^(?:onKeyDown|onKey[dD]own(?:Capture|Passive)+(?:Once)?)$/;

  return Object.entries(vnodeProps.value).find(
    ([propName, listener]) => pattern.test(propName) && typeof listener === 'function',
  ) as [string, (event: Event) => void] | undefined;
}

function invokeManualListener(name: 'click' | 'keydown', event: MouseEvent | KeyboardEvent) {
  const listener = findManualListener(name);

  if (!listener) {
    return;
  }

  const [propName, handler] = listener;

  if (propName.includes('Once')) {
    if (onceListenersCalled.has(propName)) {
      return;
    }

    onceListenersCalled.add(propName);
  }

  handler(event);
}

function hasKeydownListener() {
  return Object.keys(vnodeProps.value).some((propName) =>
    /^onKey[dD]own(?:Capture|Once|Passive)*$/.test(propName),
  );
}

const rootHref = computed(() => {
  if (rootTag.value !== 'a' || props.disabled) {
    return undefined;
  }

  return props.href;
});

const rootType = computed(() => {
  if (rootTag.value !== 'button') {
    return undefined;
  }

  return (attrs.type as HTMLButtonElement['type'] | undefined) ?? 'button';
});

const rootRole = computed(() => {
  if (rootTag.value === 'a' && isDisabled.value) {
    return explicitRole.value || 'link';
  }

  if (rootTag.value === 'span') {
    return explicitRole.value ?? 'button';
  }

  return explicitRole.value;
});

const rootTabIndex = computed(() => {
  if (rootTag.value === 'button') {
    return explicitTabIndex.value;
  }

  if (explicitTabIndex.value != null) {
    return explicitTabIndex.value;
  }

  if (props.disabled && !props.disabledFocusable) {
    return undefined;
  }

  return 0;
});

function handleClick(event: MouseEvent) {
  if (isDisabled.value) {
    event.preventDefault();
    return;
  }

  emit('click', event);
  invokeManualListener('click', event);
}

function handleKeydown(event: KeyboardEvent) {
  const isActivationKey = event.key === 'Enter' || event.key === ' ';

  if (isDisabled.value && isActivationKey) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('keydown', event);
  invokeManualListener('keydown', event);

  if (rootTag.value === 'span' && !hasKeydownListener() && isActivationKey) {
    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  }
}

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
    :class="classes"
    :style="attrs.style"
    :href="rootHref"
    :type="rootType"
    :role="rootRole"
    :tabindex="rootTabIndex"
    :disabled="rootTag === 'button' && disabled && !disabledFocusable ? true : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </component>
</template>

<style>
@import './link.css';
</style>

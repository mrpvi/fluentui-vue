<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import { tabListContextKey } from '../TabList/tabListContext';
import type { TabEmits, TabProps, TabSlots } from './Tab.types';

defineOptions({
  name: 'FTab',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<TabProps>(), {
  disabled: false,
});
const emit = defineEmits<TabEmits>();
const slots = defineSlots<TabSlots>();
const attrs = useAttrs();
const injectedTabList = inject(tabListContextKey);
if (!injectedTabList) {
  throw new Error('FTab must be used inside FTabList.');
}
const tabList = injectedTabList;
const button = ref<HTMLButtonElement | null>(null);
let unregister: (() => void) | undefined;
const disabled = computed(() => tabList.disabled.value || props.disabled);
const selected = computed(() => tabList.selectedValue.value === props.value);
const iconOnly = computed(() => Boolean(slots.icon && !slots.default));
const tabIndex = computed(() => {
  if (disabled.value) {
    return undefined;
  }
  if (selected.value) {
    return 0;
  }
  if (tabList.selectedValue.value === undefined) {
    return 0;
  }
  return -1;
});
const buttonAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    type: _type,
    disabled: _disabled,
    value: _value,
    tabindex: _tabindex,
    'aria-selected': _ariaSelected,
    onClick: _onClick,
    onFocus: _onFocus,
    onKeydown: _onKeydown,
    ...rest
  } = attrs;
  return rest;
});

function handleClick(event: MouseEvent) {
  emit('click', event);
  if (!event.defaultPrevented && !disabled.value) {
    tabList.requestSelect(props.value, event);
  }
}

function handleFocus(event: FocusEvent) {
  emit('focus', event);
  if (!event.defaultPrevented && !disabled.value && tabList.selectTabOnFocus.value) {
    tabList.requestSelect(props.value, event);
  }
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event);
  if (event.defaultPrevented || !button.value || disabled.value) {
    return;
  }
  if (
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'Home' ||
    event.key === 'End'
  ) {
    const activeForOrientation = tabList.vertical.value
      ? event.key === 'ArrowUp' || event.key === 'ArrowDown'
      : event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    if (activeForOrientation || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      tabList.moveTabFocus(button.value, event.key);
    }
  }
}

onMounted(() => {
  if (button.value) {
    unregister = tabList.registerTab(props.value, button.value);
  }
});
onBeforeUnmount(() => unregister?.());

defineExpose({
  element: button,
  focus: () => button.value?.focus(),
});
</script>

<template>
  <button
    v-bind="buttonAttrs"
    ref="button"
    :class="[
      'fui-Tab',
      `fui-Tab--${tabList.appearance.value}`,
      `fui-Tab--${tabList.size.value}`,
      {
        'fui-Tab--selected': selected,
        'fui-Tab--disabled': disabled,
        'fui-Tab--vertical': tabList.vertical.value,
        'fui-Tab--horizontal': !tabList.vertical.value,
        'fui-Tab--icon-only': iconOnly,
      },
      attrs.class,
    ]"
    :style="attrs.style"
    type="button"
    role="tab"
    :value="String(value)"
    :disabled="disabled"
    :tabindex="tabIndex"
    :aria-selected="disabled ? undefined : selected"
    @click="handleClick"
    @focus="handleFocus"
    @keydown="handleKeydown"
  >
    <span v-if="$slots.icon" class="fui-Tab__icon" aria-hidden="true">
      <slot name="icon" :selected="selected" />
    </span>
    <span v-if="$slots.default" class="fui-Tab__content"><slot /></span>
    <span
      v-if="tabList.reserveSelectedTabSpace.value && !selected && !iconOnly"
      class="fui-Tab__content fui-Tab__content--reserved-space"
      aria-hidden="true"
    >
      <slot />
    </span>
  </button>
</template>

<style>
@import './tab.css';
</style>

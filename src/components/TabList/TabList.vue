<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { tabListContextKey } from './tabListContext';
import type { TabListEmits, TabListProps, TabListSlots, TabValue } from './TabList.types';

defineOptions({
  name: 'FTabList',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<TabListProps>(), {
  appearance: 'transparent',
  disabled: false,
  reserveSelectedTabSpace: true,
  selectTabOnFocus: false,
  size: 'medium',
  vertical: false,
});
const emit = defineEmits<TabListEmits>();
defineSlots<TabListSlots>();
const attrs = useAttrs();
const isControlled = useIsPropProvided('modelValue');
const internalSelectedValue = ref<TabValue | undefined>(props.defaultSelectedValue);
const tabs = new Map<HTMLButtonElement, TabValue>();
const selectedValue = computed(() =>
  isControlled ? props.modelValue : internalSelectedValue.value,
);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-orientation': _ariaOrientation,
    ...rest
  } = attrs;
  return rest;
});

function requestSelect(value: TabValue, event: MouseEvent | FocusEvent | KeyboardEvent) {
  if (props.disabled || event.defaultPrevented) {
    return;
  }
  if (!isControlled) {
    internalSelectedValue.value = value;
  }
  emit('update:modelValue', value);
  emit('tabSelect', event, { value });
}

function registerTab(value: TabValue, element: HTMLButtonElement) {
  tabs.set(element, value);
  return () => tabs.delete(element);
}

function moveTabFocus(element: HTMLButtonElement, key: string) {
  const available = Array.from(tabs.keys()).filter((tab) => !tab.disabled && tab.isConnected);
  const currentIndex = available.indexOf(element);
  if (currentIndex < 0 || available.length === 0) {
    return;
  }

  const isForward = props.vertical ? key === 'ArrowDown' : key === 'ArrowRight';
  const isBackward = props.vertical ? key === 'ArrowUp' : key === 'ArrowLeft';
  const nextIndex = isForward
    ? (currentIndex + 1) % available.length
    : isBackward
      ? (currentIndex - 1 + available.length) % available.length
      : key === 'Home'
        ? 0
        : key === 'End'
          ? available.length - 1
          : undefined;

  if (nextIndex !== undefined) {
    available[nextIndex]?.focus();
  }
}

provide(tabListContextKey, {
  appearance: computed(() => props.appearance),
  disabled: computed(() => props.disabled),
  reserveSelectedTabSpace: computed(() => props.reserveSelectedTabSpace),
  selectedValue,
  selectTabOnFocus: computed(() => props.selectTabOnFocus),
  size: computed(() => props.size),
  vertical: computed(() => props.vertical),
  registerTab,
  requestSelect,
  moveTabFocus,
});

defineExpose({
  selectedValue,
});
</script>

<template>
  <div
    v-bind="rootAttrs"
    :class="[
      'fui-TabList',
      `fui-TabList--${appearance}`,
      `fui-TabList--${size}`,
      {
        'fui-TabList--vertical': vertical,
        'fui-TabList--horizontal': !vertical,
        'fui-TabList--disabled': disabled,
      },
      attrs.class,
    ]"
    :style="attrs.style"
    role="tablist"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
  >
    <slot />
  </div>
</template>

<style>
@import './tabList.css';
</style>

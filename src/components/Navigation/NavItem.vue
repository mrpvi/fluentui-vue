<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import type { NavItemProps, NavItemSlots } from './Navigation.types';
import { navCategoryContextKey, navContextKey } from './navigationContext';
defineOptions({ name: 'FNavItem', inheritAttrs: false });
const props = withDefaults(defineProps<NavItemProps>(), { as: 'a', disabled: false });
defineSlots<NavItemSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedNav = inject(navContextKey);
if (!injectedNav) throw new Error('FNavItem must be used inside FNav.');
const nav = injectedNav;
const category = inject(navCategoryContextKey, undefined);
const selected = computed(() => nav.selectedValue.value === props.value);
let unregister: (() => void) | undefined;
onMounted(() => {
  if (root.value)
    unregister = nav.registerItem({
      value: props.value,
      element: root.value,
      disabled: props.disabled,
      categoryValue: category?.value,
    });
});
onBeforeUnmount(() => unregister?.());
function activate(event: MouseEvent | KeyboardEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  nav.select(event, { value: props.value, categoryValue: category?.value });
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    nav.focusMove(root.value!, 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    nav.focusMove(root.value!, -1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    nav.focusMove(root.value!, 'first');
  } else if (event.key === 'End') {
    event.preventDefault();
    nav.focusMove(root.value!, 'last');
  } else if ((event.key === 'Enter' || event.key === ' ') && props.as !== 'a') activate(event);
}
defineExpose({ element: root, focus: () => root.value?.focus() });
</script>
<template>
  <component
    :is="props.as"
    ref="root"
    v-bind="attrs"
    class="fui-NavItem"
    :class="{ 'fui-NavItem--selected': selected, 'fui-NavItem--disabled': props.disabled }"
    :href="props.disabled ? undefined : props.href"
    :target="props.target"
    :aria-current="selected ? 'page' : undefined"
    :aria-disabled="props.disabled || undefined"
    :tabindex="
      props.disabled ? -1 : nav.tabbable.value || selected || !nav.selectedValue.value ? 0 : -1
    "
    @click="activate"
    @keydown="keydown"
    ><span v-if="$slots.icon" class="fui-NavItem__icon"><slot name="icon" /></span
    ><span class="fui-NavItem__content"><slot /></span
  ></component>
</template>
<style>
@import './navigation.css';
</style>

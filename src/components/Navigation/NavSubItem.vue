<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import type { NavSubItemProps, NavSubItemSlots } from './Navigation.types';
import { navCategoryContextKey, navContextKey } from './navigationContext';
defineOptions({ name: 'FNavSubItem', inheritAttrs: false });
const props = withDefaults(defineProps<NavSubItemProps>(), { as: 'a', disabled: false });
defineSlots<NavSubItemSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedNav = inject(navContextKey);
const injectedCategory = inject(navCategoryContextKey);
if (!injectedNav || !injectedCategory)
  throw new Error('FNavSubItem must be used inside FNavCategory.');
const nav = injectedNav;
const category = injectedCategory;
const selected = computed(() => nav.selectedValue.value === props.value);
let unregister: (() => void) | undefined;
onMounted(() => {
  if (root.value)
    unregister = nav.registerItem({
      value: props.value,
      element: root.value,
      disabled: props.disabled,
      categoryValue: category.value,
    });
});
onBeforeUnmount(() => unregister?.());
function click(event: MouseEvent) {
  if (props.disabled) event.preventDefault();
  else nav.select(event, { value: props.value, categoryValue: category.value });
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
  }
}
</script>
<template>
  <component
    :is="props.as"
    ref="root"
    v-bind="attrs"
    class="fui-NavSubItem"
    :class="{ 'fui-NavSubItem--selected': selected, 'fui-NavSubItem--disabled': props.disabled }"
    :href="props.disabled ? undefined : props.href"
    :target="props.target"
    :aria-current="selected ? 'page' : undefined"
    :aria-disabled="props.disabled || undefined"
    :tabindex="props.disabled ? -1 : nav.tabbable.value || selected ? 0 : -1"
    @click="click"
    @keydown="keydown"
    ><span v-if="$slots.icon" class="fui-NavItem__icon"><slot name="icon" /></span
    ><span class="fui-NavItem__content"><slot /></span
  ></component>
</template>
<style>
@import './navigation.css';
</style>

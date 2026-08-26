<script setup lang="ts">
import { computed, inject, useAttrs } from 'vue';
import type { NavCategoryItemProps, NavCategoryItemSlots } from './Navigation.types';
import { navCategoryContextKey, navContextKey } from './navigationContext';
defineOptions({ name: 'FNavCategoryItem', inheritAttrs: false });
const props = withDefaults(defineProps<NavCategoryItemProps>(), { as: 'button', disabled: false });
defineSlots<NavCategoryItemSlots>();
const attrs = useAttrs();
const nav = inject(navContextKey);
const category = inject(navCategoryContextKey);
if (!nav || !category) throw new Error('FNavCategoryItem must be used inside FNavCategory.');
const selected = computed(
  () =>
    nav.selectedCategoryValue.value === category.value ||
    (!category.open.value &&
      nav.selectedValue.value &&
      nav.items.value.some(
        (item) => item.categoryValue === category.value && item.value === nav.selectedValue.value,
      )),
);
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-NavCategoryItem"
    :class="{ 'fui-NavCategoryItem--selected': selected }"
    :type="props.as === 'button' ? 'button' : undefined"
    :disabled="props.as === 'button' ? props.disabled : undefined"
    :aria-expanded="category.open.value"
    @click="!props.disabled && nav.toggleCategory($event, category.value)"
    ><span v-if="$slots.icon" class="fui-NavItem__icon"><slot name="icon" /></span
    ><span class="fui-NavItem__content"><slot /></span
    ><span class="fui-NavCategoryItem__expand" aria-hidden="true"
      ><slot name="expandIcon" :open="category.open.value">⌄</slot></span
    ></component
  >
</template>
<style>
@import './navigation.css';
</style>

<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type { NavSubItemGroupProps, NavSubItemGroupSlots } from './Navigation.types';
import { navCategoryContextKey } from './navigationContext';
defineOptions({ name: 'FNavSubItemGroup', inheritAttrs: false });
const props = withDefaults(defineProps<NavSubItemGroupProps>(), { as: 'div' });
defineSlots<NavSubItemGroupSlots>();
const attrs = useAttrs();
const category = inject(navCategoryContextKey);
if (!category) throw new Error('FNavSubItemGroup must be used inside FNavCategory.');
</script>
<template>
  <component
    :is="props.as"
    v-show="category.open.value"
    v-bind="attrs"
    class="fui-NavSubItemGroup"
    role="group"
    ><slot
  /></component>
</template>
<style>
@import './navigation.css';
</style>

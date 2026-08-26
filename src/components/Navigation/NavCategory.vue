<script setup lang="ts">
import { computed, inject, provide } from 'vue';
import type { NavCategoryProps, NavCategorySlots } from './Navigation.types';
import { navCategoryContextKey, navContextKey } from './navigationContext';
defineOptions({ name: 'FNavCategory' });
const props = defineProps<NavCategoryProps>();
defineSlots<NavCategorySlots>();
const nav = inject(navContextKey);
if (!nav) throw new Error('FNavCategory must be used inside FNav.');
const open = computed(() => nav.openCategories.value.includes(props.value));
provide(navCategoryContextKey, { value: props.value, open });
</script>
<template>
  <div class="fui-NavCategory" :data-open="open"><slot /></div>
</template>
<style>
@import './navigation.css';
</style>

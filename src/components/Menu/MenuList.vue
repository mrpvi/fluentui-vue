<script setup lang="ts">
import { inject, onMounted, provide, ref, useAttrs } from 'vue';
import type { MenuListProps, MenuListSlots } from './Menu.types';
import { menuContextKey, menuListContextKey } from './menuContext';

defineOptions({ name: 'FMenuList', inheritAttrs: false });
const props = withDefaults(defineProps<MenuListProps>(), { as: 'div' });
defineSlots<MenuListSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedContext = inject(menuContextKey);
if (!injectedContext) throw new Error('FMenuList must be used inside FMenu.');
const context = injectedContext;
onMounted(() => context.registerList(root.value));
provide(menuListContextKey, {
  checkedValues: context.checkedValues,
  toggleChecked: context.toggleChecked,
});
</script>

<template>
  <component
    :is="props.as"
    ref="root"
    v-bind="attrs"
    class="fui-MenuList"
    role="menu"
    tabindex="-1"
  >
    <slot />
  </component>
</template>

<style>
@import './menu.css';
</style>

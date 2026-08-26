<script setup lang="ts">
import { useAttrs } from 'vue';
import type { SplitNavItemProps, SplitNavItemSlots } from './Navigation.types';
import NavItem from './NavItem.vue';
defineOptions({ name: 'FSplitNavItem', inheritAttrs: false });
const props = withDefaults(defineProps<SplitNavItemProps>(), { as: 'div', value: '' });
defineSlots<SplitNavItemSlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-SplitNavItem"
    ><NavItem :value="props.value" :href="props.href"
      ><template v-if="$slots.icon" #icon><slot name="icon" /></template><slot /></NavItem
    ><span class="fui-SplitNavItem__action"><slot name="action" /></span
  ></component>
</template>
<style>
@import './navigation.css';
</style>

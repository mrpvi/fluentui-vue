<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { NavDrawerEmits, NavDrawerProps, NavDrawerSlots } from './Navigation.types';
import { FDrawer, FInlineDrawer, FOverlayDrawer } from '../Drawer';
import Nav from './Nav.vue';
defineOptions({ name: 'FNavDrawer', inheritAttrs: false });
const props = withDefaults(defineProps<NavDrawerProps>(), {
  type: 'inline',
  position: 'start',
  size: 'small',
  defaultOpen: true,
  multiple: true,
  density: 'medium',
  tabbable: false,
});
const emit = defineEmits<NavDrawerEmits>();
defineSlots<NavDrawerSlots>();
const attrs = useAttrs();
const Surface = computed(() => (props.type === 'overlay' ? FOverlayDrawer : FInlineDrawer));
const navProps = computed(() => ({
  modelValue: props.modelValue,
  selectedValue: props.selectedValue,
  defaultSelectedValue: props.defaultSelectedValue,
  selectedCategoryValue: props.selectedCategoryValue,
  openCategories: props.openCategories,
  defaultOpenCategories: props.defaultOpenCategories,
  multiple: props.multiple,
  density: props.density,
  tabbable: props.tabbable,
  ariaLabel: props.ariaLabel,
}));
</script>
<template>
  <FDrawer
    :type="props.type"
    :open="props.open"
    :default-open="props.defaultOpen"
    :position="props.position"
    :size="props.size"
    :modal-type="props.modalType"
    :mount-node="props.mountNode"
    @update:open="emit('update:open', $event)"
    @open-change="(event, data) => emit('openChange', event, data)"
  >
    <component :is="Surface" v-bind="attrs"
      ><Nav
        v-bind="navProps"
        @update:model-value="emit('update:modelValue', $event)"
        @update:selected-value="emit('update:selectedValue', $event)"
        @update:open-categories="emit('update:openCategories', $event)"
        @nav-item-select="(event, data) => emit('navItemSelect', event, data)"
        @nav-category-item-toggle="(event, data) => emit('navCategoryItemToggle', event, data)"
        ><slot /></Nav
    ></component>
  </FDrawer>
</template>
<style>
@import './navigation.css';
</style>

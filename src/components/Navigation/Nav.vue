<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { NavEmits, NavProps, NavSlots } from './Navigation.types';
import { navContextKey, type NavItemRecord } from './navigationContext';
defineOptions({ name: 'FNav', inheritAttrs: false });
const props = withDefaults(defineProps<NavProps>(), {
  defaultSelectedValue: '',
  defaultOpenCategories: () => [],
  multiple: true,
  density: 'medium',
  tabbable: false,
  ariaLabel: 'Navigation',
});
const emit = defineEmits<NavEmits>();
defineSlots<NavSlots>();
const attrs = useAttrs();
const controlledByModel = useIsPropProvided('modelValue');
const controlledBySelected = useIsPropProvided('selectedValue');
const controlledOpen = useIsPropProvided('openCategories');
const internalSelected = ref(props.defaultSelectedValue);
const internalOpen = ref([...props.defaultOpenCategories]);
const items = ref<NavItemRecord[]>([]);
const selectedValue = computed(() =>
  controlledByModel
    ? props.modelValue
    : controlledBySelected
      ? props.selectedValue
      : internalSelected.value,
);
const selectedCategoryValue = computed(() => props.selectedCategoryValue);
const openCategories = computed(() =>
  controlledOpen ? (props.openCategories ?? []) : internalOpen.value,
);
const density = computed(() => props.density);
const multiple = computed(() => props.multiple);
const tabbable = computed(() => props.tabbable);
function registerItem(item: NavItemRecord) {
  items.value = [...items.value, item];
  return () => {
    items.value = items.value.filter((entry) => entry.element !== item.element);
  };
}
function select(event: Event, data: { value: string; categoryValue?: string }) {
  if (!controlledByModel && !controlledBySelected) internalSelected.value = data.value;
  emit('update:modelValue', data.value);
  emit('update:selectedValue', data.value);
  emit('navItemSelect', event, data);
}
function toggleCategory(event: Event, value: string) {
  const open = openCategories.value.includes(value);
  const next = open
    ? openCategories.value.filter((entry) => entry !== value)
    : props.multiple
      ? [...openCategories.value, value]
      : [value];
  if (!controlledOpen) internalOpen.value = next;
  emit('update:openCategories', next);
  emit('navCategoryItemToggle', event, { value, open: !open });
}
function focusMove(current: HTMLElement, direction: 1 | -1 | 'first' | 'last') {
  const enabled = items.value.filter(
    (item) => !item.disabled && item.element.offsetParent !== null,
  );
  const index = enabled.findIndex((item) => item.element === current);
  const next =
    direction === 'first'
      ? enabled[0]
      : direction === 'last'
        ? enabled[enabled.length - 1]
        : enabled[(index + direction + enabled.length) % enabled.length];
  next?.element.focus();
}
provide(navContextKey, {
  selectedValue,
  selectedCategoryValue,
  openCategories,
  density,
  multiple,
  tabbable,
  items,
  registerItem,
  select,
  toggleCategory,
  focusMove,
});
defineExpose({
  selectedValue,
  openCategories,
  focus: () => items.value.find((item) => !item.disabled)?.element.focus(),
});
</script>
<template>
  <nav v-bind="attrs" class="fui-Nav" :class="`fui-Nav--${density}`" :aria-label="props.ariaLabel">
    <slot />
  </nav>
</template>
<style>
@import './navigation.css';
</style>

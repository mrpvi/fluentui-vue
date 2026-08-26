<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  type VNode,
} from 'vue';
import type { MenuItemSelectableProps, MenuItemSelectableSlots } from './Menu.types';
import { menuContextKey } from './menuContext';

const props = withDefaults(defineProps<MenuItemSelectableProps>(), {
  as: 'div',
  disabled: false,
  persistOnClick: true,
  defaultChecked: false,
});
defineSlots<MenuItemSelectableSlots>();
const attrs = useAttrs();
const slots = useSlots();
const injectedContext = inject(menuContextKey);
if (!injectedContext) throw new Error('Selectable menu items must be used inside FMenu.');
const context = injectedContext;
const root = ref<HTMLElement | null>(null);
const id = `fui-menu-item-${useId()}`;
const checked = computed(() => {
  const values = context.checkedValues.value[props.name];
  return values ? values.includes(props.value) : Boolean(props.defaultChecked);
});
const text = computed(() => props.text ?? textFrom(slots.default?.()).trim());
function textFrom(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(textFrom).join('');
  if (value && typeof value === 'object' && 'children' in value)
    return textFrom((value as VNode).children);
  return '';
}
const active = computed(() => context.activeItemId.value === id);
let unregister: (() => void) | undefined;
onMounted(() => {
  if (root.value)
    unregister = context.registerItem({
      id,
      element: root.value,
      disabled: props.disabled,
      text: text.value,
      activate,
    });
});
onBeforeUnmount(() => unregister?.());
function activate(event: MouseEvent | KeyboardEvent) {
  if (props.disabled || event.defaultPrevented) return;
  const next = props.checked === undefined ? !checked.value : !props.checked;
  context.toggleChecked(event, props.name, props.value, next);
  context.closeAfterItem(event, props.persistOnClick);
}
function click(event: MouseEvent) {
  activate(event);
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    activate(event);
  }
}
</script>

<template>
  <component
    :is="props.as"
    :id="id"
    ref="root"
    v-bind="attrs"
    class="fui-MenuItem"
    :class="{ 'fui-MenuItem--active': active, 'fui-MenuItem--disabled': props.disabled }"
    :role="props.selectableRole ?? 'menuitemcheckbox'"
    :aria-disabled="props.disabled || undefined"
    :aria-checked="checked"
    :tabindex="active ? 0 : -1"
    @click="click"
    @keydown="keydown"
  >
    <span class="fui-MenuItem__checkmark" aria-hidden="true"
      ><slot name="checkmark"><span v-if="checked">✓</span></slot></span
    >
    <span class="fui-MenuItem__icon" aria-hidden="true"><slot name="icon" /></span>
    <span class="fui-MenuItem__content"><slot /></span>
    <span v-if="props.secondaryContent || $slots.secondaryContent" class="fui-MenuItem__secondary"
      ><slot name="secondaryContent">{{ props.secondaryContent }}</slot></span
    >
  </component>
</template>

<script setup lang="ts">
import {
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  computed,
  type VNode,
} from 'vue';
import type { MenuItemLinkProps, MenuItemLinkSlots } from './Menu.types';
import { menuContextKey } from './menuContext';
defineOptions({ name: 'FMenuItemLink', inheritAttrs: false });
const props = withDefaults(defineProps<MenuItemLinkProps>(), {
  as: 'a',
  disabled: false,
  hasSubmenu: false,
  persistOnClick: false,
});
defineSlots<MenuItemLinkSlots>();
const attrs = useAttrs();
const slots = useSlots();
const injectedContext = inject(menuContextKey);
if (!injectedContext) throw new Error('FMenuItemLink must be used inside FMenu.');
const context = injectedContext;
const root = ref<HTMLElement | null>(null);
const id = `fui-menu-item-${useId()}`;
const active = computed(() => context.activeItemId.value === id);
function textFrom(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(textFrom).join('');
  if (value && typeof value === 'object' && 'children' in value)
    return textFrom((value as VNode).children);
  return '';
}
const text = computed(() => props.text ?? textFrom(slots.default?.()).trim());
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
  context.closeAfterItem(event, props.persistOnClick || props.hasSubmenu);
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
    :href="props.disabled ? undefined : props.href"
    :target="props.target"
    v-bind="attrs"
    class="fui-MenuItem"
    :class="{ 'fui-MenuItem--active': active, 'fui-MenuItem--disabled': props.disabled }"
    role="menuitem"
    :aria-disabled="props.disabled || undefined"
    :tabindex="active ? 0 : -1"
    @click="click"
    @keydown="keydown"
    ><span class="fui-MenuItem__icon" aria-hidden="true"><slot name="icon" /></span
    ><span class="fui-MenuItem__content"><slot /></span
    ><span v-if="props.secondaryContent || $slots.secondaryContent" class="fui-MenuItem__secondary"
      ><slot name="secondaryContent">{{ props.secondaryContent }}</slot></span
    ></component
  >
</template>

<script setup lang="ts">
import { inject, onMounted, ref, useAttrs } from 'vue';
import type { MenuTriggerProps, MenuTriggerSlots } from './Menu.types';
import { menuContextKey } from './menuContext';

defineOptions({ name: 'FMenuTrigger', inheritAttrs: false });
const props = withDefaults(defineProps<MenuTriggerProps>(), {
  as: 'button',
  disableButtonEnhancement: false,
});
defineSlots<MenuTriggerSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedContext = inject(menuContextKey);
if (!injectedContext) throw new Error('FMenuTrigger must be used inside FMenu.');
const context = injectedContext;
onMounted(() => context.registerTrigger(root.value));
function click(event: MouseEvent) {
  if (event.defaultPrevented) return;
  context.requestOpen(!context.open.value, event, 'menuTriggerClick');
}
function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    context.requestOpen(true, event, 'menuTriggerKeyDown');
  }
}
function contextmenu(event: MouseEvent) {
  if (!context.openOnContext.value) return;
  event.preventDefault();
  context.requestOpen(true, event, 'menuTriggerContextMenu');
}
function mouseenter(event: MouseEvent) {
  if (context.openOnHover.value) context.requestOpen(true, event, 'menuTriggerMouseEnter');
}
</script>

<template>
  <component
    :is="props.as"
    ref="root"
    v-bind="attrs"
    class="fui-MenuTrigger"
    :aria-haspopup="props.disableButtonEnhancement ? undefined : 'menu'"
    :aria-expanded="context.open.value"
    @click="click"
    @keydown="keydown"
    @contextmenu="contextmenu"
    @mouseenter="mouseenter"
  >
    <slot />
  </component>
</template>

<style>
@import './menu.css';
</style>

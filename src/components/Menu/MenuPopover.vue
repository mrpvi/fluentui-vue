<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from 'vue';
import type { MenuPopoverProps, MenuPopoverSlots } from './Menu.types';
import { menuContextKey } from './menuContext';

defineOptions({ name: 'FMenuPopover', inheritAttrs: false });
const props = withDefaults(defineProps<MenuPopoverProps>(), { as: 'div' });
defineSlots<MenuPopoverSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedContext = inject(menuContextKey);
if (!injectedContext) throw new Error('FMenuPopover must be used inside FMenu.');
const context = injectedContext;
const target = computed(() => context.mountNode.value);
watch(root, (element) => context.registerPopover(element), { flush: 'post' });
onBeforeUnmount(() => context.registerPopover(null));
</script>

<template>
  <Teleport v-if="!context.inline.value" :to="target">
    <component
      :is="props.as"
      ref="root"
      v-bind="attrs"
      class="fui-MenuPopover"
      :style="[context.surfaceStyle.value, attrs.style]"
      :hidden="!context.open.value"
    >
      <slot />
    </component>
  </Teleport>
  <component
    :is="props.as"
    v-else
    ref="root"
    v-bind="attrs"
    class="fui-MenuPopover"
    :style="attrs.style"
    :hidden="!context.open.value"
  >
    <slot />
  </component>
</template>

<style>
@import './menu.css';
</style>

<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs } from 'vue';
import type { OverlayDrawerProps } from './Drawer.types';
import { drawerContextKey } from './drawerContext';

withDefaults(defineProps<OverlayDrawerProps>(), { position: 'start', size: 'small' });
defineOptions({ name: 'FOverlayDrawer', inheritAttrs: false });
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const context = inject(drawerContextKey);
if (!context) throw new Error('FOverlayDrawer must be used inside FDrawer.');
const mountNode = computed(() => context.mountNode.value);
onMounted(() => context.registerSurface(root.value));
</script>

<template>
  <Teleport :to="mountNode">
    <div v-if="context.open.value || !context.unmountOnClose.value" class="fui-DrawerHost">
      <div
        class="fui-DrawerBackdrop"
        :class="`fui-DrawerBackdrop--${context.modalType.value}`"
        aria-hidden="true"
        @click="
          context.modalType.value === 'modal' && context.requestOpen(false, $event, 'backdropClick')
        "
      />
      <component
        :is="'aside'"
        ref="root"
        v-bind="attrs"
        class="fui-DrawerSurface fui-DrawerSurface--overlay"
        :class="[
          `fui-DrawerSurface--${context.position.value}`,
          `fui-DrawerSurface--${context.size.value}`,
        ]"
        role="dialog"
        :aria-modal="context.modalType.value === 'non-modal' ? undefined : 'true'"
        :aria-labelledby="context.titleId.value"
        tabindex="-1"
      >
        <slot />
      </component>
    </div>
  </Teleport>
</template>

<style>
@import './drawer.css';
</style>

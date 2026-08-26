<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs } from 'vue';
import type { DialogSurfaceProps, DialogSurfaceSlots } from './Dialog.types';
import { dialogContextKey } from './dialogContext';

defineOptions({ name: 'FDialogSurface', inheritAttrs: false });
const props = withDefaults(defineProps<DialogSurfaceProps>(), {
  as: 'div',
  backdropAppearance: 'dimmed',
});
defineSlots<DialogSurfaceSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const context = inject(dialogContextKey);
if (!context) throw new Error('FDialogSurface must be used inside FDialog.');
const mountNode = computed(() => context.mountNode.value);

onMounted(() => context.registerSurface(root.value));
defineExpose({ element: root, focus: () => root.value?.focus() });
</script>

<template>
  <Teleport :to="mountNode">
    <div v-if="context.open.value || !context.unmountOnClose.value" class="fui-DialogSurfaceHost">
      <div
        class="fui-DialogBackdrop"
        :class="`fui-DialogBackdrop--${props.backdropAppearance}`"
        aria-hidden="true"
        @click="
          context.modalType.value === 'modal' && context.requestOpen(false, $event, 'backdropClick')
        "
      >
        <slot name="backdrop" />
      </div>
      <component
        :is="props.as"
        :id="context.surfaceId"
        ref="root"
        v-bind="attrs"
        class="fui-DialogSurface"
        :class="`fui-DialogSurface--${context.modalType.value}`"
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
@import './dialog.css';
</style>

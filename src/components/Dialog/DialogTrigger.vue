<script setup lang="ts">
import { inject, onMounted, ref, useAttrs } from 'vue';
import type { DialogTriggerProps, DialogTriggerSlots } from './Dialog.types';
import { dialogContextKey } from './dialogContext';

defineOptions({ name: 'FDialogTrigger', inheritAttrs: false });
const props = withDefaults(defineProps<DialogTriggerProps>(), { action: 'open', as: 'button' });
defineSlots<DialogTriggerSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const injectedContext = inject(dialogContextKey);
if (!injectedContext) throw new Error('FDialogTrigger must be used inside FDialog.');
const context = injectedContext;

function handleClick(event: MouseEvent) {
  if (event.defaultPrevented) return;
  context.requestOpen(props.action === 'open', event, 'triggerClick');
}

onMounted(() => context.registerTrigger(root.value));
defineExpose({ element: root, focus: () => root.value?.focus() });
</script>

<template>
  <component
    :is="props.as"
    ref="root"
    v-bind="attrs"
    class="fui-DialogTrigger"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-haspopup="props.action === 'open' ? 'dialog' : undefined"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import type { ToastTriggerProps, ToastTriggerSlots } from './Toast.types';
import { toastContextKey } from './toastContext';

defineOptions({ name: 'FToastTrigger' });
const props = withDefaults(defineProps<ToastTriggerProps>(), { as: 'button' });
defineSlots<ToastTriggerSlots>();
const context = inject(toastContextKey, undefined);
const root = ref<HTMLElement | null>(null);
function handleClick(event: MouseEvent) {
  context?.dismiss(event, 'trigger');
}
defineExpose({ element: root });
</script>

<template>
  <component
    :is="props.as"
    ref="root"
    class="fui-ToastTrigger"
    :type="props.as === 'button' ? 'button' : undefined"
    @click="handleClick"
    ><slot
  /></component>
</template>

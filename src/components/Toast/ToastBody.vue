<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import type { ToastBodySlots, ToastPartProps } from './Toast.types';
import { toastContextKey } from './toastContext';

defineOptions({ name: 'FToastBody' });
const props = withDefaults(defineProps<ToastPartProps>(), { as: 'div' });
defineSlots<ToastBodySlots>();
const context = inject(toastContextKey, undefined);
const root = ref<HTMLElement | null>(null);
onMounted(() => context?.registerBody(true));
onBeforeUnmount(() => context?.registerBody(false));
defineExpose({ element: root });
</script>

<template>
  <component :is="props.as" :id="context?.bodyId" ref="root" class="fui-ToastBody">
    <slot />
    <div v-if="$slots.subtitle" class="fui-ToastBody__subtitle"><slot name="subtitle" /></div>
  </component>
</template>

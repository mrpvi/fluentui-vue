<script setup lang="ts">
import { ref } from 'vue';
import type { ToastPartProps, ToastPartSlots } from './Toast.types';

defineOptions({ name: 'FToastFooter' });
const props = withDefaults(defineProps<ToastPartProps>(), { as: 'div' });
defineSlots<ToastPartSlots>();
const root = ref<HTMLElement | null>(null);
defineExpose({ element: root });
</script>

<template>
  <component :is="props.as" ref="root" class="fui-ToastFooter"><slot /></component>
</template>

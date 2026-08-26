<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import type { ToastPartProps, ToastTitleSlots } from './Toast.types';
import { toastContextKey } from './toastContext';

defineOptions({ name: 'FToastTitle' });
const props = withDefaults(defineProps<ToastPartProps>(), { as: 'div' });
defineSlots<ToastTitleSlots>();
const context = inject(toastContextKey, undefined);
const root = ref<HTMLElement | null>(null);
onMounted(() => context?.registerTitle(true));
onBeforeUnmount(() => context?.registerTitle(false));
defineExpose({ element: root });
</script>

<template>
  <component :is="props.as" :id="context?.titleId" ref="root" class="fui-ToastTitle">
    <div class="fui-ToastTitle__media" aria-hidden="true">
      <slot name="media">
        <span v-if="context?.intent.value === 'success'">✓</span>
        <span v-else-if="context?.intent.value === 'warning'">!</span>
        <span v-else-if="context?.intent.value === 'error'">×</span>
        <span v-else>i</span>
      </slot>
    </div>
    <div class="fui-ToastTitle__content"><slot /></div>
    <div v-if="$slots.action" class="fui-ToastTitle__action"><slot name="action" /></div>
  </component>
</template>

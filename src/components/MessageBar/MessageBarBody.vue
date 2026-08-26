<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import type { MessageBarPartProps, MessageBarPartSlots } from './MessageBar.types';
import { messageBarContextKey } from './messageBarContext';

defineOptions({ name: 'FMessageBarBody' });
const props = withDefaults(defineProps<MessageBarPartProps>(), { as: 'div' });
defineSlots<MessageBarPartSlots>();
const context = inject(messageBarContextKey, undefined);
const root = ref<HTMLElement | null>(null);
onMounted(() => context?.registerBody(root.value));
onBeforeUnmount(() => context?.registerBody(null));
defineExpose({ element: root });
</script>

<template>
  <component :is="props.as" ref="root" class="fui-MessageBarBody"><slot /></component>
</template>

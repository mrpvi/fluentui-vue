<script setup lang="ts">
import { ref } from 'vue';
import type { MessageBarGroupProps, MessageBarGroupSlots } from './MessageBar.types';

defineOptions({ name: 'FMessageBarGroup' });
const props = withDefaults(defineProps<MessageBarGroupProps>(), { animate: 'both' });
defineSlots<MessageBarGroupSlots>();
const root = ref<HTMLElement | null>(null);
defineExpose({ element: root });
</script>

<template>
  <div ref="root" class="fui-MessageBarGroup" :data-animate="props.animate"><slot /></div>
</template>

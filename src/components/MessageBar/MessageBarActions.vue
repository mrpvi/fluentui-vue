<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import type { MessageBarActionsSlots, MessageBarPartProps } from './MessageBar.types';
import { messageBarContextKey } from './messageBarContext';

defineOptions({ name: 'FMessageBarActions' });
const props = withDefaults(defineProps<MessageBarPartProps>(), { as: 'div' });
defineSlots<MessageBarActionsSlots>();
const context = inject(messageBarContextKey, undefined);
const root = ref<HTMLElement | null>(null);
onMounted(() => context?.registerActions(root.value));
onBeforeUnmount(() => context?.registerActions(null));
defineExpose({ element: root });
</script>

<template>
  <component :is="props.as" ref="root" class="fui-MessageBarActions">
    <div class="fui-MessageBarActions__actions"><slot /></div>
    <div v-if="$slots.containerAction" class="fui-MessageBarActions__containerAction">
      <slot name="containerAction" />
    </div>
  </component>
</template>

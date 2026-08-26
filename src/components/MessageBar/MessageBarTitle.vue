<script setup lang="ts">
import { inject, ref } from 'vue';
import type { MessageBarPartProps, MessageBarPartSlots } from './MessageBar.types';
import { messageBarContextKey } from './messageBarContext';

defineOptions({ name: 'FMessageBarTitle' });
const props = withDefaults(defineProps<MessageBarPartProps>(), { as: 'span' });
defineSlots<MessageBarPartSlots>();
const context = inject(messageBarContextKey, undefined);
const root = ref<HTMLElement | null>(null);
defineExpose({ element: root });
</script>

<template>
  <component :is="props.as" :id="context?.titleId" ref="root" class="fui-MessageBarTitle">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue';
import type {
  TeachingPopoverTriggerProps,
  TeachingPopoverTriggerSlots,
} from './TeachingPopover.types';
import { teachingPopoverContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverTrigger', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverTriggerProps>(), { as: 'button' });
defineSlots<TeachingPopoverTriggerSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const context = inject(teachingPopoverContextKey);
if (!context) throw new Error('FTeachingPopoverTrigger must be used inside FTeachingPopover.');
onMounted(() => context.registerTrigger(root.value));
onBeforeUnmount(() => context.registerTrigger(null));
</script>
<template>
  <component
    :is="props.as"
    :id="context.triggerId"
    ref="root"
    v-bind="attrs"
    class="fui-TeachingPopoverTrigger"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-expanded="context.open.value"
    :aria-controls="context.open.value ? context.surfaceId : undefined"
    @click="context.requestOpen(!context.open.value, $event, 'click')"
    ><slot
  /></component>
</template>

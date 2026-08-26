<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { PortalProps, PortalSlots } from './Portal.types';

defineOptions({ name: 'FPortal', inheritAttrs: false });
const props = withDefaults(defineProps<PortalProps>(), { mountNode: 'body', disabled: false });
defineSlots<PortalSlots>();
const attrs = useAttrs();
const target = computed(() => props.mountNode);
</script>

<template>
  <Teleport v-if="!disabled" :to="target">
    <div v-bind="attrs"><slot /></div>
  </Teleport>
  <div v-else v-bind="attrs"><slot /></div>
</template>

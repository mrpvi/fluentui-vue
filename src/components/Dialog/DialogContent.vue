<script setup lang="ts">
import { useAttrs } from 'vue';
import type { DialogContentProps, DialogContentSlots } from './Dialog.types';

defineOptions({ name: 'FDialogContent', inheritAttrs: false });
const props = withDefaults(defineProps<DialogContentProps>(), { as: 'div' });
defineSlots<DialogContentSlots>();
const attrs = useAttrs();
</script>

<template>
  <component :is="props.as" v-bind="attrs" class="fui-DialogContent"><slot /></component>
</template>

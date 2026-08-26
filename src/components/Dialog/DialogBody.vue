<script setup lang="ts">
import { useAttrs } from 'vue';
import type { DialogBodyProps, DialogBodySlots } from './Dialog.types';

defineOptions({ name: 'FDialogBody', inheritAttrs: false });
const props = withDefaults(defineProps<DialogBodyProps>(), { as: 'div' });
defineSlots<DialogBodySlots>();
const attrs = useAttrs();
</script>

<template>
  <component :is="props.as" v-bind="attrs" class="fui-DialogBody"><slot /></component>
</template>

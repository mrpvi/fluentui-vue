<script setup lang="ts">
import { inject, onMounted, useAttrs, useId } from 'vue';
import type { DialogTitleProps, DialogTitleSlots } from './Dialog.types';
import { dialogContextKey } from './dialogContext';

defineOptions({ name: 'FDialogTitle', inheritAttrs: false });
const props = withDefaults(defineProps<DialogTitleProps>(), { as: 'h2' });
defineSlots<DialogTitleSlots>();
const attrs = useAttrs();
const context = inject(dialogContextKey);
if (!context) throw new Error('FDialogTitle must be used inside FDialog.');
const titleId = `fui-dialog-title-${useId()}`;

onMounted(() => {
  context.titleId.value = titleId;
});
</script>

<template>
  <component :is="props.as" :id="titleId" v-bind="attrs" class="fui-DialogTitle">
    <span><slot /></span>
    <span v-if="$slots.action" class="fui-DialogTitle__action"><slot name="action" /></span>
  </component>
</template>

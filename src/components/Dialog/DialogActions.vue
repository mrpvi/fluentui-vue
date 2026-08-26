<script setup lang="ts">
import { useAttrs } from 'vue';
import type { DialogActionsProps, DialogActionsSlots } from './Dialog.types';

defineOptions({ name: 'FDialogActions', inheritAttrs: false });
const props = withDefaults(defineProps<DialogActionsProps>(), {
  as: 'div',
  position: 'end',
  fluid: false,
});
defineSlots<DialogActionsSlots>();
const attrs = useAttrs();
</script>

<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-DialogActions"
    :class="[`fui-DialogActions--${props.position}`, { 'fui-DialogActions--fluid': props.fluid }]"
  >
    <slot />
  </component>
</template>

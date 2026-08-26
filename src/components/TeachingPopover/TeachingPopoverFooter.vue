<script setup lang="ts">
import { inject, useAttrs } from 'vue';
import type {
  TeachingPopoverFooterEmits,
  TeachingPopoverFooterProps,
  TeachingPopoverFooterSlots,
} from './TeachingPopover.types';
import { teachingPopoverContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverFooter', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverFooterProps>(), {
  as: 'div',
  footerLayout: 'horizontal',
  dismissOnPrimary: true,
  dismissOnSecondary: true,
});
const emit = defineEmits<TeachingPopoverFooterEmits>();
defineSlots<TeachingPopoverFooterSlots>();
const attrs = useAttrs();
const injectedContext = inject(teachingPopoverContextKey);
if (!injectedContext)
  throw new Error('FTeachingPopoverFooter must be used inside FTeachingPopover.');
const context = injectedContext;
function primary(event: MouseEvent) {
  emit('primaryClick', event);
  if (props.dismissOnPrimary) context.requestOpen(false, event, 'dismiss');
}
function secondary(event: MouseEvent) {
  emit('secondaryClick', event);
  if (props.dismissOnSecondary) context.requestOpen(false, event, 'dismiss');
}
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-TeachingPopoverFooter"
    :class="`fui-TeachingPopoverFooter--${props.footerLayout}`"
    ><slot name="secondary"
      ><button
        v-if="props.secondaryText"
        type="button"
        class="fui-TeachingPopoverFooter__secondary"
        @click="secondary"
      >
        {{ props.secondaryText }}
      </button></slot
    ><slot
      ><slot name="primary"
        ><button
          v-if="props.primaryText"
          type="button"
          class="fui-TeachingPopoverFooter__primary"
          @click="primary"
        >
          {{ props.primaryText }}
        </button></slot
      ></slot
    ></component
  >
</template>
<style>
@import './teachingPopover.css';
</style>

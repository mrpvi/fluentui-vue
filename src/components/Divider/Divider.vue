<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue';
import type { DividerProps, DividerSlots } from './Divider.types';

defineOptions({
  name: 'FDivider',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DividerProps>(), {
  alignContent: 'center',
  appearance: 'default',
  inset: false,
  vertical: false,
});

const slots = defineSlots<DividerSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const generatedContentId = `fui-divider-${useId()}__content`;
const hasContent = computed(() => Boolean(slots.default));

const classes = computed(() => [
  'fui-Divider',
  `fui-Divider--${props.vertical ? 'vertical' : 'horizontal'}`,
  `fui-Divider--align-${props.alignContent}`,
  `fui-Divider--${props.appearance}`,
  {
    'fui-Divider--inset': props.inset,
    'fui-Divider--with-content': hasContent.value,
    'fui-Divider--childless': !hasContent.value,
  },
  attrs.class,
]);

const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-orientation': _ariaOrientation,
    'aria-labelledby': _ariaLabelledby,
    ...rest
  } = attrs;

  return rest;
});

defineExpose({
  element: root,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    :aria-labelledby="hasContent ? generatedContentId : undefined"
  >
    <div v-if="hasContent" :id="generatedContentId" class="fui-Divider__wrapper">
      <slot />
    </div>
  </div>
</template>

<style>
@import './divider.css';
</style>

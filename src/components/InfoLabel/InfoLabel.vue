<script setup lang="ts">
import { computed, ref, useAttrs, useId, useSlots } from 'vue';
import FLabel from '../Label/Label.vue';
import FInfoButton from './InfoButton.vue';
import type { InfoLabelProps, InfoLabelSlots } from './InfoLabel.types';

defineOptions({ name: 'FInfoLabel', inheritAttrs: false });
const props = withDefaults(defineProps<InfoLabelProps>(), {
  disabled: false,
  inline: true,
  mountNode: 'body',
  required: false,
  size: 'medium',
  weight: 'regular',
});
defineSlots<InfoLabelSlots>();
const attrs = useAttrs();
const slots = useSlots();
const root = ref<HTMLSpanElement | null>(null);
const labelId = `fui-info-label-${useId()}`;
const infoButtonId = `${labelId}-button`;
const showInfoButton = computed(() => Boolean(props.info || slots.info || slots.infoButton));
const labelAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
defineExpose({ element: root });
</script>

<template>
  <span ref="root" class="fui-InfoLabel" :class="attrs.class" :style="attrs.style">
    <FLabel
      :id="labelId"
      v-bind="labelAttrs"
      :for="props.for"
      :disabled="props.disabled"
      :required="props.required"
      :size="props.size"
      :weight="props.weight"
    >
      <slot />
      <template v-if="$slots.required" #required><slot name="required" /></template>
    </FLabel>
    <slot v-if="showInfoButton" name="infoButton">
      <FInfoButton
        :id="infoButtonId"
        :info="props.info"
        :size="props.size"
        :inline="props.inline"
        :mount-node="props.mountNode"
        :aria-labelledby="`${labelId} ${infoButtonId}`"
      >
        <template v-if="$slots.info" #info><slot name="info" /></template>
      </FInfoButton>
    </slot>
  </span>
</template>

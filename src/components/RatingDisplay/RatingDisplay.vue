<script setup lang="ts">
import { computed, provide, ref, useAttrs, useId } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { ratingItemContextKey } from '../Rating/ratingContext';
import FRatingItem from '../RatingItem/RatingItem.vue';
import type { RatingDisplayProps, RatingDisplaySlots } from './RatingDisplay.types';

defineOptions({
  name: 'FRatingDisplay',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<RatingDisplayProps>(), {
  color: 'neutral',
  compact: false,
  max: 5,
  size: 'medium',
});
const slots = defineSlots<RatingDisplaySlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const valueTextId = `fui-rating-value-${useId()}`;
const countTextId = `fui-rating-count-${useId()}`;

function normalizedMaxValue(max: number): number {
  if (Number.isInteger(max) && max > 1) {
    return max;
  }

  if (import.meta.env.DEV) {
    console.error(
      `[FRatingDisplay] The prop 'max' must be a whole number greater than 1. Received max: ${max}`,
    );
  }
  return 5;
}

const normalizedMax = computed(() => normalizedMaxValue(props.max));
const normalizedValue = computed(() => {
  if (props.value === undefined || !Number.isFinite(props.value)) {
    return 0;
  }
  return Math.min(normalizedMax.value, Math.max(0, props.value));
});
const formattedCount = computed(() => props.count?.toLocaleString());
const hasValueText = computed(() => props.value !== undefined || Boolean(slots['value-text']));
const hasCountText = computed(() => props.count !== undefined || Boolean(slots['count-text']));
const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, id: attrs.id as string | undefined }),
  { supportsRequired: false },
);
const classes = computed(() => [
  'fui-RatingDisplay',
  `fui-RatingDisplay--${props.color}`,
  `fui-RatingDisplay--${props.size}`,
  { 'fui-RatingDisplay--compact': props.compact },
  attrs.class,
]);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-labelledby': consumerLabelledBy,
    ...rest
  } = fieldControlProps.value;
  const generatedLabelledBy = [
    hasValueText.value ? valueTextId : undefined,
    hasCountText.value ? countTextId : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    ...rest,
    'aria-labelledby':
      typeof consumerLabelledBy === 'string'
        ? consumerLabelledBy
        : generatedLabelledBy || undefined,
    'aria-label': attrs['aria-label'] as string | undefined,
  };
});
const emptyName = computed(() => {
  const resolvedAttrs = rootAttrs.value as Record<string, unknown>;
  return !(resolvedAttrs['aria-label'] || resolvedAttrs['aria-labelledby'] || resolvedAttrs.title);
});

provide(ratingItemContextKey, {
  color: computed(() => props.color),
  size: computed(() => props.size),
  step: computed(() => 1 as const),
  value: normalizedValue,
  previewValue: computed(() => undefined),
  name: computed(() => ''),
  interactive: computed(() => false),
  disabled: computed(() => false),
  readOnly: computed(() => true),
  compact: computed(() => props.compact),
  itemLabel: computed(() => (value: number) => `${value}`),
});

defineExpose({ element: root });
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    role="img"
    :aria-label="
      (attrs['aria-label'] as string | undefined) ??
      (emptyName ? `${normalizedValue} out of ${normalizedMax}` : undefined)
    "
  >
    <FRatingItem
      v-for="itemValue in compact ? 1 : normalizedMax"
      :key="itemValue"
      :value="itemValue"
      aria-hidden="true"
    >
      <template v-if="slots.icon" #selected-icon="slotProps">
        <slot name="icon" v-bind="slotProps" />
      </template>
      <template v-if="slots.icon" #unselected-icon="slotProps">
        <slot name="icon" v-bind="slotProps" />
      </template>
    </FRatingItem>

    <span
      v-if="hasValueText"
      :id="valueTextId"
      class="fui-RatingDisplay__valueText"
      aria-hidden="true"
    >
      <slot name="value-text" :value="value">{{ value }}</slot>
    </span>
    <span
      v-if="hasCountText"
      :id="countTextId"
      class="fui-RatingDisplay__countText"
      aria-hidden="true"
    >
      <slot name="count-text" :count="count" :formatted-count="formattedCount">{{
        formattedCount
      }}</slot>
    </span>
  </div>
</template>

<style>
@import './ratingDisplay.css';
</style>

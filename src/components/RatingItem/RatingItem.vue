<script setup lang="ts">
import { computed, inject, ref, useAttrs } from 'vue';
import { ratingItemContextKey } from '../Rating/ratingContext';
import type { RatingItemProps, RatingItemSlots } from './RatingItem.types';

defineOptions({
  name: 'FRatingItem',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<RatingItemProps>(), {
  value: 0,
});
defineSlots<RatingItemSlots>();
const attrs = useAttrs();
const root = ref<HTMLSpanElement | null>(null);
const context = inject(ratingItemContextKey, undefined);

const color = computed(() => context?.color.value ?? 'neutral');
const size = computed(() => context?.size.value ?? 'medium');
const step = computed(() => context?.step.value ?? 1);
const interactive = computed(() => context?.interactive.value ?? false);
const disabled = computed(() => context?.disabled.value ?? false);
const readOnly = computed(() => context?.readOnly.value ?? false);
const displayedValue = computed(
  () => context?.previewValue.value ?? Math.round((context?.value.value ?? 0) * 2) / 2,
);
const fill = computed(() => {
  if (context?.compact.value || displayedValue.value >= props.value) {
    return 1;
  }
  if (displayedValue.value >= props.value - 0.5) {
    return 0.5;
  }
  return 0;
});
const appearance = computed(() => (interactive.value ? 'outline' : 'filled'));
const classes = computed(() => [
  'fui-RatingItem',
  `fui-RatingItem--${size.value}`,
  `fui-RatingItem--${color.value}`,
  `fui-RatingItem--fill-${fill.value === 0.5 ? 'half' : fill.value === 1 ? 'full' : 'none'}`,
  `fui-RatingItem--${appearance.value}`,
  {
    'fui-RatingItem--disabled': disabled.value,
    'fui-RatingItem--read-only': readOnly.value,
  },
  attrs.class,
]);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, value: _value, ...rest } = attrs;
  return rest;
});
const itemLabel = computed(() => context?.itemLabel.value ?? ((value: number) => `${value}`));

function starPath() {
  return 'M12 2.25l2.93 5.94 6.55.95-4.74 4.62 1.12 6.52L12 17.2l-5.86 3.08 1.12-6.52-4.74-4.62 6.55-.95L12 2.25Z';
}

defineExpose({
  element: root,
  focus: () =>
    root.value?.querySelector<HTMLInputElement>('input[type="radio"]:not(:disabled)')?.focus(),
});
</script>

<template>
  <span ref="root" v-bind="rootAttrs" :class="classes" :style="attrs.style">
    <template v-if="interactive">
      <input
        v-if="step === 0.5"
        v-bind="context?.inputAttrs.value"
        class="fui-RatingItem__halfValueInput"
        type="radio"
        :name="context?.name.value"
        :value="value - 0.5"
        :checked="context?.value.value === value - 0.5"
        :disabled="disabled || readOnly"
        :required="context?.required.value"
        :aria-label="itemLabel(value - 0.5)"
      />
      <input
        v-bind="context?.inputAttrs.value"
        class="fui-RatingItem__fullValueInput"
        :class="{ 'fui-RatingItem__fullValueInput--upper-half': step === 0.5 }"
        type="radio"
        :name="context?.name.value"
        :value="value"
        :checked="context?.value.value === value"
        :disabled="disabled || readOnly"
        :required="context?.required.value"
        :aria-label="itemLabel(value)"
      />
    </template>

    <span v-if="fill < 1" class="fui-RatingItem__unselectedIcon" aria-hidden="true">
      <slot name="unselected-icon" :value="value" :fill="fill">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            v-if="appearance === 'outline'"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linejoin="round"
            :d="starPath()"
          />
          <path v-else :d="starPath()" />
        </svg>
      </slot>
    </span>
    <span v-if="fill > 0" class="fui-RatingItem__selectedIcon" aria-hidden="true">
      <slot name="selected-icon" :value="value" :fill="fill">
        <svg viewBox="0 0 24 24" focusable="false"><path :d="starPath()" /></svg>
      </slot>
    </span>
  </span>
</template>

<style>
@import './ratingItem.css';
</style>

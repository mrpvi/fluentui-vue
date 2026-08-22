<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import FRatingItem from '../RatingItem/RatingItem.vue';
import { ratingItemContextKey } from './ratingContext';
import type { RatingEmits, RatingProps, RatingSlots } from './Rating.types';

defineOptions({
  name: 'FRating',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<RatingProps>(), {
  color: 'neutral',
  max: 5,
  step: 1,
  size: 'extra-large',
  readOnly: false,
  disabled: false,
  itemLabel: (value: number) => `${value}`,
});

const emit = defineEmits<RatingEmits>();
const slots = defineSlots<RatingSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const generatedName = `fui-rating-${useId()}`;
const initialValue = props.defaultValue ?? 0;
const internalValue = ref(initialValue);
const previewValue = ref<number | undefined>(undefined);
const isControlled = useIsPropProvided('modelValue') || useIsPropProvided('model-value');
let form: HTMLFormElement | null = null;
let resetTimer: ReturnType<typeof setTimeout> | undefined;

function normalizedMaxValue(max: number): number {
  if (Number.isInteger(max) && max > 1) {
    return max;
  }

  if (import.meta.env.DEV) {
    console.error(
      `[FRating] The prop 'max' must be a whole number greater than 1. Received max: ${max}`,
    );
  }
  return 5;
}

function normalizedStepValue(step: unknown): 0.5 | 1 {
  if (step === 0.5 || step === 1) {
    return step;
  }

  if (import.meta.env.DEV) {
    console.error(`[FRating] The prop 'step' must be 0.5 or 1. Received step: ${String(step)}`);
  }
  return 1;
}

function normalizeValue(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) {
    return 0;
  }

  const stepped = Math.round(value / normalizedStep.value) * normalizedStep.value;
  return Math.min(normalizedMax.value, Math.max(0, stepped));
}

const normalizedMax = computed(() => normalizedMaxValue(props.max));
const normalizedStep = computed(() => normalizedStepValue(props.step));
const currentValue = computed(() =>
  normalizeValue(isControlled ? props.modelValue : internalValue.value),
);
const resolvedName = computed(() => props.name ?? generatedName);
const interactive = computed(() => !props.readOnly);
const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, id: attrs.id as string | undefined }),
  { supportsRequired: false },
);
const required = computed(
  () =>
    attrs.required !== false &&
    (attrs.required !== undefined ||
      fieldControlProps.value['aria-required'] === true ||
      fieldControlProps.value['aria-required'] === 'true'),
);
const inputAttrs = computed(() => {
  const { form, autocomplete } = attrs;
  return { form, autocomplete };
});
const consumerMouseOver = computed(
  () => attrs.onMouseover as ((event: MouseEvent) => void) | undefined,
);
const consumerMouseLeave = computed(
  () => attrs.onMouseleave as ((event: MouseEvent) => void) | undefined,
);
const classes = computed(() => [
  'fui-Rating',
  `fui-Rating--${props.color}`,
  `fui-Rating--${props.size}`,
  {
    'fui-Rating--disabled': props.disabled,
    'fui-Rating--read-only': props.readOnly,
    'fui-Rating--previewing': previewValue.value !== undefined,
  },
  attrs.class,
]);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    value: _value,
    name: _name,
    disabled: _disabled,
    readonly: _readonly,
    required: _required,
    form: _form,
    autocomplete: _autocomplete,
    onChange: _onChange,
    onMouseover: _onMouseover,
    onMouseleave: _onMouseleave,
    ...rest
  } = fieldControlProps.value;

  return rest;
});

function isOwnRadio(target: EventTarget | null): target is HTMLInputElement {
  return (
    target instanceof HTMLInputElement &&
    target.type === 'radio' &&
    target.name === resolvedName.value
  );
}

function syncNativeState() {
  if (!root.value) {
    return;
  }

  for (const input of root.value.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
    input.checked = Number(input.value) === currentValue.value;
  }
}

function handleChange(event: Event) {
  if (props.disabled || props.readOnly || !isOwnRadio(event.target)) {
    return;
  }

  const nextValue = Number(event.target.value);
  if (!Number.isFinite(nextValue) || nextValue === currentValue.value) {
    if (isControlled) {
      nextTick(syncNativeState);
    }
    return;
  }

  if (!isControlled) {
    internalValue.value = nextValue;
  } else {
    nextTick(syncNativeState);
  }

  emit('update:modelValue', nextValue);
  emit('change', event, { value: nextValue });
}

function handleMouseOver(event: MouseEvent) {
  if (!props.disabled && !props.readOnly && isOwnRadio(event.target)) {
    const nextValue = Number(event.target.value);
    previewValue.value = Number.isFinite(nextValue) ? nextValue : undefined;
  }
  consumerMouseOver.value?.(event);
}

function handleMouseLeave(event: MouseEvent) {
  previewValue.value = undefined;
  consumerMouseLeave.value?.(event);
}

function handleFormReset() {
  resetTimer = setTimeout(() => {
    previewValue.value = undefined;
    if (isControlled) {
      syncNativeState();
      return;
    }

    internalValue.value = initialValue;
    syncNativeState();
  });
}

provide(ratingItemContextKey, {
  color: computed(() => props.color),
  size: computed(() => props.size),
  step: normalizedStep,
  value: currentValue,
  previewValue: computed(() => previewValue.value),
  name: resolvedName,
  interactive,
  disabled: computed(() => props.disabled),
  readOnly: computed(() => props.readOnly),
  required,
  inputAttrs,
  compact: computed(() => false),
  itemLabel: computed(() => props.itemLabel),
});

onMounted(() => {
  if (root.value) {
    for (const input of root.value.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
      input.defaultChecked = Number(input.value) === normalizeValue(initialValue);
    }
    syncNativeState();
  }

  form = root.value?.querySelector<HTMLInputElement>('input[type="radio"]')?.form ?? null;
  form?.addEventListener('reset', handleFormReset);
});
onBeforeUnmount(() => {
  form?.removeEventListener('reset', handleFormReset);
  if (resetTimer !== undefined) {
    clearTimeout(resetTimer);
  }
});

defineExpose({
  element: root,
  focus: () => {
    const selected = root.value?.querySelector<HTMLInputElement>(
      'input[type="radio"]:checked:not(:disabled)',
    );
    const firstEnabled = root.value?.querySelector<HTMLInputElement>(
      'input[type="radio"]:not(:disabled)',
    );
    (selected ?? firstEnabled)?.focus();
  },
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    role="radiogroup"
    :aria-disabled="disabled || undefined"
    :aria-readonly="readOnly || undefined"
    :aria-required="required || undefined"
    @change="handleChange"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <slot>
      <FRatingItem v-for="itemValue in normalizedMax" :key="itemValue" :value="itemValue">
        <template v-if="slots['selected-icon']" #selected-icon="slotProps">
          <slot name="selected-icon" v-bind="slotProps" />
        </template>
        <template v-if="slots['unselected-icon']" #unselected-icon="slotProps">
          <slot name="unselected-icon" v-bind="slotProps" />
        </template>
      </FRatingItem>
    </slot>
  </div>
</template>

<style>
@import './rating.css';
</style>

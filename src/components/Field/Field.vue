<script setup lang="ts">
import { computed, provide, ref, useAttrs, useId } from 'vue';
import { FLabel } from '../Label';
import { fieldContextKey } from './fieldContext';
import type {
  FieldControlProps,
  FieldProps,
  FieldSlots,
  FieldValidationState,
} from './Field.types';

defineOptions({
  name: 'FField',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<FieldProps>(), {
  orientation: 'vertical',
  required: false,
  size: 'medium',
});

const attrs = useAttrs();
const slots = defineSlots<FieldSlots>();
const root = ref<HTMLDivElement | null>(null);
const baseId = `fui-field-${useId()}`;
const generatedControlId = `${baseId}__control`;
const generatedLabelId = `${baseId}__label`;
const generatedValidationMessageId = `${baseId}__validation-message`;
const generatedHintId = `${baseId}__hint`;
const hasLabel = computed(() => Boolean(props.label || slots.label));
const hasValidationMessage = computed(() =>
  Boolean(props.validationMessage || slots['validation-message']),
);
const hasHint = computed(() => Boolean(props.hint || slots.hint));
const validationState = computed<FieldValidationState>(
  () => props.validationState ?? (hasValidationMessage.value ? 'error' : 'none'),
);
const hasValidationMessageIcon = computed(
  () =>
    hasValidationMessage.value &&
    (Boolean(slots['validation-message-icon']) || validationState.value !== 'none'),
);
const labelFor = computed(() => (hasLabel.value ? generatedControlId : undefined));
const labelId = computed(() => (hasLabel.value ? generatedLabelId : undefined));
const validationMessageId = computed(() =>
  hasValidationMessage.value ? generatedValidationMessageId : undefined,
);
const hintId = computed(() => (hasHint.value ? generatedHintId : undefined));
const required = computed(() => props.required);
const size = computed(() => props.size);

provide(fieldContextKey, {
  generatedControlId,
  labelFor,
  labelId,
  validationMessageId,
  hintId,
  required,
  size,
  validationState,
});

const controlProps = computed<FieldControlProps>(() => {
  const describedBy = [validationMessageId.value, hintId.value].filter(Boolean).join(' ');

  return {
    id: generatedControlId,
    ...(describedBy ? { 'aria-describedby': describedBy } : {}),
    ...(validationState.value === 'error' ? { 'aria-invalid': true } : {}),
    ...(props.required ? { required: true } : {}),
  };
});

const rootClasses = computed(() => [
  'fui-Field',
  `fui-Field--${props.orientation}`,
  `fui-Field--${props.size}`,
  `fui-Field--validation-${validationState.value}`,
  {
    'fui-Field--horizontal-no-label': props.orientation === 'horizontal' && !hasLabel.value,
  },
  attrs.class,
]);

const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

const validationMessageRole = computed(() =>
  validationState.value === 'error' || validationState.value === 'warning'
    ? 'alert'
    : undefined,
);

defineExpose({
  element: root,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="rootClasses"
    :style="attrs.style"
  >
    <FLabel
      v-if="hasLabel"
      :id="generatedLabelId"
      :for="generatedControlId"
      class="fui-Field__label"
      :required="required"
      :size="size"
    >
      <slot name="label">{{ label }}</slot>
    </FLabel>

    <slot v-bind="controlProps" />

    <div
      v-if="hasValidationMessage"
      :id="generatedValidationMessageId"
      :class="[
        'fui-Field__validationMessage',
        `fui-Field__validationMessage--${validationState}`,
        { 'fui-Field__validationMessage--with-icon': hasValidationMessageIcon },
      ]"
      :role="validationMessageRole"
    >
      <span
        v-if="hasValidationMessageIcon"
        :class="[
          'fui-Field__validationMessageIcon',
          `fui-Field__validationMessageIcon--${validationState}`,
        ]"
        aria-hidden="true"
      >
        <slot
          name="validation-message-icon"
          :validation-state="validationState"
        >
          <svg
            v-if="validationState === 'error'"
            viewBox="0 0 12 12"
            focusable="false"
          >
            <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm1.47 6.82a.5.5 0 0 1-.7 0L6 7.06l-.76.76a.5.5 0 1 1-.71-.7l.76-.77-.76-.76a.5.5 0 1 1 .7-.71l.77.76.76-.76a.5.5 0 0 1 .71.7l-.76.77.76.76a.5.5 0 0 1 0 .71Z" />
          </svg>
          <svg
            v-else-if="validationState === 'warning'"
            viewBox="0 0 12 12"
            focusable="false"
          >
            <path d="M5.12 1.5a1 1 0 0 1 1.76 0l4.02 7.53A1 1 0 0 1 10.02 10H1.98a1 1 0 0 1-.88-1.47L5.12 1.5ZM6 3.25a.5.5 0 0 0-.5.5v2.5a.5.5 0 0 0 1 0v-2.5a.5.5 0 0 0-.5-.5Zm0 5.5a.63.63 0 1 0 0-1.25.63.63 0 0 0 0 1.25Z" />
          </svg>
          <svg
            v-else-if="validationState === 'success'"
            viewBox="0 0 12 12"
            focusable="false"
          >
            <path d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1Zm2.35 3.85-2.7 3a.5.5 0 0 1-.73.02L3.6 6.55a.5.5 0 1 1 .7-.7l.95.94 2.36-2.61a.5.5 0 1 1 .74.67Z" />
          </svg>
        </slot>
      </span>
      <slot name="validation-message">{{ validationMessage }}</slot>
    </div>

    <div
      v-if="hasHint"
      :id="generatedHintId"
      class="fui-Field__hint"
    >
      <slot name="hint">{{ hint }}</slot>
    </div>
  </div>
</template>

<style>
@import './field.css';
</style>

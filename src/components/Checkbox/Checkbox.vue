<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { CheckboxEmits, CheckboxProps, CheckboxSlots, CheckboxValue } from './Checkbox.types';

defineOptions({
  name: 'FCheckbox',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CheckboxProps>(), {
  labelPosition: 'after',
  shape: 'square',
  size: 'medium',
  disabled: false,
});

const emit = defineEmits<CheckboxEmits>();
const attrs = useAttrs();
const slots = defineSlots<CheckboxSlots>();
const input = ref<HTMLInputElement | null>(null);
const generatedId = useId();
const initialChecked = props.defaultChecked ?? false;
const internalChecked = ref<CheckboxValue>(initialChecked);
const isControlled = useIsPropProvided('modelValue');
let form: HTMLFormElement | null = null;
const checked = computed<CheckboxValue>(() =>
  isControlled ? (props.modelValue ?? false) : internalChecked.value,
);
const isMixed = computed(() => checked.value === 'mixed');
const isChecked = computed(() => checked.value === true);
const hasLabel = computed(() => Boolean(props.label || slots.label));
const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, id: attrs.id as string | undefined }),
  {
    supportsLabelFor: true,
    supportsRequired: true,
  },
);
const inputId = computed(
  () => (fieldControlProps.value.id as string | undefined) ?? `fui-checkbox-${generatedId}`,
);

const classes = computed(() => [
  'fui-Checkbox',
  `fui-Checkbox--${props.size}`,
  `fui-Checkbox--${props.shape}`,
  `fui-Checkbox--label-${props.labelPosition}`,
  {
    'fui-Checkbox--unchecked': checked.value === false,
    'fui-Checkbox--checked': isChecked.value,
    'fui-Checkbox--mixed': isMixed.value,
    'fui-Checkbox--disabled': props.disabled,
  },
  attrs.class,
]);

const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    checked: _checked,
    ...rest
  } = fieldControlProps.value;
  return rest;
});

function syncNativeState() {
  if (!input.value) {
    return;
  }

  input.value.indeterminate = isMixed.value;

  if (isControlled || isMixed.value) {
    input.value.checked = isChecked.value;
  }
}

function handleFormReset() {
  setTimeout(() => {
    if (!input.value) {
      return;
    }

    if (isControlled) {
      syncNativeState();
      return;
    }

    internalChecked.value = initialChecked === 'mixed' ? 'mixed' : input.value.checked;
    syncNativeState();
  });
}

watch(checked, syncNativeState, { flush: 'post' });
onMounted(() => {
  if (input.value && !isControlled) {
    input.value.defaultChecked = initialChecked === true;
    input.value.checked = initialChecked === true;
  }

  syncNativeState();
  form = input.value?.form ?? null;
  form?.addEventListener('reset', handleFormReset);
});
onBeforeUnmount(() => form?.removeEventListener('reset', handleFormReset));

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const nextChecked: CheckboxValue = target.checked;

  if (isControlled) {
    nextTick(syncNativeState);
  } else {
    internalChecked.value = nextChecked;
  }

  emit('update:modelValue', nextChecked);
  emit('change', event, { checked: nextChecked });
}

defineExpose({
  element: input,
  focus: () => input.value?.focus(),
});
</script>

<template>
  <span :class="classes" :style="attrs.style">
    <input
      v-bind="inputAttrs"
      :id="inputId"
      ref="input"
      :class="[
        'fui-Checkbox__input',
        `fui-Checkbox__input--${size}`,
        `fui-Checkbox__input--label-${labelPosition}`,
      ]"
      type="checkbox"
      :checked="isControlled ? isChecked : undefined"
      :disabled="disabled"
      @change="handleChange"
    />

    <label
      v-if="hasLabel && labelPosition === 'before'"
      :for="inputId"
      :class="[
        'fui-Checkbox__label',
        `fui-Checkbox__label--${size}`,
        'fui-Checkbox__label--before',
      ]"
    >
      <slot name="label">{{ label }}</slot>
    </label>

    <span
      :class="['fui-Checkbox__indicator', `fui-Checkbox__indicator--${size}`]"
      aria-hidden="true"
    >
      <slot name="indicator" :checked="checked">
        <svg v-if="isChecked" class="fui-Checkbox__checkmark" viewBox="0 0 16 16" focusable="false">
          <path
            d="M13.2 4.2a.75.75 0 0 1 .1 1.06l-6 7a.75.75 0 0 1-1.1.04l-3.5-3.5a.75.75 0 0 1 1.06-1.06l2.93 2.93 5.47-6.38a.75.75 0 0 1 1.05-.09Z"
          />
        </svg>
        <span v-else-if="isMixed" class="fui-Checkbox__mixedMark" />
      </slot>
    </span>

    <label
      v-if="hasLabel && labelPosition === 'after'"
      :for="inputId"
      :class="['fui-Checkbox__label', `fui-Checkbox__label--${size}`, 'fui-Checkbox__label--after']"
    >
      <slot name="label">{{ label }}</slot>
    </label>
  </span>
</template>

<style>
@import './checkbox.css';
</style>

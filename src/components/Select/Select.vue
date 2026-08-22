<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { SelectEmits, SelectProps, SelectSize, SelectSlots } from './Select.types';

defineOptions({
  name: 'FSelect',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SelectProps>(), {
  appearance: 'outline',
  size: 'medium',
});

const emit = defineEmits<SelectEmits>();
const attrs = useAttrs();
defineSlots<SelectSlots>();
const select = ref<HTMLSelectElement | null>(null);
const initialValue = props.defaultValue;
const internalValue = ref(initialValue ?? '');
const isControlled = useIsPropProvided('modelValue');
const isSizeProvided = useIsPropProvided('size');
let form: HTMLFormElement | null = null;

const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, ...(isSizeProvided ? { size: props.size } : {}) }),
  {
    supportsLabelFor: true,
    supportsRequired: true,
    supportsSize: true,
  },
);
const effectiveSize = computed(
  () => (fieldControlProps.value.size as SelectSize | undefined) ?? props.size,
);

const rootClasses = computed(() => [
  'fui-Select',
  `fui-Select--${props.appearance}`,
  `fui-Select--${effectiveSize.value}`,
  {
    'fui-Select--disabled': Boolean(fieldControlProps.value.disabled),
    'fui-Select--invalid':
      fieldControlProps.value['aria-invalid'] === true ||
      fieldControlProps.value['aria-invalid'] === 'true',
  },
  attrs.class,
]);

const selectAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    value: _value,
    selected: _selected,
    size: _size,
    onChange: _onChange,
    onInput: _onInput,
    ...rest
  } = fieldControlProps.value;

  // The released React runtime forwards a raw `multiple` attribute. We preserve
  // that native behavior, but the public value contract intentionally stays scalar.
  return rest;
});

function controlledValue(): string {
  return props.modelValue ?? '';
}

function applyValue(value: string) {
  if (!select.value) {
    return;
  }

  select.value.value = value;
}

function setDefaultSelection(value: string) {
  if (!select.value) {
    return;
  }

  for (const option of select.value.options) {
    option.defaultSelected = option.value === value;
  }
}

function handleFormReset() {
  setTimeout(() => {
    if (!select.value) {
      return;
    }

    if (isControlled) {
      applyValue(controlledValue());
      return;
    }

    if (initialValue !== undefined) {
      applyValue(initialValue);
    }
    internalValue.value = select.value.value;
  });
}

onMounted(() => {
  if (!select.value) {
    return;
  }

  if (isControlled) {
    applyValue(controlledValue());
  } else if (initialValue !== undefined) {
    setDefaultSelection(initialValue);
    applyValue(initialValue);
  } else {
    internalValue.value = select.value.value;
  }

  form = select.value.form;
  form?.addEventListener('reset', handleFormReset);
});

onBeforeUnmount(() => form?.removeEventListener('reset', handleFormReset));

watch(
  () => props.modelValue,
  (value) => {
    if (isControlled) {
      applyValue(value ?? '');
    }
  },
  { flush: 'post' },
);

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  if (isControlled) {
    target.value = controlledValue();
  } else {
    internalValue.value = value;
  }

  emit('update:modelValue', value);
  emit('change', event, { value });
}

defineExpose({
  element: select,
  focus: () => select.value?.focus(),
});
</script>

<template>
  <span :class="rootClasses" :style="attrs.style">
    <select ref="select" v-bind="selectAttrs" class="fui-Select__select" @change="handleChange">
      <slot />
    </select>

    <span class="fui-Select__icon" aria-hidden="true">
      <slot name="icon">
        <svg viewBox="0 0 20 20" fill="currentColor" focusable="false" aria-hidden="true">
          <path
            d="M5.65 7.65a.5.5 0 0 1 .7 0L10 11.29l3.65-3.64a.5.5 0 0 1 .7.7l-4 4a.5.5 0 0 1-.7 0l-4-4a.5.5 0 0 1 0-.7Z"
          />
        </svg>
      </slot>
    </span>
  </span>
</template>

<style>
@import './select.css';
</style>

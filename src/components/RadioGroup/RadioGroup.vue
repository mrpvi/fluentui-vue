<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, useId } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { radioGroupContextKey } from './radioGroupContext';
import type { RadioGroupEmits, RadioGroupProps, RadioGroupSlots } from './RadioGroup.types';

defineOptions({
  name: 'FRadioGroup',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<RadioGroupProps>(), {
  layout: 'vertical',
  disabled: false,
  required: false,
});

const emit = defineEmits<RadioGroupEmits>();
defineSlots<RadioGroupSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const generatedName = `fui-radiogroup-${useId()}`;
const initialValue = props.defaultValue;
const internalValue = ref<string | undefined>(initialValue);
const isControlled = useIsPropProvided('modelValue');
let form: HTMLFormElement | null = null;
const value = computed(() => (isControlled ? props.modelValue : internalValue.value));
const name = computed(() => props.name ?? generatedName);
const disabled = computed(() => props.disabled);
const layout = computed(() => props.layout);
const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, id: attrs.id as string | undefined }),
  { supportsRequired: false },
);
const describedBy = computed(
  () => fieldControlProps.value['aria-describedby'] as string | undefined,
);
const required = computed(
  () =>
    props.required ||
    fieldControlProps.value['aria-required'] === true ||
    fieldControlProps.value['aria-required'] === 'true',
);
const invalid = computed(
  () =>
    fieldControlProps.value['aria-invalid'] === true ||
    fieldControlProps.value['aria-invalid'] === 'true',
);
const classes = computed(() => [
  'fui-RadioGroup',
  `fui-RadioGroup--${props.layout}`,
  {
    'fui-RadioGroup--disabled': props.disabled,
    'fui-RadioGroup--invalid': invalid.value,
  },
  attrs.class,
]);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    name: _name,
    value: _value,
    disabled: _disabled,
    required: _required,
    onChange: _onChange,
    'aria-required': _ariaRequired,
    ...rest
  } = fieldControlProps.value;
  return rest;
});

function select(nextValue: string) {
  if (!isControlled) {
    internalValue.value = nextValue;
  }
}

function syncControlledInputs() {
  if (!isControlled || !root.value) {
    return;
  }

  for (const input of root.value.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
    input.checked = input.value === props.modelValue;
  }
}

function handleChange(event: Event) {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.type !== 'radio') {
    return;
  }

  select(target.value);
  if (isControlled) {
    queueMicrotask(syncControlledInputs);
  }
  emit('update:modelValue', target.value);
  emit('change', event, { value: target.value });
}

function handleFormReset() {
  setTimeout(() => {
    if (isControlled) {
      syncControlledInputs();
      return;
    }

    internalValue.value = initialValue;
  });
}

provide(radioGroupContextKey, {
  name,
  value,
  defaultValue: initialValue,
  isControlled,
  disabled,
  required,
  layout,
  describedBy,
  invalid,
  select,
});

onMounted(() => {
  form = root.value?.closest('form') ?? null;
  form?.addEventListener('reset', handleFormReset);
});
onBeforeUnmount(() => form?.removeEventListener('reset', handleFormReset));

defineExpose({
  element: root,
  focus: () =>
    root.value?.querySelector<HTMLInputElement>('input[type="radio"]:not(:disabled)')?.focus(),
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    role="radiogroup"
    :aria-required="required || undefined"
    @change="handleChange"
  >
    <slot />
  </div>
</template>

<style>
@import './radioGroup.css';
</style>

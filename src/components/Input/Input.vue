<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  InputEmits,
  InputProps,
  InputSize,
  InputSlots,
} from './Input.types';

defineOptions({
  name: 'FInput',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<InputProps>(), {
  appearance: 'outline',
  size: 'medium',
  type: 'text',
});

const emit = defineEmits<InputEmits>();
const attrs = useAttrs();
const slots = defineSlots<InputSlots>();
const input = ref<HTMLInputElement | null>(null);
const initialValue = props.defaultValue ?? '';
const internalValue = ref(initialValue);
const isControlled = useIsPropProvided('modelValue');
const isSizeProvided = useIsPropProvided('size');
let form: HTMLFormElement | null = null;

if (import.meta.env.DEV && props.appearance.endsWith('-shadow')) {
  console.error(
    `[FInput] appearance="${props.appearance}" is deprecated and is retained only for Fluent UI parity.`,
  );
}

watch(
  () => props.appearance,
  appearance => {
    if (import.meta.env.DEV && appearance.endsWith('-shadow')) {
      console.error(`[FInput] appearance="${appearance}" is deprecated.`);
    }
  },
);

const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, ...(isSizeProvided ? { size: props.size } : {}) }),
  {
    supportsLabelFor: true,
    supportsRequired: true,
    supportsSize: true,
  },
);
const effectiveSize = computed(
  () => (fieldControlProps.value.size as InputSize | undefined) ?? props.size,
);

const rootClasses = computed(() => [
  'fui-Input',
  `fui-Input--${props.appearance}`,
  `fui-Input--${effectiveSize.value}`,
  {
    'fui-Input--with-content-before': Boolean(slots['content-before']),
    'fui-Input--with-content-after': Boolean(slots['content-after']),
    'fui-Input--disabled': Boolean(fieldControlProps.value.disabled),
    'fui-Input--invalid':
      fieldControlProps.value['aria-invalid'] === true ||
      fieldControlProps.value['aria-invalid'] === 'true',
  },
  attrs.class,
]);

const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    value: _value,
    size: _size,
    ...rest
  } = fieldControlProps.value;
  return rest;
});

function handleFormReset() {
  setTimeout(() => {
    if (!input.value) {
      return;
    }

    if (isControlled) {
      input.value.value = props.modelValue ?? '';
      return;
    }

    internalValue.value = input.value.value;
  });
}

onMounted(() => {
  if (!input.value) {
    return;
  }

  if (isControlled) {
    input.value.value = props.modelValue ?? '';
  } else {
    input.value.defaultValue = initialValue;
    input.value.value = initialValue;
  }

  form = input.value.form;
  form?.addEventListener('reset', handleFormReset);
});

onBeforeUnmount(() => form?.removeEventListener('reset', handleFormReset));

watch(
  () => props.modelValue,
  value => {
    if (isControlled && input.value) {
      input.value.value = value ?? '';
    }
  },
  { flush: 'post' },
);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  if (isControlled) {
    target.value = props.modelValue ?? '';
  } else {
    internalValue.value = value;
  }

  emit('update:modelValue', value);
  emit('input', event, { value });
}

function handleChange(event: Event) {
  emit('change', event, { value: (event.target as HTMLInputElement).value });
}

defineExpose({
  element: input,
  focus: () => input.value?.focus(),
  select: () => input.value?.select(),
});
</script>

<template>
  <span :class="rootClasses" :style="attrs.style">
    <span
      v-if="$slots['content-before']"
      :class="['fui-Input__contentBefore', `fui-Input__contentBefore--${effectiveSize}`]"
    >
      <slot name="content-before" />
    </span>

    <input
      ref="input"
      v-bind="inputAttrs"
      class="fui-Input__input"
      :type="type"
      @input="handleInput"
      @change="handleChange"
    />

    <span
      v-if="$slots['content-after']"
      :class="['fui-Input__contentAfter', `fui-Input__contentAfter--${effectiveSize}`]"
    >
      <slot name="content-after" />
    </span>
  </span>
</template>

<style>
@import './input.css';
</style>

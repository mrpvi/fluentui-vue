<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  TextareaEmits,
  TextareaProps,
  TextareaSize,
} from './Textarea.types';

defineOptions({
  name: 'FTextarea',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<TextareaProps>(), {
  appearance: 'outline',
  resize: 'none',
  size: 'medium',
});

const emit = defineEmits<TextareaEmits>();
const attrs = useAttrs();
const textarea = ref<HTMLTextAreaElement | null>(null);
const initialValue = props.defaultValue ?? '';
const internalValue = ref(initialValue);
const isControlled = useIsPropProvided('modelValue');
const isSizeProvided = useIsPropProvided('size');
let form: HTMLFormElement | null = null;

function warnDeprecatedAppearance(appearance: string) {
  if (import.meta.env.DEV && appearance.endsWith('-shadow')) {
    console.error(
      `[FTextarea] appearance="${appearance}" is deprecated and is retained only for Fluent UI parity.`,
    );
  }
}

warnDeprecatedAppearance(props.appearance);

watch(() => props.appearance, warnDeprecatedAppearance);

const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, ...(isSizeProvided ? { size: props.size } : {}) }),
  {
    supportsLabelFor: true,
    supportsRequired: true,
    supportsSize: true,
  },
);
const effectiveSize = computed(
  () => (fieldControlProps.value.size as TextareaSize | undefined) ?? props.size,
);

const rootClasses = computed(() => [
  'fui-Textarea',
  `fui-Textarea--${props.appearance}`,
  `fui-Textarea--${effectiveSize.value}`,
  `fui-Textarea--resize-${props.resize}`,
  {
    'fui-Textarea--disabled': Boolean(fieldControlProps.value.disabled),
    'fui-Textarea--readonly': Boolean(
      fieldControlProps.value.readonly ?? fieldControlProps.value.readOnly,
    ),
    'fui-Textarea--invalid':
      fieldControlProps.value['aria-invalid'] === true ||
      fieldControlProps.value['aria-invalid'] === 'true',
  },
  attrs.class,
]);

const textareaAttrs = computed(() => {
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
    if (!textarea.value) {
      return;
    }

    if (isControlled) {
      textarea.value.value = props.modelValue ?? '';
      return;
    }

    internalValue.value = textarea.value.value;
  });
}

onMounted(() => {
  if (!textarea.value) {
    return;
  }

  if (isControlled) {
    textarea.value.value = props.modelValue ?? '';
  } else {
    textarea.value.defaultValue = initialValue;
    textarea.value.value = initialValue;
  }

  form = textarea.value.form;
  form?.addEventListener('reset', handleFormReset);
});

onBeforeUnmount(() => form?.removeEventListener('reset', handleFormReset));

watch(
  () => props.modelValue,
  value => {
    if (isControlled && textarea.value) {
      textarea.value.value = value ?? '';
    }
  },
  { flush: 'post' },
);

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
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
  emit('change', event, {
    value: (event.target as HTMLTextAreaElement).value,
  });
}

defineExpose({
  element: textarea,
  focus: () => textarea.value?.focus(),
  select: () => textarea.value?.select(),
});
</script>

<template>
  <span :class="rootClasses" :style="attrs.style">
    <textarea
      ref="textarea"
      v-bind="textareaAttrs"
      class="fui-Textarea__textarea"
      @input="handleInput"
      @change="handleChange"
    />
  </span>
</template>

<style>
@import './textarea.css';
</style>

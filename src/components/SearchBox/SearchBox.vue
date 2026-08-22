<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  SearchBoxEmits,
  SearchBoxProps,
  SearchBoxSize,
  SearchBoxSlots,
} from './SearchBox.types';

defineOptions({
  name: 'FSearchBox',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SearchBoxProps>(), {
  appearance: 'outline',
  size: 'medium',
  disabled: false,
  readOnly: false,
});

const emit = defineEmits<SearchBoxEmits>();
const attrs = useAttrs();
const slots = defineSlots<SearchBoxSlots>();
const input = useTemplateRef<HTMLInputElement>('input');
const root = useTemplateRef<HTMLSpanElement>('root');
const initialValue = props.defaultValue ?? '';
const internalValue = ref(initialValue);
const isControlled = useIsPropProvided('modelValue');
const isSizeProvided = useIsPropProvided('size');
const focusWithin = ref(false);
let form: HTMLFormElement | null = null;

function warnDeprecatedAppearance(appearance: string) {
  if (import.meta.env.DEV && appearance.endsWith('-shadow')) {
    console.error(
      `[FSearchBox] appearance="${appearance}" is deprecated and is retained only for Fluent UI parity.`,
    );
  }
}

warnDeprecatedAppearance(props.appearance);
watch(() => props.appearance, warnDeprecatedAppearance);

const fieldControlProps = useFieldControlProps(
  () => ({
    ...attrs,
    disabled: props.disabled || attrs.disabled,
    readonly: props.readOnly || attrs.readonly || attrs.readOnly,
    ...(isSizeProvided ? { size: props.size } : {}),
  }),
  {
    supportsLabelFor: true,
    supportsRequired: true,
    supportsSize: true,
  },
);

const effectiveSize = computed(
  () => (fieldControlProps.value.size as SearchBoxSize | undefined) ?? props.size,
);
const isDisabled = computed(() => Boolean(fieldControlProps.value.disabled));
const isReadOnly = computed(() =>
  Boolean(fieldControlProps.value.readonly ?? fieldControlProps.value.readOnly),
);

const rootClasses = computed(() => [
  'fui-SearchBox',
  `fui-SearchBox--${props.appearance}`,
  `fui-SearchBox--${effectiveSize.value}`,
  {
    'fui-SearchBox--focused': focusWithin.value,
    'fui-SearchBox--with-content-after': Boolean(slots['content-after']),
    'fui-SearchBox--disabled': isDisabled.value,
    'fui-SearchBox--readonly': isReadOnly.value,
    'fui-SearchBox--invalid':
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
    type: _type,
    onInput: _onInput,
    onChange: _onChange,
    onSearch: _onSearch,
    onKeydown: _onKeydown,
    ...rest
  } = fieldControlProps.value;
  return rest;
});

function controlledValue(): string {
  return props.modelValue ?? '';
}

function applyValue(value: string) {
  if (input.value) {
    input.value.value = value;
  }
}

function handleFormReset() {
  setTimeout(() => {
    if (!input.value) {
      return;
    }

    if (isControlled) {
      applyValue(controlledValue());
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
    applyValue(controlledValue());
  } else {
    input.value.defaultValue = initialValue;
    applyValue(initialValue);
  }

  form = input.value.form;
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

function commitUserValue(value: string, event: Event) {
  if (isControlled) {
    applyValue(controlledValue());
  } else {
    internalValue.value = value;
  }

  emit('update:modelValue', value);
  emit('input', event, { value });
}

function handleInput(event: Event) {
  commitUserValue((event.target as HTMLInputElement).value, event);
}

function handleChange(event: Event) {
  emit('change', event, { value: (event.target as HTMLInputElement).value });
}

function handleSearch(event: Event) {
  emit('search', event, { value: (event.target as HTMLInputElement).value });
}

function clear(event: MouseEvent | KeyboardEvent) {
  if (isDisabled.value || isReadOnly.value || !input.value) {
    return;
  }

  applyValue('');
  if (!isControlled) {
    internalValue.value = '';
  }

  emit('update:modelValue', '');
  emit('input', event, { value: '' });
  emit('clear', event, { value: '' });
  input.value.focus();

  if (isControlled) {
    applyValue(controlledValue());
  }
}

function handleDismissClick(event: MouseEvent) {
  clear(event);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && input.value?.value) {
    event.preventDefault();
    clear(event);
  }
}

function handleFocusIn() {
  focusWithin.value = true;
}

function handleFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget;
  focusWithin.value = nextTarget instanceof Node && Boolean(root.value?.contains(nextTarget));
}

defineExpose({
  element: input,
  focus: () => input.value?.focus(),
  select: () => input.value?.select(),
});
</script>

<template>
  <span
    ref="root"
    :class="rootClasses"
    :style="attrs.style"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <span class="fui-SearchBox__contentBefore">
      <slot name="content-before">
        <svg viewBox="0 0 20 20" fill="currentColor" focusable="false" aria-hidden="true">
          <path
            d="M8.5 3a5.5 5.5 0 1 0 3.47 9.77l3.63 3.63a.5.5 0 0 0 .7-.7l-3.63-3.63A5.5 5.5 0 0 0 8.5 3Zm-4.5 5.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z"
          />
        </svg>
      </slot>
    </span>

    <input
      ref="input"
      v-bind="inputAttrs"
      class="fui-SearchBox__input"
      type="search"
      @input="handleInput"
      @change="handleChange"
      @search="handleSearch"
      @keydown="handleKeydown"
    />

    <span
      :class="[
        'fui-SearchBox__contentAfter',
        { 'fui-SearchBox__contentAfter--visible': focusWithin },
      ]"
    >
      <span v-if="$slots['content-after']" class="fui-SearchBox__customContentAfter">
        <slot name="content-after" />
      </span>

      <span
        class="fui-SearchBox__dismiss"
        role="button"
        aria-label="clear"
        tabindex="-1"
        :aria-disabled="isDisabled || isReadOnly ? 'true' : undefined"
        @click="handleDismissClick"
      >
        <slot name="dismiss">
          <svg viewBox="0 0 20 20" fill="currentColor" focusable="false" aria-hidden="true">
            <path
              d="M4.15 4.15a.5.5 0 0 1 .7 0L10 9.29l5.15-5.14a.5.5 0 0 1 .7.7L10.71 10l5.14 5.15a.5.5 0 0 1-.7.7L10 10.71l-5.15 5.14a.5.5 0 0 1-.7-.7L9.29 10 4.15 4.85a.5.5 0 0 1 0-.7Z"
            />
          </svg>
        </slot>
      </span>
    </span>
  </span>
</template>

<style>
@import './searchBox.css';
</style>

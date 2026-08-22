<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue';
import { useFieldControlProps } from '../../composables/useFieldControlProps';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import FLabel from '../Label/Label.vue';
import type { SwitchEmits, SwitchProps, SwitchSlots } from './Switch.types';

defineOptions({
  name: 'FSwitch',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SwitchProps>(), {
  labelPosition: 'after',
  size: 'medium',
  disabled: false,
  disabledFocusable: false,
});

const emit = defineEmits<SwitchEmits>();
const attrs = useAttrs();
const slots = defineSlots<SwitchSlots>();
const input = ref<HTMLInputElement | null>(null);
const generatedId = useId();
const initialChecked = props.defaultChecked ?? false;
const internalChecked = ref(initialChecked);
const isControlled = useIsPropProvided('modelValue');
let form: HTMLFormElement | null = null;
let pendingReset: ReturnType<typeof setTimeout> | undefined;

const checked = computed(() =>
  isControlled ? (props.modelValue ?? false) : internalChecked.value,
);
const hasLabel = computed(() => Boolean(props.label || slots.label));
const fieldControlProps = useFieldControlProps(
  () => ({ ...attrs, id: attrs.id as string | undefined }),
  {
    supportsLabelFor: true,
    supportsRequired: true,
  },
);
const isDisabled = computed(
  () =>
    props.disabled ||
    fieldControlProps.value.disabled === true ||
    fieldControlProps.value.disabled === '',
);
const inputId = computed(
  () => (fieldControlProps.value.id as string | undefined) ?? `fui-switch-${generatedId}`,
);
const isInvalid = computed(
  () =>
    fieldControlProps.value['aria-invalid'] === true ||
    fieldControlProps.value['aria-invalid'] === 'true',
);
const rootClasses = computed(() => [
  'fui-Switch',
  `fui-Switch--${props.size}`,
  `fui-Switch--label-${props.labelPosition}`,
  {
    'fui-Switch--checked': checked.value,
    'fui-Switch--disabled': isDisabled.value || props.disabledFocusable,
    'fui-Switch--disabled-focusable': props.disabledFocusable,
    'fui-Switch--invalid': isInvalid.value,
  },
  attrs.class,
]);
const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    checked: _checked,
    defaultChecked: _defaultChecked,
    disabled: _disabled,
    role: _role,
    type: _type,
    onChange: _onChange,
    onClick: _onClick,
    onKeydown: _onKeydown,
    onKeyDown: _onKeyDown,
    'aria-disabled': _ariaDisabled,
    ...rest
  } = fieldControlProps.value;

  return rest;
});

function syncNativeState() {
  if (input.value) {
    input.value.checked = checked.value;
  }
}

function handleFormReset() {
  pendingReset = setTimeout(() => {
    if (!input.value) {
      return;
    }

    if (isControlled) {
      syncNativeState();
      return;
    }

    internalChecked.value = initialChecked;
    syncNativeState();
  });
}

watch(checked, syncNativeState, { flush: 'post' });
onMounted(() => {
  if (!input.value) {
    return;
  }

  if (!isControlled) {
    input.value.defaultChecked = initialChecked;
    input.value.checked = initialChecked;
  }

  syncNativeState();
  form = input.value.form;
  form?.addEventListener('reset', handleFormReset);
});
onBeforeUnmount(() => {
  form?.removeEventListener('reset', handleFormReset);
  if (pendingReset !== undefined) {
    clearTimeout(pendingReset);
  }
});

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const nextChecked = target.checked;

  if (props.disabledFocusable) {
    nextTick(syncNativeState);
    return;
  }

  if (isControlled) {
    nextTick(syncNativeState);
  } else {
    internalChecked.value = nextChecked;
  }

  emit('update:modelValue', nextChecked);
  emit('change', event, { checked: nextChecked });
}

function handleClick(event: MouseEvent) {
  if (props.disabledFocusable) {
    event.preventDefault();
    nextTick(syncNativeState);
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabledFocusable && (event.key === ' ' || event.key === 'Enter')) {
    event.preventDefault();
    nextTick(syncNativeState);
  }
}

defineExpose({
  element: input,
  focus: () => input.value?.focus(),
});
</script>

<template>
  <div :class="rootClasses" :style="attrs.style">
    <input
      v-bind="inputAttrs"
      :id="inputId"
      ref="input"
      :class="[
        'fui-Switch__input',
        `fui-Switch__input--${size}`,
        `fui-Switch__input--label-${labelPosition}`,
      ]"
      type="checkbox"
      role="switch"
      :checked="checked"
      :disabled="isDisabled && !disabledFocusable"
      :aria-disabled="disabledFocusable ? 'true' : undefined"
      @change="handleChange"
      @click="handleClick"
      @keydown="handleKeydown"
    />

    <FLabel
      v-if="hasLabel && labelPosition !== 'after'"
      :for="inputId"
      :disabled="isDisabled || disabledFocusable"
      :required="Boolean(fieldControlProps.required)"
      :class="[
        'fui-Switch__label',
        `fui-Switch__label--${size}`,
        `fui-Switch__label--${labelPosition}`,
      ]"
      size="medium"
    >
      <slot name="label">{{ label }}</slot>
    </FLabel>

    <div
      :class="[
        'fui-Switch__indicator',
        `fui-Switch__indicator--${size}`,
        { 'fui-Switch__indicator--label-above': hasLabel && labelPosition === 'above' },
      ]"
      aria-hidden="true"
    >
      <slot name="indicator" :checked="checked">
        <span class="fui-Switch__thumb" />
      </slot>
    </div>

    <FLabel
      v-if="hasLabel && labelPosition === 'after'"
      :for="inputId"
      :disabled="isDisabled || disabledFocusable"
      :required="Boolean(fieldControlProps.required)"
      :class="['fui-Switch__label', `fui-Switch__label--${size}`, 'fui-Switch__label--after']"
      size="medium"
    >
      <slot name="label">{{ label }}</slot>
    </FLabel>
  </div>
</template>

<style>
@import './switch.css';
</style>

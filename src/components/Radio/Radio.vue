<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch,
} from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { radioGroupContextKey } from '../RadioGroup/radioGroupContext';
import type { RadioEmits, RadioProps, RadioSlots } from './Radio.types';

defineOptions({
  name: 'FRadio',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<RadioProps>(), {
  labelPosition: undefined,
  disabled: false,
});

const emit = defineEmits<RadioEmits>();
const attrs = useAttrs();
const slots = defineSlots<RadioSlots>();
const input = ref<HTMLInputElement | null>(null);
const group = inject(radioGroupContextKey, undefined);
const generatedId = useId();
const initialChecked = props.defaultChecked ?? false;
const internalChecked = ref(initialChecked);
const hasModelValue = useIsPropProvided('modelValue');
const hasName = useIsPropProvided('name');
const hasDisabled = useIsPropProvided('disabled');
const hasRequired = useIsPropProvided('required');
const hasLabelPosition = useIsPropProvided('labelPosition');
const hasAriaDescribedBy = useIsPropProvided('aria-describedby');
const hasAriaInvalid = useIsPropProvided('aria-invalid');
const isStandaloneControlled = !group && hasModelValue;
let form: HTMLFormElement | null = null;
const checked = computed(() => {
  if (hasModelValue) {
    return props.modelValue ?? false;
  }

  if (group) {
    return group.value.value === props.value;
  }

  return internalChecked.value;
});
const resolvedName = computed(() => {
  const localName = attrs.name as string | undefined;
  return hasName ? localName : group?.name.value;
});
const resolvedDisabled = computed(() =>
  hasDisabled ? props.disabled : (group?.disabled.value ?? props.disabled),
);
const resolvedRequired = computed(() => {
  const localRequired = attrs.required;
  return hasRequired ? localRequired !== false : (group?.required.value ?? false);
});
const resolvedLabelPosition = computed(() => {
  if (hasLabelPosition) {
    return props.labelPosition ?? 'after';
  }

  return group?.layout.value === 'horizontal-stacked' ? 'below' : 'after';
});
const resolvedAriaDescribedBy = computed(() => {
  const localDescription = attrs['aria-describedby'] as string | undefined;
  return hasAriaDescribedBy ? localDescription : group?.describedBy.value;
});
const resolvedAriaInvalid = computed(() => {
  const localInvalid = attrs['aria-invalid'] as boolean | 'true' | 'false' | undefined;
  return hasAriaInvalid ? localInvalid : group?.invalid.value || undefined;
});
const hasLabel = computed(() => Boolean(props.label || slots.label));
const inputId = computed(() => (attrs.id as string | undefined) ?? `fui-radio-${generatedId}`);
const classes = computed(() => [
  'fui-Radio',
  `fui-Radio--label-${resolvedLabelPosition.value}`,
  {
    'fui-Radio--checked': checked.value,
    'fui-Radio--unchecked': !checked.value,
    'fui-Radio--disabled': resolvedDisabled.value,
  },
  attrs.class,
]);
const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    type: _type,
    checked: _checked,
    defaultChecked: _defaultChecked,
    name: _name,
    disabled: _disabled,
    required: _required,
    value: _value,
    'aria-describedby': _ariaDescribedBy,
    'aria-invalid': _ariaInvalid,
    onChange: _onChange,
    ...rest
  } = attrs;
  return rest;
});

function syncNativeState() {
  if (input.value) {
    input.value.checked = checked.value;
  }
}

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;

  if (!target.checked) {
    return;
  }

  if (group) {
    group.select(props.value);
    if (group.isControlled || hasModelValue) {
      nextTick(syncNativeState);
    }
  } else if (isStandaloneControlled) {
    nextTick(syncNativeState);
  } else {
    internalChecked.value = true;
  }

  emit('update:modelValue', true);
  emit('change', event, { value: props.value });
}

function handleFormReset() {
  setTimeout(() => {
    if (group) {
      syncNativeState();
      return;
    }

    if (isStandaloneControlled) {
      syncNativeState();
      return;
    }

    internalChecked.value = input.value?.checked ?? initialChecked;
  });
}

watch(checked, syncNativeState, { flush: 'post' });
onMounted(() => {
  if (input.value) {
    input.value.defaultChecked = group
      ? !group.isControlled && group.defaultValue === props.value
      : initialChecked;
    syncNativeState();
  }

  form = input.value?.form ?? null;
  form?.addEventListener('reset', handleFormReset);
});
onBeforeUnmount(() => form?.removeEventListener('reset', handleFormReset));

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
      :class="['fui-Radio__input', `fui-Radio__input--label-${resolvedLabelPosition}`]"
      type="radio"
      :name="resolvedName"
      :value="value"
      :checked="checked"
      :disabled="resolvedDisabled"
      :required="resolvedRequired"
      :aria-describedby="resolvedAriaDescribedBy"
      :aria-invalid="resolvedAriaInvalid"
      @change="handleChange"
    />

    <span class="fui-Radio__indicator" aria-hidden="true">
      <slot name="indicator" :checked="checked" />
    </span>

    <label
      v-if="hasLabel"
      :for="inputId"
      :class="['fui-Radio__label', `fui-Radio__label--${resolvedLabelPosition}`]"
    >
      <slot name="label">{{ label }}</slot>
    </label>
  </span>
</template>

<style>
@import './radio.css';
</style>

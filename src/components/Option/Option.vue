<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  inject,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  type VNode,
} from 'vue';
import { listboxContextKey } from '../Listbox/listboxContext';
import type { OptionEmits, OptionProps, OptionSlots } from './Option.types';

defineOptions({
  name: 'FOption',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<OptionProps>(), {
  disabled: false,
});
const emit = defineEmits<OptionEmits>();
defineSlots<OptionSlots>();
const slots = useSlots();
const attrs = useAttrs();
const injectedListbox = inject(listboxContextKey);
if (!injectedListbox) {
  throw new Error('FOption must be used inside FListbox.');
}
const listbox = injectedListbox;
const root = ref<HTMLDivElement | null>(null);
const generatedId = `fui-option-${useId()}`;
const id = computed(() => String(attrs.id ?? generatedId));

function getVNodeText(value: unknown): string {
  if (value === null || value === undefined || typeof value === 'boolean') {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(getVNodeText).join('');
  }
  if (!isVNode(value) || value.type === Comment) {
    return '';
  }
  if (value.type === Text) {
    return String(value.children ?? '');
  }
  if (value.type === Fragment) {
    return getVNodeText(value.children);
  }
  if (typeof value.children === 'string' || Array.isArray(value.children)) {
    return getVNodeText(value.children);
  }
  return '';
}

const optionText = computed(() =>
  props.text !== undefined
    ? props.text
    : getVNodeText(slots.default?.() as VNode[] | undefined).trim(),
);
const optionValue = computed(() => props.value ?? optionText.value);
const selected = computed(() => listbox.selectedOptions.value.includes(optionValue.value));
const active = computed(() => listbox.activeOptionId.value === id.value);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    role: _role,
    tabindex: _tabindex,
    onClick: _onClick,
    'aria-checked': _ariaChecked,
    'aria-disabled': _ariaDisabled,
    'aria-selected': _ariaSelected,
    ...rest
  } = attrs;
  return rest;
});
let unregister: (() => void) | undefined;

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit('click', event);
  if (event.defaultPrevented) {
    return;
  }

  listbox.setActiveOption(id.value);
  listbox.selectOption(event, {
    disabled: props.disabled,
    element: root.value!,
    id: id.value,
    text: optionText.value,
    value: optionValue.value,
  });
}

onMounted(() => {
  if (import.meta.env.DEV && props.text === undefined && !optionText.value.trim()) {
    console.warn('Provide a `text` prop to FOption when its default slot is not plain text.');
  }

  if (root.value) {
    unregister = listbox.registerOption({
      disabled: () => props.disabled,
      element: root.value,
      id: () => id.value,
      text: () => optionText.value,
      value: () => optionValue.value,
    });
  }
});
onBeforeUnmount(() => unregister?.());

defineExpose({
  element: root,
});
</script>

<template>
  <div
    :id="id"
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-Option',
      {
        'fui-Option--active': active,
        'fui-Option--disabled': disabled,
        'fui-Option--multiselect': listbox.multiselect.value,
        'fui-Option--selected': selected,
        'fui-Option--focus-visible': active && listbox.focusVisible.value,
      },
      attrs.class,
    ]"
    :style="attrs.style"
    :role="listbox.multiselect.value ? 'menuitemcheckbox' : 'option'"
    :aria-checked="listbox.multiselect.value ? selected : undefined"
    :aria-disabled="disabled || undefined"
    :aria-selected="listbox.multiselect.value ? undefined : selected"
    @click="handleClick"
  >
    <span
      class="fui-Option__checkIcon"
      :class="{
        'fui-Option__checkIcon--disabled': disabled,
        'fui-Option__checkIcon--multiselect': listbox.multiselect.value,
        'fui-Option__checkIcon--selected': selected,
      }"
      aria-hidden="true"
    >
      <slot
        name="check-icon"
        :disabled="disabled"
        :multiselect="listbox.multiselect.value"
        :selected="selected"
      >
        <svg v-if="selected" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
          <path
            d="M13.2 4.2a.75.75 0 0 1 .1 1.06l-6 7a.75.75 0 0 1-1.1.04l-3.5-3.5a.75.75 0 0 1 1.06-1.06l2.93 2.93 5.47-6.38a.75.75 0 0 1 1.05-.09Z"
          />
        </svg>
      </slot>
    </span>
    <span :key="optionText" class="fui-Option__content"><slot /></span>
  </div>
</template>

<style>
@import './option.css';
</style>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { cardContextKey } from './cardContext';
import type {
  CardAppearance,
  CardEmits,
  CardFocusMode,
  CardOrientation,
  CardProps,
  CardSize,
  CardSlots,
} from './Card.types';

defineOptions({
  name: 'FCard',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CardProps>(), {
  as: 'div',
  appearance: 'filled',
  orientation: 'vertical',
  size: 'medium',
  disabled: false,
});

const emit = defineEmits<CardEmits>();
defineSlots<CardSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const checkbox = ref<HTMLInputElement | null>(null);
const initialSelected = props.defaultSelected ?? false;
const internalSelected = ref(initialSelected);
const referenceId = ref<string>();
const referenceLabel = ref<string>();
const focusWithin = ref(false);
const focusInside = ref(false);
const isModelProvided = useIsPropProvided('modelValue');
let form: HTMLFormElement | null = null;
let pendingReset: ReturnType<typeof setTimeout> | undefined;
const isDefaultSelectedProvided =
  useIsPropProvided('defaultSelected') || useIsPropProvided('default-selected');
const hasSelectionListener = useIsPropProvided('onSelectionChange');
const hasClickListener = useIsPropProvided('onClick');
const selectable = computed(
  () => isModelProvided || isDefaultSelectedProvided || hasSelectionListener,
);
const selected = computed(() =>
  isModelProvided ? (props.modelValue ?? false) : internalSelected.value,
);
const interactive = computed(
  () =>
    !props.disabled &&
    (props.as === 'button' || props.as === 'a' || hasClickListener || selectable.value),
);
const effectiveFocusMode = computed<CardFocusMode>(
  () => props.focusMode ?? (interactive.value ? 'no-tab' : 'off'),
);
const rootElement = computed(() => (selectable.value ? 'div' : props.as));
const rootRole = computed(() => {
  if (selectable.value) {
    return 'group';
  }
  if (props.as === 'div') {
    return (attrs.role as string | undefined) ?? 'group';
  }
  if (props.as === 'article' || props.as === 'section') {
    return attrs.role as string | undefined;
  }
  if (props.as === 'a' && !attrs.href) {
    return 'button';
  }
  return undefined;
});
const rootTabIndex = computed(() => {
  if (props.disabled || selectable.value) {
    return undefined;
  }
  if (effectiveFocusMode.value !== 'off') {
    return 0;
  }
  if (props.as === 'a' && !attrs.href) {
    return 0;
  }
  return attrs.tabindex as string | number | undefined;
});
const rootType = computed(() =>
  rootElement.value === 'button'
    ? ((attrs.type as HTMLButtonElement['type'] | undefined) ?? 'button')
    : undefined,
);
const rootHref = computed(() =>
  rootElement.value === 'a' && !props.disabled ? (attrs.href as string | undefined) : undefined,
);
const checkboxName = computed(() => attrs.name as string | undefined);
const checkboxValue = computed(() => (attrs.value as string | undefined) ?? 'on');
const checkboxForm = computed(() => attrs.form as string | undefined);
const checkboxRequired = computed(() => attrs.required === true || attrs.required === '');
const checkboxLabel = computed(() =>
  referenceId.value
    ? undefined
    : (referenceLabel.value ?? (attrs['aria-label'] as string | undefined)),
);
const classes = computed(() => [
  'fui-Card',
  `fui-Card--${props.appearance satisfies CardAppearance}`,
  `fui-Card--${props.orientation satisfies CardOrientation}`,
  `fui-Card--${props.size satisfies CardSize}`,
  {
    'fui-Card--interactive': interactive.value,
    'fui-Card--selectable': selectable.value,
    'fui-Card--selected': selected.value,
    'fui-Card--disabled': props.disabled,
    'fui-Card--focus-within': focusWithin.value,
  },
  attrs.class,
]);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    tabindex: _tabindex,
    type: _type,
    href: _href,
    disabled: _disabled,
    name: _name,
    value: _value,
    form: _form,
    required: _required,
    'aria-disabled': _ariaDisabled,
    'aria-selected': _ariaSelected,
    'aria-checked': _ariaChecked,
    onClick: _onClick,
    onKeydown: _onKeydown,
    onSelectionChange: _onSelectionChange,
    'onUpdate:modelValue': _onUpdate,
    ...rest
  } = attrs;
  return rest;
});

provide(cardContextKey, {
  referenceId,
  referenceLabel,
  setReferenceId: (value) => {
    referenceId.value = value;
  },
  setReferenceLabel: (value) => {
    referenceLabel.value = value;
  },
});

function isRestrictedTarget(target: EventTarget | null): boolean {
  if (
    !(target instanceof Element) ||
    !root.value ||
    target === root.value ||
    target === checkbox.value
  ) {
    return false;
  }
  return Boolean(
    target.closest(
      'a, button, input, select, textarea, summary, [contenteditable="true"], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function setSelected(nextSelected: boolean, event: MouseEvent | KeyboardEvent | Event) {
  if (props.disabled || nextSelected === selected.value) {
    if (isModelProvided) {
      nextTick(syncCheckboxState);
    }
    return;
  }
  if (!isModelProvided) {
    internalSelected.value = nextSelected;
  } else {
    nextTick(syncCheckboxState);
  }
  emit('update:modelValue', nextSelected);
  emit('selectionChange', event, { selected: nextSelected });
}

function toggleSelection(event: MouseEvent | KeyboardEvent | Event) {
  if (!selectable.value || props.disabled || isRestrictedTarget(event.target)) {
    return;
  }
  setSelected(!selected.value, event);
}

function syncCheckboxState() {
  if (checkbox.value) {
    checkbox.value.checked = selected.value;
  }
}

function handleFormReset() {
  pendingReset = setTimeout(() => {
    if (isModelProvided) {
      syncCheckboxState();
      return;
    }
    internalSelected.value = initialSelected;
    syncCheckboxState();
  });
}

function getFocusableElements(): HTMLElement[] {
  if (!root.value) {
    return [];
  }
  return Array.from(
    root.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [contenteditable="true"], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element !== checkbox.value && !element.hidden);
}

function focusFirstInside() {
  const first = getFocusableElements()[0];
  if (first) {
    focusInside.value = true;
    first.focus();
  }
}

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  emit('click', event);
  if (!event.defaultPrevented) {
    toggleSelection(event);
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
    }
    return;
  }
  emit('keydown', event);
  if (event.defaultPrevented) {
    return;
  }

  if (event.key === 'Tab' && focusInside.value) {
    handleFocusTab(event);
    if (event.defaultPrevented) {
      return;
    }
  }

  if (event.key === 'Escape' && focusInside.value) {
    event.preventDefault();
    focusInside.value = false;
    root.value?.focus();
    return;
  }

  if (
    event.target === root.value &&
    effectiveFocusMode.value !== 'off' &&
    !selectable.value &&
    event.key === 'Enter'
  ) {
    event.preventDefault();
    focusFirstInside();
    return;
  }

  if (selectable.value && event.key === 'Enter') {
    event.preventDefault();
    toggleSelection(event);
  } else if (props.as === 'a' && !attrs.href && event.key === 'Enter') {
    event.preventDefault();
    root.value?.click();
  }
}

function handleCheckboxChange(event: Event) {
  if (props.disabled) {
    syncCheckboxState();
    return;
  }
  setSelected((event.target as HTMLInputElement).checked, event);
}

function handleFocusIn(event: FocusEvent) {
  focusWithin.value = true;
  if (event.target !== root.value && event.target !== checkbox.value) {
    focusInside.value = true;
  }
}

function handleFocusOut(event: FocusEvent) {
  focusWithin.value =
    event.relatedTarget instanceof Node && Boolean(root.value?.contains(event.relatedTarget));
  if (!focusWithin.value) {
    focusInside.value = false;
  }
}

function handleFocusTab(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !focusInside.value || props.disabled) {
    return;
  }
  const focusable = getFocusableElements();
  if (focusable.length === 0) {
    return;
  }
  const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
  const atStart = currentIndex <= 0;
  const atEnd = currentIndex === focusable.length - 1;

  if (effectiveFocusMode.value === 'no-tab') {
    event.preventDefault();
    const nextIndex = event.shiftKey
      ? atStart
        ? focusable.length - 1
        : currentIndex - 1
      : atEnd
        ? 0
        : currentIndex + 1;
    focusable[nextIndex]?.focus();
  } else if (
    effectiveFocusMode.value === 'tab-exit' &&
    ((event.shiftKey && atStart) || (!event.shiftKey && atEnd))
  ) {
    focusInside.value = false;
  } else if (
    effectiveFocusMode.value === 'tab-only' &&
    ((event.shiftKey && atStart) || (!event.shiftKey && atEnd))
  ) {
    focusInside.value = false;
  }
}

onMounted(() => {
  syncCheckboxState();
  form = checkbox.value?.form ?? null;
  form?.addEventListener('reset', handleFormReset);
});

onBeforeUnmount(() => {
  form?.removeEventListener('reset', handleFormReset);
  if (pendingReset !== undefined) {
    clearTimeout(pendingReset);
  }
});

defineExpose({
  element: root,
  focus: () => root.value?.focus(),
});
</script>

<template>
  <component
    :is="rootElement"
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    :role="rootRole"
    :tabindex="rootTabIndex"
    :type="rootType"
    :href="rootHref"
    :disabled="rootElement === 'button' && disabled ? true : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <input
      v-if="selectable && !$slots['floating-action']"
      ref="checkbox"
      class="fui-Card__checkbox"
      type="checkbox"
      :checked="selected"
      :disabled="disabled"
      :name="checkboxName"
      :value="checkboxValue"
      :form="checkboxForm"
      :required="checkboxRequired"
      :aria-labelledby="referenceId"
      :aria-label="checkboxLabel"
      @change.stop="handleCheckboxChange"
    />
    <div v-if="$slots['floating-action']" class="fui-Card__floatingAction" @click.stop>
      <slot name="floating-action" />
    </div>
    <slot />
  </component>
</template>

<style>
@import './card.css';
</style>

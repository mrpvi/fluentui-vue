<script setup lang="ts">
import { computed, onMounted, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  SwatchPickerEmits,
  SwatchPickerLayout,
  SwatchPickerProps,
  SwatchPickerShape,
  SwatchPickerSize,
  SwatchPickerSpacing,
} from './SwatchPicker.types';
import { swatchPickerContextKey, type SwatchRegistration } from './swatchPickerContext';

defineOptions({ name: 'FSwatchPicker', inheritAttrs: false });

// Native Vue adaptation of @fluentui/react-swatch-picker-preview 0.6.0
// (gitHead 3ae9ed772fbcedeff1a76e154f6eb7d515785698). Tabster arrow navigation
// becomes deterministic roving tabindex over native buttons, including RTL and grid rows.
const props = withDefaults(defineProps<SwatchPickerProps>(), {
  defaultValue: '',
  layout: 'row',
  size: 'medium',
  shape: 'square',
  spacing: 'medium',
});
const emit = defineEmits<SwatchPickerEmits>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const isControlled = useIsPropProvided('modelValue');
const internalValue = ref(props.defaultValue);
const selectedValue = computed(() =>
  isControlled ? (props.modelValue ?? '') : internalValue.value,
);
const currentLayout = computed<SwatchPickerLayout>(() => props.layout);
const currentSize = computed<SwatchPickerSize>(() => props.size);
const currentShape = computed<SwatchPickerShape>(() => props.shape);
const currentSpacing = computed<SwatchPickerSpacing>(() => props.spacing);
const registrations: SwatchRegistration[] = [];
const activeElement = ref<HTMLButtonElement | null>(null);

const rootClasses = computed(() => [
  'fui-SwatchPicker',
  `fui-SwatchPicker--${props.layout}`,
  `fui-SwatchPicker--spacing-${props.spacing}`,
  attrs.class,
]);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, role: _role, onKeydown: _onKeydown, ...rest } = attrs;
  return rest;
});

function getEnabled(): SwatchRegistration[] {
  return registrations.filter((item) => !item.disabled && item.element.isConnected);
}

function syncTabStops(preferred?: HTMLButtonElement | null) {
  const enabled = getEnabled();
  const selected = enabled.find((item) => item.value === selectedValue.value)?.element;
  const activeIsEnabled = enabled.some((item) => item.element === activeElement.value);
  const next =
    preferred && enabled.some((item) => item.element === preferred)
      ? preferred
      : (selected ?? (activeIsEnabled ? activeElement.value : null) ?? enabled[0]?.element ?? null);
  activeElement.value = next;
  for (const item of registrations) {
    item.element.tabIndex = item.disabled || item.element !== next ? -1 : 0;
  }
}

function register(registration: SwatchRegistration) {
  registrations.push(registration);
  if (registration.value === selectedValue.value) {
    activeElement.value = registration.element;
  }
  syncTabStops();
  queueMicrotask(() => syncTabStops());
  return () => {
    const index = registrations.indexOf(registration);
    if (index >= 0) {
      registrations.splice(index, 1);
    }
    if (activeElement.value === registration.element) {
      activeElement.value = null;
      syncTabStops();
    }
  };
}

function requestSelection(
  event: MouseEvent | KeyboardEvent,
  data: { selectedValue: string; selectedSwatch: string },
) {
  if (!isControlled) {
    internalValue.value = data.selectedValue;
  }
  activeElement.value = event.currentTarget as HTMLButtonElement;
  syncTabStops(activeElement.value);
  emit('update:modelValue', data.selectedValue);
  emit('selectionChange', event, data);
}

function moveFocus(event: KeyboardEvent, delta: number) {
  const enabled = getEnabled();
  if (enabled.length === 0) {
    return;
  }
  const current = enabled.findIndex((item) => item.element === event.target);
  const start = current >= 0 ? current : 0;
  const next = enabled[(start + delta + enabled.length) % enabled.length];
  if (next) {
    activeElement.value = next.element;
    syncTabStops(next.element);
    next.element.focus();
  }
}

function moveGrid(event: KeyboardEvent, verticalDelta: number) {
  const enabled = getEnabled();
  const current = enabled.find((item) => item.element === event.target);
  if (!current) {
    return;
  }
  const rows = Array.from(new Set(enabled.map((item) => item.row)));
  const rowIndex = rows.indexOf(current.row);
  const targetRow = rows[(rowIndex + verticalDelta + rows.length) % rows.length];
  const currentRow = enabled.filter((item) => item.row === current.row);
  const targetItems = enabled.filter((item) => item.row === targetRow);
  const column = Math.max(currentRow.indexOf(current), 0);
  const next = targetItems[Math.min(column, targetItems.length - 1)];
  if (next) {
    activeElement.value = next.element;
    syncTabStops(next.element);
    next.element.focus();
  }
}

function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  if (!target.matches('.fui-ColorSwatch, .fui-ImageSwatch, .fui-EmptySwatch')) {
    return;
  }
  const direction = root.value?.closest('[dir="rtl"]') ? 'rtl' : 'ltr';
  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      moveFocus(event, direction === 'rtl' ? -1 : 1);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      moveFocus(event, direction === 'rtl' ? 1 : -1);
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (props.layout === 'grid') {
        moveGrid(event, 1);
      } else {
        moveFocus(event, 1);
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (props.layout === 'grid') {
        moveGrid(event, -1);
      } else {
        moveFocus(event, -1);
      }
      break;
    case 'Home': {
      event.preventDefault();
      const first = getEnabled()[0];
      if (first) {
        syncTabStops(first.element);
        first.element.focus();
      }
      break;
    }
    case 'End': {
      event.preventDefault();
      const enabled = getEnabled();
      const last = enabled[enabled.length - 1];
      if (last) {
        syncTabStops(last.element);
        last.element.focus();
      }
      break;
    }
  }
}

onMounted(() => syncTabStops());

provide(swatchPickerContextKey, {
  layout: currentLayout,
  selectedValue,
  shape: currentShape,
  size: currentSize,
  spacing: currentSpacing,
  register,
  requestSelection,
});

defineExpose({
  element: root,
  focus: () => (activeElement.value ?? getEnabled()[0]?.element)?.focus(),
});
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="root"
    :class="rootClasses"
    :style="attrs.style"
    :role="layout === 'grid' ? 'grid' : 'radiogroup'"
    @keydown="handleKeydown"
  >
    <slot :selected-value="selectedValue" />
  </div>
</template>

<style>
@import './swatchPicker.css';
</style>

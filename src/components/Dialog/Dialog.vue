<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useAttrs,
  useId,
  watch,
} from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { DialogEmits, DialogProps, DialogSlots } from './Dialog.types';
import { dialogContextKey } from './dialogContext';

defineOptions({ name: 'FDialog', inheritAttrs: false });
const props = withDefaults(defineProps<DialogProps>(), {
  defaultOpen: false,
  modalType: 'modal',
  inertTrapFocus: false,
  unmountOnClose: true,
  mountNode: 'body',
});
const emit = defineEmits<DialogEmits>();
defineSlots<DialogSlots>();
const attrs = useAttrs();
const internalOpen = ref(props.defaultOpen);
const controlledByModel = useIsPropProvided('modelValue');
const controlledByOpen = useIsPropProvided('open');
const open = computed(() =>
  controlledByModel
    ? Boolean(props.modelValue)
    : controlledByOpen
      ? Boolean(props.open)
      : internalOpen.value,
);
const modalType = computed(() => props.modalType);
const unmountOnClose = computed(() => props.unmountOnClose);
const surfaceId = `fui-dialog-surface-${useId()}`;
const titleId = ref<string>();
const surface = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;
let previousBodyOverflow = '';
let previousInert: Array<[HTMLElement, string | null]> = [];

function requestOpen(
  next: boolean,
  event: Event,
  type: 'escapeKeyDown' | 'backdropClick' | 'triggerClick' | 'programmatic',
) {
  if (next === open.value) return;
  if (next && typeof document !== 'undefined') {
    previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  if (!controlledByModel && !controlledByOpen) internalOpen.value = next;
  emit('update:modelValue', next);
  emit('update:open', next);
  emit('openChange', event, { open: next, type, event });
}

provide(dialogContextKey, {
  open,
  modalType,
  unmountOnClose,
  mountNode: computed(() => props.mountNode),
  surfaceId,
  titleId,
  surface,
  trigger,
  requestOpen,
  registerSurface: (element) => {
    surface.value = element;
  },
  registerTrigger: (element) => {
    trigger.value = element;
  },
});

function focusableElements() {
  if (!surface.value) return [];
  return Array.from(
    surface.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

function handleKeydown(event: KeyboardEvent) {
  if (!open.value) return;
  if (event.key === 'Escape' && modalType.value !== 'alert') {
    event.preventDefault();
    requestOpen(false, event, 'escapeKeyDown');
    nextTick(() => trigger.value?.focus());
    return;
  }
  if (modalType.value === 'non-modal' || event.key !== 'Tab') return;
  const focusables = focusableElements();
  if (!focusables.length) {
    event.preventDefault();
    surface.value?.focus();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (
    event.shiftKey &&
    (document.activeElement === surface.value || document.activeElement === first)
  ) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

function setOutsideInert(inert: boolean) {
  if (!props.inertTrapFocus || typeof document === 'undefined') return;
  if (inert) {
    previousInert = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && !element.contains(surface.value),
      )
      .map((element) => [element, element.getAttribute('inert')]);
    previousInert.forEach(([element]) => element.setAttribute('inert', ''));
  } else {
    previousInert.forEach(([element, value]) => {
      if (value === null) element.removeAttribute('inert');
      else element.setAttribute('inert', value);
    });
    previousInert = [];
  }
}

watch(open, async (isOpen, wasOpen) => {
  if (isOpen) {
    if (modalType.value !== 'non-modal' && typeof document !== 'undefined') {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setOutsideInert(true);
    }
    await nextTick();
    (focusableElements()[0] ?? surface.value)?.focus();
  } else {
    document.body.style.overflow = previousBodyOverflow;
    setOutsideInert(false);
    if (wasOpen) nextTick(() => previouslyFocused?.isConnected && previouslyFocused.focus());
  }
});

onMounted(() => document.addEventListener('keydown', handleKeydown, true));
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown, true);
  document.body.style.overflow = previousBodyOverflow;
  setOutsideInert(false);
  if (previouslyFocused?.isConnected) previouslyFocused.focus();
});

defineExpose({ open, surface, trigger, focus: () => surface.value?.focus() });
</script>

<template>
  <div ref="root" v-bind="attrs" class="fui-Dialog">
    <slot />
  </div>
</template>

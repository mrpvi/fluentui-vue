<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, watch } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { DrawerEmits, DrawerProps, DrawerSlots, DrawerScrollState } from './Drawer.types';
import { drawerContextKey } from './drawerContext';

const props = withDefaults(defineProps<DrawerProps>(), {
  type: 'overlay',
  position: 'start',
  size: 'small',
  defaultOpen: false,
  modalType: 'modal',
  inertTrapFocus: false,
  unmountOnClose: true,
  mountNode: 'body',
  separator: false,
});
const emit = defineEmits<DrawerEmits>();
defineSlots<DrawerSlots>();
defineOptions({ name: 'FDrawer', inheritAttrs: false });
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
const position = computed(() => props.position);
const size = computed(() => props.size);
const modalType = computed(() => (props.type === 'inline' ? 'non-modal' : props.modalType));
const unmountOnClose = computed(() => props.unmountOnClose);
const mountNode = computed(() => props.mountNode);
const surface = ref<HTMLElement | null>(null);
const titleId = ref<string>();
const scrollState = ref<DrawerScrollState>('none');
let previouslyFocused: HTMLElement | null = null;
let previousBodyOverflow = '';
let previousInert: Array<[HTMLElement, string | null]> = [];

function requestOpen(next: boolean, event: Event, type: DrawerEmits['openChange'][1]['type']) {
  if (next === open.value || props.type === 'inline') return;
  if (next && typeof document !== 'undefined') {
    previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  if (!controlledByModel && !controlledByOpen) internalOpen.value = next;
  emit('update:modelValue', next);
  emit('update:open', next);
  emit('openChange', event, { open: next, type, event });
}

provide(drawerContextKey, {
  open,
  position,
  size,
  modalType,
  unmountOnClose,
  mountNode,
  scrollState,
  titleId,
  surface,
  requestOpen,
  registerSurface: (element) => {
    surface.value = element;
  },
  registerTitle: (id) => {
    titleId.value = id;
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
  if (!open.value || props.type === 'inline') return;
  if (event.key === 'Escape' && modalType.value !== 'alert') {
    event.preventDefault();
    requestOpen(false, event, 'escapeKeyDown');
    nextFocus();
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

function nextFocus() {
  queueMicrotask(() => previouslyFocused?.isConnected && previouslyFocused.focus());
}

function setOutsideInert(inert: boolean) {
  if (!props.inertTrapFocus || modalType.value === 'non-modal' || typeof document === 'undefined')
    return;
  if (inert) {
    previousInert = Array.from(document.body.children)
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement && !element.contains(surface.value),
      )
      .map((element) => [element, element.getAttribute('inert')]);
    previousInert.forEach(([element]) => element.setAttribute('inert', ''));
  } else {
    previousInert.forEach(([element, value]) =>
      value === null ? element.removeAttribute('inert') : element.setAttribute('inert', value),
    );
    previousInert = [];
  }
}

function updateScrollState() {
  const element = surface.value;
  if (!element || element.scrollHeight <= element.clientHeight) {
    scrollState.value = 'none';
    return;
  }
  if (element.scrollTop <= 0) scrollState.value = 'top';
  else if (element.scrollTop + element.clientHeight >= element.scrollHeight - 1)
    scrollState.value = 'bottom';
  else scrollState.value = 'middle';
}

watch(open, async (isOpen, wasOpen) => {
  if (props.type === 'inline') return;
  if (isOpen) {
    if (modalType.value !== 'non-modal' && typeof document !== 'undefined') {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setOutsideInert(true);
    }
    await Promise.resolve();
    (focusableElements()[0] ?? surface.value)?.focus();
    updateScrollState();
  } else if (typeof document !== 'undefined') {
    document.body.style.overflow = previousBodyOverflow;
    setOutsideInert(false);
    if (wasOpen) nextFocus();
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleKeydown, true);
  surface.value?.addEventListener('scroll', updateScrollState);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown, true);
  surface.value?.removeEventListener('scroll', updateScrollState);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = previousBodyOverflow;
    setOutsideInert(false);
  }
  nextFocus();
});

defineExpose({ open, surface, focus: () => surface.value?.focus() });
</script>

<template>
  <div v-if="props.type === 'inline'" v-bind="attrs" class="fui-Drawer fui-Drawer--inline">
    <slot />
  </div>
  <div v-else v-bind="attrs" class="fui-Drawer fui-Drawer--overlay">
    <slot />
  </div>
</template>

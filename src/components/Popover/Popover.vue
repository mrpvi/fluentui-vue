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
import type { PopoverEmits, PopoverProps, PopoverSlots } from './Popover.types';
import { popoverContextKey } from './popoverContext';

defineOptions({ name: 'FPopover', inheritAttrs: false });
const props = withDefaults(defineProps<PopoverProps>(), {
  defaultOpen: false,
  inlinePopup: false,
  mountNode: 'body',
  positioning: 'auto',
  trapFocus: false,
  dismissOnOutsideClick: true,
});
const emit = defineEmits<PopoverEmits>();
defineSlots<PopoverSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const surface = ref<HTMLElement | null>(null);
const internalOpen = ref(props.defaultOpen);
const isControlled = useIsPropProvided('modelValue');
const open = computed(() => (isControlled ? Boolean(props.modelValue) : internalOpen.value));
const surfaceId = `fui-popover-surface-${useId()}`;
const triggerId = `fui-popover-trigger-${useId()}`;
const surfaceStyle = ref<Record<string, string>>({});
let previouslyFocused: HTMLElement | null = null;
let resizeObserver: ResizeObserver | undefined;

function focusableElements() {
  if (!surface.value) return [];
  return Array.from(
    surface.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

function requestOpen(
  next: boolean,
  event: Event,
  reason: 'click' | 'escape' | 'outside' | 'programmatic' = 'programmatic',
) {
  if (next === open.value) return;
  if (next && typeof document !== 'undefined')
    previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (!isControlled) internalOpen.value = next;
  emit('update:modelValue', next);
  emit('openChange', event, { open: next, reason });
}

function updatePosition() {
  if (!open.value || props.inlinePopup || !trigger.value || !surface.value) return;
  const triggerRect = trigger.value.getBoundingClientRect();
  const surfaceRect = surface.value.getBoundingClientRect();
  const gap = 4;
  const above =
    props.positioning === 'above' ||
    (props.positioning === 'auto' &&
      triggerRect.bottom + surfaceRect.height + gap > window.innerHeight);
  const before = props.positioning === 'before';
  const after = props.positioning === 'after';
  const left = before
    ? triggerRect.left - surfaceRect.width - gap
    : after
      ? triggerRect.right + gap
      : triggerRect.left;
  surfaceStyle.value = {
    position: 'fixed',
    left: `${Math.max(4, left)}px`,
    top: above ? 'auto' : `${triggerRect.bottom + gap}px`,
    bottom: above ? `${Math.max(4, window.innerHeight - triggerRect.top + gap)}px` : 'auto',
    maxWidth: `calc(100vw - 8px)`,
  };
}

function handleDocumentPointerdown(event: PointerEvent) {
  if (!open.value || !props.dismissOnOutsideClick) return;
  const path = event.composedPath();
  if (path.includes(root.value as EventTarget) || path.includes(surface.value as EventTarget))
    return;
  requestOpen(false, event, 'outside');
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (!open.value || event.defaultPrevented) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    requestOpen(false, event, 'escape');
    nextTick(() => trigger.value?.focus());
    return;
  }
  if (!props.trapFocus || event.key !== 'Tab') return;
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

provide(popoverContextKey, {
  open,
  surfaceId,
  triggerId,
  trapFocus: computed(() => props.trapFocus),
  inlinePopup: computed(() => props.inlinePopup),
  mountNode: computed(() => props.mountNode),
  surfaceStyle,
  requestOpen,
  registerTrigger: (element) => {
    trigger.value = element;
  },
  registerSurface: (element) => {
    surface.value = element;
  },
  trigger,
  surface,
});

watch(open, async (isOpen) => {
  if (!isOpen) {
    surfaceStyle.value = {};
    return;
  }
  await nextTick();
  updatePosition();
  if (props.trapFocus) (focusableElements()[0] ?? surface.value)?.focus();
});

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerdown);
  document.addEventListener('keydown', handleDocumentKeydown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(root.value);
  }
});

watch(open, (isOpen, wasOpen) => {
  if (wasOpen && !isOpen) {
    nextTick(() => {
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerdown);
  document.removeEventListener('keydown', handleDocumentKeydown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
  resizeObserver?.disconnect();
  if (previouslyFocused?.isConnected) previouslyFocused.focus();
});

defineExpose({ element: root, trigger, surface, open, focus: () => trigger.value?.focus() });
</script>

<template>
  <div ref="root" v-bind="attrs" class="fui-Popover">
    <slot />
  </div>
</template>

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
import type {
  TeachingPopoverEmits,
  TeachingPopoverProps,
  TeachingPopoverSlots,
} from './TeachingPopover.types';
import { teachingPopoverContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopover', inheritAttrs: false });
const props = withDefaults(defineProps<TeachingPopoverProps>(), {
  defaultOpen: false,
  inlinePopup: false,
  mountNode: 'body',
  positioning: 'auto',
  trapFocus: true,
  dismissOnOutsideClick: true,
  appearance: 'brand',
});
const emit = defineEmits<TeachingPopoverEmits>();
defineSlots<TeachingPopoverSlots>();
const attrs = useAttrs();
const internalOpen = ref(props.defaultOpen);
const controlledModel = useIsPropProvided('modelValue');
const controlledOpen = useIsPropProvided('open');
const open = computed(() =>
  controlledModel
    ? Boolean(props.modelValue)
    : controlledOpen
      ? Boolean(props.open)
      : internalOpen.value,
);
const appearance = computed(() => props.appearance);
const inlinePopup = computed(() => props.inlinePopup);
const mountNode = computed(() => props.mountNode);
const trigger = ref<HTMLElement | null>(null);
const surface = ref<HTMLElement | null>(null);
const surfaceStyle = ref<Record<string, string>>({});
const surfaceId = `fui-teaching-surface-${useId()}`;
const triggerId = `fui-teaching-trigger-${useId()}`;
let previouslyFocused: HTMLElement | null = null;
function focusables() {
  return surface.value
    ? Array.from(
        surface.value.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((e) => !e.hidden)
    : [];
}
function requestOpen(
  next: boolean,
  event: Event,
  reason: TeachingPopoverEmits['openChange'][1]['reason'],
) {
  if (next === open.value) return;
  if (next && typeof document !== 'undefined')
    previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (!controlledModel && !controlledOpen) internalOpen.value = next;
  emit('update:modelValue', next);
  emit('update:open', next);
  emit('openChange', event, { open: next, reason });
}
function position() {
  if (!open.value || props.inlinePopup || !trigger.value || !surface.value) return;
  const t = trigger.value.getBoundingClientRect(),
    s = surface.value.getBoundingClientRect(),
    gap = 12;
  const above =
    props.positioning === 'above' ||
    (props.positioning === 'auto' && t.bottom + s.height + gap > window.innerHeight);
  const left =
    props.positioning === 'before'
      ? t.left - s.width - gap
      : props.positioning === 'after'
        ? t.right + gap
        : Math.min(window.innerWidth - s.width - 8, Math.max(8, t.left));
  surfaceStyle.value = {
    position: 'fixed',
    left: `${left}px`,
    top: above ? 'auto' : `${t.bottom + gap}px`,
    bottom: above ? `${window.innerHeight - t.top + gap}px` : 'auto',
    maxWidth: 'calc(100vw - 16px)',
  };
}
function pointerdown(event: PointerEvent) {
  if (!open.value || !props.dismissOnOutsideClick) return;
  const path = event.composedPath();
  if (path.includes(trigger.value as EventTarget) || path.includes(surface.value as EventTarget))
    return;
  requestOpen(false, event, 'outside');
}
function keydown(event: KeyboardEvent) {
  if (!open.value) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    requestOpen(false, event, 'escape');
    nextTick(() => trigger.value?.focus());
    return;
  }
  if (!props.trapFocus || event.key !== 'Tab') return;
  const list = focusables(),
    first = list[0],
    last = list[list.length - 1];
  if (!list.length) {
    event.preventDefault();
    surface.value?.focus();
  } else if (
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
provide(teachingPopoverContextKey, {
  open,
  appearance,
  inlinePopup,
  mountNode,
  surfaceId,
  triggerId,
  surfaceStyle,
  trigger,
  surface,
  requestOpen,
  registerTrigger: (e) => (trigger.value = e),
  registerSurface: (e) => (surface.value = e),
});
watch(open, async (value, previous) => {
  if (value) {
    await nextTick();
    position();
    (focusables()[0] ?? surface.value)?.focus();
  } else {
    surfaceStyle.value = {};
    if (previous) nextTick(() => previouslyFocused?.isConnected && previouslyFocused.focus());
  }
});
onMounted(() => {
  document.addEventListener('pointerdown', pointerdown);
  document.addEventListener('keydown', keydown);
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, true);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', pointerdown);
  document.removeEventListener('keydown', keydown);
  window.removeEventListener('resize', position);
  window.removeEventListener('scroll', position, true);
});
defineExpose({ open, trigger, surface, focus: () => trigger.value?.focus() });
</script>
<template>
  <div v-bind="attrs" class="fui-TeachingPopover"><slot /></div>
</template>
<style>
@import './teachingPopover.css';
</style>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  watch,
} from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { TooltipEmits, TooltipProps, TooltipSlots } from './Tooltip.types';

defineOptions({ name: 'FTooltip', inheritAttrs: false });
const props = withDefaults(defineProps<TooltipProps>(), {
  appearance: 'normal',
  hideDelay: 250,
  positioning: 'above',
  relationship: 'description',
  showDelay: 250,
  visible: undefined,
  withArrow: false,
  mountNode: 'body',
  inlinePopup: false,
});
const emit = defineEmits<TooltipEmits>();
defineSlots<TooltipSlots>();
const attrs = useAttrs();
const slots = useSlots();
const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const surface = ref<HTMLElement | null>(null);
const internalVisible = ref(false);
const controlledByModel = useIsPropProvided('modelValue');
const controlledByVisible = useIsPropProvided('visible');
const isControlled = computed(() => controlledByModel || controlledByVisible);
const visible = computed(() =>
  controlledByModel
    ? Boolean(props.modelValue)
    : controlledByVisible
      ? Boolean(props.visible)
      : internalVisible.value,
);
const surfaceId = `fui-tooltip-${useId()}`;
const surfaceStyle = ref<Record<string, string>>({});
let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let ignoreNextFocus = false;

function clearTimers() {
  if (showTimer) clearTimeout(showTimer);
  if (hideTimer) clearTimeout(hideTimer);
  showTimer = undefined;
  hideTimer = undefined;
}

function requestVisible(next: boolean, event?: Event) {
  clearTimers();
  if (next === visible.value) return;
  if (!isControlled.value) internalVisible.value = next;
  emit('update:visible', next);
  emit('update:modelValue', next);
  emit('visibleChange', event, { visible: next });
}

function scheduleVisible(
  next: boolean,
  event?: Event,
  delay = next ? props.showDelay : props.hideDelay,
) {
  clearTimers();
  const callback = () => requestVisible(next, event);
  if (delay <= 0) callback();
  else if (next) showTimer = setTimeout(callback, delay);
  else hideTimer = setTimeout(callback, delay);
}

function updatePosition() {
  if (!visible.value || props.inlinePopup || !trigger.value || !surface.value) return;
  const triggerRect = trigger.value.getBoundingClientRect();
  const surfaceRect = surface.value.getBoundingClientRect();
  const gap = props.withArrow ? 8 : 4;
  const above =
    props.positioning === 'above' ||
    (props.positioning === 'auto' && triggerRect.top >= surfaceRect.height + gap);
  const before = props.positioning === 'before';
  const after = props.positioning === 'after';
  const left = before
    ? triggerRect.left - surfaceRect.width - gap
    : after
      ? triggerRect.right + gap
      : triggerRect.left + (triggerRect.width - surfaceRect.width) / 2;
  const top = above ? triggerRect.top - surfaceRect.height - gap : triggerRect.bottom + gap;
  surfaceStyle.value = {
    position: 'fixed',
    left: `${Math.max(4, Math.min(left, window.innerWidth - surfaceRect.width - 4))}px`,
    top: before || after ? `${Math.max(4, triggerRect.top)}px` : `${Math.max(4, top)}px`,
    maxWidth: 'calc(100vw - 8px)',
  };
}

function handleEnter(event: FocusEvent | PointerEvent) {
  if ((event.type === 'focus' || event.type === 'focusin') && ignoreNextFocus) {
    ignoreNextFocus = false;
    return;
  }
  scheduleVisible(true, event);
}

function handleLeave(event: FocusEvent | PointerEvent) {
  if (event.type === 'blur') {
    ignoreNextFocus = typeof document !== 'undefined' && document.activeElement === event.target;
    scheduleVisible(false, event, 0);
    return;
  }
  scheduleVisible(false, event);
}

function handleSurfaceEnter() {
  clearTimers();
}

function handleSurfaceLeave(event: PointerEvent | FocusEvent) {
  handleLeave(event);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !visible.value) return;
  event.preventDefault();
  event.stopPropagation();
  requestVisible(false, event);
  nextTick(() => trigger.value?.focus());
}

function triggerAria(): Record<string, string | undefined> {
  if (props.relationship === 'inaccessible') return {};
  if (props.relationship === 'label' && props.content && !slots.content) {
    return { 'aria-label': props.content };
  }
  return props.relationship === 'label'
    ? { 'aria-labelledby': surfaceId }
    : { 'aria-describedby': surfaceId };
}

function getTriggerElement() {
  return (trigger.value?.firstElementChild as HTMLElement | null) ?? trigger.value;
}

function applyTriggerAria() {
  const element = getTriggerElement();
  if (!element) return;
  for (const name of ['aria-label', 'aria-labelledby', 'aria-describedby']) {
    element.removeAttribute(name);
  }
  for (const [name, value] of Object.entries(triggerAria())) {
    if (value) element.setAttribute(name, value);
  }
}

const teleportTarget = computed(() => props.mountNode);
const rendered = computed(() => visible.value || props.relationship !== 'inaccessible');

watch(visible, async (isVisible) => {
  if (!isVisible) {
    surfaceStyle.value = {};
    return;
  }
  await nextTick();
  applyTriggerAria();
  updatePosition();
});

onMounted(() => {
  applyTriggerAria();
  document.addEventListener('keydown', handleKeydown, true);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
});

onBeforeUnmount(() => {
  clearTimers();
  document.removeEventListener('keydown', handleKeydown, true);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
});

defineExpose({ element: root, trigger, surface, visible, focus: () => trigger.value?.focus() });
</script>

<template>
  <div ref="root" v-bind="attrs" class="fui-Tooltip">
    <span
      ref="trigger"
      class="fui-Tooltip__trigger"
      v-bind="triggerAria()"
      @pointerover="handleEnter"
      @pointerout="handleLeave"
      @mouseenter="handleEnter"
      @mouseleave="handleLeave"
      @focus="handleEnter"
      @blur="handleLeave"
      @focusin="handleEnter"
      @focusout="handleLeave"
    >
      <slot />
    </span>
    <Teleport v-if="!props.inlinePopup && rendered" :to="teleportTarget">
      <div
        ref="surface"
        :id="surfaceId"
        class="fui-Tooltip__content"
        :class="[
          `fui-Tooltip__content--${props.appearance}`,
          { 'fui-Tooltip__content--visible': visible },
        ]"
        :style="surfaceStyle"
        role="tooltip"
        :hidden="!visible"
        @pointerenter="handleSurfaceEnter"
        @pointerleave="handleSurfaceLeave"
        @focus="handleSurfaceEnter"
        @blur="handleSurfaceLeave"
      >
        <span v-if="props.withArrow" class="fui-Tooltip__arrow" aria-hidden="true" />
        <slot name="content">{{ props.content }}</slot>
      </div>
    </Teleport>
    <div
      v-else-if="rendered"
      ref="surface"
      :id="surfaceId"
      class="fui-Tooltip__content"
      :class="[
        `fui-Tooltip__content--${props.appearance}`,
        { 'fui-Tooltip__content--visible': visible },
      ]"
      role="tooltip"
      :hidden="!visible"
      @pointerenter="handleSurfaceEnter"
      @pointerleave="handleSurfaceLeave"
      @focus="handleSurfaceEnter"
      @blur="handleSurfaceLeave"
    >
      <span v-if="props.withArrow" class="fui-Tooltip__arrow" aria-hidden="true" />
      <slot name="content">{{ props.content }}</slot>
    </div>
  </div>
</template>

<style>
@import './tooltip.css';
</style>

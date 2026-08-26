<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useAttrs,
  useId,
} from 'vue';
import { ariaLiveAnnouncerContextKey } from '../AriaLiveAnnouncer/announcerContext';
import type { MessageBarProps, MessageBarSlots } from './MessageBar.types';
import { messageBarContextKey } from './messageBarContext';

defineOptions({ name: 'FMessageBar', inheritAttrs: false });
const props = withDefaults(defineProps<MessageBarProps>(), {
  intent: 'info',
  layout: 'auto',
  shape: 'rounded',
});
defineSlots<MessageBarSlots>();
const attrs = useAttrs();
const root = ref<HTMLElement | null>(null);
const body = ref<HTMLElement | null>(null);
const actions = ref<HTMLElement | null>(null);
const measuredLayout = ref<'singleline' | 'multiline'>('singleline');
const layout = computed(() => (props.layout === 'auto' ? measuredLayout.value : props.layout));
const titleId = `fui-message-bar-title-${useId()}`;
const announcer = inject(ariaLiveAnnouncerContextKey, undefined);
let resizeObserver: ResizeObserver | undefined;

const politeness = computed(
  () => props.politeness ?? (props.intent === 'info' ? 'polite' : 'assertive'),
);

function measure() {
  if (props.layout !== 'auto' || !root.value) return;
  measuredLayout.value =
    root.value.scrollWidth > root.value.clientWidth ? 'multiline' : 'singleline';
}

function announceContent() {
  const message = [body.value?.textContent, actions.value?.textContent].filter(Boolean).join(', ');
  if (message) announcer?.announce(message, { politeness: politeness.value });
}

provide(messageBarContextKey, {
  layout,
  titleId,
  registerBody: (element) => (body.value = element),
  registerActions: (element) => (actions.value = element),
});

onMounted(async () => {
  await nextTick();
  measure();
  announceContent();
  if (typeof ResizeObserver !== 'undefined' && root.value) {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root.value);
  }
});
onBeforeUnmount(() => resizeObserver?.disconnect());
defineExpose({ element: root });
</script>

<template>
  <div
    ref="root"
    v-bind="attrs"
    class="fui-MessageBar"
    :class="[
      `fui-MessageBar--${props.intent}`,
      `fui-MessageBar--${layout}`,
      `fui-MessageBar--${props.shape}`,
    ]"
    role="group"
    :aria-labelledby="titleId"
  >
    <div class="fui-MessageBar__icon" aria-hidden="true">
      <slot name="icon">
        <span v-if="props.intent === 'success'">✓</span>
        <span v-else-if="props.intent === 'warning'">!</span>
        <span v-else-if="props.intent === 'error'">×</span>
        <span v-else>i</span>
      </slot>
    </div>
    <slot />
    <div v-if="layout === 'multiline'" class="fui-MessageBar__spacer" aria-hidden="true" />
  </div>
</template>

<style>
@import './messageBar.css';
</style>

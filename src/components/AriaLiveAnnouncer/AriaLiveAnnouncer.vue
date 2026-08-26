<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref } from 'vue';
import type {
  AriaLiveAnnouncementOptions,
  AriaLiveAnnouncerExpose,
  AriaLiveAnnouncerProps,
  AriaLiveAnnouncerSlots,
  AriaLivePoliteness,
} from './AriaLiveAnnouncer.types';
import { ariaLiveAnnouncerContextKey } from './announcerContext';

defineOptions({ name: 'FAriaLiveAnnouncer' });
const props = withDefaults(defineProps<AriaLiveAnnouncerProps>(), { messageDuration: 500 });
defineSlots<AriaLiveAnnouncerSlots>();

interface QueuedAnnouncement {
  message: string;
  politeness: AriaLivePoliteness;
  order: number;
}

const current = ref<QueuedAnnouncement>();
const queue = ref<QueuedAnnouncement[]>([]);
let order = 0;
let timer: ReturnType<typeof setTimeout> | undefined;

const politeMessage = computed(() =>
  current.value?.politeness === 'polite' ? current.value.message : '',
);
const assertiveMessage = computed(() =>
  current.value?.politeness === 'assertive' ? current.value.message : '',
);

function scheduleNext() {
  if (timer) clearTimeout(timer);
  if (!current.value) return;
  timer = setTimeout(
    () => {
      const next = queue.value.shift();
      current.value = next;
      scheduleNext();
    },
    Math.max(0, props.messageDuration),
  );
}

function announce(message: string, options: AriaLiveAnnouncementOptions = {}) {
  const normalized = message.trim();
  if (!normalized || current.value?.message === normalized) return;
  const announcement: QueuedAnnouncement = {
    message: normalized,
    politeness: options.politeness ?? 'polite',
    order: order++,
  };
  if (!current.value) {
    current.value = announcement;
    scheduleNext();
    return;
  }
  queue.value.push(announcement);
  queue.value.sort((a, b) => {
    if (a.politeness === b.politeness) return a.order - b.order;
    return a.politeness === 'assertive' ? -1 : 1;
  });
}

function clear() {
  if (timer) clearTimeout(timer);
  timer = undefined;
  queue.value = [];
  current.value = undefined;
}

provide(ariaLiveAnnouncerContextKey, { announce });
defineExpose<AriaLiveAnnouncerExpose>({ announce, clear });
onBeforeUnmount(clear);
</script>

<template>
  <slot />
  <div class="fui-AriaLiveAnnouncer" aria-live="polite" aria-atomic="true">
    {{ politeMessage }}
  </div>
  <div class="fui-AriaLiveAnnouncer" aria-live="assertive" aria-atomic="true">
    {{ assertiveMessage }}
  </div>
</template>

<style>
@import './ariaLiveAnnouncer.css';
</style>

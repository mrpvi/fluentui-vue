<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useId } from 'vue';
import type { ToastEmits, ToastProps, ToastSlots } from './Toast.types';
import { toastContextKey } from './toastContext';

defineOptions({ name: 'FToast' });
const props = withDefaults(defineProps<ToastProps>(), {
  intent: 'info',
  pauseOnHover: false,
  pauseOnWindowBlur: false,
  timeout: -1,
});
const emit = defineEmits<ToastEmits>();
defineSlots<ToastSlots>();
const root = ref<HTMLElement | null>(null);
const intent = computed(() => props.intent);
const toastId = computed(() => props.toastId);
const titleId = `fui-toast-title-${useId()}`;
const bodyId = `fui-toast-body-${useId()}`;
const hasTitle = ref(false);
const hasBody = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
let remaining = props.timeout;
let startedAt = 0;

function pause() {
  if (!timer) return;
  clearTimeout(timer);
  timer = undefined;
  remaining -= Date.now() - startedAt;
}
function play() {
  if (remaining < 0 || timer) return;
  startedAt = Date.now();
  timer = setTimeout(() => dismiss(undefined, 'timeout'), Math.max(0, remaining));
}
function dismiss(
  event?: Event,
  reason: 'timeout' | 'trigger' | 'escape' | 'programmatic' = 'programmatic',
) {
  pause();
  emit('dismiss', event, { toastId: props.toastId, reason });
}
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  dismiss(event, 'escape');
}

provide(toastContextKey, {
  intent,
  toastId,
  titleId,
  bodyId,
  hasTitle,
  hasBody,
  registerTitle: (present) => (hasTitle.value = present),
  registerBody: (present) => (hasBody.value = present),
  dismiss,
});
onMounted(() => play());
onBeforeUnmount(() => pause());
defineExpose({ element: root, dismiss, pause, play, focus: () => root.value?.focus() });
</script>

<template>
  <div
    ref="root"
    class="fui-Toast"
    :class="`fui-Toast--${props.intent}`"
    role="listitem"
    tabindex="0"
    :aria-labelledby="hasTitle ? titleId : undefined"
    :aria-describedby="hasBody ? bodyId : undefined"
    @keydown="handleKeydown"
    @mouseenter="props.pauseOnHover && pause()"
    @mouseleave="props.pauseOnHover && play()"
    @focusin="pause"
    @focusout="play"
  >
    <slot />
  </div>
</template>

<style>
@import './toast.css';
</style>

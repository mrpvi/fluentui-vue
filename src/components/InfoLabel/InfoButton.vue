<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue';
import type { InfoButtonEmits, InfoButtonProps, InfoButtonSlots } from './InfoLabel.types';

defineOptions({ name: 'FInfoButton', inheritAttrs: false });
const attrs = useAttrs();
const props = withDefaults(defineProps<InfoButtonProps>(), {
  ariaLabel: 'information',
  inline: true,
  mountNode: 'body',
  size: 'medium',
});
const emit = defineEmits<InfoButtonEmits>();
defineSlots<InfoButtonSlots>();
const root = ref<HTMLSpanElement | null>(null);
const button = ref<HTMLButtonElement | null>(null);
const surface = ref<HTMLElement | null>(null);
const open = ref(false);
const surfaceId = `fui-info-button-${useId()}`;
const surfaceStyle = ref<Record<string, string>>({});
const rendered = computed(() => open.value);

function updatePosition() {
  if (!open.value || props.inline || !button.value || !surface.value) return;
  const triggerRect = button.value.getBoundingClientRect();
  const surfaceRect = surface.value.getBoundingClientRect();
  surfaceStyle.value = {
    position: 'fixed',
    left: `${Math.max(4, Math.min(triggerRect.left, window.innerWidth - surfaceRect.width - 4))}px`,
    bottom: `${Math.max(4, window.innerHeight - triggerRect.top + 8)}px`,
  };
}
function requestOpen(next: boolean, event: Event) {
  if (next === open.value) return;
  open.value = next;
  emit('update:open', next);
  emit('openChange', event, { open: next });
  if (next) nextTick(updatePosition);
}
function handleDocumentPointerdown(event: PointerEvent) {
  if (
    !open.value ||
    event.composedPath().includes(root.value as EventTarget) ||
    event.composedPath().includes(surface.value as EventTarget)
  )
    return;
  requestOpen(false, event);
}
function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !open.value) return;
  event.preventDefault();
  requestOpen(false, event);
  nextTick(() => button.value?.focus());
}
function handleFocusout(event: FocusEvent) {
  const next = event.relatedTarget;
  if (next instanceof Node && (root.value?.contains(next) || surface.value?.contains(next))) return;
  requestOpen(false, event);
}
onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerdown);
  document.addEventListener('keydown', handleDocumentKeydown);
  window.addEventListener('resize', updatePosition);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerdown);
  document.removeEventListener('keydown', handleDocumentKeydown);
  window.removeEventListener('resize', updatePosition);
});
defineExpose({ element: root, button, surface, open, focus: () => button.value?.focus() });
</script>

<template>
  <span
    ref="root"
    class="fui-InfoButton"
    :class="`fui-InfoButton--${props.size}`"
    @focusout="handleFocusout"
  >
    <button
      ref="button"
      v-bind="attrs"
      type="button"
      class="fui-InfoButton__trigger"
      :aria-label="attrs['aria-labelledby'] ? undefined : props.ariaLabel"
      :aria-expanded="open"
      :aria-controls="surfaceId"
      @click="requestOpen(!open, $event)"
    >
      <slot><span aria-hidden="true">i</span></slot>
    </button>
    <Teleport v-if="!props.inline && rendered" :to="props.mountNode">
      <div
        :id="surfaceId"
        ref="surface"
        class="fui-InfoButton__surface"
        :style="surfaceStyle"
        role="note"
        tabindex="-1"
        @focusout="handleFocusout"
      >
        <slot name="info">{{ props.info }}</slot>
      </div>
    </Teleport>
    <div
      v-else-if="rendered"
      :id="surfaceId"
      ref="surface"
      class="fui-InfoButton__surface fui-InfoButton__surface--inline"
      role="note"
      tabindex="-1"
    >
      <slot name="info">{{ props.info }}</slot>
    </div>
  </span>
</template>

<style>
@import './infoLabel.css';
</style>

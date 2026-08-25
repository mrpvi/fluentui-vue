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
  useSlots,
  watch,
} from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { avatarGroupContextKey } from '../AvatarGroup/avatarGroupContext';
import type {
  AvatarGroupPopoverEmits,
  AvatarGroupPopoverProps,
  AvatarGroupPopoverSlots,
} from './AvatarGroupPopover.types';

defineOptions({
  name: 'FAvatarGroupPopover',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AvatarGroupPopoverProps>(), {
  defaultOpen: false,
});
const emit = defineEmits<AvatarGroupPopoverEmits>();
defineSlots<AvatarGroupPopoverSlots>();
const attrs = useAttrs();
const slots = useSlots();
const group = inject(avatarGroupContextKey);
if (!group) {
  throw new Error('FAvatarGroupPopover must be used inside FAvatarGroup.');
}
const isControlled = useIsPropProvided('modelValue');
const internalOpen = ref(props.defaultOpen);
const open = computed(() => (isControlled ? Boolean(props.modelValue) : internalOpen.value));
const indicator = computed(() => props.indicator ?? (group.size.value < 24 ? 'icon' : 'count'));
const trigger = ref<HTMLButtonElement | null>(null);
const surface = ref<HTMLDivElement | null>(null);
const root = ref<HTMLDivElement | null>(null);
const surfaceId = `fui-avatar-group-popover-${useId()}`;
const triggerLabel = computed(() => String(attrs['aria-label'] ?? 'View more people.'));
const count = computed(() => {
  if (props.count !== undefined) return props.count;
  const children = slots.default?.() ?? [];
  return children.reduce((total, child) => {
    if (typeof child.type === 'symbol' && Array.isArray(child.children)) {
      return total + child.children.length;
    }
    return total + 1;
  }, 0);
});
const visibleCount = computed(() => (count.value > 99 ? '99+' : `+${count.value}`));
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    'aria-label': _ariaLabel,
    onClick: _onClick,
    onKeydown: _onKeydown,
    ...rest
  } = attrs;
  return rest;
});

provide(avatarGroupContextKey, {
  isOverflow: computed(() => true),
  layout: computed(() => group.layout.value),
  shape: computed(() => group.shape.value),
  size: computed(() => 24 as const),
});

function focusableElements() {
  if (!surface.value) return [];
  return Array.from(
    surface.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function requestOpen(nextOpen: boolean, event: Event) {
  if (!isControlled) {
    internalOpen.value = nextOpen;
  }
  emit('update:modelValue', nextOpen);
  emit('openChange', event, { open: nextOpen });
}

function handleTriggerClick(event: MouseEvent) {
  if (event.defaultPrevented) return;
  requestOpen(!open.value, event);
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented) return;
  if (event.key === 'ArrowDown' && !open.value) {
    event.preventDefault();
    requestOpen(true, event);
  }
}

function handleSurfaceKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    requestOpen(false, event);
    nextTick(() => trigger.value?.focus());
    return;
  }
  if (event.key !== 'Tab') return;

  const available = focusableElements();
  if (available.length === 0) {
    event.preventDefault();
    surface.value?.focus();
    return;
  }
  const first = available[0];
  const last = available[available.length - 1];
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

function handleDocumentPointerDown(event: PointerEvent) {
  if (!open.value || root.value?.contains(event.target as Node)) return;
  requestOpen(false, event);
}

watch(open, async (isOpen) => {
  if (!isOpen) return;
  await nextTick();
  surface.value?.focus();
});

onMounted(() => document.addEventListener('pointerdown', handleDocumentPointerDown));
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleDocumentPointerDown));

defineExpose({
  element: root,
  trigger,
  surface,
  open,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-AvatarGroupPopover',
      `fui-AvatarGroupPopover--${group.layout.value}`,
      attrs.class,
    ]"
    :style="attrs.style"
  >
    <button
      ref="trigger"
      class="fui-AvatarGroupPopover__trigger"
      type="button"
      :aria-label="triggerLabel"
      :aria-expanded="open"
      :aria-controls="open ? surfaceId : undefined"
      @click="handleTriggerClick"
      @keydown="handleTriggerKeydown"
    >
      <slot name="trigger" :count="count" :open="open">
        <slot name="indicator" :count="count" :open="open">
          <template v-if="group.layout.value !== 'pie'">
            <svg
              v-if="indicator === 'icon'"
              class="fui-AvatarGroupPopover__icon"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M4 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
              />
            </svg>
            <span v-else>{{ visibleCount }}</span>
          </template>
        </slot>
      </slot>
    </button>
    <div
      v-if="open"
      :id="surfaceId"
      ref="surface"
      class="fui-AvatarGroupPopover__surface"
      role="dialog"
      aria-label="Overflow"
      tabindex="0"
      @keydown="handleSurfaceKeydown"
    >
      <ul class="fui-AvatarGroupPopover__content" role="list">
        <slot />
      </ul>
    </div>
  </div>
</template>

<style>
@import './avatarGroupPopover.css';
</style>

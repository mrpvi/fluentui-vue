<script setup lang="ts">
import { computed, provide, shallowRef, useAttrs } from 'vue';
import { breadcrumbContextKey } from './breadcrumbContext';
import type { BreadcrumbProps, BreadcrumbSlots } from './Breadcrumb.types';

defineOptions({
  name: 'FBreadcrumb',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  focusMode: 'tab',
  size: 'medium',
});
defineSlots<BreadcrumbSlots>();
const attrs = useAttrs();
const controls = new Map<HTMLElement, () => boolean>();
const currentControl = shallowRef<HTMLElement | null>(null);
const controlVersion = shallowRef(0);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, 'aria-label': _ariaLabel, ...rest } = attrs;
  return rest;
});

function getAvailableControls() {
  return Array.from(controls)
    .flatMap(([control, isNavigable]) => (control.isConnected && isNavigable() ? [control] : []))
    .sort((first, second) => {
      const position = first.compareDocumentPosition(second);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }
      if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      }
      return 0;
    });
}

function notifyControlsChanged() {
  controlVersion.value += 1;
}

function registerControl(element: HTMLElement, isNavigable: () => boolean) {
  controls.set(element, isNavigable);
  notifyControlsChanged();
  if (!currentControl.value && isNavigable()) {
    currentControl.value = element;
  }
  return () => {
    controls.delete(element);
    notifyControlsChanged();
    if (currentControl.value === element) {
      currentControl.value = getAvailableControls()[0] ?? null;
    }
  };
}

function rememberControl(element: HTMLElement) {
  if (props.focusMode === 'arrow') {
    currentControl.value = element;
  }
}

function clearControl(element: HTMLElement) {
  if (currentControl.value === element) {
    currentControl.value = getAvailableControls().find((control) => control !== element) ?? null;
  }
}

function moveControlFocus(element: HTMLElement, key: string) {
  if (props.focusMode !== 'arrow') {
    return;
  }
  const available = getAvailableControls();
  const currentIndex = available.indexOf(element);
  if (currentIndex < 0 || available.length === 0) {
    return;
  }
  const isRtl = element.closest('[dir="rtl"]') !== null || document.dir === 'rtl';
  const direction =
    key === 'ArrowRight' ? (isRtl ? -1 : 1) : key === 'ArrowLeft' ? (isRtl ? 1 : -1) : 0;
  if (!direction) {
    return;
  }
  const next = available[(currentIndex + direction + available.length) % available.length];
  if (next) {
    currentControl.value = next;
    next.focus();
  }
}

provide(breadcrumbContextKey, {
  focusMode: computed(() => props.focusMode),
  size: computed(() => props.size),
  registerControl,
  currentControl: computed(() => currentControl.value),
  controlVersion: computed(() => controlVersion.value),
  notifyControlsChanged,
  rememberControl,
  clearControl,
  moveControlFocus,
});
</script>

<template>
  <nav
    v-bind="rootAttrs"
    :class="['fui-Breadcrumb', `fui-Breadcrumb--${size}`, attrs.class]"
    :style="attrs.style"
    :aria-label="(attrs['aria-label'] as string | undefined) ?? 'breadcrumb'"
  >
    <ol class="fui-Breadcrumb__list" role="list">
      <slot />
    </ol>
  </nav>
</template>

<style>
@import './breadcrumb.css';
</style>

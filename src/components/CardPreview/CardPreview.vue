<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs, useTemplateRef } from 'vue';
import { cardContextKey } from '../Card/cardContext';
import type { CardPreviewSlots } from './CardPreview.types';

defineOptions({
  name: 'FCardPreview',
  inheritAttrs: false,
});

defineSlots<CardPreviewSlots>();
const attrs = useAttrs();
const card = inject(cardContextKey, undefined);
const root = useTemplateRef<HTMLElement>('root');
const registeredReferenceId = ref<string>();
const registeredReferenceLabel = ref<string>();
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

onMounted(() => {
  if (!card || card.referenceId.value || card.referenceLabel.value) {
    return;
  }
  const image = root.value?.querySelector<HTMLImageElement>(':scope > img');
  if (!image) {
    return;
  }
  const describedBy = image.getAttribute('aria-describedby') ?? undefined;
  const label = image.alt || image.getAttribute('aria-label') || undefined;
  if (describedBy) {
    registeredReferenceId.value = describedBy;
    card.setReferenceId(describedBy);
  } else if (label) {
    registeredReferenceLabel.value = label;
    card.setReferenceLabel(label);
  }
});

onBeforeUnmount(() => {
  if (!card) {
    return;
  }
  if (registeredReferenceId.value && card.referenceId.value === registeredReferenceId.value) {
    card.setReferenceId(undefined);
  }
  if (
    registeredReferenceLabel.value &&
    card.referenceLabel.value === registeredReferenceLabel.value
  ) {
    card.setReferenceLabel(undefined);
  }
});

defineExpose({
  element: root,
});
</script>

<template>
  <div ref="root" v-bind="rootAttrs" :class="['fui-CardPreview', attrs.class]" :style="attrs.style">
    <slot />
    <div v-if="$slots.logo" class="fui-CardPreview__logo">
      <slot name="logo" />
    </div>
  </div>
</template>

<style>
@import './cardPreview.css';
</style>

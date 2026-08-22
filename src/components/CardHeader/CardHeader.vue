<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue';
import { cardContextKey } from '../Card/cardContext';
import type { CardHeaderSlots } from './CardHeader.types';

defineOptions({
  name: 'FCardHeader',
  inheritAttrs: false,
});

defineSlots<CardHeaderSlots>();
const attrs = useAttrs();
const card = inject(cardContextKey, undefined);
const root = ref<HTMLElement | null>(null);
const generatedHeaderId = `fui-CardHeader__header-${useId()}`;
const registeredReferenceId = ref<string>();
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});

onMounted(() => {
  if (!card) {
    return;
  }
  const header = root.value?.querySelector<HTMLElement>('.fui-CardHeader__header');
  const childWithId = header?.querySelector<HTMLElement>('[id]');
  if (childWithId?.id) {
    header?.removeAttribute('id');
    registeredReferenceId.value = childWithId.id;
    card.setReferenceId(childWithId.id);
  } else if (header) {
    registeredReferenceId.value = header.id;
    card.setReferenceId(header.id);
  }
});

onBeforeUnmount(() => {
  if (
    card &&
    registeredReferenceId.value &&
    card.referenceId.value === registeredReferenceId.value
  ) {
    card.setReferenceId(undefined);
  }
});

defineExpose({
  element: root,
});
</script>

<template>
  <div ref="root" v-bind="rootAttrs" :class="['fui-CardHeader', attrs.class]" :style="attrs.style">
    <div v-if="$slots.image" class="fui-CardHeader__image">
      <slot name="image" />
    </div>
    <div v-if="$slots.header" :id="generatedHeaderId" class="fui-CardHeader__header">
      <slot name="header" />
    </div>
    <div v-if="$slots.description" class="fui-CardHeader__description">
      <slot name="description" />
    </div>
    <div v-if="$slots.action" class="fui-CardHeader__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style>
@import './cardHeader.css';
</style>

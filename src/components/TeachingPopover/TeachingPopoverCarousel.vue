<script setup lang="ts">
import { computed, provide, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type {
  TeachingPopoverCarouselEmits,
  TeachingPopoverCarouselProps,
  TeachingPopoverCarouselSlots,
} from './TeachingPopover.types';
import { teachingCarouselContextKey } from './teachingPopoverContext';
defineOptions({ name: 'FTeachingPopoverCarousel', inheritAttrs: false });
const props = defineProps<TeachingPopoverCarouselProps>();
const emit = defineEmits<TeachingPopoverCarouselEmits>();
defineSlots<TeachingPopoverCarouselSlots>();
const attrs = useAttrs();
const controlled = useIsPropProvided('modelValue');
const internal = ref(props.defaultValue ?? null);
const values = ref<string[]>([]);
const value = computed(() =>
  controlled ? (props.modelValue ?? null) : (internal.value ?? values.value[0] ?? null),
);
function select(next: string, event: Event) {
  if (!values.value.includes(next) || next === value.value) return;
  if (!controlled) internal.value = next;
  emit('update:modelValue', next);
  emit('valueChange', event, next);
}
function move(direction: 'prev' | 'next', event: Event) {
  const index = values.value.indexOf(value.value ?? '');
  const next = index + (direction === 'next' ? 1 : -1);
  if (next < 0) return;
  if (next >= values.value.length) {
    emit('finish', event, value.value ?? '');
    return;
  }
  select(values.value[next]!, event);
}
function register(entry: string) {
  if (!values.value.includes(entry)) values.value = [...values.value, entry];
  return () => {
    values.value = values.value.filter((item) => item !== entry);
  };
}
function finish(event: Event) {
  emit('finish', event, value.value ?? '');
}
provide(teachingCarouselContextKey, { value, values, select, move, register, finish });
</script>
<template>
  <div v-bind="attrs" class="fui-TeachingPopoverCarousel">
    <slot /><span class="fui-TeachingPopoverCarousel__announcer" aria-live="polite">{{
      props.announcement && value ? props.announcement(value) : ''
    }}</span>
  </div>
</template>
<style>
@import './teachingPopover.css';
</style>

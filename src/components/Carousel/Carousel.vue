<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref, useAttrs, watch } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { CarouselEmits, CarouselProps, CarouselSlots } from './Carousel.types';
import { carouselContextKey, type CarouselCardRecord } from './carouselContext';

defineOptions({ name: 'FCarousel', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselProps>(), {
  defaultActiveIndex: 0,
  align: 'center',
  appearance: 'flat',
  circular: false,
  groupSize: 1,
  draggable: false,
  whitespace: false,
  motion: 'slide',
  autoplayInterval: 4000,
  ariaLabel: 'Carousel',
});
const emit = defineEmits<CarouselEmits>();
defineSlots<CarouselSlots>();
const attrs = useAttrs();
const internalIndex = ref(props.defaultActiveIndex);
const controlledByModel = useIsPropProvided('modelValue');
const controlledByIndex = useIsPropProvided('activeIndex');
const cards = ref<CarouselCardRecord[]>([]);
const viewport = ref<HTMLElement | null>(null);
const slider = ref<HTMLElement | null>(null);
const playing = ref(false);
let autoplayTimer: ReturnType<typeof setInterval> | undefined;
let resizeObserver: ResizeObserver | undefined;

const total = computed(() => cards.value.length);
const groupSize = computed(() => {
  if (props.groupSize !== 'auto') return Math.max(1, Math.floor(props.groupSize));
  const viewportWidth = viewport.value?.clientWidth ?? 0;
  const cardWidth = cards.value[0]?.element.getBoundingClientRect().width ?? viewportWidth;
  return Math.max(1, cardWidth ? Math.floor(viewportWidth / cardWidth) : 1);
});
const groups = computed(() => {
  const result: number[][] = [];
  for (let index = 0; index < total.value; index += groupSize.value) {
    result.push(
      Array.from(
        { length: Math.min(groupSize.value, total.value - index) },
        (_, offset) => index + offset,
      ),
    );
  }
  return result;
});
const maximumIndex = computed(() => Math.max(0, groups.value.length - 1));
const activeIndex = computed(() => {
  const value = controlledByModel
    ? Number(props.modelValue ?? 0)
    : controlledByIndex
      ? Number(props.activeIndex ?? 0)
      : internalIndex.value;
  return Math.min(maximumIndex.value, Math.max(0, Number.isFinite(value) ? Math.floor(value) : 0));
});
const align = computed(() => props.align);
const appearance = computed(() => props.appearance);
const circular = computed(() => props.circular);
const motion = computed(() => props.motion);
const announcementText = computed(() =>
  props.announcement
    ? props.announcement(activeIndex.value, groups.value.length, groups.value)
    : `Slide ${activeIndex.value + 1} of ${Math.max(1, groups.value.length)}`,
);

function select(
  index: number,
  event: Event,
  reason: CarouselEmits['activeIndexChange'][1]['reason'],
) {
  const count = groups.value.length;
  if (!count) return;
  const next = props.circular ? (index + count) % count : Math.min(count - 1, Math.max(0, index));
  if (next === activeIndex.value) return;
  if (!controlledByModel && !controlledByIndex) internalIndex.value = next;
  emit('update:modelValue', next);
  emit('update:activeIndex', next);
  emit('activeIndexChange', event, { index: next, reason });
}
function move(
  direction: 'prev' | 'next',
  event: Event,
  reason: CarouselEmits['activeIndexChange'][1]['reason'] = direction,
) {
  select(activeIndex.value + (direction === 'next' ? 1 : -1), event, reason);
}
function setPlaying(value: boolean) {
  playing.value = value;
}
function registerCard(card: CarouselCardRecord) {
  cards.value = [...cards.value, card];
  return () => {
    cards.value = cards.value.filter((entry) => entry.id !== card.id);
  };
}
function updateCards() {
  const activeCards = new Set(groups.value[activeIndex.value] ?? []);
  cards.value.forEach((card, index) => {
    const active = activeCards.has(index);
    card.element.toggleAttribute('inert', !active);
    card.element.setAttribute('aria-hidden', String(!active));
    card.element.dataset.active = String(active);
  });
}
function restartAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = undefined;
  if (playing.value && groups.value.length > 1 && props.autoplayInterval > 0) {
    autoplayTimer = setInterval(
      () => move('next', new Event('autoplay'), 'autoplay'),
      props.autoplayInterval,
    );
  }
}
function handleKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  const rtl = getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl';
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    move(rtl ? 'prev' : 'next', event, 'keyboard');
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    move(rtl ? 'next' : 'prev', event, 'keyboard');
  } else if (event.key === 'Home') {
    event.preventDefault();
    select(0, event, 'keyboard');
  } else if (event.key === 'End') {
    event.preventDefault();
    select(maximumIndex.value, event, 'keyboard');
  }
}

provide(carouselContextKey, {
  activeIndex,
  align,
  appearance,
  circular,
  motion,
  total,
  playing,
  groups,
  viewport,
  slider,
  cards,
  registerViewport: (element) => (viewport.value = element),
  registerSlider: (element) => (slider.value = element),
  registerCard,
  select,
  move,
  setPlaying,
});
watch([activeIndex, cards, groups], updateCards, { deep: true, flush: 'post' });
watch([playing, () => props.autoplayInterval, groups], restartAutoplay);
watch(maximumIndex, (maximum) => {
  if (!controlledByModel && !controlledByIndex && internalIndex.value > maximum)
    internalIndex.value = maximum;
});
onMounted(() => {
  updateCards();
  if (typeof ResizeObserver !== 'undefined' && viewport.value) {
    resizeObserver = new ResizeObserver(() => {
      updateCards();
    });
    resizeObserver.observe(viewport.value);
  }
});
onBeforeUnmount(() => {
  if (autoplayTimer) clearInterval(autoplayTimer);
  resizeObserver?.disconnect();
});
defineExpose({
  activeIndex,
  total,
  select,
  next: (event: Event) => move('next', event),
  previous: (event: Event) => move('prev', event),
});
</script>

<template>
  <div
    v-bind="attrs"
    class="fui-Carousel"
    :class="[`fui-Carousel--${appearance}`, `fui-Carousel--${align}`]"
    role="region"
    :aria-label="props.ariaLabel"
    :data-motion="motion"
    tabindex="0"
    @keydown="handleKeydown"
    @pointerenter="playing && setPlaying(false)"
    @focusin="playing && setPlaying(false)"
  >
    <slot />
    <span class="fui-CarouselAnnouncer" aria-live="polite" aria-atomic="true">{{
      announcementText
    }}</span>
  </div>
</template>

<style>
@import './carousel.css';
</style>

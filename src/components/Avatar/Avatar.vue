<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, useId, useSlots } from 'vue';
import PresenceBadge from '../PresenceBadge/PresenceBadge.vue';
import type { BadgeSize } from '../Badge';
import type { AvatarColor, AvatarProps, AvatarSlots } from './Avatar.types';
import { getAvatarInitials, resolveColorfulAvatar } from './Avatar.utils';

defineOptions({
  name: 'FAvatar',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AvatarProps>(), {
  active: 'unset',
  activeAppearance: 'ring',
  color: 'neutral',
  shape: 'circular',
  size: 32,
});

defineSlots<AvatarSlots>();
const attrs = useAttrs();
const slots = useSlots();
const root = ref<HTMLSpanElement | null>(null);
const imageFailed = ref(false);
const inheritedDirection = ref<'ltr' | 'rtl'>('ltr');
const initialsId = `fui-avatar-${useId()}__initials`;

const direction = computed(() => {
  const explicitDirection = String(attrs.dir ?? '').toLowerCase();
  return explicitDirection === 'rtl' || explicitDirection === 'ltr'
    ? explicitDirection
    : inheritedDirection.value;
});
const generatedInitials = computed(() =>
  getAvatarInitials(props.name, direction.value === 'rtl', props.size === 16),
);
const hasInitials = computed(() => Boolean(slots.initials || generatedInitials.value));
const renderImage = computed(() => Boolean(slots.image || props.image));
const showImage = computed(() => Boolean(slots.image || (props.image && !imageFailed.value)));
const showIcon = computed(() => !showImage.value && !hasInitials.value);
const resolvedColor = computed<Exclude<AvatarColor, 'colorful'>>(() =>
  props.color === 'colorful' ? resolveColorfulAvatar(props.idForColor ?? props.name) : props.color,
);
const badgeSize = computed<BadgeSize>(() => {
  if (props.size >= 96) return 'extra-large';
  if (props.size >= 64) return 'large';
  if (props.size >= 56) return 'medium';
  if (props.size >= 40) return 'small';
  if (props.size >= 28) return 'extra-small';
  return 'tiny';
});
const activeLabel = computed(() => {
  if (props.active === 'active') return 'active';
  if (props.active === 'inactive') return 'inactive';
  return undefined;
});
const presenceLabel = computed(() => {
  if (!props.presence) return undefined;

  const status = props.presence.status ?? 'available';
  const label = status.replaceAll('-', ' ');
  return props.presence.outOfOffice && status !== 'out-of-office'
    ? `${label} out of office`
    : label;
});
const accessibleLabel = computed(() => {
  if (attrs['aria-label'] !== undefined || attrs['aria-labelledby'] !== undefined) {
    return undefined;
  }
  if (!props.name && hasInitials.value) {
    return undefined;
  }

  return (
    [props.name, presenceLabel.value, activeLabel.value].filter(Boolean).join(', ') || undefined
  );
});
const accessibleLabelledBy = computed(() => {
  if (
    attrs['aria-label'] !== undefined ||
    attrs['aria-labelledby'] !== undefined ||
    props.name ||
    !hasInitials.value
  ) {
    return undefined;
  }
  return initialsId;
});
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledby,
    onError: _onError,
    onLoad: _onLoad,
    ...rest
  } = attrs;
  return rest;
});
const classes = computed(() => [
  'fui-Avatar',
  `fui-Avatar--size-${props.size}`,
  `fui-Avatar--shape-${props.shape}`,
  `fui-Avatar--color-${resolvedColor.value}`,
  {
    [`fui-Avatar--${props.active}`]: props.active !== 'unset',
    [`fui-Avatar--active-${props.activeAppearance}`]: props.active === 'active',
  },
  attrs.class,
]);

function invokeListener(listener: unknown, event: Event) {
  if (Array.isArray(listener)) {
    listener.forEach((callback) => invokeListener(callback, event));
  } else if (typeof listener === 'function') {
    listener(event);
  }
}

function handleImageError(event: Event) {
  imageFailed.value = true;
  invokeListener(attrs.onError, event);
}

function handleImageLoad(event: Event) {
  imageFailed.value = false;
  invokeListener(attrs.onLoad, event);
}

onMounted(() => {
  const inherited =
    root.value?.closest('[dir]')?.getAttribute('dir') ?? document.documentElement.dir ?? '';
  inheritedDirection.value = inherited.toLowerCase() === 'rtl' ? 'rtl' : 'ltr';
});

defineExpose({
  element: root,
});
</script>

<template>
  <span
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    :role="(attrs.role as string | undefined) ?? 'img'"
    :aria-label="(attrs['aria-label'] as string | undefined) ?? accessibleLabel"
    :aria-labelledby="(attrs['aria-labelledby'] as string | undefined) ?? accessibleLabelledBy"
  >
    <span
      v-if="hasInitials"
      :id="initialsId"
      class="fui-Avatar__initials"
      :aria-hidden="accessibleLabelledBy ? undefined : 'true'"
    >
      <slot name="initials">{{ generatedInitials }}</slot>
    </span>
    <span v-if="showIcon" class="fui-Avatar__icon" aria-hidden="true">
      <slot name="icon">
        <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM4 15.25C4 12.9 6.54 11 10 11s6 1.9 6 4.25c0 1.25-1.1 2.25-2.47 2.25H6.47C5.1 17.5 4 16.5 4 15.25Z"
          />
        </svg>
      </slot>
    </span>
    <span v-if="renderImage" v-show="showImage" class="fui-Avatar__image" aria-hidden="true">
      <slot name="image">
        <img
          v-if="image"
          v-show="!imageFailed"
          :src="image"
          alt=""
          @error="handleImageError"
          @load="handleImageLoad"
        />
      </slot>
    </span>
    <span v-if="presence || slots.badge" class="fui-Avatar__badge">
      <slot name="badge">
        <PresenceBadge v-if="presence" v-bind="presence" :size="badgeSize" />
      </slot>
    </span>
  </span>
</template>

<style>
@import './avatar.css';
</style>

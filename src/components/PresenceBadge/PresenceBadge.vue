<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import PresenceIcon from './PresenceIcon.vue';
import type {
  PresenceBadgeProps,
  PresenceBadgeSlots,
  PresenceBadgeStatus,
} from './PresenceBadge.types';

defineOptions({
  name: 'FPresenceBadge',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PresenceBadgeProps>(), {
  outOfOffice: false,
  size: 'medium',
  status: 'available',
});

defineSlots<PresenceBadgeSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);

const defaultStrings: Record<PresenceBadgeStatus, string> = {
  available: 'available',
  away: 'away',
  blocked: 'blocked',
  busy: 'busy',
  'do-not-disturb': 'do not disturb',
  offline: 'offline',
  'out-of-office': 'out of office',
  unknown: 'unknown',
};

const defaultLabel = computed(() => {
  const suffix = props.outOfOffice && props.status !== 'out-of-office' ? ' out of office' : '';
  return `${defaultStrings[props.status]}${suffix}`;
});

const isBusy = computed(() => ['busy', 'do-not-disturb', 'blocked'].includes(props.status));

const classes = computed(() => [
  'fui-PresenceBadge',
  `fui-PresenceBadge--${props.status}`,
  `fui-PresenceBadge--size-${props.size}`,
  {
    'fui-PresenceBadge--busy': isBusy.value,
    'fui-PresenceBadge--out-of-office': props.outOfOffice,
  },
  attrs.class,
]);

const rootAttrs = computed(() => {
  const { class: _class, style: _style, role: _role, 'aria-label': _ariaLabel, ...rest } = attrs;
  return rest;
});

defineExpose({
  element: root,
});
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    :class="classes"
    :style="attrs.style"
    :role="(attrs.role as string | undefined) ?? 'img'"
    :aria-label="(attrs['aria-label'] as string | undefined) ?? defaultLabel"
  >
    <span class="fui-PresenceBadge__icon">
      <slot name="icon">
        <PresenceIcon :status="status" :out-of-office="outOfOffice" :size="size" />
      </slot>
    </span>
  </div>
</template>

<style>
@import './presenceBadge.css';
</style>

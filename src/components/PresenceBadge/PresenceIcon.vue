<script setup lang="ts">
import { computed } from 'vue';
import type { BadgeSize } from '../Badge';
import type { PresenceBadgeStatus } from './PresenceBadge.types';
import { presenceIconData, type PresenceIconData } from './presenceIconData';

const props = defineProps<{
  outOfOffice: boolean;
  size: BadgeSize;
  status: PresenceBadgeStatus;
}>();

const sourceSize = computed(() => {
  switch (props.size) {
    case 'tiny':
    case 'extra-small':
      return 10;
    case 'small':
      return 12;
    case 'medium':
      return 16;
    case 'large':
    case 'extra-large':
      return 20;
    default:
      return 16;
  }
});

const iconKind = computed(() => {
  switch (props.status) {
    case 'available':
      return props.outOfOffice ? 'available_regular' : 'available_filled';
    case 'away':
      return props.outOfOffice ? 'oof_regular' : 'away_filled';
    case 'blocked':
      return 'blocked_regular';
    case 'busy':
      return props.outOfOffice ? 'unknown_regular' : 'busy_filled';
    case 'do-not-disturb':
      return props.outOfOffice ? 'dnd_regular' : 'dnd_filled';
    case 'offline':
      return props.outOfOffice ? 'oof_regular' : 'offline_regular';
    case 'out-of-office':
      return 'oof_regular';
    case 'unknown':
      return 'unknown_regular';
    default:
      return 'available_filled';
  }
});

const icon = computed<PresenceIconData>(() => {
  const key =
    `${iconKind.value.replace('_', `_${sourceSize.value}_`)}` as keyof typeof presenceIconData;
  return presenceIconData[key];
});
</script>

<template>
  <svg
    class="fui-PresenceBadge__svg"
    :viewBox="`0 0 ${icon.viewBox} ${icon.viewBox}`"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="path in icon.paths" :key="path" :d="path" />
  </svg>
</template>

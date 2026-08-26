<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';
import Avatar from '../Avatar/Avatar.vue';
import type { AvatarSize } from '../Avatar';
import PresenceBadge from '../PresenceBadge/PresenceBadge.vue';
import type { BadgeSize } from '../Badge';
import type { PersonaProps, PersonaSize, PersonaSlots } from './Persona.types';

defineOptions({
  name: 'FPersona',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<PersonaProps>(), {
  presenceOnly: false,
  size: 'medium',
  textAlignment: 'start',
  textPosition: 'after',
});

defineSlots<PersonaSlots>();
const attrs = useAttrs();
const slots = useSlots();
const root = ref<HTMLDivElement | null>(null);

const avatarSizes: Record<PersonaSize, AvatarSize> = {
  'extra-small': 20,
  small: 28,
  medium: 32,
  large: 36,
  'extra-large': 40,
  huge: 56,
};

const presenceSizes: Record<PersonaSize, BadgeSize> = {
  'extra-small': 'tiny',
  small: 'extra-small',
  medium: 'small',
  large: 'medium',
  'extra-large': 'large',
  huge: 'large',
};

const hasMedia = computed(() =>
  props.presenceOnly ? Boolean(slots.presence || props.presence) : true,
);
const textLineCount = computed(
  () => 1 + [slots.secondaryText, slots.tertiaryText, slots.quaternaryText].filter(Boolean).length,
);
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;
  return rest;
});
const classes = computed(() => [
  'fui-Persona',
  `fui-Persona--size-${props.size}`,
  `fui-Persona--text-position-${props.textPosition}`,
  `fui-Persona--text-alignment-${props.textAlignment}`,
  {
    'fui-Persona--presence-only': props.presenceOnly,
    'fui-Persona--single-line': textLineCount.value <= 1,
  },
  attrs.class,
]);
const avatarProps = computed(() => ({
  name: props.name,
  presence: props.presence,
  size: avatarSizes[props.size],
  ...props.avatar,
}));
const presenceProps = computed(() => ({
  size: presenceSizes[props.size],
  ...props.presence,
}));

defineExpose({
  element: root,
});
</script>

<template>
  <div ref="root" v-bind="rootAttrs" :class="classes" :style="attrs.style">
    <span
      v-if="hasMedia && (textPosition === 'after' || textPosition === 'below')"
      class="fui-Persona__media"
    >
      <slot v-if="presenceOnly" name="presence">
        <PresenceBadge v-if="presence" v-bind="presenceProps">
          <template v-if="$slots.presenceIcon" #icon>
            <slot name="presenceIcon" />
          </template>
        </PresenceBadge>
      </slot>
      <slot v-else name="avatar">
        <Avatar v-bind="avatarProps">
          <template v-if="$slots.avatarInitials" #initials>
            <slot name="avatarInitials" />
          </template>
          <template v-if="$slots.avatarIcon" #icon>
            <slot name="avatarIcon" />
          </template>
          <template v-if="$slots.avatarImage" #image>
            <slot name="avatarImage" />
          </template>
        </Avatar>
      </slot>
    </span>

    <span class="fui-Persona__primaryText">
      <slot name="primaryText">{{ name }}</slot>
    </span>
    <span v-if="$slots.secondaryText" class="fui-Persona__secondaryText">
      <slot name="secondaryText" />
    </span>
    <span v-if="$slots.tertiaryText" class="fui-Persona__tertiaryText">
      <slot name="tertiaryText" />
    </span>
    <span v-if="$slots.quaternaryText" class="fui-Persona__quaternaryText">
      <slot name="quaternaryText" />
    </span>

    <span v-if="hasMedia && textPosition === 'before'" class="fui-Persona__media">
      <slot v-if="presenceOnly" name="presence">
        <PresenceBadge v-if="presence" v-bind="presenceProps">
          <template v-if="$slots.presenceIcon" #icon>
            <slot name="presenceIcon" />
          </template>
        </PresenceBadge>
      </slot>
      <slot v-else name="avatar">
        <Avatar v-bind="avatarProps">
          <template v-if="$slots.avatarInitials" #initials>
            <slot name="avatarInitials" />
          </template>
          <template v-if="$slots.avatarIcon" #icon>
            <slot name="avatarIcon" />
          </template>
          <template v-if="$slots.avatarImage" #image>
            <slot name="avatarImage" />
          </template>
        </Avatar>
      </slot>
    </span>
  </div>
</template>

<style>
@import './persona.css';
</style>

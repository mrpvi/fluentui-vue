<script setup lang="ts">
import { computed, inject, onMounted, ref, useAttrs } from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import { menuContextKey } from '../Menu/menuContext';
import type { SplitButtonEmits, SplitButtonProps, SplitButtonSlots } from './SplitButton.types';

defineOptions({ name: 'FSplitButton', inheritAttrs: false });
const props = withDefaults(defineProps<SplitButtonProps>(), {
  appearance: 'secondary',
  shape: 'rounded',
  size: 'medium',
  disabled: false,
  disabledFocusable: false,
  menuButtonDisabled: false,
  menuButtonDisabledFocusable: false,
  defaultOpen: false,
});
const emit = defineEmits<SplitButtonEmits>();
defineSlots<SplitButtonSlots>();
const attrs = useAttrs();
const root = ref<HTMLDivElement | null>(null);
const primary = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLButtonElement | null>(null);
const menuContext = inject(menuContextKey, null);
const controlled = useIsPropProvided('modelValue');
const internalOpen = ref(props.defaultOpen);
const open = computed(() =>
  menuContext
    ? menuContext.open.value
    : controlled
      ? Boolean(props.modelValue)
      : internalOpen.value,
);
const primaryDisabledFocusable = computed(() => props.disabledFocusable && !props.disabled);
const menuDisabled = computed(() => props.disabled || props.menuButtonDisabled);
const menuDisabledFocusable = computed(
  () => !menuDisabled.value && (props.disabledFocusable || props.menuButtonDisabledFocusable),
);
const primaryClasses = computed(() => [
  'fui-Button',
  'fui-SplitButton__primaryAction',
  `fui-Button--${props.appearance}`,
  `fui-Button--${props.shape}`,
  `fui-Button--${props.size}`,
  {
    'fui-Button--disabled': props.disabled,
    'fui-Button--disabled-focusable': primaryDisabledFocusable.value,
  },
]);

function primaryClick(event: MouseEvent) {
  if (props.disabled || primaryDisabledFocusable.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  emit('click', event);
}
function menuClick(event: MouseEvent) {
  if (menuDisabled.value || menuDisabledFocusable.value) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  emit('menuClick', event);
  if (event.defaultPrevented) return;
  const next = !open.value;
  if (menuContext) menuContext.requestOpen(next, event, 'menuTriggerClick');
  else {
    if (!controlled) internalOpen.value = next;
    emit('update:modelValue', next);
  }
}
function rootKeydown(event: KeyboardEvent) {
  if (
    event.altKey &&
    event.key === 'ArrowDown' &&
    !menuDisabled.value &&
    !menuDisabledFocusable.value
  ) {
    event.preventDefault();
    menu.value?.click();
  }
}
onMounted(() => {
  if (menuContext) menuContext.registerTrigger(menu.value);
});

defineExpose({
  element: root,
  primaryAction: primary,
  menuButton: menu,
  open,
  focus: () => primary.value?.focus(),
  focusMenuButton: () => menu.value?.focus(),
});
</script>

<template>
  <div
    ref="root"
    v-bind="attrs"
    :class="['fui-SplitButton', `fui-SplitButton--${shape}`, attrs.class]"
    :style="attrs.style"
    role="group"
    @keydown="rootKeydown"
  >
    <button
      ref="primary"
      :class="[...primaryClasses, { 'fui-Button--with-icon': Boolean($slots.icon) }]"
      type="button"
      :disabled="disabled ? true : undefined"
      :aria-disabled="primaryDisabledFocusable ? 'true' : undefined"
      @click="primaryClick"
    >
      <span
        v-if="$slots.icon"
        :class="['fui-Button__icon', `fui-Button__icon--${size}`, 'fui-Button__icon--before']"
        aria-hidden="true"
        ><slot name="icon"
      /></span>
      <slot />
    </button>
    <button
      ref="menu"
      :class="[
        'fui-Button',
        'fui-SplitButton__menuButton',
        `fui-Button--${appearance}`,
        `fui-Button--${shape}`,
        `fui-Button--${size}`,
        `fui-Button--icon-only-${size}`,
        {
          'fui-Button--disabled': menuDisabled,
          'fui-Button--disabled-focusable': menuDisabledFocusable,
          'fui-SplitButton__menuButton--open': open,
        },
      ]"
      type="button"
      :disabled="menuDisabled ? true : undefined"
      :aria-disabled="menuDisabledFocusable ? 'true' : undefined"
      aria-haspopup="menu"
      :aria-expanded="open ? 'true' : 'false'"
      aria-label="More options"
      @click="menuClick"
    >
      <span class="fui-SplitButton__menuIcon" aria-hidden="true">
        <slot name="menu-icon">
          <svg viewBox="0 0 12 12" focusable="false">
            <path d="M2.2 4.3 6 8l3.8-3.7.7.7L6 9.4 1.5 5z" />
          </svg>
        </slot>
      </span>
    </button>
  </div>
</template>

<style>
@import '../Button/button.css';
@import './splitButton.css';
</style>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  ref,
  useAttrs,
  watch,
} from 'vue';
import { useIsPropProvided } from '../../composables/useIsPropProvided';
import type { MenuEmits, MenuProps, MenuSlots } from './Menu.types';
import { menuContextKey } from './menuContext';

defineOptions({ name: 'FMenu', inheritAttrs: false });
const props = withDefaults(defineProps<MenuProps>(), {
  defaultOpen: false,
  mountNode: 'body',
  inline: false,
  positioning: 'auto',
  hoverDelay: 300,
  openOnHover: false,
  openOnContext: false,
  closeOnScroll: false,
  persistOnItemClick: false,
  hasIcons: false,
  hasCheckmarks: false,
  defaultCheckedValues: () => ({}),
});
const emit = defineEmits<MenuEmits>();
defineSlots<MenuSlots>();
const attrs = useAttrs();
const internalOpen = ref(props.defaultOpen);
const internalCheckedValues = ref<Record<string, string[]>>({ ...props.defaultCheckedValues });
const controlledByModel = useIsPropProvided('modelValue');
const controlledByOpen = useIsPropProvided('open');
const controlledCheckedValues = useIsPropProvided('checkedValues');
const open = computed(() =>
  controlledByModel
    ? Boolean(props.modelValue)
    : controlledByOpen
      ? Boolean(props.open)
      : internalOpen.value,
);
const checkedValues = computed(() =>
  controlledCheckedValues ? (props.checkedValues ?? {}) : internalCheckedValues.value,
);
const inline = computed(() => props.inline);
const positioning = computed(() => props.positioning);
const mountNode = computed(() => props.mountNode);
const openOnHover = computed(() => props.openOnHover);
const openOnContext = computed(() => props.openOnContext);
const hoverDelay = computed(() => props.hoverDelay);
const closeOnScroll = computed(() => props.closeOnScroll);
const persistOnItemClick = computed(() => props.persistOnItemClick);
const hasIcons = computed(() => props.hasIcons);
const hasCheckmarks = computed(() => props.hasCheckmarks);
const root = ref<HTMLElement | null>(null);
const direction = ref<'ltr' | 'rtl'>();
const trigger = ref<HTMLElement | null>(null);
const popover = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);
const items = ref<import('./menuContext').MenuItemRecord[]>([]);
const activeItemId = ref<string>();
const surfaceStyle = ref<Record<string, string>>({});
let previouslyFocused: HTMLElement | null = null;

function requestOpen(next: boolean, event: Event, type: MenuEmits['openChange'][1]['type']) {
  if (next === open.value) return;
  if (next && typeof document !== 'undefined') {
    previouslyFocused =
      document.activeElement instanceof HTMLElement && document.activeElement !== document.body
        ? document.activeElement
        : trigger.value;
  }
  if (!controlledByModel && !controlledByOpen) internalOpen.value = next;
  emit('update:modelValue', next);
  emit('update:open', next);
  emit('openChange', event, { open: next, type, event });
}

function focusableItems() {
  return items.value.filter((item) => !item.disabled && !item.element.hidden);
}
function setActiveItem(id: string | undefined, focus = false) {
  activeItemId.value = id;
  if (focus) items.value.find((item) => item.id === id)?.element.focus({ preventScroll: true });
}
function focusFirst() {
  const item = focusableItems()[0];
  if (item) setActiveItem(item.id, true);
}
function focusLast() {
  const list = focusableItems();
  const item = list[list.length - 1];
  if (item) setActiveItem(item.id, true);
}
function focusNext(current = document.activeElement as HTMLElement | null) {
  const list = focusableItems();
  const index = list.findIndex((item) => item.element === current);
  const item = list[(index + 1) % list.length];
  if (item) setActiveItem(item.id, true);
}
function focusPrevious(current = document.activeElement as HTMLElement | null) {
  const list = focusableItems();
  const index = list.findIndex((item) => item.element === current);
  const item = list[(index - 1 + list.length) % list.length];
  if (item) setActiveItem(item.id, true);
}
function focusByCharacter(character: string) {
  const normalized = character.toLocaleLowerCase();
  const list = focusableItems();
  const currentIndex = list.findIndex((item) => item.element === document.activeElement);
  const ordered = [...list.slice(currentIndex + 1), ...list.slice(0, currentIndex + 1)];
  const item = ordered.find((entry) => entry.text.toLocaleLowerCase().startsWith(normalized));
  if (item) setActiveItem(item.id, true);
}
function registerItem(item: import('./menuContext').MenuItemRecord) {
  items.value = [...items.value, item];
  return () => {
    items.value = items.value.filter((entry) => entry.id !== item.id);
  };
}
function toggleChecked(
  event: Event,
  name: string,
  value: string,
  checked: boolean,
  exclusive = false,
) {
  const current = checkedValues.value[name] ?? [];
  const nextValues = checked
    ? exclusive
      ? [value]
      : [...new Set([...current, value])]
    : current.filter((entry) => entry !== value);
  const next = { ...checkedValues.value, [name]: nextValues };
  if (!controlledCheckedValues) internalCheckedValues.value = next;
  emit('update:checkedValues', next);
  emit('checkedValueChange', event, { name, value, checked, checkedValues: next });
}
function closeAfterItem(event: Event, persist = false) {
  if (!persist && !props.persistOnItemClick) requestOpen(false, event, 'menuItemClick');
}
function updatePosition() {
  const source = trigger.value ?? root.value;
  if (source) {
    const nextDirection = getComputedStyle(source).direction === 'rtl' ? 'rtl' : 'ltr';
    if (direction.value !== nextDirection) {
      direction.value = nextDirection;
      nextTick(updatePosition);
      return;
    }
  }
  if (!open.value || inline.value || !trigger.value || !popover.value) return;
  popover.value.style.visibility = 'hidden';
  popover.value.hidden = false;
  const triggerRect = trigger.value.getBoundingClientRect();
  const surfaceRect = popover.value.getBoundingClientRect();
  const gap = 4;
  const above =
    props.positioning === 'above' ||
    (props.positioning === 'auto' &&
      triggerRect.bottom + surfaceRect.height + gap > window.innerHeight);
  const before = props.positioning === 'before';
  const after = props.positioning === 'after';
  const rtl = getComputedStyle(popover.value).direction === 'rtl';
  const left =
    before || after
      ? before !== rtl
        ? triggerRect.left - surfaceRect.width - gap
        : triggerRect.right + gap
      : rtl
        ? triggerRect.right - surfaceRect.width
        : triggerRect.left;
  const nextStyle = {
    position: 'fixed',
    left: `${Math.max(4, left)}px`,
    top: above ? 'auto' : `${triggerRect.bottom + gap}px`,
    bottom: above ? `${Math.max(4, window.innerHeight - triggerRect.top + gap)}px` : 'auto',
    maxWidth: 'calc(100vw - 8px)',
  };
  if (Object.entries(nextStyle).some(([key, value]) => surfaceStyle.value[key] !== value)) {
    surfaceStyle.value = nextStyle;
  }
  popover.value.style.visibility = '';
}
function handleDocumentPointerdown(event: PointerEvent) {
  if (!open.value) return;
  const path = event.composedPath();
  if (path.includes(trigger.value as EventTarget) || path.includes(popover.value as EventTarget))
    return;
  requestOpen(false, event, 'clickOutside');
}
function handleDocumentKeydown(event: KeyboardEvent) {
  if (!open.value || event.defaultPrevented) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    requestOpen(false, event, 'menuPopoverKeyDown');
    nextTick(() => (previouslyFocused ?? trigger.value)?.focus());
    return;
  }
  if (!list.value) return;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    focusNext();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    focusPrevious();
  } else if (event.key === 'Home') {
    event.preventDefault();
    focusFirst();
  } else if (event.key === 'End') {
    event.preventDefault();
    focusLast();
  } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey)
    focusByCharacter(event.key);
}
function handleScroll(event: Event) {
  if (open.value && props.closeOnScroll) requestOpen(false, event, 'scrollOutside');
}
provide(menuContextKey, {
  open,
  inline,
  positioning,
  mountNode,
  surfaceStyle,
  direction,
  openOnHover,
  openOnContext,
  hoverDelay,
  closeOnScroll,
  persistOnItemClick,
  hasIcons,
  hasCheckmarks,
  trigger,
  popover,
  list,
  requestOpen,
  registerTrigger: (element) => {
    trigger.value = element;
  },
  registerPopover: (element) => {
    popover.value = element;
  },
  registerList: (element) => {
    list.value = element;
  },
  registerItem,
  items,
  activeItemId,
  setActiveItem,
  focusFirst,
  focusLast,
  focusNext,
  focusPrevious,
  focusByCharacter,
  checkedValues,
  toggleChecked,
  closeAfterItem,
});

watch(open, async (value, previous) => {
  if (value) {
    await nextTick();
    updatePosition();
    await nextTick();
    focusFirst();
  } else {
    surfaceStyle.value = {};
    if (previous) nextTick(() => previouslyFocused?.isConnected && previouslyFocused.focus());
  }
});
onUpdated(updatePosition);
onMounted(() => {
  updatePosition();
  document.addEventListener('pointerdown', handleDocumentPointerdown);
  document.addEventListener('keydown', handleDocumentKeydown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', updatePosition, true);
  window.addEventListener('scroll', handleScroll, true);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerdown);
  document.removeEventListener('keydown', handleDocumentKeydown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
  window.removeEventListener('scroll', handleScroll, true);
});

defineExpose({
  open,
  trigger,
  popover,
  focus: () => trigger.value?.focus(),
  openMenu: (event: Event = new Event('programmatic')) =>
    requestOpen(true, event, 'menuTriggerClick'),
});
</script>

<template>
  <div ref="root" v-bind="attrs" class="fui-Menu"><slot /></div>
</template>

<style>
@import './menu.css';
</style>

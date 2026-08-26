<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
} from 'vue';
import { listContextKey } from '../List/listContext';
import type { ListValue } from '../List/List.types';
import type {
  ListItemElement,
  ListItemEmits,
  ListItemProps,
  ListItemSlots,
} from './ListItem.types';

defineOptions({
  name: 'FListItem',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ListItemProps>(), {
  disabledSelection: false,
});
const emit = defineEmits<ListItemEmits>();
defineSlots<ListItemSlots>();
const attrs = useAttrs();
const instance = getCurrentInstance();
const injectedList = inject(listContextKey);
if (!injectedList) {
  throw new Error('FListItem must be used inside FList.');
}
const list = injectedList;
const root = ref<HTMLElement | null>(null);
const generatedValue = `fui-list-item-${useId()}`;
const value = computed<ListValue>(() => props.value ?? generatedValue);
const rootTag = computed<ListItemElement>(
  () => props.as ?? (list.navigationMode.value === 'composite' ? 'div' : 'li'),
);
const selected = computed(() => list.selectable.value && list.isSelected(value.value));
const checkmarkLabel = computed(() => `Select ${String(attrs['aria-label'] ?? value.value)}`);
const navigable = computed(
  () => list.selectable.value || Boolean(list.navigationMode.value) || props.tabindex === 0,
);
const hasActionListener = computed(() => Boolean(instance?.vnode.props?.onAction));
const selectionDisabledWithoutAction = computed(
  () => props.disabledSelection && !hasActionListener.value,
);
const rootAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    role: _role,
    tabindex: _tabindex,
    onClick: _onClick,
    onFocus: _onFocus,
    onKeydown: _onKeydown,
    onAction: _onAction,
    'aria-selected': _ariaSelected,
    'aria-disabled': _ariaDisabled,
    ...rest
  } = attrs;
  return rest;
});
let unregister: (() => void) | undefined;

function createActionEvent(originalEvent: MouseEvent | KeyboardEvent) {
  return new CustomEvent('ListItemAction', {
    cancelable: true,
    bubbles: true,
    detail: { originalEvent },
  });
}

function triggerAction(originalEvent: MouseEvent | KeyboardEvent) {
  const actionEvent = createActionEvent(originalEvent);
  emit('action', actionEvent, { value: value.value });
  if (!actionEvent.defaultPrevented && list.selectable.value && !props.disabledSelection) {
    list.requestToggle(value.value, originalEvent);
  }
  originalEvent.target?.dispatchEvent(actionEvent);
}

function handleClick(event: MouseEvent) {
  emit('click', event);
  if (event.defaultPrevented || !root.value) {
    return;
  }
  const target = event.target;
  if (
    target instanceof Node &&
    root.value.querySelector('.fui-ListItem__checkmark')?.contains(target)
  ) {
    return;
  }
  triggerAction(event);
}

function handleFocus(event: FocusEvent) {
  emit('focus', event);
}

function handleKeydown(event: KeyboardEvent) {
  emit('keydown', event);
  if (event.defaultPrevented || !root.value) {
    return;
  }

  if (event.target !== event.currentTarget) {
    if (list.navigationMode.value === 'composite') {
      if (event.key === 'Escape') {
        event.preventDefault();
        list.leaveItem(root.value);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        if (list.moveActionFocus(root.value, target, direction)) {
          event.preventDefault();
        } else if (direction === -1) {
          event.preventDefault();
          list.leaveItem(root.value);
        }
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        list.leaveItem(root.value);
        list.moveItemFocus(root.value, event.key);
      }
    }
    return;
  }

  if (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'Home' ||
    event.key === 'End' ||
    event.key === 'PageUp' ||
    event.key === 'PageDown'
  ) {
    event.preventDefault();
    list.moveItemFocus(root.value, event.key);
    return;
  }

  if (event.key === 'ArrowRight') {
    list.enterItem(root.value);
    return;
  }

  if (event.key === ' ') {
    event.preventDefault();
    if (list.selectable.value) {
      if (!props.disabledSelection) {
        list.requestToggle(value.value, event);
      }
    } else {
      triggerAction(event);
    }
    return;
  }

  if (event.key === 'Enter') {
    triggerAction(event);
  }
}

function handleCheckmarkChange(event: Event) {
  if (!event.defaultPrevented && !props.disabledSelection) {
    list.requestToggle(value.value, event);
  }
}

onMounted(() => {
  if (root.value) {
    unregister = list.registerItem(root.value, () => navigable.value);
  }
});
onBeforeUnmount(() => unregister?.());

defineExpose({
  element: root,
  focus: () => root.value?.focus(),
});
</script>

<template>
  <component
    :is="rootTag"
    :id="String(value)"
    ref="root"
    v-bind="rootAttrs"
    :class="[
      'fui-ListItem',
      {
        'fui-ListItem--selectable': list.selectable.value,
        'fui-ListItem--navigable': navigable,
        'fui-ListItem--selected': selected,
        'fui-ListItem--disabled': selectionDisabledWithoutAction,
      },
      attrs.class,
    ]"
    :style="attrs.style"
    :role="role ?? list.itemRole.value"
    :tabindex="navigable ? (tabindex ?? 0) : undefined"
    :aria-selected="list.selectable.value ? String(selected) : undefined"
    :aria-disabled="selectionDisabledWithoutAction ? 'true' : undefined"
    @click="handleClick"
    @focus="handleFocus"
    @keydown="handleKeydown"
  >
    <span
      v-if="list.selectable.value"
      class="fui-ListItem__checkmark"
      :class="{ 'fui-ListItem__checkmark--selected': selected }"
      @click.stop="handleCheckmarkChange"
    >
      <slot name="checkmark" :selected="selected" :disabled="disabledSelection">
        <span
          class="fui-ListItem__checkmarkControl"
          role="checkbox"
          :aria-label="checkmarkLabel"
          :aria-checked="selected"
          :aria-disabled="disabledSelection ? 'true' : undefined"
        >
          <span class="fui-ListItem__checkmarkIndicator" aria-hidden="true">
            <svg v-if="selected" viewBox="0 0 16 16" focusable="false">
              <path
                d="M13.2 4.2a.75.75 0 0 1 .1 1.06l-6 7a.75.75 0 0 1-1.1.04l-3.5-3.5a.75.75 0 0 1 1.06-1.06l2.93 2.93 5.47-6.38a.75.75 0 0 1 1.05-.09Z"
              />
            </svg>
          </span>
        </span>
      </slot>
    </span>
    <slot />
  </component>
</template>

<style>
@import './listItem.css';
</style>

<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  inject,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  useSlots,
  type VNode,
} from 'vue';
import { tagPickerContextKey } from './tagPickerContext';
import type { TagPickerOptionProps, TagPickerOptionSlots } from './TagPicker.types';
defineOptions({ name: 'FTagPickerOption', inheritAttrs: false });
const props = withDefaults(defineProps<TagPickerOptionProps>(), { disabled: false });
defineSlots<TagPickerOptionSlots>();
const slots = useSlots();
const attrs = useAttrs();
const injectedContext = inject(tagPickerContextKey);
if (!injectedContext) throw new Error('FTagPickerOption must be used inside FTagPickerList.');
const context = injectedContext;
const root = ref<HTMLDivElement | null>(null);
const id = computed(() => String(attrs.id ?? `fui-tag-picker-option-${useId()}`));
function textOf(value: unknown): string {
  if (value == null || typeof value === 'boolean') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(textOf).join('');
  if (!isVNode(value) || value.type === Comment) return '';
  if (value.type === Text) return String(value.children ?? '');
  if (
    value.type === Fragment ||
    typeof value.children === 'string' ||
    Array.isArray(value.children)
  )
    return textOf(value.children);
  return '';
}
const text = computed(() => props.text ?? textOf(slots.default?.() as VNode[] | undefined).trim());
const selected = computed(() => context.selectedOptions.value.includes(props.value));
const active = computed(() => context.activeOptionId.value === id.value);
const hidden = computed(() =>
  Boolean(
    context.filterText.value.trim() &&
    !text.value.toLocaleLowerCase().includes(context.filterText.value.trim().toLocaleLowerCase()),
  ),
);
let unregister: (() => void) | undefined;
function click(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  context.setActiveOption(id.value);
  context.selectOption(event, {
    disabled: props.disabled,
    element: root.value!,
    id: id.value,
    text: text.value,
    value: props.value,
  });
}
onMounted(() => {
  if (root.value)
    unregister = context.registerOption({
      disabled: () => props.disabled,
      element: root.value,
      id: () => id.value,
      text: () => text.value,
      value: () => props.value,
    });
});
onBeforeUnmount(() => unregister?.());
defineExpose({ element: root });
</script>
<template>
  <div
    :id="id"
    ref="root"
    v-bind="attrs"
    class="fui-TagPickerOption"
    :class="{
      'fui-TagPickerOption--active': active,
      'fui-TagPickerOption--disabled': disabled,
      'fui-TagPickerOption--selected': selected,
    }"
    role="option"
    :aria-selected="selected"
    :aria-disabled="disabled || undefined"
    :hidden="hidden || undefined"
    @click="click"
  >
    <div v-if="$slots.media" class="fui-TagPickerOption__media"><slot name="media" /></div>
    <span class="fui-TagPickerOption__content"><slot /></span
    ><span v-if="$slots['secondary-content']" class="fui-TagPickerOption__secondaryContent"
      ><slot name="secondary-content"
    /></span>
  </div>
</template>

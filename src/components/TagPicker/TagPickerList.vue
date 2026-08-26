<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  Teleport,
  useAttrs,
  watch,
} from 'vue';
import { tagPickerContextKey } from './tagPickerContext';
defineOptions({ name: 'FTagPickerList', inheritAttrs: false });
const attrs = useAttrs();
const injectedContext = inject(tagPickerContextKey);
if (!injectedContext) throw new Error('FTagPickerList must be used inside FTagPicker.');
const context = injectedContext;
const root = ref<HTMLDivElement | null>(null);
const style = ref<Record<string, string>>({});
let observer: ResizeObserver | undefined;
function position() {
  if (!context.open.value || context.inlinePopup.value || !context.control.value) return;
  const rect = context.control.value.getBoundingClientRect();
  const height = root.value?.offsetHeight ?? 0;
  const above =
    context.positioning.value === 'above' ||
    (context.positioning.value === 'auto' && rect.bottom + height > window.innerHeight);
  style.value = {
    position: 'fixed',
    left: `${rect.left}px`,
    top: above ? 'auto' : `${rect.bottom + 2}px`,
    bottom: above ? `${window.innerHeight - rect.top + 2}px` : 'auto',
    width: `${rect.width}px`,
  };
}
const visible = computed(() => context.open.value);
watch(visible, async (value) => {
  if (value) {
    await nextTick();
    position();
  }
});
onMounted(() => {
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, true);
  if (typeof ResizeObserver !== 'undefined' && context.control.value) {
    observer = new ResizeObserver(position);
    observer.observe(context.control.value);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', position);
  window.removeEventListener('scroll', position, true);
  observer?.disconnect();
});
function assign(element: unknown) {
  root.value = element as HTMLDivElement | null;
  context.popup.value = element as HTMLDivElement | null;
}
defineExpose({ element: root });
</script>
<template>
  <component
    :is="context.inlinePopup.value ? 'div' : Teleport"
    v-if="visible"
    :to="context.mountNode.value"
  >
    <div
      :id="context.listboxId"
      :ref="assign"
      v-bind="attrs"
      class="fui-TagPickerList"
      :class="{ 'fui-TagPickerList--inline': context.inlinePopup.value }"
      :style="context.inlinePopup.value ? attrs.style : [style, attrs.style]"
      role="listbox"
      aria-multiselectable="true"
      @pointerdown="(e) => e.preventDefault()"
    >
      <slot />
    </div>
  </component>
</template>

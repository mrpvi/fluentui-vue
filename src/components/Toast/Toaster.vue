<script setup lang="ts">
import {
  computed,
  defineComponent,
  Fragment,
  h,
  inject,
  isVNode,
  provide,
  ref,
  shallowRef,
  useId,
} from 'vue';
import FAriaLiveAnnouncer from '../AriaLiveAnnouncer/AriaLiveAnnouncer.vue';
import type { AriaLiveAnnouncerExpose } from '../AriaLiveAnnouncer';
import FToast from './Toast.vue';
import type {
  ToastController,
  ToastId,
  ToastOptions,
  ToastRecord,
  ToasterProps,
  ToasterSlots,
} from './Toast.types';
import { toastControllerContextKey } from './toastContext';

defineOptions({ name: 'FToaster' });
const props = withDefaults(defineProps<ToasterProps>(), {
  inline: false,
  mountNode: 'body',
  position: 'bottom-end',
  timeout: 3000,
  pauseOnHover: false,
  pauseOnWindowBlur: false,
  limit: 5,
});
defineSlots<ToasterSlots>();
const inheritedController = inject(toastControllerContextKey, undefined);
const announcer = ref<AriaLiveAnnouncerExpose>();
const records = shallowRef<ToastRecord[]>([]);
let sequence = 0;
const toasterId = useId();

function normalize(options: ToastOptions = {}) {
  return {
    intent: options.intent ?? 'info',
    position: options.position ?? props.position,
    timeout: options.timeout ?? props.timeout,
    pauseOnHover: options.pauseOnHover ?? props.pauseOnHover,
    pauseOnWindowBlur: options.pauseOnWindowBlur ?? props.pauseOnWindowBlur,
    priority: options.priority ?? 0,
    politeness: options.politeness,
  };
}
function dispatchToast(content: ToastRecord['content'], options: ToastOptions = {}): ToastId {
  const toastId = options.toastId ?? `${toasterId}-${sequence++}`;
  const normalized = normalize(options);
  const record: ToastRecord = { toastId, content, ...normalized };
  records.value = [...records.value, record]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, props.limit);
  const text = typeof content === 'string' || typeof content === 'number' ? String(content) : '';
  if (text)
    announcer.value?.announce(text, {
      politeness:
        options.politeness ??
        (options.intent === 'error' || options.intent === 'warning' ? 'assertive' : 'polite'),
    });
  return toastId;
}
function dismissToast(toastId: ToastId) {
  records.value = records.value.filter((record) => record.toastId !== toastId);
}
function dismissAllToasts() {
  records.value = [];
}
function updateToast(
  toastId: ToastId,
  content: ToastRecord['content'],
  options: ToastOptions = {},
) {
  const index = records.value.findIndex((record) => record.toastId === toastId);
  if (index < 0) return;
  records.value = records.value.map((record, recordIndex) =>
    recordIndex === index ? { ...record, ...normalize(options), content, toastId } : record,
  );
}
const controller: ToastController = { dispatchToast, dismissToast, dismissAllToasts, updateToast };
provide(toastControllerContextKey, controller);

const grouped = computed(() => {
  const positions = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
  ] as const;
  return positions.map((position) => ({
    position,
    toasts: records.value.filter((record) => record.position === position),
  }));
});
function renderContent(record: ToastRecord) {
  return typeof record.content === 'function' ? record.content() : record.content;
}
const ToastContent = defineComponent({
  name: 'FToastContent',
  props: { record: { type: Object as () => ToastRecord, required: true } },
  setup(contentProps) {
    return () => {
      const content = renderContent(contentProps.record);
      if (Array.isArray(content)) return h(Fragment, undefined, content);
      if (isVNode(content)) return content;
      return h('div', undefined, content == null ? undefined : String(content));
    };
  },
});
defineExpose(controller);
</script>

<template>
  <slot />
  <FAriaLiveAnnouncer ref="announcer" />
  <Teleport :to="props.mountNode" :disabled="props.inline">
    <div class="fui-Toaster" :data-controller-inherited="Boolean(inheritedController)">
      <div
        v-for="group in grouped"
        :key="group.position"
        class="fui-Toaster__position"
        :class="`fui-Toaster__position--${group.position}`"
        role="list"
      >
        <component
          :is="FToast"
          v-for="toastRecord in group.toasts"
          :key="toastRecord.toastId"
          :toast-id="toastRecord.toastId"
          :intent="toastRecord.intent"
          :timeout="toastRecord.timeout"
          :pause-on-hover="toastRecord.pauseOnHover"
          :pause-on-window-blur="toastRecord.pauseOnWindowBlur"
          @dismiss="dismissToast(toastRecord.toastId)"
        >
          <ToastContent :record="toastRecord" />
        </component>
      </div>
    </div>
  </Teleport>
</template>

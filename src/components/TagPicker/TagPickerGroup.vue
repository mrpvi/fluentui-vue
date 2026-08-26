<script setup lang="ts">
import { computed, inject } from 'vue';
import FTagGroup from '../Tag/TagGroup.vue';
import { tagPickerContextKey } from './tagPickerContext';
import type { TagPickerGroupProps } from './TagPicker.types';
defineOptions({ name: 'FTagPickerGroup' });
const props = withDefaults(defineProps<TagPickerGroupProps>(), {
  appearance: 'filled',
  size: 'medium',
});
const injectedContext = inject(tagPickerContextKey);
if (!injectedContext) throw new Error('FTagPickerGroup must be used inside FTagPickerControl.');
const context = injectedContext;
const visible = computed(() => context.selectedOptions.value.length > 0);
function dismiss(event: MouseEvent | KeyboardEvent, data: { value: string }) {
  context.removeOption(event, data.value);
}
</script>
<template>
  <FTagGroup
    v-if="visible"
    class="fui-TagPickerGroup"
    :appearance="props.appearance"
    :size="props.size"
    dismissible
    @dismiss="dismiss"
    ><slot :selected-options="context.selectedOptions.value"
  /></FTagGroup>
</template>

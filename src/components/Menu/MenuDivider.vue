<script setup lang="ts">
import { useAttrs } from 'vue';
import type { MenuDividerProps, MenuDividerSlots } from './Menu.types';
defineOptions({ name: 'FMenuDivider', inheritAttrs: false });
const props = withDefaults(defineProps<MenuDividerProps>(), { as: 'div' });
defineSlots<MenuDividerSlots>();
const attrs = useAttrs();
</script>
<template>
  <component :is="props.as" v-bind="attrs" class="fui-MenuDivider" role="separator"
    ><slot
  /></component>
</template>

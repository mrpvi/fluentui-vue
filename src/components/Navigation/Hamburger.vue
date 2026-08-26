<script setup lang="ts">
import { useAttrs } from 'vue';
import type { HamburgerEmits, HamburgerProps, HamburgerSlots } from './Navigation.types';
defineOptions({ name: 'FHamburger', inheritAttrs: false });
const props = withDefaults(defineProps<HamburgerProps>(), {
  as: 'button',
  ariaLabel: 'Open navigation',
});
const emit = defineEmits<HamburgerEmits>();
defineSlots<HamburgerSlots>();
const attrs = useAttrs();
</script>
<template>
  <component
    :is="props.as"
    v-bind="attrs"
    class="fui-Hamburger"
    :type="props.as === 'button' ? 'button' : undefined"
    :aria-expanded="props.open"
    :aria-label="props.ariaLabel"
    @click="emit('click', $event)"
    ><slot><span aria-hidden="true">☰</span></slot></component
  >
</template>
<style>
@import './navigation.css';
</style>

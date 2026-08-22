import { defineComponent, h } from 'vue';
import {
  FButton,
  FCheckbox,
  FDivider,
  FField,
  FImage,
  FInput,
  FLabel,
  FLink,
  FText,
  FTextarea,
} from '../../src';

export const SsrFixture = defineComponent({
  name: 'SsrFixture',
  setup() {
    return () =>
      h('main', { class: 'fui-theme-light' }, [
        h(FText, { as: 'h1', size: 700 }, () => 'SSR fixture'),
        h(FLabel, { for: 'standalone-input' }, () => 'Standalone input'),
        h(FInput, { id: 'standalone-input', defaultValue: 'Initial value' }),
        h(
          FField,
          {
            label: 'Email address',
            hint: 'Use a work address.',
            required: true,
          },
          { default: () => h(FInput, { type: 'email' }) },
        ),
        h(
          FField,
          { label: 'Biography' },
          { default: () => h(FTextarea, { defaultValue: 'Vue-native components' }) },
        ),
        h(FCheckbox, { defaultChecked: true, label: 'Accept terms' }),
        h(FDivider, { 'aria-label': 'Contentless boundary' }),
        h(FDivider, { appearance: 'brand' }, () => 'Server section'),
        h(FDivider, { vertical: true }, () => 'Vertical section'),
        h(FImage, {
          src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
          alt: 'SSR image',
          fit: 'cover',
          shape: 'rounded',
          width: 64,
          height: 48,
        }),
        h(FLink, { href: '#details' }, () => 'View details'),
        h(FButton, { appearance: 'primary' }, () => 'Continue'),
      ]);
  },
});

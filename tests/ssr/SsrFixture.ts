import { defineComponent, h } from 'vue';
import { FButton, FCheckbox, FField, FInput, FLabel, FLink, FText, FTextarea } from '../../src';

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
        h(FLink, { href: '#details' }, () => 'View details'),
        h(FButton, { appearance: 'primary' }, () => 'Continue'),
      ]);
  },
});

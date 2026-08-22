<script setup lang="ts">
import { ref } from 'vue';
import {
  FButton,
  FCheckbox,
  FField,
  FInput,
  FLabel,
  FLink,
  FText,
  FTextarea,
  type CheckboxValue,
} from '../src';

const name = ref('Ada Lovelace');
const biography = ref('Vue-native Fluent components.');
const accepted = ref<CheckboxValue>(false);
const triState = ref<CheckboxValue>('mixed');
const dark = ref(false);

function clearUncontrolledAmount(event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement;
  const input = button.closest('.fui-Input')?.querySelector('input');

  if (input) {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  }
}
</script>

<template>
  <main :class="['playground', dark ? 'fui-theme-dark' : 'fui-theme-light']">
    <header class="hero">
      <div>
        <p class="eyebrow">@local/fluent-vue · 0.1.0</p>
        <h1>Native Fluent components for Vue 3</h1>
        <p>
          Native Button, Input, Checkbox, Text, Label, Field, Textarea, and Link components
          translated from Fluent UI React v9 to Vue props, slots, emits, and semantic HTML.
        </p>
      </div>
      <FButton appearance="subtle" @click="dark = !dark">
        {{ dark ? 'Use light theme' : 'Use dark theme' }}
      </FButton>
    </header>

    <section>
      <h2>Text</h2>
      <div class="text-samples">
        <FText as="h2" :size="700" weight="semibold">Semantic Fluent heading</FText>
        <FText as="p">
          FText preserves semantic HTML while applying Fluent typography tokens.
        </FText>
        <div class="row">
          <FText :size="100">Size 100</FText>
          <FText :size="300">Size 300</FText>
          <FText :size="500" weight="semibold">Size 500 semibold</FText>
          <FText :size="800" weight="bold">Size 800 bold</FText>
        </div>
        <div class="row">
          <FText font="monospace">const fluent = 'vue';</FText>
          <FText font="numeric">123,456.78</FText>
          <FText italic>Italic</FText>
          <FText underline>Underline</FText>
          <FText underline strikethrough>Combined decoration</FText>
        </div>
        <FText class="text-align-sample" block align="end">
          End-aligned text follows the document direction.
        </FText>
        <FText
          class="text-truncate-sample"
          block
          :wrap="false"
          truncate
          title="This long Fluent text demonstrates explicit single-line truncation."
        >
          This long Fluent text demonstrates explicit single-line truncation.
        </FText>
      </div>
    </section>

    <section>
      <h2>Label</h2>
      <div class="label-samples">
        <div class="column label-field">
          <FLabel for="label-email" :required="true">Email address</FLabel>
          <FInput id="label-email" required type="email" placeholder="name@example.com" />
          <FText :size="200"
            >The marker is visual; the input carries native required semantics.</FText
          >
        </div>
        <div class="row">
          <FLabel size="small">Small label</FLabel>
          <FLabel>Medium label</FLabel>
          <FLabel size="large">Large label</FLabel>
          <FLabel weight="semibold">Semibold label</FLabel>
          <FLabel required="(required)">Custom marker</FLabel>
        </div>
        <div class="column label-field">
          <FLabel for="label-disabled" disabled :required="true">Disabled email</FLabel>
          <FInput id="label-disabled" disabled placeholder="Disabled input" />
        </div>
      </div>
    </section>

    <section>
      <h2>Field</h2>
      <div class="field-samples">
        <form class="field-validity-demo">
          <FField
            class="field-required-email"
            label="Work email"
            hint="Use the address where your team can reach you."
            required
          >
            <FInput type="email" placeholder="team@example.com" />
          </FField>
          <FButton type="submit">Submit required field</FButton>
        </form>

        <div class="field-status-grid">
          <FField label="Username" validation-message="This username is already taken.">
            <FInput value="fluent" />
          </FField>
          <FField
            label="Storage"
            validation-state="warning"
            validation-message="Your storage is almost full."
          >
            <FInput value="92% used" />
          </FField>
          <FField
            label="Profile"
            validation-state="success"
            validation-message="Your profile is complete."
          >
            <FInput value="Ready" />
          </FField>
        </div>

        <FField
          class="field-horizontal-demo"
          label="Department"
          hint="Shown in the company directory."
          orientation="horizontal"
          size="large"
        >
          <FInput placeholder="Engineering" />
        </FField>

        <FField
          class="field-checkbox-demo"
          label="Product updates"
          hint="You can unsubscribe at any time."
        >
          <FCheckbox />
        </FField>

        <FField
          class="field-native-demo"
          label="Native reference"
          hint="This native input uses the scoped control attributes."
        >
          <template #default="controlProps">
            <input v-bind="controlProps" class="native-field-input" placeholder="Native input" />
          </template>
        </FField>
      </div>
    </section>

    <section id="link">
      <h2>Link</h2>
      <div class="link-samples">
        <div class="row">
          <FLink href="#textarea">Go to Textarea examples</FLink>
          <FLink appearance="subtle" href="#input">Subtle Input link</FLink>
          <FLink @click="dark = !dark">Toggle theme action</FLink>
          <FLink as="span" class="link-span-action" @click="dark = !dark">
            Span theme action
          </FLink>
        </div>

        <FText as="p">
          Fluent links embedded in prose use
          <FLink inline href="#checkbox">an inline underline</FLink>
          so the destination is not communicated through color alone.
        </FText>

        <div class="row link-disabled-demo">
          <FLink href="#input" disabled>Disabled link</FLink>
          <FLink href="#input" disabled-focusable>Focusable disabled link</FLink>
          <FLink disabled>Disabled action</FLink>
          <FLink disabled-focusable>Focusable disabled action</FLink>
        </div>
      </div>
    </section>

    <section>
      <h2>Button</h2>
      <div class="row">
        <FButton appearance="primary">Primary</FButton>
        <FButton>Secondary</FButton>
        <FButton appearance="outline">Outline</FButton>
        <FButton appearance="subtle">Subtle</FButton>
        <FButton appearance="transparent">Transparent</FButton>
      </div>
      <div class="row">
        <FButton size="small">Small</FButton>
        <FButton>Medium</FButton>
        <FButton size="large">Large</FButton>
        <FButton shape="circular">Circular</FButton>
        <FButton shape="square">Square</FButton>
      </div>
      <div class="row">
        <FButton appearance="primary">
          <template #icon>
            <svg viewBox="0 0 20 20">
              <path
                d="M10 2a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H3a1 1 0 1 1 0-2h6V3a1 1 0 0 1 1-1Z"
              />
            </svg>
          </template>
          Create
        </FButton>
        <FButton aria-label="Add item" shape="circular">
          <template #icon>
            <svg viewBox="0 0 20 20">
              <path
                d="M10 2a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H3a1 1 0 1 1 0-2h6V3a1 1 0 0 1 1-1Z"
              />
            </svg>
          </template>
        </FButton>
        <FButton disabled>Disabled</FButton>
        <FButton disabled-focusable>Focusable disabled</FButton>
        <FButton as="a" href="#input">Anchor button</FButton>
      </div>
    </section>

    <section id="input">
      <h2>Input</h2>
      <div class="column">
        <label class="field-label" for="name">Controlled name</label>
        <FInput id="name" v-model="name" placeholder="Enter a name" />
        <small>Value: {{ name }}</small>
      </div>
      <div class="row inputs">
        <FInput appearance="underline" placeholder="Underline" />
        <FInput appearance="filled-darker" placeholder="Filled darker" />
        <FInput appearance="filled-lighter" placeholder="Filled lighter" />
        <FInput aria-label="Invalid input" aria-invalid="true" value="Invalid" />
        <FInput disabled placeholder="Disabled" />
      </div>
      <div class="row inputs">
        <FInput size="small" placeholder="Small search">
          <template #content-before>⌕</template>
        </FInput>
        <FInput placeholder="Amount">
          <template #content-before>$</template>
          <template #content-after>
            <button class="input-adornment-button" type="button" @click="clearUncontrolledAmount">
              Clear
            </button>
          </template>
        </FInput>
        <FInput size="large" placeholder="Large input" />
      </div>
      <form class="reset-demo">
        <FInput default-value="Reset me" aria-label="Resettable input" />
        <FCheckbox default-checked label="Resettable checkbox" />
        <FButton type="reset">Reset native form</FButton>
      </form>
    </section>

    <section id="textarea">
      <h2>Textarea</h2>
      <div class="textarea-samples">
        <FField
          class="textarea-field-demo"
          label="Biography"
          hint="Write a short summary for your profile."
          required
        >
          <FTextarea v-model="biography" placeholder="Tell us about yourself" resize="vertical" />
        </FField>
        <small>Biography: {{ biography }}</small>

        <div class="textarea-grid">
          <FTextarea size="small" placeholder="Small textarea" />
          <FTextarea placeholder="Medium textarea" resize="horizontal" />
          <FTextarea size="large" placeholder="Large textarea" resize="both" />
          <FTextarea appearance="filled-darker" placeholder="Filled darker" />
          <FTextarea appearance="filled-lighter" placeholder="Filled lighter" />
          <FTextarea
            aria-label="Invalid textarea"
            aria-invalid="true"
            default-value="Invalid textarea"
          />
          <FTextarea disabled placeholder="Disabled textarea" />
          <FTextarea aria-label="Read-only textarea" readonly default-value="Read-only textarea" />
        </div>

        <FField
          class="textarea-error-demo"
          label="Review"
          hint="Include at least one sentence."
          validation-message="A review is required."
          required
        >
          <FTextarea placeholder="Write a review" />
        </FField>

        <form class="textarea-reset-demo">
          <FField label="Resettable notes">
            <FTextarea default-value="Resettable textarea value" resize="vertical" />
          </FField>
          <FButton type="reset">Reset textarea form</FButton>
        </form>
      </div>
    </section>

    <section id="checkbox">
      <h2>Checkbox</h2>
      <div class="column">
        <FCheckbox v-model="accepted" label="Accept terms" />
        <FCheckbox v-model="triState" label="Mixed state" />
        <FCheckbox label="Circular task" shape="circular" />
        <FCheckbox label="Large before label" label-position="before" size="large" />
        <FCheckbox label="Disabled" disabled />
        <small>Accepted: {{ accepted }} · Tri-state: {{ triState }}</small>
      </div>
    </section>
  </main>
</template>

<style scoped>
.playground {
  color-scheme: light;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 3rem max(1.5rem, calc((100vw - 72rem) / 2));
  color: var(--fui-color-neutral-foreground-1);
  background: var(--fui-color-neutral-background-1);
  transition:
    color 160ms ease,
    background 160ms ease;
}

.playground.fui-theme-dark {
  color-scheme: dark;
}

.hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 3rem;
}

.hero > div {
  max-width: 46rem;
}

h1,
h2,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0.75rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.04;
}

h2 {
  margin-bottom: 1.25rem;
}

.eyebrow {
  color: var(--fui-color-compound-brand-foreground-1);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

section {
  padding: 2rem 0;
  border-top: 1px solid var(--fui-color-neutral-stroke-1);
}

.text-samples,
.label-samples,
.field-samples,
.link-samples,
.textarea-samples {
  display: grid;
  gap: 1rem;
}

.field-validity-demo,
.field-status-grid {
  display: grid;
  gap: 1rem;
}

.field-validity-demo {
  align-items: end;
  grid-template-columns: minmax(0, 24rem) max-content;
}

.field-status-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
}

.field-horizontal-demo,
.field-checkbox-demo,
.field-native-demo {
  width: min(100%, 36rem);
}

.native-field-input {
  box-sizing: border-box;
  min-height: 32px;
  padding-inline: var(--fui-spacing-horizontal-m);
  color: var(--fui-color-neutral-foreground-1);
  font: inherit;
  background: var(--fui-color-neutral-background-1);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
  border-radius: var(--fui-border-radius-medium);
}

.label-field {
  width: min(100%, 24rem);
}

.text-align-sample {
  width: min(100%, 34rem);
  padding: 0.5rem;
  border: 1px solid var(--fui-color-neutral-stroke-1);
}

.text-truncate-sample {
  width: 18rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.inputs > * {
  width: min(100%, 18rem);
}

.textarea-field-demo,
.textarea-error-demo,
.textarea-reset-demo {
  width: min(100%, 36rem);
}

.link-samples > p {
  max-width: 42rem;
}

.link-span-action {
  white-space: normal;
}

.textarea-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
}

.textarea-grid > * {
  width: 100%;
}

.textarea-reset-demo {
  display: grid;
  align-items: end;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--fui-color-neutral-stroke-1);
}

.field-label {
  font-weight: 600;
}

.input-adornment-button {
  padding: 0;
  color: inherit;
  font: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.input-adornment-button:focus-visible {
  outline: 2px solid var(--fui-color-stroke-focus-2);
  outline-offset: 2px;
}

.reset-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--fui-color-neutral-stroke-1);
}

small {
  color: var(--fui-color-neutral-foreground-3);
}

@media (max-width: 42rem) {
  .hero {
    flex-direction: column;
  }

  .field-validity-demo,
  .textarea-reset-demo {
    grid-template-columns: 1fr;
  }
}
</style>

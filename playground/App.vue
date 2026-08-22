<script setup lang="ts">
import { ref } from 'vue';
import {
  FBadge,
  FButton,
  FCheckbox,
  FCounterBadge,
  FDivider,
  FField,
  FImage,
  FInput,
  FLabel,
  FLink,
  FPresenceBadge,
  FProgressBar,
  FSpinner,
  FSwitch,
  FText,
  FTextarea,
  type CheckboxValue,
} from '../src';

const name = ref('Ada Lovelace');
const biography = ref('Vue-native Fluent components.');
const accepted = ref<CheckboxValue>(false);
const triState = ref<CheckboxValue>('mixed');
const dark = ref(false);
const switchEnabled = ref(false);
const controlledSwitch = ref(true);
const imageFixture =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22180%22 viewBox=%220 0 320 180%22%3E%3Crect width=%22320%22 height=%22180%22 fill=%22%230f6cbd%22/%3E%3Crect width=%22160%22 height=%2290%22 fill=%22%23479ef5%22/%3E%3Crect x=%22160%22 y=%2290%22 width=%22160%22 height=%2290%22 fill=%22%230e4775%22/%3E%3Ccircle cx=%22160%22 cy=%2290%22 r=%2242%22 fill=%22%23f7c646%22/%3E%3Cpath d=%22M0 180 96 68l58 66 44-46 122 92Z%22 fill=%22%23dff6dd%22 opacity=%22.92%22/%3E%3C/svg%3E';
const missingImageFixture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABINVALID';

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
          Native Button, Input, Checkbox, Text, Label, Field, Textarea, Link, Divider, Image, Badge,
          Spinner, ProgressBar, and Switch components translated from Fluent UI React v9 to Vue
          props, slots, emits, and semantic HTML.
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

    <section id="divider">
      <h2>Divider</h2>
      <div class="divider-samples">
        <div class="divider-horizontal-samples">
          <FDivider aria-label="Unlabeled section boundary" />
          <FDivider class="divider-start" align-content="start" appearance="brand">
            Planning
          </FDivider>
          <FDivider appearance="strong">Review</FDivider>
          <FDivider class="divider-end" align-content="end" appearance="subtle" inset>
            Complete
          </FDivider>
        </div>

        <div class="divider-vertical-row">
          <FText>Previous</FText>
          <FDivider class="divider-vertical-childless" vertical aria-label="Page boundary" />
          <FText>Current</FText>
          <FDivider class="divider-vertical-content" vertical appearance="brand"> OR </FDivider>
          <FText>Next</FText>
        </div>
      </div>
    </section>

    <section id="image">
      <h2>Image</h2>
      <div class="image-samples">
        <div class="image-grid image-shape-grid">
          <figure>
            <FImage
              class="image-square"
              :src="imageFixture"
              alt="Abstract blue landscape with a yellow sun"
              width="160"
              height="112"
            />
            <figcaption>Square</figcaption>
          </figure>
          <figure>
            <FImage
              class="image-rounded"
              :src="imageFixture"
              alt="Abstract blue landscape with a yellow sun"
              shape="rounded"
              width="160"
              height="112"
            />
            <figcaption>Rounded</figcaption>
          </figure>
          <figure>
            <FImage
              class="image-circular"
              :src="imageFixture"
              alt="Abstract blue landscape with a yellow sun"
              shape="circular"
              width="112"
              height="112"
            />
            <figcaption>Circular</figcaption>
          </figure>
          <figure>
            <FImage
              class="image-decorated"
              :src="imageFixture"
              alt=""
              bordered
              shadow
              shape="rounded"
              width="160"
              height="112"
            />
            <figcaption>Decorative, bordered, and shadowed</figcaption>
          </figure>
        </div>

        <div class="image-block-frame">
          <FImage
            class="image-block"
            :src="imageFixture"
            alt="Wide abstract landscape filling its container"
            block
            height="88"
            fit="cover"
            shape="rounded"
          />
        </div>

        <div class="image-grid image-fit-grid">
          <figure
            v-for="fit in ['default', 'none', 'center', 'contain', 'cover'] as const"
            :key="fit"
          >
            <div class="image-fit-frame">
              <FImage
                :class="`image-fit-${fit}`"
                :src="imageFixture"
                :alt="`Abstract landscape using ${fit} image fit`"
                :fit="fit"
                width="144"
                height="104"
              />
            </div>
            <figcaption>{{ fit }}</figcaption>
          </figure>
          <figure>
            <div class="image-fit-frame image-fit-fill-frame">
              <FImage
                class="image-fit-fill"
                :src="imageFixture"
                alt="Abstract landscape filling inferred dimensions"
                fit="cover"
              />
            </div>
            <figcaption>cover with inferred fill dimensions</figcaption>
          </figure>
        </div>

        <div class="image-failure-frame">
          <FImage
            class="image-native-failure"
            :src="missingImageFixture"
            alt="Unavailable image example"
            width="160"
            height="72"
          />
        </div>
      </div>
    </section>

    <section id="badge">
      <h2>Badge</h2>
      <div class="badge-samples">
        <div class="badge-group">
          <h3>Appearances</h3>
          <div class="row badge-matrix">
            <FBadge appearance="filled">Filled</FBadge>
            <FBadge appearance="ghost" color="danger">Ghost</FBadge>
            <FBadge appearance="outline" color="success">Outline</FBadge>
            <FBadge appearance="tint" color="warning">Tint</FBadge>
          </div>
        </div>

        <div class="badge-group">
          <h3>Colors</h3>
          <div class="row badge-matrix">
            <FBadge
              v-for="color in [
                'brand',
                'danger',
                'important',
                'informative',
                'severe',
                'subtle',
                'success',
                'warning',
              ] as const"
              :key="color"
              :color="color"
            >
              {{ color }}
            </FBadge>
          </div>
        </div>

        <div class="badge-group">
          <h3>Sizes and shapes</h3>
          <div class="row badge-matrix badge-size-matrix">
            <FBadge
              v-for="size in [
                'tiny',
                'extra-small',
                'small',
                'medium',
                'large',
                'extra-large',
              ] as const"
              :key="size"
              :class="`badge-size-${size}`"
              :size="size"
            >
              {{ size === 'tiny' || size === 'extra-small' ? '' : size }}
            </FBadge>
          </div>
          <div class="row badge-matrix">
            <FBadge shape="circular">Circular</FBadge>
            <FBadge shape="rounded" color="informative">Rounded</FBadge>
            <FBadge shape="square" color="important">Square</FBadge>
          </div>
        </div>

        <div class="badge-group">
          <h3>Icon order</h3>
          <div class="row badge-matrix">
            <FBadge class="badge-icon-before" appearance="tint">
              <template #icon>
                <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">
                  <path
                    d="M10 2 12.2 7l5.3.5-4 3.5 1.2 5.2-4.7-2.7-4.7 2.7L6.5 11l-4-3.5L7.8 7 10 2Z"
                  />
                </svg>
              </template>
              Before
            </FBadge>
            <FBadge class="badge-icon-after" appearance="tint" icon-position="after">
              <template #icon>
                <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">
                  <path
                    d="M10 2 12.2 7l5.3.5-4 3.5 1.2 5.2-4.7-2.7-4.7 2.7L6.5 11l-4-3.5L7.8 7 10 2Z"
                  />
                </svg>
              </template>
              After
            </FBadge>
            <FBadge class="badge-icon-only" role="img" aria-label="Favorite" size="large">
              <template #icon>
                <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20">
                  <path
                    d="M10 2 12.2 7l5.3.5-4 3.5 1.2 5.2-4.7-2.7-4.7 2.7L6.5 11l-4-3.5L7.8 7 10 2Z"
                  />
                </svg>
              </template>
            </FBadge>
          </div>
        </div>

        <div class="badge-group">
          <h3>Counter badges</h3>
          <div class="row badge-matrix">
            <FCounterBadge
              class="counter-hidden-zero"
              role="img"
              aria-label="No unread notifications"
            />
            <FCounterBadge
              class="counter-show-zero"
              show-zero
              role="img"
              aria-label="Zero unread notifications"
            />
            <FCounterBadge :count="42" role="img" aria-label="42 unread notifications" />
            <FCounterBadge
              class="counter-overflow"
              :count="120"
              :overflow-count="99"
              role="img"
              aria-label="More than 99 unread notifications"
            />
            <FCounterBadge class="counter-dot" dot role="img" aria-label="New notification" />
            <FCounterBadge appearance="ghost" color="danger" :count="7" shape="rounded" />
            <FCounterBadge class="counter-custom" :count="12">Custom</FCounterBadge>
          </div>
        </div>

        <div class="badge-group">
          <h3>Presence badges</h3>
          <div class="row badge-matrix presence-status-matrix">
            <FPresenceBadge
              v-for="status in [
                'available',
                'away',
                'busy',
                'do-not-disturb',
                'blocked',
                'offline',
                'out-of-office',
                'unknown',
              ] as const"
              :key="status"
              :class="`presence-${status}`"
              :status="status"
            />
          </div>
          <div class="row badge-matrix presence-size-matrix">
            <FPresenceBadge
              v-for="size in [
                'tiny',
                'extra-small',
                'small',
                'medium',
                'large',
                'extra-large',
              ] as const"
              :key="size"
              :class="`presence-size-${size}`"
              :size="size"
              status="available"
              :aria-label="`available ${size}`"
            />
            <FPresenceBadge status="away" out-of-office />
            <FPresenceBadge status="do-not-disturb" out-of-office />
            <FPresenceBadge
              class="presence-custom-label"
              status="available"
              aria-label="Available for pair programming"
            />
            <FPresenceBadge
              class="presence-custom-icon"
              status="available"
              aria-label="Custom online status"
            >
              <template #icon>
                <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16">
                  <rect x="1" y="1" width="14" height="14" rx="7" fill="currentColor" />
                  <path d="m4.5 8 2 2 5-5" fill="none" stroke="white" stroke-width="1.5" />
                </svg>
              </template>
            </FPresenceBadge>
          </div>
        </div>

        <div
          class="badge-group badge-consumer-overrides"
          style="--fui-color-brand-background: rgb(92, 45, 145)"
        >
          <h3>Consumer token overrides</h3>
          <div class="row badge-matrix">
            <FBadge class="badge-token-override">Override</FBadge>
            <FCounterBadge class="counter-token-override" :count="3" />
          </div>
        </div>
      </div>
    </section>

    <section id="spinner">
      <h2>Spinner</h2>
      <div class="spinner-samples">
        <div class="spinner-group">
          <h3>Label positions</h3>
          <div class="spinner-position-grid">
            <FSpinner
              v-for="position in ['above', 'below', 'before', 'after'] as const"
              :key="position"
              :class="`spinner-position-${position}`"
              :label="position"
              :label-position="position"
            />
          </div>
        </div>

        <div class="spinner-group">
          <h3>Sizes</h3>
          <div class="spinner-size-grid">
            <FSpinner
              v-for="size in [
                'extra-tiny',
                'tiny',
                'extra-small',
                'small',
                'medium',
                'large',
                'extra-large',
                'huge',
              ] as const"
              :key="size"
              :class="`spinner-size-${size}`"
              :label="size"
              :size="size"
            />
          </div>
        </div>

        <div class="spinner-group">
          <h3>Appearance, root, delay, and indicator slot</h3>
          <div class="spinner-feature-grid">
            <FSpinner class="spinner-primary" label="Primary spinner" />
            <div class="spinner-inverted-surface">
              <FSpinner appearance="inverted" label="Inverted spinner" />
            </div>
            <FSpinner
              as="span"
              class="spinner-span-root"
              label="Inline span spinner"
              size="small"
            />
            <FSpinner
              class="spinner-delayed"
              :delay="1200"
              aria-label="Delayed spinner"
              label="Delayed spinner"
              size="extra-small"
            />
            <FSpinner class="spinner-custom-indicator" label="Custom indicator">
              <template #indicator>
                <span class="spinner-custom-indicator-shape"></span>
              </template>
            </FSpinner>
          </div>
        </div>
      </div>
    </section>

    <section id="progress-bar">
      <h2>ProgressBar</h2>
      <div class="progress-bar-samples">
        <div class="progress-bar-group">
          <h3>Determinate colors and values</h3>
          <div class="progress-bar-stack">
            <FProgressBar
              v-for="color in ['brand', 'error', 'warning', 'success'] as const"
              :key="color"
              :class="`progress-bar-color-${color}`"
              :value="
                color === 'brand' ? 0.25 : color === 'error' ? 0.5 : color === 'warning' ? 0.75 : 1
              "
              :color="color"
              :aria-label="`${color} progress`"
            />
            <FProgressBar
              class="progress-bar-custom-max"
              :value="36"
              :max="100"
              aria-label="Custom maximum progress"
            />
          </div>
        </div>

        <div class="progress-bar-group">
          <h3>Shapes, thicknesses, and indeterminate motion</h3>
          <div class="progress-bar-stack">
            <FProgressBar
              class="progress-bar-rounded-medium"
              :value="0.42"
              aria-label="Rounded medium progress"
            />
            <FProgressBar
              class="progress-bar-square-large"
              :value="0.68"
              shape="square"
              thickness="large"
              aria-label="Square large progress"
            />
            <FProgressBar class="progress-bar-indeterminate" aria-label="Indeterminate progress" />
            <FProgressBar
              class="progress-bar-indeterminate-static"
              :indeterminate-motion="false"
              aria-label="Indeterminate progress without motion"
            />
          </div>
        </div>

        <div class="progress-bar-group">
          <h3>Field validation integration</h3>
          <div class="progress-bar-field-grid">
            <FField label="Upload" hint="Uploading three account files.">
              <FProgressBar class="progress-bar-field-default" :value="0.62" />
            </FField>
            <FField label="Profile import" validation-message="Two records could not be imported.">
              <FProgressBar class="progress-bar-field-error" :value="0.38" thickness="large" />
            </FField>
            <FField
              label="Storage migration"
              validation-state="warning"
              validation-message="Migration is taking longer than expected."
            >
              <FProgressBar class="progress-bar-field-warning" :value="0.84" />
            </FField>
            <FField
              label="Account setup"
              validation-state="success"
              validation-message="Account setup is complete."
            >
              <FProgressBar class="progress-bar-field-success" :value="1" />
            </FField>
          </div>
        </div>
      </div>
    </section>

    <section id="switch">
      <h2>Switch</h2>
      <div class="switch-samples">
        <div class="switch-group">
          <h3>Label positions and sizes</h3>
          <div class="switch-position-grid">
            <FSwitch
              v-for="position in ['before', 'above', 'after'] as const"
              :key="position"
              :class="`switch-position-${position}`"
              :label="`${position} label`"
              :label-position="position"
              default-checked
            />
          </div>
          <div class="row switch-size-row">
            <FSwitch class="switch-size-small" size="small" label="Small" />
            <FSwitch class="switch-size-medium" label="Medium" default-checked />
          </div>
        </div>

        <div class="switch-group">
          <h3>State, disabled behavior, and label wrapping</h3>
          <div class="switch-state-grid">
            <FSwitch v-model="switchEnabled" class="switch-uncontrolled" label="Live setting" />
            <FSwitch
              class="switch-controlled-rollback"
              :model-value="controlledSwitch"
              label="Controlled rollback"
            />
            <FSwitch label="Disabled" disabled />
            <FSwitch label="Focusable disabled" disabled-focusable default-checked />
            <FSwitch
              class="switch-long-label"
              label="This concise demonstration label wraps while the switch track remains aligned with its first line."
            />
          </div>
          <small>
            Live setting: {{ switchEnabled }} · Controlled value: {{ controlledSwitch }}
          </small>
          <FButton size="small" @click="controlledSwitch = !controlledSwitch">
            Update controlled switch
          </FButton>
        </div>

        <form class="switch-form-demo">
          <FField
            class="switch-field-demo"
            label="Enable alerts"
            hint="This Switch receives its label, required state, and description from Field."
            required
          >
            <FSwitch name="alerts" value="enabled" />
          </FField>
          <FSwitch
            class="switch-resettable"
            default-checked
            label="Resettable switch"
            name="updates"
            value="enabled"
          />
          <FButton type="reset">Reset switch form</FButton>
        </form>
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
.divider-samples,
.image-samples,
.textarea-samples {
  display: grid;
  gap: 1rem;
}

.badge-samples,
.spinner-samples,
.progress-bar-samples,
.switch-samples {
  display: grid;
  gap: 1.5rem;
}

.badge-group,
.spinner-group,
.progress-bar-group,
.switch-group {
  display: grid;
  gap: 0.75rem;
}

.spinner-group h3,
.badge-group h3,
.progress-bar-group h3,
.switch-group h3 {
  margin: 0;
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-300);
}

.spinner-position-grid,
.spinner-size-grid,
.spinner-feature-grid {
  display: grid;
  align-items: center;
  gap: 1.25rem;
}

.spinner-position-grid {
  grid-template-columns: repeat(4, minmax(8rem, 1fr));
  min-height: 7.5rem;
}

.spinner-size-grid {
  grid-template-columns: repeat(4, minmax(10rem, 1fr));
}

.spinner-feature-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
}

.spinner-inverted-surface {
  display: grid;
  min-height: 5rem;
  padding: 1rem;
  color: var(--fui-color-neutral-foreground-static-inverted);
  background: var(--fui-color-brand-background);
  place-items: center;
}

.spinner-custom-indicator-shape {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 4px dotted currentcolor;
  border-radius: 50%;
}

.progress-bar-stack,
.progress-bar-field-grid {
  display: grid;
  gap: 1rem;
}

.progress-bar-stack {
  width: min(100%, 38rem);
  padding-block: 0.5rem;
}

.progress-bar-field-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}

.progress-bar-field-grid .fui-Field {
  align-content: start;
}

.switch-position-grid,
.switch-state-grid {
  display: grid;
  align-items: start;
  gap: 1rem;
}

.switch-position-grid {
  grid-template-columns: repeat(3, minmax(10rem, 1fr));
}

.switch-state-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), max-content));
}

.switch-size-row {
  min-height: 3rem;
}

.switch-long-label {
  width: min(100%, 20rem);
}

.switch-form-demo {
  display: grid;
  align-items: end;
  grid-template-columns: minmax(0, 24rem) minmax(12rem, max-content) max-content;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--fui-color-neutral-stroke-1);
}

.badge-matrix {
  margin-bottom: 0;
}

.badge-size-matrix {
  min-height: 2rem;
}

.badge-matrix svg {
  width: 1em;
  height: 1em;
  fill: currentcolor;
}

.badge-consumer-overrides {
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.divider-horizontal-samples {
  display: grid;
  gap: 1.25rem;
}

.divider-vertical-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 9rem;
}

.divider-vertical-childless {
  flex-grow: 0;
  height: 3rem;
}

.divider-vertical-content {
  flex-grow: 0;
  height: 7rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  gap: 1rem;
}

.image-samples {
  display: grid;
  gap: 1.5rem;
}

.image-samples figure {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  margin: 0;
}

.image-samples figcaption {
  color: var(--fui-color-neutral-foreground-3);
  font-size: var(--fui-font-size-base-200);
  text-align: center;
}

.image-shape-grid {
  align-items: start;
}

.image-block-frame {
  width: min(100%, 38rem);
  padding: 0.75rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.image-fit-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 9rem), 1fr));
}

.image-fit-frame {
  width: 144px;
  height: 104px;
  overflow: hidden;
  background: var(--fui-color-neutral-background-3);
  border: var(--fui-stroke-width-thin) dashed var(--fui-color-neutral-stroke-1);
}

.image-fit-fill-frame {
  width: 176px;
  height: 104px;
}

.image-failure-frame {
  display: grid;
  place-items: center;
  width: 176px;
  min-height: 88px;
  padding: 0.5rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
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
  .spinner-position-grid,
  .spinner-size-grid,
  .textarea-reset-demo {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FAccordion,
  FAccordionHeader,
  FAccordionItem,
  FAccordionPanel,
  FAvatar,
  FAvatarGroup,
  FAvatarGroupItem,
  FAvatarGroupPopover,
  FBadge,
  FBreadcrumb,
  FBreadcrumbButton,
  FBreadcrumbDivider,
  FBreadcrumbItem,
  FButton,
  FCard,
  FCardFooter,
  FCardHeader,
  FCardPreview,
  FCheckbox,
  FCompoundButton,
  FCounterBadge,
  FDivider,
  FField,
  FImage,
  FInput,
  FLabel,
  FLink,
  FList,
  FListItem,
  FPersona,
  FPresenceBadge,
  FProgressBar,
  FRating,
  FRatingDisplay,
  FRadio,
  FRadioGroup,
  FSkeleton,
  FSkeletonItem,
  FSlider,
  FSelect,
  FSearchBox,
  FSpinner,
  FSpinButton,
  FSwitch,
  FTab,
  FTabList,
  FText,
  FTextarea,
  FToggleButton,
  type CheckboxValue,
} from '../src';

const name = ref('Ada Lovelace');
const biography = ref('Vue-native Fluent components.');
const accepted = ref<CheckboxValue>(false);
const triState = ref<CheckboxValue>('mixed');
const selectedPet = ref('dog');
const lockedPet = ref('cat');
const controlledSpinValue = ref(10);
const controlledSpinDisplay = ref('$10.00');
const rollbackSpinValue = ref(4);
const spinFormData = ref('not submitted');
const searchQuery = ref('Fluent Vue');
const controlledSearch = 'Locked query';
const searchEventLog = ref('No search interaction yet.');
const dark = ref(false);
const switchEnabled = ref(false);
const controlledSwitch = ref(true);
const controlledRadio = ref('beta');
const standaloneRadio = ref(false);
const radioSubmission = ref('');
const sliderValue = ref(40);
const sliderControlled = ref(35);
const ratingValue = ref(3);
const controlledRatingValue = ref(2);
const controlledRatingAttempt = ref<number | null>(null);
const selectableCard = ref(false);
const controlledCard = ref(true);
const selectedTab = ref('overview');
const automaticTab = ref('activity');
const selectedListItems = ref<Array<string | number>>(['Ada']);
const avatarOverflowOpen = ref(false);
const toggleControlled = ref(true);
const toggleSubmitCount = ref(0);
const compoundSubmitCount = ref(0);
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

function captureRadioSubmission(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement;
  const value = new FormData(form).get('radio-form-choice');
  radioSubmission.value = typeof value === 'string' ? value : '';
}

function updateControlledSpin(value: number | null) {
  controlledSpinValue.value = value ?? 0;
  controlledSpinDisplay.value = `$${controlledSpinValue.value.toFixed(2)}`;
}

function submitSpinForm(event: Event) {
  const form = event.currentTarget as HTMLFormElement;
  spinFormData.value = String(new FormData(form).get('quantity'));
}

function ratingItemLabel(value: number) {
  return `${value} stars`;
}
</script>

<template>
  <main :class="['playground', dark ? 'fui-theme-dark' : 'fui-theme-light']">
    <header class="hero">
      <div>
        <p class="eyebrow">fluentui-vue · 0.1.0</p>
        <h1>Native Fluent components for Vue 3</h1>
        <p>
          Native Button, ToggleButton, Input, Checkbox, Text, Label, Field, Textarea, Link, Divider,
          Image, Badge, Spinner, ProgressBar, SpinButton, SearchBox, Switch, Radio, RadioGroup,
          Select, Skeleton, Slider, Rating, RatingDisplay, Card, Accordion, Tabs, Breadcrumb, List,
          and Avatar components translated from Fluent UI React v9 to Vue props, slots, emits, and
          semantic HTML.
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
              :delay="3000"
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

    <section id="spin-button">
      <h2>SpinButton</h2>
      <div class="spin-button-samples">
        <div class="spin-button-group">
          <h3>Appearances and sizes</h3>
          <div class="spin-button-grid">
            <FSpinButton
              v-for="appearance in [
                'outline',
                'underline',
                'filled-darker',
                'filled-lighter',
              ] as const"
              :key="appearance"
              :class="`spin-button-${appearance}`"
              :appearance="appearance"
              :aria-label="`${appearance} SpinButton`"
              :default-value="2"
            />
            <FSpinButton
              class="spin-button-small"
              size="small"
              aria-label="Small SpinButton"
              :default-value="3"
            />
          </div>
        </div>

        <div class="spin-button-group">
          <h3>Bounds, precision, and formatted controlled values</h3>
          <div class="spin-button-grid">
            <FSpinButton
              class="spin-button-bounded"
              aria-label="Bounded quantity"
              :default-value="5"
              :min="0"
              :max="20"
              :step="2"
              :step-page="10"
            />
            <FSpinButton
              class="spin-button-precision"
              aria-label="Precise amount"
              :default-value="0.1"
              :step="0.2"
            />
            <FSpinButton
              class="spin-button-formatted"
              :model-value="controlledSpinValue"
              :display-value="controlledSpinDisplay"
              aria-label="Formatted price"
              @update:model-value="updateControlledSpin"
            />
            <FSpinButton
              class="spin-button-controlled-rollback"
              :model-value="rollbackSpinValue"
              aria-label="Controlled rollback"
            />
          </div>
        </div>

        <div class="spin-button-group">
          <h3>Field, form, and states</h3>
          <div class="spin-button-field-grid">
            <FField label="Cases" hint="Use whole cases." required size="small">
              <FSpinButton class="spin-button-field" :default-value="1" :min="0" :max="12" />
            </FField>
            <FField label="Invalid quantity" validation-message="Choose a supported quantity.">
              <FSpinButton class="spin-button-invalid" :default-value="99" />
            </FField>
          </div>
          <form class="spin-button-form" @submit.prevent="submitSpinForm">
            <FSpinButton
              class="spin-button-form-control"
              name="quantity"
              aria-label="Resettable quantity"
              :default-value="2"
            />
            <FButton type="reset">Reset SpinButton form</FButton>
            <FButton type="submit">Submit SpinButton form</FButton>
            <output aria-live="polite">Submitted quantity: {{ spinFormData }}</output>
          </form>
          <div class="spin-button-grid spin-button-states">
            <FSpinButton aria-label="Disabled SpinButton" :default-value="1" disabled />
            <FSpinButton aria-label="Read-only SpinButton" :default-value="1" read-only />
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

    <section id="skeleton">
      <h2>Skeleton</h2>
      <div class="skeleton-samples">
        <div class="skeleton-group">
          <h3>Animations and appearances</h3>
          <div class="skeleton-feature-grid">
            <FSkeleton class="skeleton-card skeleton-wave-opaque" aria-label="Loading wave card">
              <FSkeletonItem shape="circle" :size="48" />
              <FSkeletonItem class="skeleton-line-long" />
              <FSkeletonItem class="skeleton-line-short" />
            </FSkeleton>
            <FSkeleton
              class="skeleton-card skeleton-wave-translucent"
              appearance="translucent"
              aria-label="Loading translucent wave card"
            >
              <FSkeletonItem shape="square" :size="48" />
              <FSkeletonItem class="skeleton-line-long" />
              <FSkeletonItem class="skeleton-line-short" />
            </FSkeleton>
            <FSkeleton
              class="skeleton-card skeleton-pulse-opaque"
              animation="pulse"
              aria-label="Loading pulse card"
            >
              <FSkeletonItem shape="circle" :size="48" />
              <FSkeletonItem class="skeleton-line-long" />
              <FSkeletonItem class="skeleton-line-short" />
            </FSkeleton>
            <FSkeleton
              class="skeleton-card skeleton-pulse-translucent"
              animation="pulse"
              appearance="translucent"
              aria-label="Loading translucent pulse card"
            >
              <FSkeletonItem shape="square" :size="48" />
              <FSkeletonItem class="skeleton-line-long" />
              <FSkeletonItem class="skeleton-line-short" />
            </FSkeleton>
          </div>
        </div>

        <div class="skeleton-group">
          <h3>Shapes and exact sizes</h3>
          <FSkeleton class="skeleton-shape-row" aria-label="Loading shape examples">
            <FSkeletonItem class="skeleton-size-circle" shape="circle" :size="64" />
            <FSkeletonItem class="skeleton-size-square" shape="square" :size="64" />
            <FSkeletonItem class="skeleton-size-rectangle" shape="rectangle" :size="64" />
          </FSkeleton>
          <FSkeleton class="skeleton-size-grid" aria-label="Loading size examples">
            <div
              v-for="size in [
                8, 12, 14, 16, 20, 22, 24, 28, 32, 36, 40, 48, 52, 56, 64, 72, 92, 96, 120, 128,
              ] as const"
              :key="size"
              class="skeleton-size-sample"
            >
              <FText :size="200">{{ size }}</FText>
              <FSkeletonItem :class="`skeleton-exact-size-${size}`" :size="size" />
            </div>
          </FSkeleton>
        </div>

        <div class="skeleton-group">
          <h3>Context, roots, width compatibility, and ARIA overrides</h3>
          <div class="skeleton-context-grid">
            <FSkeleton
              class="skeleton-context-parent"
              animation="pulse"
              appearance="translucent"
              :size="32"
              shape="circle"
              aria-label="Loading inherited items"
            >
              <FSkeletonItem class="skeleton-inherited-item" />
              <FSkeletonItem
                class="skeleton-overridden-item"
                animation="wave"
                appearance="opaque"
                :size="20"
                shape="square"
              />
              <FSkeleton class="skeleton-nested-context" aria-label="Loading nested item">
                <FSkeletonItem class="skeleton-nested-item" />
              </FSkeleton>
            </FSkeleton>
            <FSkeleton
              as="span"
              class="skeleton-span-root"
              role="status"
              :aria-busy="false"
              :width="240"
              aria-label="Custom skeleton status"
            >
              <FSkeletonItem as="span" class="skeleton-span-item" :size="24" />
            </FSkeleton>
          </div>
        </div>
      </div>
    </section>

    <section id="slider">
      <h2>Slider</h2>
      <div class="slider-samples">
        <div class="slider-group">
          <h3>Values and sizes</h3>
          <FField label="Volume" hint="Use arrow keys for single steps." size="small">
            <FSlider
              v-model="sliderValue"
              class="slider-volume"
              name="volume"
              :min="0"
              :max="100"
              :step="5"
            />
          </FField>
          <small>Volume: {{ sliderValue }}</small>
          <FSlider class="slider-medium" aria-label="Medium slider" :default-value="65" />
          <FSlider
            class="slider-small"
            aria-label="Small slider"
            :default-value="65"
            size="small"
          />
          <FSlider
            class="slider-decimal"
            aria-label="Decimal slider"
            :default-value="0.3"
            :min="-0.5"
            :max="0.5"
            :step="0.1"
          />
        </div>

        <div class="slider-group">
          <h3>Controlled, invalid, and disabled</h3>
          <FField
            class="slider-field-invalid"
            label="Brightness"
            hint="Controlled by Vue state."
            validation-message="Brightness needs review."
            size="small"
          >
            <FSlider v-model="sliderControlled" class="slider-controlled" />
          </FField>
          <div class="row slider-actions">
            <FButton type="button" size="small" @click="sliderControlled = 20">Set to 20</FButton>
            <FButton type="button" size="small" @click="sliderControlled = 80">Set to 80</FButton>
            <small>Controlled: {{ sliderControlled }}</small>
          </div>
          <FSlider
            class="slider-controlled-rollback"
            aria-label="Controlled rollback slider"
            :model-value="35"
          />
          <FSlider
            class="slider-disabled"
            aria-label="Disabled slider"
            :default-value="45"
            disabled
          />
        </div>

        <div class="slider-group slider-orientation-group">
          <h3>Orientation and RTL</h3>
          <div class="slider-orientation-row">
            <FSlider
              class="slider-horizontal-geometry"
              aria-label="Horizontal geometry slider"
              :default-value="25"
              :min="0"
              :max="100"
              :step="25"
            />
            <FSlider
              class="slider-vertical-geometry"
              aria-label="Vertical geometry slider"
              :default-value="25"
              :min="0"
              :max="100"
              :step="25"
              vertical
            />
            <div class="slider-rtl-surface" dir="rtl">
              <FSlider
                class="slider-rtl"
                aria-label="RTL slider"
                :default-value="25"
                :min="0"
                :max="100"
                :step="25"
              />
            </div>
          </div>
        </div>

        <form class="slider-reset-demo">
          <FField label="Resettable level" hint="Submitted as the native level field.">
            <FSlider class="slider-resettable" name="level" :default-value="30" />
          </FField>
          <FButton type="reset">Reset slider form</FButton>
        </form>
      </div>
    </section>

    <section id="toggle-button">
      <h2>ToggleButton</h2>
      <div class="toggle-button-samples">
        <div class="toggle-button-group">
          <h3>Pressed appearances and accessible selection</h3>
          <div class="toggle-button-grid">
            <FToggleButton
              v-for="appearance in [
                'secondary',
                'primary',
                'outline',
                'subtle',
                'transparent',
              ] as const"
              :key="appearance"
              :class="`toggle-${appearance}`"
              :appearance="appearance"
              default-checked
            >
              {{ appearance }} pinned
            </FToggleButton>
            <FToggleButton
              class="toggle-accessible"
              appearance="primary"
              default-checked
              is-accessible
            >
              Accessible selected
            </FToggleButton>
          </div>
        </div>

        <div class="toggle-button-group">
          <h3>Controlled state, geometry, and icons</h3>
          <div class="toggle-button-grid">
            <FToggleButton v-model="toggleControlled" class="toggle-controlled">
              Controlled pin
            </FToggleButton>
            <FToggleButton class="toggle-small" size="small">Small toggle</FToggleButton>
            <FToggleButton class="toggle-large" size="large">Large toggle</FToggleButton>
            <FToggleButton class="toggle-circular" shape="circular">Circular toggle</FToggleButton>
            <FToggleButton class="toggle-square" shape="square">Square toggle</FToggleButton>
            <FToggleButton class="toggle-icon-before" default-checked>
              <template #icon>
                <span class="toggle-dual-icon">
                  <svg class="fui-Icon-regular" viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" />
                  </svg>
                  <svg class="fui-Icon-filled" viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="10" cy="10" r="6" fill="currentColor" />
                  </svg>
                </span>
              </template>
              Before icon
            </FToggleButton>
            <FToggleButton class="toggle-icon-after" icon-position="after">
              <template #icon>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4 10h12M10 4v12" fill="none" stroke="currentColor" />
                </svg>
              </template>
              After icon
            </FToggleButton>
            <FToggleButton class="toggle-icon-only" aria-label="Toggle favorite">
              <template #icon>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="m10 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8Z"
                  />
                </svg>
              </template>
            </FToggleButton>
          </div>
          <output aria-live="polite">Controlled toggle: {{ toggleControlled }}</output>
        </div>

        <div class="toggle-button-group">
          <h3>Native form and disabled behavior</h3>
          <form
            id="toggle-target-form"
            class="toggle-button-form"
            @submit.prevent="toggleSubmitCount += 1"
          >
            <FToggleButton class="toggle-default-type" name="default-action" value="default">
              Default type
            </FToggleButton>
            <FToggleButton
              class="toggle-submit"
              type="submit"
              name="toggle-action"
              value="submitted"
              form="toggle-target-form"
            >
              Submit toggle form
            </FToggleButton>
            <FToggleButton class="toggle-disabled" type="submit" disabled>
              Disabled toggle
            </FToggleButton>
            <FToggleButton class="toggle-disabled-focusable" disabled-focusable>
              Focusable disabled toggle
            </FToggleButton>
            <FToggleButton class="toggle-both-disabled" disabled disabled-focusable>
              Both disabled toggle
            </FToggleButton>
            <output aria-live="polite">Toggle submissions: {{ toggleSubmitCount }}</output>
          </form>
          <div class="toggle-rtl-surface" dir="rtl">
            <FToggleButton class="toggle-rtl-icon">
              <template #icon>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12" /></svg>
              </template>
              RTL icon toggle
            </FToggleButton>
          </div>
        </div>
      </div>
    </section>

    <section id="card">
      <h2>Card</h2>
      <div class="card-samples">
        <div class="card-group">
          <h3>Appearances, sizes, and parts</h3>
          <div class="card-grid">
            <FCard
              v-for="appearance in ['filled', 'filled-alternative', 'outline', 'subtle'] as const"
              :key="appearance"
              :class="`card-appearance-${appearance}`"
              :appearance="appearance"
              :aria-label="`${appearance} card`"
            >
              <FCardPreview>
                <FImage
                  :src="imageFixture"
                  :alt="`${appearance} project preview`"
                  block
                  height="96"
                  fit="cover"
                />
                <template #logo><FBadge appearance="tint">Vue</FBadge></template>
              </FCardPreview>
              <FCardHeader>
                <template #image
                  ><FBadge>{{ appearance.slice(0, 1).toUpperCase() }}</FBadge></template
                >
                <template #header
                  ><h3>{{ appearance }}</h3></template
                >
                <template #description><span>Complete Card part composition</span></template>
                <template #action
                  ><FButton size="small" appearance="subtle">More</FButton></template
                >
              </FCardHeader>
              <p>Preview, header, description, action, body, footer, and logo slots.</p>
              <FCardFooter>
                <FButton size="small" appearance="primary">Open</FButton>
                <template #action><FLink href="#card">Details</FLink></template>
              </FCardFooter>
            </FCard>
          </div>
          <div class="card-size-row">
            <FCard
              v-for="size in ['small', 'medium', 'large'] as const"
              :key="size"
              :size="size"
              :aria-label="`${size} card`"
            >
              <strong>{{ size }}</strong
              ><span>Size</span>
            </FCard>
          </div>
        </div>

        <div class="card-group">
          <h3>Selection, forms, nested actions, and disabled state</h3>
          <form class="card-form-demo">
            <FCard
              v-model="selectableCard"
              class="card-selectable"
              name="selected-report"
              value="quarterly"
            >
              <FCardHeader>
                <template #header><h3>Quarterly report</h3></template>
                <template #description><span>Selectable native checkbox card</span></template>
              </FCardHeader>
              <FButton class="card-nested-action" size="small" @click.prevent
                >Nested action</FButton
              >
            </FCard>
            <FCard
              :model-value="controlledCard"
              class="card-controlled-rollback"
              name="locked-report"
              value="locked"
            >
              <FCardHeader
                ><template #header><h3>Controlled report</h3></template></FCardHeader
              >
              <span>Selection rolls back until the parent updates.</span>
            </FCard>
            <FCard
              class="card-disabled"
              default-selected
              disabled
              aria-label="Disabled selected card"
            >
              <FCardHeader
                ><template #header><h3>Disabled selected card</h3></template></FCardHeader
              >
            </FCard>
            <div class="row">
              <FButton type="reset">Reset card form</FButton>
              <FButton type="button" size="small" @click="controlledCard = !controlledCard"
                >Update controlled card</FButton
              >
              <small>Selectable: {{ selectableCard }} · Controlled: {{ controlledCard }}</small>
            </div>
          </form>
        </div>

        <div class="card-group">
          <h3>Focus modes, semantic roots, horizontal and RTL layouts</h3>
          <div class="card-focus-grid">
            <FCard
              v-for="mode in ['off', 'no-tab', 'tab-exit', 'tab-only'] as const"
              :key="mode"
              :class="`card-focus-${mode}`"
              :focus-mode="mode"
              :aria-label="`${mode} focus card`"
            >
              <strong>{{ mode }}</strong>
              <FButton size="small">First action</FButton>
              <FLink href="#card">Second action</FLink>
            </FCard>
          </div>
          <FCard as="article" class="card-semantic-article" aria-label="Article card">
            <FCardHeader
              ><template #header><h3>Article root</h3></template></FCardHeader
            >
          </FCard>
          <div dir="rtl" class="card-rtl-surface">
            <FCard
              orientation="horizontal"
              class="card-horizontal-rtl"
              aria-label="RTL horizontal card"
            >
              <FCardPreview
                ><FImage
                  :src="imageFixture"
                  alt="RTL project preview"
                  width="120"
                  height="96"
                  fit="cover"
              /></FCardPreview>
              <FCardHeader>
                <template #header><h3>RTL horizontal</h3></template>
                <template #description
                  ><span>Logical preview and floating-action placement</span></template
                >
              </FCardHeader>
            </FCard>
          </div>
        </div>
      </div>
    </section>

    <section id="accordion">
      <h2>Accordion</h2>
      <div class="accordion-samples">
        <FAccordion class="accordion-single" default-open-items="overview">
          <FAccordionItem value="overview">
            <FAccordionHeader as="h3">Overview</FAccordionHeader>
            <FAccordionPanel
              >Accordion uses native buttons with stable disclosure relationships.</FAccordionPanel
            >
          </FAccordionItem>
          <FAccordionItem value="details">
            <FAccordionHeader as="h3" expand-icon-position="end">Details</FAccordionHeader>
            <FAccordionPanel
              >The final item remains open unless collapsible is enabled.</FAccordionPanel
            >
          </FAccordionItem>
          <FAccordionItem value="disabled" disabled>
            <FAccordionHeader as="h3">Disabled section</FAccordionHeader>
            <FAccordionPanel>This content cannot be opened.</FAccordionPanel>
          </FAccordionItem>
        </FAccordion>
        <FAccordion class="accordion-multiple" multiple collapsible :default-open-items="['one']">
          <FAccordionItem value="one">
            <FAccordionHeader size="small">First collapsible item</FAccordionHeader>
            <FAccordionPanel>Multiple panels can remain open.</FAccordionPanel>
          </FAccordionItem>
          <FAccordionItem value="two">
            <FAccordionHeader size="large">
              <template #icon>ⓘ</template>
              Second collapsible item
            </FAccordionHeader>
            <FAccordionPanel>All panels may also be closed.</FAccordionPanel>
          </FAccordionItem>
        </FAccordion>
      </div>
    </section>

    <section id="tabs">
      <h2>Tabs</h2>
      <div class="tab-samples">
        <div>
          <h3>Controlled horizontal tabs</h3>
          <FTabList v-model="selectedTab" aria-label="Project sections">
            <FTab value="overview">
              <template #icon>◫</template>
              Overview
            </FTab>
            <FTab value="activity">
              <template #icon>◷</template>
              Activity
            </FTab>
            <FTab value="settings" disabled>Settings</FTab>
          </FTabList>
          <p>Selected tab: {{ selectedTab }}</p>
        </div>
        <div>
          <h3>Vertical automatic activation</h3>
          <FTabList
            v-model="automaticTab"
            vertical
            select-tab-on-focus
            appearance="subtle"
            size="small"
            aria-label="Automatic sections"
          >
            <FTab value="activity">Activity</FTab>
            <FTab value="mentions">Mentions</FTab>
            <FTab value="files">Files</FTab>
          </FTabList>
        </div>
        <div>
          <h3>Circular appearances and sizes</h3>
          <FTabList
            class="tab-circular"
            appearance="filled-circular"
            size="large"
            default-selected-value="home"
            aria-label="Circular navigation"
          >
            <FTab value="home">Home</FTab>
            <FTab value="favorites">Favorites</FTab>
            <FTab value="icon-only" aria-label="Notifications">
              <template #icon>●</template>
            </FTab>
          </FTabList>
        </div>
      </div>
    </section>

    <section id="breadcrumb">
      <h2>Breadcrumb</h2>
      <div class="breadcrumb-samples">
        <div>
          <h3>Tab navigation</h3>
          <FBreadcrumb aria-label="Project breadcrumb">
            <FBreadcrumbItem>
              <FBreadcrumbButton href="#workspace">
                <template #icon>⌂</template>
                Workspace
              </FBreadcrumbButton>
            </FBreadcrumbItem>
            <FBreadcrumbDivider />
            <FBreadcrumbItem
              ><FBreadcrumbButton href="#projects">Projects</FBreadcrumbButton></FBreadcrumbItem
            >
            <FBreadcrumbDivider />
            <FBreadcrumbItem
              ><FBreadcrumbButton current>Fluent Vue</FBreadcrumbButton></FBreadcrumbItem
            >
          </FBreadcrumb>
        </div>
        <div>
          <h3>Arrow navigation and sizes</h3>
          <FBreadcrumb
            class="breadcrumb-arrow"
            focus-mode="arrow"
            size="large"
            aria-label="Arrow breadcrumb"
          >
            <FBreadcrumbItem
              ><FBreadcrumbButton href="#home">Home</FBreadcrumbButton></FBreadcrumbItem
            >
            <FBreadcrumbDivider />
            <FBreadcrumbItem
              ><FBreadcrumbButton disabled>Disabled</FBreadcrumbButton></FBreadcrumbItem
            >
            <FBreadcrumbDivider />
            <FBreadcrumbItem>
              <FBreadcrumbButton disabled-focusable>Focusable disabled</FBreadcrumbButton>
            </FBreadcrumbItem>
            <FBreadcrumbDivider />
            <FBreadcrumbItem
              ><FBreadcrumbButton current>Current page</FBreadcrumbButton></FBreadcrumbItem
            >
          </FBreadcrumb>
        </div>
        <div dir="rtl">
          <h3>RTL divider</h3>
          <FBreadcrumb size="small" aria-label="RTL breadcrumb">
            <FBreadcrumbItem
              ><FBreadcrumbButton href="#rtl-home">الرئيسية</FBreadcrumbButton></FBreadcrumbItem
            >
            <FBreadcrumbDivider />
            <FBreadcrumbItem
              ><FBreadcrumbButton current>المشروع</FBreadcrumbButton></FBreadcrumbItem
            >
          </FBreadcrumb>
        </div>
      </div>
    </section>

    <section id="list">
      <h2>List</h2>
      <div class="list-samples">
        <div>
          <h3>Semantic content list</h3>
          <FList class="list-default" aria-label="Continents">
            <FListItem>Asia</FListItem>
            <FListItem>Africa</FListItem>
            <FListItem>Europe</FListItem>
          </FList>
        </div>
        <div>
          <h3>Controlled multiselect</h3>
          <FList
            v-model="selectedListItems"
            class="list-selection"
            selection-mode="multiselect"
            aria-label="People list"
          >
            <FListItem value="Ada" aria-label="Ada">Ada Lovelace</FListItem>
            <FListItem value="Grace" aria-label="Grace">Grace Hopper</FListItem>
            <FListItem value="Linus" aria-label="Linus" disabled-selection>
              Linus Torvalds · selection disabled
            </FListItem>
          </FList>
          <small>Selected people: {{ selectedListItems.join(', ') || 'none' }}</small>
        </div>
        <div>
          <h3>Composite actions</h3>
          <FList class="list-composite" navigation-mode="composite" aria-label="Project actions">
            <FListItem value="roadmap" aria-label="Roadmap project">
              <div class="list-gridcell" role="gridcell">
                <span class="list-primary">Roadmap</span>
                <FButton size="small">Open</FButton>
                <FButton size="small" appearance="subtle" aria-label="More Roadmap actions"
                  >•••</FButton
                >
              </div>
            </FListItem>
            <FListItem value="release" aria-label="Release project">
              <div class="list-gridcell" role="gridcell">
                <span class="list-primary">Release</span>
                <FButton size="small">Open</FButton>
                <FButton size="small" appearance="subtle" aria-label="More Release actions"
                  >•••</FButton
                >
              </div>
            </FListItem>
          </FList>
        </div>
      </div>
    </section>

    <section id="avatar">
      <h2>Avatar</h2>
      <div class="avatar-samples">
        <div>
          <h3>Fallbacks, color, activity, and presence</h3>
          <div class="avatar-row">
            <FAvatar name="Ada Lovelace" color="colorful" />
            <FAvatar name="Grace Hopper" color="brand" shape="square" :size="40" />
            <FAvatar
              name="Linus Torvalds"
              color="forest"
              active="active"
              active-appearance="ring-shadow"
              :presence="{ status: 'available' }"
              :size="48"
            />
            <FAvatar aria-label="Anonymous person" :size="56" />
          </div>
        </div>
        <div>
          <h3>Spread and stacked groups</h3>
          <FAvatarGroup class="avatar-spread" aria-label="Design team">
            <FAvatarGroupItem name="Ada Lovelace" />
            <FAvatarGroupItem name="Grace Hopper" />
            <FAvatarGroupItem name="Margaret Hamilton" />
          </FAvatarGroup>
          <FAvatarGroup
            class="avatar-stack"
            layout="stack"
            :size="40"
            aria-label="Engineering team"
          >
            <FAvatarGroupItem name="Linus Torvalds" />
            <FAvatarGroupItem name="Barbara Liskov" />
            <FAvatarGroupItem name="Edsger Dijkstra" />
            <FAvatarGroupPopover v-model="avatarOverflowOpen" :count="3">
              <FAvatarGroupItem name="Radia Perlman" />
              <FAvatarGroupItem name="Donald Knuth" />
              <FAvatarGroupItem name="Frances Allen" />
            </FAvatarGroupPopover>
          </FAvatarGroup>
          <small>Overflow popover: {{ avatarOverflowOpen ? 'open' : 'closed' }}</small>
        </div>
        <div>
          <h3>Pie layout</h3>
          <FAvatarGroup
            class="avatar-pie"
            layout="pie"
            :size="48"
            aria-label="Project contributors"
          >
            <FAvatarGroupItem name="Katherine Johnson" />
            <FAvatarGroupItem name="Dorothy Vaughan" />
            <FAvatarGroupItem name="Mary Jackson" />
            <FAvatarGroupPopover :count="5">
              <FAvatarGroupItem name="Katherine Johnson" />
              <FAvatarGroupItem name="Dorothy Vaughan" />
              <FAvatarGroupItem name="Mary Jackson" />
              <FAvatarGroupItem name="Christine Darden" />
              <FAvatarGroupItem name="Annie Easley" />
            </FAvatarGroupPopover>
          </FAvatarGroup>
        </div>
      </div>
    </section>

    <section id="persona">
      <h2>Persona</h2>
      <div class="persona-samples">
        <div>
          <h3>Identity and text hierarchy</h3>
          <FPersona
            name="Ada Lovelace"
            :avatar="{ color: 'colorful' }"
            :presence="{ status: 'available' }"
          >
            <template #secondaryText>Mathematician</template>
            <template #tertiaryText>London, United Kingdom</template>
            <template #quaternaryText>Available</template>
          </FPersona>
          <FPersona
            name="Grace Hopper"
            size="extra-large"
            :avatar="{ color: 'brand', shape: 'square' }"
            :presence="{ status: 'busy' }"
          >
            <template #secondaryText>Rear admiral and computer scientist</template>
          </FPersona>
        </div>
        <div>
          <h3>Position and alignment</h3>
          <div class="persona-layouts">
            <FPersona name="Katherine Johnson" text-position="before" text-alignment="center">
              <template #secondaryText>Orbital mechanics</template>
              <template #tertiaryText>NASA</template>
            </FPersona>
            <FPersona
              name="Dorothy Vaughan"
              size="large"
              text-position="below"
              text-alignment="center"
            >
              <template #secondaryText>Human computer</template>
            </FPersona>
          </div>
        </div>
        <div>
          <h3>Presence only</h3>
          <div class="persona-layouts">
            <FPersona
              name="Margaret Hamilton"
              presence-only
              :presence="{ status: 'do-not-disturb', outOfOffice: true }"
            >
              <template #secondaryText>Software engineering lead</template>
            </FPersona>
            <FPersona name="Radia Perlman" presence-only size="huge" text-alignment="center">
              <template #presence>
                <FPresenceBadge status="away" size="large" aria-label="Custom away status" />
              </template>
              <template #secondaryText>Network engineer</template>
              <template #tertiaryText>Inventor of spanning tree protocol</template>
            </FPersona>
          </div>
        </div>
      </div>
    </section>

    <section id="radio">
      <h2>Radio</h2>
      <div class="radio-samples">
        <div class="radio-group-sample radio-native-selection">
          <h3>Native common-name selection and keyboard navigation</h3>
          <FRadioGroup name="radio-native-choice" default-value="alpha" aria-label="Native choices">
            <FRadio value="alpha" label="Alpha" />
            <FRadio value="beta" label="Beta" />
            <FRadio value="gamma" label="Gamma" />
          </FRadioGroup>
        </div>

        <div class="radio-group-sample radio-controlled-group">
          <h3>Controlled group</h3>
          <FRadioGroup v-model="controlledRadio" name="radio-controlled-choice" layout="horizontal">
            <FRadio value="alpha" label="Alpha" />
            <FRadio value="beta" label="Beta" />
            <FRadio value="gamma" label="Gamma" />
          </FRadioGroup>
          <small>Controlled value: {{ controlledRadio }}</small>
        </div>

        <div class="radio-group-sample radio-controlled-rollback">
          <h3>Controlled rollback</h3>
          <FRadioGroup
            model-value="alpha"
            name="radio-rollback-choice"
            aria-label="Rollback choices"
          >
            <FRadio value="alpha" label="Locked Alpha" />
            <FRadio value="beta" label="Attempt Beta" />
          </FRadioGroup>
        </div>

        <div class="radio-group-sample radio-standalone-sample">
          <h3>Standalone radios</h3>
          <div class="row">
            <FRadio
              v-model="standaloneRadio"
              value="controlled-standalone"
              label="Controlled standalone"
            />
            <FRadio :model-value="false" value="rollback-standalone" label="Locked standalone" />
          </div>
          <small>Standalone value: {{ standaloneRadio }}</small>
        </div>

        <FField
          class="radio-field-demo"
          label="Preferred contact"
          hint="Choose how the team should contact you."
          validation-message="A contact method is required."
          required
        >
          <FRadioGroup name="radio-field-choice" layout="horizontal">
            <FRadio value="email" label="Email" />
            <FRadio value="chat" label="Chat" />
            <FRadio value="phone" label="Phone" />
          </FRadioGroup>
        </FField>

        <div class="radio-group-sample">
          <h3>Layouts, labels, disabled, and RTL-safe spacing</h3>
          <FRadioGroup
            class="radio-stacked-layout"
            name="radio-stacked-choice"
            layout="horizontal-stacked"
            default-value="one"
            aria-label="Stacked choices"
          >
            <FRadio value="one" label="One" />
            <FRadio value="two" label="Two" />
            <FRadio value="three" label="Three" />
          </FRadioGroup>
          <div class="row radio-state-row">
            <FRadio value="after" name="radio-label-after" label="Label after" />
            <FRadio
              value="below"
              name="radio-label-below"
              label="Label below"
              label-position="below"
            />
            <FRadio value="disabled" name="radio-disabled" label="Disabled" disabled />
            <FRadio
              value="disabled-checked"
              name="radio-disabled-checked"
              label="Disabled checked"
              disabled
              default-checked
            />
          </div>
        </div>

        <form class="radio-form-demo" @submit.prevent="captureRadioSubmission">
          <FRadioGroup name="radio-form-choice" default-value="email" aria-label="Form choices">
            <FRadio value="email" label="Email receipt" />
            <FRadio value="paper" label="Paper receipt" />
          </FRadioGroup>
          <div class="row">
            <FButton type="submit">Submit radio form</FButton>
            <FButton type="reset">Reset radio form</FButton>
          </div>
          <output aria-live="polite">Submitted radio: {{ radioSubmission || 'none' }}</output>
        </form>
      </div>
    </section>

    <section id="search-box">
      <h2>SearchBox</h2>
      <div class="search-box-samples">
        <div class="search-box-group">
          <h3>Controlled interaction and native events</h3>
          <FField
            label="Search documentation"
            hint="Type a query, then clear it with Escape or the dismiss control."
          >
            <FSearchBox
              v-model="searchQuery"
              class="search-box-controlled"
              name="documentation-query"
              placeholder="Search documentation"
              @input="(_event, data) => (searchEventLog = `input: ${data.value}`)"
              @change="(_event, data) => (searchEventLog = `change: ${data.value}`)"
              @search="(_event, data) => (searchEventLog = `search: ${data.value}`)"
              @clear="() => (searchEventLog = 'clear')"
            />
          </FField>
          <small class="search-box-value">Value: {{ searchQuery }}</small>
          <small class="search-box-event-log">{{ searchEventLog }}</small>
        </div>

        <div class="search-box-group">
          <h3>Appearances and sizes</h3>
          <div class="search-box-grid">
            <FSearchBox
              class="search-box-appearance-outline search-box-size-small"
              size="small"
              aria-label="Small outline search"
              default-value="Small"
            />
            <FSearchBox
              class="search-box-appearance-underline search-box-size-medium"
              appearance="underline"
              aria-label="Medium underline search"
              default-value="Underline"
            />
            <FSearchBox
              class="search-box-appearance-filled-darker search-box-size-large"
              appearance="filled-darker"
              size="large"
              aria-label="Large filled darker search"
              default-value="Filled darker"
            />
            <FSearchBox
              class="search-box-appearance-filled-lighter"
              appearance="filled-lighter"
              aria-label="Filled lighter search"
              default-value="Filled lighter"
            />
          </div>
        </div>

        <div class="search-box-group">
          <h3>Content slots and states</h3>
          <div class="search-box-grid">
            <FSearchBox
              class="search-box-content-slots"
              aria-label="Search people by voice"
              default-value="Ada"
            >
              <template #content-before><span class="search-box-prefix">People:</span></template>
              <template #content-after>
                <button class="search-box-voice" type="button" aria-label="Start voice search">
                  Voice
                </button>
              </template>
              <template #dismiss><span aria-hidden="true">×</span></template>
            </FSearchBox>
            <FSearchBox
              class="search-box-disabled"
              disabled
              aria-label="Disabled search"
              default-value="Disabled query"
            />
            <FSearchBox
              class="search-box-readonly"
              read-only
              aria-label="Read-only search"
              default-value="Read-only query"
            />
            <FField
              class="search-box-field"
              label="Product search"
              hint="Use a product name."
              validation-message="A product query is required."
              required
              size="large"
            >
              <FSearchBox placeholder="Search products" />
            </FField>
          </div>
        </div>

        <div class="search-box-group">
          <h3>Controlled rollback and native form reset</h3>
          <div class="search-box-grid">
            <FSearchBox
              class="search-box-controlled-rollback"
              :model-value="controlledSearch"
              aria-label="Controlled rollback search"
              @update:model-value="searchEventLog = `proposed: ${$event}`"
            />
            <form class="search-box-reset-demo">
              <FSearchBox
                class="search-box-resettable"
                default-value="Resettable query"
                name="reset-query"
                aria-label="Resettable search"
              />
              <FButton type="reset">Reset search form</FButton>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section id="rating">
      <h2>Rating</h2>
      <div class="rating-samples">
        <div class="rating-group">
          <h3>Interactive ratings</h3>
          <div class="rating-stack">
            <div class="rating-example">
              <FLabel id="rating-default-label">Product rating</FLabel>
              <FRating
                v-model="ratingValue"
                class="rating-default"
                aria-labelledby="rating-default-label"
                name="product-rating"
              />
              <small>Selected: {{ ratingValue }}</small>
            </div>
            <div class="rating-example">
              <FLabel id="rating-half-label">Half-star rating</FLabel>
              <FRating
                class="rating-half"
                aria-labelledby="rating-half-label"
                :default-value="2.5"
                :item-label="ratingItemLabel"
                name="half-rating"
                :step="0.5"
              />
            </div>
            <div class="rating-example">
              <FLabel id="rating-controlled-label">Controlled rollback rating</FLabel>
              <FRating
                class="rating-controlled"
                aria-labelledby="rating-controlled-label"
                :model-value="controlledRatingValue"
                name="controlled-rating"
                @update:model-value="controlledRatingAttempt = $event"
              />
              <small>Attempted: {{ controlledRatingAttempt ?? 'none' }}</small>
            </div>
          </div>
        </div>

        <div class="rating-group">
          <h3>Native form, states, and Field</h3>
          <div class="rating-state-grid">
            <form class="rating-form" @submit.prevent>
              <FLabel id="rating-form-label">Order rating</FLabel>
              <FRating
                class="rating-form-control"
                aria-labelledby="rating-form-label"
                :default-value="2"
                name="order-rating"
              />
              <div class="row">
                <FButton type="reset">Reset order rating</FButton>
                <FButton type="submit">Submit order rating</FButton>
              </div>
            </form>
            <div class="rating-example">
              <FLabel id="rating-readonly-label">Read-only rating</FLabel>
              <FRating
                class="rating-readonly"
                aria-labelledby="rating-readonly-label"
                :default-value="3"
                read-only
              />
            </div>
            <div class="rating-example">
              <FLabel id="rating-disabled-label" disabled>Disabled rating</FLabel>
              <FRating
                class="rating-disabled"
                aria-labelledby="rating-disabled-label"
                :default-value="4"
                disabled
              />
            </div>
            <FField
              class="rating-field"
              label="Required service rating"
              hint="Choose one to five stars."
              required
            >
              <FRating class="rating-field-control" name="service-rating" />
            </FField>
            <div class="rating-example">
              <form id="rating-external-form" class="rating-external-form" @submit.prevent></form>
              <FLabel id="rating-external-label">External required rating</FLabel>
              <FRating
                class="rating-external-control"
                aria-labelledby="rating-external-label"
                :default-value="2"
                form="rating-external-form"
                name="external-rating"
                required
              />
              <FButton type="reset" form="rating-external-form">Reset external rating</FButton>
            </div>
          </div>
        </div>

        <div class="rating-group">
          <h3>Interactive colors and sizes</h3>
          <div class="rating-matrix">
            <FRating
              v-for="color in ['neutral', 'brand', 'marigold'] as const"
              :key="color"
              :class="`rating-color-${color}`"
              :color="color"
              :default-value="3"
              :aria-label="`${color} rating`"
            />
            <FRating
              v-for="size in ['small', 'medium', 'large', 'extra-large'] as const"
              :key="size"
              :class="`rating-size-${size}`"
              :default-value="4"
              :size="size"
              :aria-label="`${size} rating`"
            />
          </div>
        </div>

        <div class="rating-group">
          <h3>Rating displays</h3>
          <div class="rating-display-grid">
            <FRatingDisplay
              class="rating-display-value-count"
              :value="4.2"
              :count="1160"
              aria-label="4.2 out of 5 from 1,160 ratings"
            />
            <FRatingDisplay
              class="rating-display-compact"
              compact
              color="marigold"
              :value="3.8"
              :count="86"
              aria-label="3.8 out of 5 from 86 ratings"
            />
            <FRatingDisplay
              class="rating-display-custom"
              :value="4"
              aria-label="Custom heart rating display"
            >
              <template #icon="{ fill }"
                ><span aria-hidden="true">{{ fill > 0 ? '♥' : '♡' }}</span></template
              >
              <template #value-text="{ value }">Custom {{ value }}</template>
            </FRatingDisplay>
            <div dir="ltr">
              <FRating
                class="rating-ltr"
                :default-value="3.5"
                :step="0.5"
                aria-label="LTR rating"
              />
            </div>
            <div dir="rtl">
              <FRating
                class="rating-rtl"
                :default-value="3.5"
                :step="0.5"
                aria-label="RTL rating"
              />
            </div>
            <FRatingDisplay
              v-for="color in ['neutral', 'brand', 'marigold'] as const"
              :key="`display-${color}`"
              :class="`rating-display-color-${color}`"
              :color="color"
              :value="3.5"
              :aria-label="`${color} rating display`"
            />
            <FRatingDisplay
              v-for="size in ['small', 'medium', 'large', 'extra-large'] as const"
              :key="`display-${size}`"
              :class="`rating-display-size-${size}`"
              :size="size"
              :value="4.5"
              :aria-label="`${size} rating display`"
            />
          </div>
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

    <section id="compound-button">
      <h2>CompoundButton</h2>
      <div class="compound-button-samples">
        <div class="compound-button-group">
          <h3>Appearances and accessible content</h3>
          <div class="compound-button-grid compound-button-appearance-grid">
            <FCompoundButton
              v-for="appearance in [
                'secondary',
                'primary',
                'outline',
                'subtle',
                'transparent',
              ] as const"
              :key="appearance"
              :class="`compound-${appearance}`"
              :appearance="appearance"
              :secondary-content="`${appearance} details`"
            >
              {{ appearance }} action
            </FCompoundButton>
          </div>
        </div>

        <div class="compound-button-group">
          <h3>Sizes, shapes, and icons</h3>
          <div class="compound-button-grid">
            <FCompoundButton
              v-for="size in ['small', 'medium', 'large'] as const"
              :key="size"
              :class="`compound-size-${size}`"
              :size="size"
              :secondary-content="`${size} secondary content`"
            >
              {{ size }} action
            </FCompoundButton>
            <FCompoundButton
              class="compound-circular"
              shape="circular"
              secondary-content="Circular shape"
            >
              Circular action
            </FCompoundButton>
            <FCompoundButton
              class="compound-square"
              shape="square"
              secondary-content="Square shape"
            >
              Square action
            </FCompoundButton>
            <FCompoundButton
              class="compound-icon-before"
              secondary-content="Decorative icon before"
            >
              <template #icon>
                <svg viewBox="0 0 40 40">
                  <path
                    d="M20 4a2 2 0 0 1 2 2v12h12a2 2 0 1 1 0 4H22v12a2 2 0 1 1-4 0V22H6a2 2 0 1 1 0-4h12V6a2 2 0 0 1 2-2Z"
                  />
                </svg>
              </template>
              Create project
            </FCompoundButton>
            <FCompoundButton
              class="compound-icon-after"
              icon-position="after"
              secondary-content="Decorative icon after"
            >
              Continue setup
              <template #icon>
                <svg viewBox="0 0 40 40">
                  <path d="m15 7 13 13-13 13-3-3 10-10-10-10 3-3Z" />
                </svg>
              </template>
            </FCompoundButton>
            <FCompoundButton class="compound-icon-only" aria-label="Open calendar">
              <template #icon>
                <svg viewBox="0 0 40 40">
                  <path d="M10 4h4v4h12V4h4v4h4v28H6V8h4V4Zm20 14H10v14h20V18Z" />
                </svg>
              </template>
            </FCompoundButton>
          </div>
        </div>

        <div class="compound-button-group">
          <h3>Native behavior, disabled focus, and long text</h3>
          <form class="compound-button-form" @submit.prevent="compoundSubmitCount += 1">
            <FCompoundButton
              class="compound-default-type"
              secondary-content="Does not submit the form"
            >
              Default type
            </FCompoundButton>
            <FCompoundButton
              class="compound-submit"
              type="submit"
              secondary-content="Submits this native form"
            >
              Submit compound form
            </FCompoundButton>
            <output aria-live="polite">Compound submissions: {{ compoundSubmitCount }}</output>
          </form>
          <div class="compound-button-grid">
            <FCompoundButton class="compound-disabled" disabled secondary-content="Unavailable">
              Disabled action
            </FCompoundButton>
            <FCompoundButton
              class="compound-disabled-focusable"
              disabled-focusable
              secondary-content="Focus reveals why this is unavailable"
            >
              Focusable disabled action
            </FCompoundButton>
            <FCompoundButton
              class="compound-both-disabled"
              disabled
              disabled-focusable
              secondary-content="Native disabled takes precedence"
            >
              Both disabled action
            </FCompoundButton>
            <FCompoundButton
              as="a"
              class="compound-anchor"
              href="#textarea"
              secondary-content="Uses native anchor navigation"
            >
              Go to Textarea examples
            </FCompoundButton>
            <FCompoundButton
              as="a"
              class="compound-anchor-button"
              secondary-content="Anchor root with button keyboard behavior"
              @click="dark = !dark"
            >
              Toggle theme from anchor button
            </FCompoundButton>
            <FCompoundButton
              class="compound-long-text"
              secondary-content="This descriptive line is deliberately long so wrapping and content containment remain visible in the representative browser and visual fixtures."
            >
              A compound action with a long primary label that wraps naturally
            </FCompoundButton>
          </div>
        </div>
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

    <section id="select">
      <h2>Select</h2>
      <div class="select-samples">
        <div class="select-group">
          <h3>Appearances</h3>
          <div class="select-grid">
            <FField label="Outline color">
              <FSelect class="select-appearance-outline" default-value="blue">
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
              </FSelect>
            </FField>
            <FField label="Underline color">
              <FSelect class="select-appearance-underline" appearance="underline">
                <option>Red</option>
                <option>Green</option>
                <option>Blue</option>
              </FSelect>
            </FField>
            <div class="select-contrast-surface">
              <FField label="Filled lighter color">
                <FSelect class="select-appearance-filled-lighter" appearance="filled-lighter">
                  <option>Red</option>
                  <option>Green</option>
                  <option>Blue</option>
                </FSelect>
              </FField>
            </div>
            <div class="select-contrast-surface">
              <FField label="Filled darker color">
                <FSelect class="select-appearance-filled-darker" appearance="filled-darker">
                  <option>Red</option>
                  <option>Green</option>
                  <option>Blue</option>
                </FSelect>
              </FField>
            </div>
          </div>
        </div>

        <div class="select-group">
          <h3>Sizes, states, and icon slot</h3>
          <div class="select-grid">
            <FField label="Small animal" size="small">
              <FSelect class="select-size-small">
                <option>Cat</option>
                <option>Dog</option>
              </FSelect>
            </FField>
            <FField label="Medium animal">
              <FSelect class="select-size-medium">
                <option>Cat</option>
                <option>Dog</option>
              </FSelect>
            </FField>
            <FField label="Large animal" size="large">
              <FSelect class="select-size-large">
                <option>Cat</option>
                <option>Dog</option>
              </FSelect>
            </FField>
            <FField label="Invalid animal" validation-message="Choose an available animal.">
              <FSelect class="select-invalid" default-value="unavailable">
                <option value="unavailable">Unavailable</option>
                <option value="cat">Cat</option>
              </FSelect>
            </FField>
            <FField label="Disabled animal">
              <FSelect class="select-disabled" disabled>
                <option>Cat</option>
                <option>Dog</option>
              </FSelect>
            </FField>
            <FField label="Custom icon animal">
              <FSelect class="select-custom-icon">
                <option>Cat</option>
                <option>Dog</option>
                <template #icon>
                  <svg viewBox="0 0 20 20" data-select-custom-icon>
                    <path d="m5 8 5 5 5-5Z" />
                  </svg>
                </template>
              </FSelect>
            </FField>
          </div>
        </div>

        <div class="select-group">
          <h3>Native options, forms, and controlled state</h3>
          <form class="select-form-demo">
            <FField
              label="Companion"
              hint="Choose one native option from the grouped list."
              required
            >
              <FSelect v-model="selectedPet" name="companion">
                <option value="">Choose a companion</option>
                <optgroup label="Land animals">
                  <option value="cat">Cat</option>
                  <option value="dog">Dog</option>
                  <option value="horse">Horse</option>
                </optgroup>
                <optgroup label="Water animals">
                  <option value="dolphin">Dolphin</option>
                  <option value="seal">Seal</option>
                </optgroup>
              </FSelect>
            </FField>
            <FButton type="submit" @click.prevent>Submit select form</FButton>
            <output class="select-current-value">Value: {{ selectedPet }}</output>
          </form>

          <form class="select-reset-demo">
            <FField label="Resettable animal">
              <FSelect name="resettableAnimal" default-value="dog">
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="seal">Seal</option>
              </FSelect>
            </FField>
            <FButton type="reset">Reset select form</FButton>
          </form>

          <div class="select-controlled-demo">
            <FField label="Controlled rollback animal">
              <FSelect :model-value="lockedPet">
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="seal">Seal</option>
              </FSelect>
            </FField>
            <FButton type="button" @click="lockedPet = 'seal'"
              >Set controlled animal to Seal</FButton
            >
            <output>Locked value: {{ lockedPet }}</output>
          </div>
        </div>
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
.search-box-samples {
  display: grid;
  gap: 1.5rem;
}

.search-box-group {
  display: grid;
  gap: 0.75rem;
}

.search-box-group h3 {
  margin: 0;
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-300);
}

.search-box-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
}

.search-box-grid > .fui-SearchBox,
.search-box-grid > .fui-Field,
.search-box-reset-demo {
  width: 100%;
}

.search-box-reset-demo {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.search-box-prefix,
.search-box-voice {
  color: inherit;
  font: inherit;
}

.search-box-voice {
  padding: 0;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.search-box-voice:focus-visible {
  outline: 2px solid var(--fui-color-stroke-focus-2);
  outline-offset: 2px;
}

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
.toggle-button-samples,
.compound-button-samples,
.card-samples,
.accordion-samples,
.tab-samples,
.breadcrumb-samples,
.list-samples,
.spinner-samples,
.progress-bar-samples,
.spin-button-samples,
.switch-samples,
.skeleton-samples {
  display: grid;
  gap: 1.5rem;
}

.badge-group,
.toggle-button-group,
.compound-button-group,
.card-group,
.spinner-group,
.progress-bar-group,
.spin-button-group,
.switch-group,
.skeleton-group {
  display: grid;
  gap: 0.75rem;
}

.list-default,
.list-selection,
.list-composite {
  display: grid;
  gap: 0.5rem;
}

.list-default .fui-ListItem,
.list-selection .fui-ListItem,
.list-composite .fui-ListItem {
  min-height: 2.5rem;
  align-items: center;
  padding: 0.5rem;
  border-radius: var(--fui-border-radius-medium);
  background-color: var(--fui-color-neutral-background-2);
  color: var(--fui-color-neutral-foreground-1);
}

.list-gridcell {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.5rem;
}

.list-primary {
  flex: 1;
  font-weight: var(--fui-font-weight-semibold);
}

.avatar-samples {
  display: grid;
  gap: 1.5rem;
}

.avatar-samples > div {
  display: grid;
  gap: 0.75rem;
}

.avatar-samples h3 {
  margin: 0;
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-300);
}

.avatar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.avatar-spread,
.avatar-stack {
  width: max-content;
}

.persona-samples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1.5rem;
}

.persona-samples > div,
.persona-layouts {
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 1rem;
}

.persona-samples h3 {
  margin: 0;
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-300);
}

.spinner-group h3,
.badge-group h3,
.toggle-button-group h3,
.compound-button-group h3,
.card-group > h3,
.progress-bar-group h3,
.spin-button-group h3,
.switch-group h3,
.skeleton-group h3 {
  margin: 0;
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-300);
}

.toggle-button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), max-content));
  align-items: center;
  gap: 0.75rem;
}

.toggle-button-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.toggle-button-form output,
.toggle-button-group > output {
  flex-basis: 100%;
}

.toggle-button-grid svg {
  width: 1em;
  height: 1em;
}

.compound-button-grid {
  display: grid;
  align-items: start;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}

.compound-button-appearance-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
}

.compound-button-grid > .fui-CompoundButton {
  justify-content: flex-start;
  width: 100%;
}

.compound-button-grid > .compound-icon-only {
  width: auto;
}

.compound-button-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.compound-button-form output {
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-200);
}

.compound-long-text {
  max-width: 22rem;
  white-space: normal;
}

.compound-button-grid svg {
  width: 1em;
  height: 1em;
  fill: currentcolor;
}

.toggle-dual-icon {
  display: inline-flex;
}

.toggle-rtl-surface {
  width: max-content;
  padding: 0.75rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.slider-samples,
.spinner-samples {
  display: grid;
  gap: 1.5rem;
}

.badge-group,
.slider-group,
.spinner-group {
  display: grid;
  gap: 0.75rem;
}

.slider-group {
  width: min(100%, 40rem);
}

.slider-group > .fui-Slider,
.slider-group > .fui-Field,
.slider-reset-demo > .fui-Field {
  width: 100%;
}

.slider-actions {
  margin-bottom: 0;
}

.slider-orientation-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
  min-height: 12rem;
}

.slider-horizontal-geometry,
.slider-rtl {
  width: 16rem;
}

.slider-vertical-geometry {
  height: 10rem;
}

.slider-rtl-surface {
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.slider-reset-demo {
  display: grid;
  align-items: end;
  grid-template-columns: minmax(0, 1fr) max-content;
  gap: 1rem;
  width: min(100%, 40rem);
  padding: 1rem;
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.spinner-group h3,
.slider-group h3,
.badge-group h3 {
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

.skeleton-feature-grid,
.skeleton-context-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}

.skeleton-card {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.skeleton-card > :first-child {
  grid-row: span 2;
}

.skeleton-line-long {
  width: 85%;
}

.skeleton-line-short {
  width: 55%;
}

.skeleton-shape-row {
  display: grid;
  grid-template-columns: 64px 64px minmax(10rem, 24rem);
  gap: 1rem;
  align-items: center;
}

.skeleton-size-grid {
  display: grid;
  gap: 0.5rem;
  width: min(100%, 42rem);
}

.skeleton-size-sample {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
}

.skeleton-context-parent {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 4rem;
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
}

.skeleton-nested-context {
  width: 7rem;
}

.skeleton-span-root {
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
}

.skeleton-span-item {
  width: 75%;
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

.rating-samples,
.rating-group,
.rating-stack,
.rating-example,
.rating-form,
.rating-matrix,
.rating-display-grid {
  display: grid;
  gap: 0.75rem;
}

.rating-samples {
  gap: 1.5rem;
}

.rating-stack,
.rating-state-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
}

.rating-state-grid {
  display: grid;
  align-items: start;
  gap: 1rem;
}

.rating-example,
.rating-form {
  align-content: start;
  justify-items: start;
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.rating-matrix,
.rating-display-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), max-content));
  align-items: center;
}

.spin-button-grid,
.spin-button-field-grid {
  display: grid;
  align-items: start;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}

.spin-button-grid .fui-SpinButton {
  width: 100%;
}

.spin-button-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.spin-button-form output {
  color: var(--fui-color-neutral-foreground-3);
  font-size: var(--fui-font-size-base-200);
}

.spin-button-states {
  width: min(100%, 30rem);
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

.card-grid,
.card-focus-grid,
.card-size-row {
  display: grid;
  gap: 1rem;
}

.card-grid,
.card-focus-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}

.card-size-row {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.card-grid .fui-Card,
.card-focus-grid .fui-Card,
.card-size-row .fui-Card,
.card-form-demo .fui-Card,
.card-semantic-article,
.card-rtl-surface {
  min-width: 0;
}

.card-grid .fui-CardHeader h3,
.card-form-demo .fui-CardHeader h3,
.card-semantic-article h3,
.card-horizontal-rtl h3 {
  margin: 0;
  font-size: var(--fui-font-size-base-300);
}

.card-grid .fui-CardPreview > .fui-Image {
  width: 100%;
}

.card-form-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
  gap: 1rem;
  padding: 1rem;
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.card-form-demo > .row {
  grid-column: 1 / -1;
  margin-bottom: 0;
}

.card-focus-grid .fui-Card {
  min-height: 9rem;
}

.card-rtl-surface {
  width: min(100%, 40rem);
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
}

.card-horizontal-rtl {
  width: 100%;
}

.radio-group-sample,
.radio-form-demo,
.radio-field-demo {
  display: grid;
  gap: 0.75rem;
  width: min(100%, 42rem);
  padding: 1rem;
  background: var(--fui-color-neutral-background-2);
  border: var(--fui-stroke-width-thin) solid var(--fui-color-neutral-stroke-1);
  border-radius: var(--fui-border-radius-medium);
}

.radio-group-sample h3 {
  margin: 0;
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-300);
}

.radio-group-sample .fui-RadioGroup,
.radio-field-demo .fui-RadioGroup {
  gap: var(--fui-spacing-vertical-xs) var(--fui-spacing-horizontal-m);
}

.radio-stacked-layout {
  min-height: 4.5rem;
}

.radio-state-row {
  align-items: flex-start;
  margin-bottom: 0;
}

.radio-form-demo output {
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-200);
}

.select-samples,
.select-group {
  display: grid;
  gap: 1.5rem;
}

.select-group {
  gap: 0.75rem;
}

.select-group h3 {
  margin: 0;
  color: var(--fui-color-neutral-foreground-2);
  font-size: var(--fui-font-size-base-300);
}

.select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}

.select-grid .fui-Field,
.select-form-demo .fui-Field,
.select-reset-demo .fui-Field,
.select-controlled-demo .fui-Field {
  min-width: 0;
}

.select-grid .fui-Select,
.select-form-demo .fui-Select,
.select-reset-demo .fui-Select,
.select-controlled-demo .fui-Select {
  width: 100%;
}

.select-contrast-surface {
  padding: 0.75rem;
  background: var(--fui-color-neutral-background-2);
}

.select-form-demo,
.select-reset-demo,
.select-controlled-demo {
  display: grid;
  align-items: end;
  grid-template-columns: minmax(0, 24rem) max-content minmax(0, 1fr);
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--fui-color-neutral-stroke-1);
}

.select-custom-icon [data-select-custom-icon] {
  display: block;
  width: 1em;
  height: 1em;
  fill: currentcolor;
}

.select-current-value,
.select-controlled-demo output {
  color: var(--fui-color-neutral-foreground-3);
  font-size: var(--fui-font-size-base-200);
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

  .card-size-row,
  .field-validity-demo,
  .select-form-demo,
  .select-reset-demo,
  .select-controlled-demo,
  .spinner-position-grid,
  .spinner-size-grid,
  .textarea-reset-demo {
    grid-template-columns: 1fr;
  }
}
</style>

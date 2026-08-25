# fluentui-vue

A native Vue 3 adaptation of selected Microsoft Fluent UI React v9 components. This package does not require React and does not wrap Fluent Web Components.

> This is an independent, unofficial package and is not affiliated with or endorsed by Microsoft.

## Current components

- `FButton`, `FToggleButton`, and `FCompoundButton` — adapted from `@fluentui/react-button` 9.11.0
- `FInput` — adapted from `@fluentui/react-input` 9.8.6
- `FCheckbox` — adapted from `@fluentui/react-checkbox` 9.6.4
- `FDivider` — adapted from `@fluentui/react-divider` 9.7.4
- `FImage` — adapted from `@fluentui/react-image` 9.4.4
- `FBadge`, `FCounterBadge`, and `FPresenceBadge` — adapted from `@fluentui/react-badge` 9.5.5
- `FSpinner` — adapted from `@fluentui/react-spinner` 9.8.5
- `FProgressBar` — adapted from `@fluentui/react-progress` 9.5.4
- `FSwitch` — adapted from `@fluentui/react-switch` 9.7.5
- `FSkeleton` and `FSkeletonItem` — adapted from `@fluentui/react-skeleton` 9.7.5
- `FSlider` — adapted from `@fluentui/react-slider` 9.6.5
- `FCard`, `FCardHeader`, `FCardPreview`, and `FCardFooter` — adapted from `@fluentui/react-card` 9.7.2
- `FRadio` and `FRadioGroup` — adapted from `@fluentui/react-radio` 9.6.5
- `FSelect` — adapted from `@fluentui/react-select` 9.5.5
- `FSpinButton` — adapted from `@fluentui/react-spinbutton` 9.6.5
- `FSearchBox` — adapted from `@fluentui/react-search` 9.4.6
- `FRating`, `FRatingItem`, and `FRatingDisplay` — adapted from `@fluentui/react-rating` 9.4.4
- `FText` — adapted from `@fluentui/react-text` 9.6.19
- `FLabel` — adapted from `@fluentui/react-label` 9.4.4
- `FField` — adapted from `@fluentui/react-field` 9.5.4
- `FTextarea` — adapted from `@fluentui/react-textarea` 9.7.6
- `FLink` — adapted from `@fluentui/react-link` 9.8.4

See [ARCHITECTURE.md](./ARCHITECTURE.md) for project structure and engineering rules, [COMPONENT_ROADMAP.md](./COMPONENT_ROADMAP.md) for the recommended development order, [UPSTREAM.md](./UPSTREAM.md) for source provenance, and [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for license details.

## Local development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test:run
npm run test:a11y
npm run test:ssr
npm run build
npm run pack:check
npm run consumer:check
npm run test:browser
npm run test:visual
```

Use `npm run format` and `npm run lint:fix` to apply deterministic formatting and safe lint fixes. Install local browser binaries with `npx playwright install chromium firefox webkit` before running browser-based checks. Browser tests run semantic and keyboard coverage in Chromium, Firefox, and WebKit. The visual suite currently records deterministic Chromium light/dark playground baselines, and the automated accessibility suite fails on axe violations. The CI workflow installs all three browser engines with their Linux system dependencies.

## Test this package in another local Vue project

The recommended local installation flow uses an npm tarball. This closely matches how consumers will receive the eventual published package and avoids symlink-specific behavior.

### 1. Build and pack this library

From this repository:

```bash
cd /Users/ali/Desktop/flaunt-convert-react
npm install
npm run build
npm pack
```

This creates a file such as:

```text
mrpvi-fluentui-vue-0.1.0.tgz
```

The tarball contains the same scoped package consumers receive from npm and can be installed locally before publication.

### 2. Install the tarball in another Vue project

Using npm:

```bash
cd /path/to/your-vue-project
npm install /Users/ali/Desktop/flaunt-convert-react/mrpvi-fluentui-vue-0.1.0.tgz
```

Using pnpm:

```bash
pnpm add /Users/ali/Desktop/flaunt-convert-react/mrpvi-fluentui-vue-0.1.0.tgz
```

Using Yarn:

```bash
yarn add file:/Users/ali/Desktop/flaunt-convert-react/mrpvi-fluentui-vue-0.1.0.tgz
```

The consuming application must use Vue 3.5 or later because Vue is a peer dependency:

```bash
npm install vue@^3.5.0
```

### 3. Import the required stylesheet

Import the emitted stylesheet once in the consuming application's entry file. JavaScript imports do not load the global tokens and shared foundations automatically, so this explicit stylesheet import is required:

```ts
import { createApp } from 'vue';
import { FluentVue } from '@mrpvi/fluentui-vue';
import '@mrpvi/fluentui-vue/style.css';
import App from './App.vue';

createApp(App).use(FluentVue).mount('#app');
```

Registering `FluentVue` makes all package components available globally.

### 4. Or import components individually

Components can be imported without installing the global plugin:

```vue
<script setup lang="ts">
import {
  FBadge,
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
  FPresenceBadge,
  FProgressBar,
  FRating,
  FRatingDisplay,
  FRatingItem,
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
  FText,
  FTextarea,
  FToggleButton,
  type CheckboxValue,
  type RatingColor,
  type RatingSize,
  type RatingStep,
  type ToggleButtonAppearance,
  type ToggleButtonIconPosition,
  type ToggleButtonShape,
  type ToggleButtonSize,
} from '@mrpvi/fluentui-vue';
import { ref } from 'vue';

const name = ref('');
const biography = ref('');
const accepted = ref<CheckboxValue>(false);
const receiptMethod = ref('email');
const companion = ref('dog');
const pinned = ref(false);
</script>

<template>
  <FField label="Your name" required>
    <FInput v-model="name" placeholder="Your name" />
  </FField>
  <FField label="Biography">
    <FTextarea v-model="biography" resize="vertical" />
  </FField>
  <FCheckbox v-model="accepted" label="Accept terms" />
  <FField label="Receipt method" required>
    <FRadioGroup v-model="receiptMethod" name="receipt-method" layout="horizontal">
      <FRadio value="email" label="Email" />
      <FRadio value="paper" label="Paper" />
    </FRadioGroup>
  </FField>
  <FDivider>Review</FDivider>
  <FImage src="/summary.png" alt="Account summary chart" shape="rounded" />
  <FBadge appearance="tint" color="success">Verified</FBadge>
  <FCounterBadge :count="120" role="img" aria-label="120 unread notifications" />
  <FPresenceBadge status="available" aria-label="Available for support" />
  <FSpinner label="Loading account" size="large" />
  <FProgressBar :value="0.6" aria-label="Account setup progress" />
  <FRating :default-value="3" aria-label="Account experience rating" />
  <FRatingDisplay :value="4.5" :count="1160" aria-label="4.5 out of 5 from 1,160 ratings" />
  <FSpinButton :default-value="1" :min="0" :max="10" aria-label="Quantity" />
  <FSearchBox aria-label="Search account settings" placeholder="Search settings" />
  <FSwitch label="Enable notifications" />
  <FSkeleton aria-label="Loading account card" style="display: grid; gap: 0.5rem">
    <FSkeletonItem shape="circle" :size="48" />
    <FSkeletonItem style="width: 65%" />
  </FSkeleton>
  <FField label="Volume">
    <FSlider :default-value="40" />
  </FField>
  <FField label="Companion">
    <FSelect v-model="companion">
      <option value="cat">Cat</option>
      <option value="dog">Dog</option>
    </FSelect>
  </FField>
  <FLink inline href="/privacy">Read the privacy policy</FLink>
  <FToggleButton v-model="pinned">Pin profile</FToggleButton>
  <FCompoundButton secondary-content="Includes account preferences"> Save profile </FCompoundButton>
  <FButton appearance="primary" :disabled="!accepted">Continue</FButton>
</template>
```

### 5. Test later library changes

After changing this library, create a fresh tarball:

```bash
cd /Users/ali/Desktop/flaunt-convert-react
npm run build
npm pack
```

Reinstall it in the consuming project:

```bash
npm install /Users/ali/Desktop/flaunt-convert-react/mrpvi-fluentui-vue-0.1.0.tgz --force
```

Restart the consuming project's development server. If Vite still uses a cached package copy, remove its dependency cache and start it again:

```bash
rm -rf node_modules/.vite
npm run dev
```

For frequent iterations, incrementing the package version before packing—such as `0.1.1`, `0.1.2`, and so on—also avoids package-manager cache ambiguity.

## npm installation

Install the public scoped package from the npm registry:

```bash
npm install @mrpvi/fluentui-vue
```

## Text

```vue
<FText as="h2" :size="700" weight="semibold">Account settings</FText>
<FText as="p">Use semantic elements while applying Fluent typography.</FText>

<FText block :wrap="false" truncate style="width: 18rem">
  A long single line that is truncated only when layout, wrapping, and width are explicit.
</FText>
```

Key props:

- `as`: `span | h1 | h2 | h3 | h4 | h5 | h6 | p | pre | strong | b | em | i`
- `align`: `start | center | end | justify`
- `font`: `base | monospace | numeric`
- `size`: `100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000`
- `weight`: `regular | medium | semibold | bold`
- `block`, `italic`, `underline`, `strikethrough`, `truncate`, and `wrap`

The default root is `span`, size is `300`, weight is `regular`, and wrapping is enabled. `truncate` only applies `text-overflow: ellipsis`; use it with `block`, `:wrap="false"`, and a constrained width for single-line truncation. Choose `as` for document semantics rather than appearance alone.

The upstream preset wrappers such as `Body1`, `Caption1`, and `Title1` are not included in this first Text slice.

## Field

`FField` composes a label, one control, validation feedback, and hint text while generating and wiring their IDs and ARIA relationships.

```vue
<script setup lang="ts">
import { FField, FInput } from '@mrpvi/fluentui-vue';
</script>

<template>
  <FField
    label="Email address"
    hint="Use your work email."
    validation-state="error"
    validation-message="Enter a valid email address."
    required
  >
    <FInput type="email" />
  </FField>
</template>
```

Key props:

- `label`, `hint`, and `validationMessage`
- `validationState`: `none | error | warning | success`
- `orientation`: `vertical | horizontal`
- `size`: `small | medium | large`
- `required`

`FInput`, `FCheckbox`, `FTextarea`, `FSwitch`, `FSlider`, `FRadioGroup`, `FSelect`, and `FSpinButton` automatically consume the enclosing Field context. Field generates the control ID, connects `label for` to that ID, merges validation and hint IDs into `aria-describedby`, applies native `required`, and defaults `aria-invalid="true"` for errors. Explicit control attributes remain authoritative; for example, an explicit `aria-invalid="false"` or `:required="false"` is preserved.

Error and warning messages use `role="alert"`. Success and `none` messages do not. Validation icons are decorative and hidden from assistive technology. The required asterisk is also visual; native required semantics are applied separately to supported controls.

Use the Field label rather than also supplying `label` to `FCheckbox`, which would intentionally render a second checkbox-owned label.

For native or third-party controls, bind the default scoped-slot attributes explicitly:

```vue
<FField label="Reference" hint="Enter the external reference.">
  <template #default="controlProps">
    <input v-bind="controlProps" />
  </template>
</FField>
```

Named slots are available for `label`, `hint`, `validation-message`, and the decorative `validation-message-icon`.

## Label

```vue
<FLabel for="email" :required="true">Email address</FLabel>
<FInput id="email" type="email" required />

<FLabel for="nickname" required="(required)">Nickname</FLabel>
<FInput id="nickname" />
```

Key props:

- `size`: `small | medium | large`
- `weight`: `regular | semibold`
- `required`: `boolean | string` for a visual indicator
- `disabled` for disabled-state styling

`FLabel` always renders a native `<label>`. Native label attributes such as `for` are forwarded to it, so set `for` to the associated control's `id`. Clicking the label then focuses or activates that control according to browser semantics.

The `required` prop renders a visual marker only and does not make the associated control required. Apply the native `required` attribute to `FInput` or the other form control as shown above. The marker has `aria-hidden="true"` to prevent an assistive-technology announcement that could duplicate the control's native required state.

The `required` slot can replace the marker, but it is decorative and must not contain interactive controls. `disabled` is also visual only: disable the associated control separately.

Because `required` accepts both strings and booleans, use `:required="true"` when you want the default `*` marker. An unbound value such as `required="(required)"` is treated as custom marker text.

## Button

```vue
<FButton appearance="primary" size="large">Save</FButton>

<FButton aria-label="Add item" shape="circular">
  <template #icon>
    <MyAddIcon />
  </template>
</FButton>

<FButton as="a" href="/docs">Read documentation</FButton>
```

Key props:

- `appearance`: `secondary | primary | outline | subtle | transparent`
- `shape`: `rounded | circular | square`
- `size`: `small | medium | large`
- `as`: `button | a`
- `disabled` and `disabledFocusable`
- `iconPosition`: `before | after`

`disabledFocusable` retains tab focus but suppresses activation. Anchors without `href` receive button semantics and keyboard activation.

Slots:

- `default` contains the visible button label.
- `icon` is decorative and is hidden from assistive technology. An icon-only button must therefore provide `aria-label` or `aria-labelledby`; development builds warn when the name is missing.

## CompoundButton

`FCompoundButton` is the two-line Button variant adapted from the exact released `@fluentui/react-button@9.11.0` CompoundButton. It preserves native Button and anchor behavior while adding visible secondary content and the released CompoundButton dimensions.

```vue
<FCompoundButton appearance="primary" secondary-content="Includes sharing settings">
  Save changes
</FCompoundButton>

<FCompoundButton as="a" href="/reports" secondary-content="Updated five minutes ago">
  Open report
</FCompoundButton>

<FCompoundButton aria-label="Open calendar" shape="circular">
  <template #icon><CalendarIcon /></template>
</FCompoundButton>
```

Key props:

- `secondaryContent` for the descriptive second line; the `secondary-content` slot takes precedence
- `appearance`: `secondary | primary | outline | subtle | transparent`
- `shape`: `rounded | circular | square`
- `size`: `small | medium | large`
- `as`: `button | a`
- `iconPosition`: `before | after`
- `href`, `disabled`, and `disabledFocusable`

The default root is `<button type="button">`, so it submits only when an explicit `type="submit"` is supplied. `as="a"` with `href` preserves native link navigation. An anchor without `href` receives `role="button"`, enters the tab order, and supports Enter and Space activation. Consumer `keydown` and `keyup` listeners are composed with that managed keyboard behavior without duplicate click delivery.

`disabled` uses native disabled semantics for a button and removes anchor navigation. `disabledFocusable` retains focus, exposes `aria-disabled="true"`, and suppresses pointer and Enter/Space activation. If both props are present, native `disabled` takes precedence and the focusable-disabled classes and redundant `aria-disabled` are omitted.

Primary and secondary visible content form the accessible name. The `icon` slot is decorative and receives `aria-hidden="true"`; icon-only usage therefore requires `aria-label` or `aria-labelledby`, with a development warning when missing. Native form, anchor, ARIA, data, class, and style attributes are forwarded while managed root semantics remain authoritative. The component emits one typed native `click`, exposes its native `element` and `focus()`, uses logical icon spacing for RTL, and preserves light/dark themes, forced colors, focus visibility, and reduced motion.

React slot objects, shorthand slot resolution, and Button context sizing are intentionally translated to direct Vue props and named slots.

## ToggleButton

`FToggleButton` is the pressed-state Button variant adapted from the exact released `@fluentui/react-button@9.11.0` ToggleButton. It always renders a native `<button>` and exposes selection through authoritative `aria-pressed`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FToggleButton } from '@mrpvi/fluentui-vue';

const pinned = ref(false);
</script>

<template>
  <FToggleButton v-model="pinned">Pin item</FToggleButton>
  <FToggleButton appearance="primary" default-checked is-accessible>
    Accessible selected action
  </FToggleButton>
  <FToggleButton aria-label="Toggle favorite">
    <template #icon><FavoriteIcon /></template>
  </FToggleButton>
</template>
```

Key props:

- `modelValue` for controlled pressed state through `v-model`
- `defaultChecked` for initial uncontrolled pressed state
- `isAccessible` for Fluent's alternate accessible selected treatment
- `appearance`: `secondary | primary | outline | subtle | transparent`
- `shape`: `rounded | circular | square`
- `size`: `small | medium | large`
- `iconPosition`: `before | after`
- `disabled` and `disabledFocusable`

The corresponding public types are `ToggleButtonAppearance`, `ToggleButtonShape`, `ToggleButtonSize`, and `ToggleButtonIconPosition`. An explicitly bound `undefined` `modelValue` is controlled and renders unchecked, matching the package-wide prop-presence rule. `defaultChecked` is read only during initialization, and a controlled ToggleButton remains prop-authoritative until the parent updates it.

Enabled pointer, Enter, and Space activation use native button behavior. The component emits the native `click` first and then one `update:modelValue`; calling `preventDefault()` from the click listener vetoes the state transition. `disabled` uses native disabled semantics. `disabledFocusable` is used only when native `disabled` is false: it keeps focus, exposes `aria-disabled="true"`, and suppresses pointer and Enter/Space activation. If both props are true, native `disabled` takes precedence and no focusable-disabled class or ARIA state is added.

The default root type is `button`; explicit `submit` and `reset` types, `name`, `value`, `form`, data attributes, and accessible naming attributes are forwarded. ToggleButton does not invent checkbox-like form-reset state: resetting a form does not reset `aria-pressed`, because this is a stateful button rather than a checkbox. Managed button semantics, disabled state, `aria-pressed`, and click handling cannot be overridden through fallthrough attributes.

The `icon` slot is decorative and hidden from assistive technology; icon-only usage requires `aria-label` or `aria-labelledby`. Released regular/filled Fluent icon pairs may use `.fui-Icon-regular` and `.fui-Icon-filled`, which switch with the pressed state. Sizes, shapes, icon order, RTL logical spacing, light/dark themes, focus, forced-color selected/disabled palettes, and the base Button reduced-motion safeguard are preserved. The component exposes its native `element` and `focus()`.

React's `checked`/`onClick` API is translated to Vue `modelValue`, `update:modelValue`, and a typed native `click` emit. React Button context sizing and ToggleButton anchor-root customization are intentionally omitted from this fixed-native-button Vue slice.

## Link

`FLink` is a single native interactive root for navigation or lightweight action styling. It renders an anchor when `href` is truthy and a button when `href` is absent. An explicit `as` value overrides that automatic selection.

```vue
<FLink href="/documentation">Read the documentation</FLink>

<FText as="p">
  Review the
  <FLink inline href="/privacy">privacy policy</FLink>
  before continuing.
</FText>

<FLink appearance="subtle" href="/archive">View archive</FLink>
<FLink @click="openDetails">Open details</FLink>
<FLink href="/unavailable" disabled-focusable>Unavailable destination</FLink>
```

Key props:

- `appearance`: `default | subtle`
- `as`: `a | button | span`
- `href` for native anchor navigation
- `inline` for a resting underline inside prose
- `disabled` and `disabledFocusable`

Root selection follows the reviewed Fluent implementation: explicit `as` wins; otherwise a truthy `href` renders `<a>` and no or empty `href` renders `<button type="button">`. Use anchors for navigation and buttons for actions. `as="span"` is available for constrained composition cases, receives button semantics by default, and implements Enter/Space activation.

All root `class`, `style`, native, ARIA, and data attributes are forwarded to the selected native element. Native anchor attributes such as `target`, `rel`, `download`, `hreflang`, and `referrerpolicy`, and native button attributes such as `type`, `form`, `name`, and `value`, remain available. An explicit `role`, `tabindex`, or button `type` is preserved where applicable.

The component emits typed native `click` and `keydown` events. Native anchors and buttons retain browser keyboard behavior. For a span root, Enter and Space synthesize one click unless the consumer supplies a `keydown` listener, in which case the consumer controls keyboard activation.

`disabled` removes normal activation and native button focusability. A disabled anchor has its `href` removed and is not placed in the tab order by the component. `disabledFocusable` keeps the root keyboard-focusable while setting `aria-disabled="true"` and suppressing click plus Enter/Space activation. Use the focusable variant when users need to discover why an option is unavailable.

Default links use Fluent brand link colors; subtle links use neutral link colors. Hover and active states underline the link, while `inline` adds a resting underline so links embedded in prose are not identified by color alone. The component exposes its native `element` and a `focus()` method.

Use specific, meaningful link text rather than “click here.” If a link opens a new tab or window, provide both a visual indication and accessible text that announces that behavior. Background-aware inverted/brand colors from Fluent’s React context are intentionally not exposed until this library has a shared provider/background context.

## Divider

`FDivider` is a semantic separator that may render visible content as its accessible name. It is adapted from `@fluentui/react-divider@9.7.4`.

```vue
<FDivider aria-label="Section boundary" />
<FDivider align-content="start" appearance="brand">Planning</FDivider>
<FDivider align-content="end" appearance="subtle" inset>Complete</FDivider>
<FDivider vertical aria-label="Column boundary" />
```

Key props:

- `alignContent`: `start | center | end`
- `appearance`: `brand | default | strong | subtle`
- `inset` for beginning and end spacing
- `vertical` for vertical orientation

The root is a native `<div role="separator">` with managed `aria-orientation`. When the default slot is present, the component wraps it in an ID generated with Vue `useId()` and applies that ID through `aria-labelledby`, so visible content names the separator. A contentless divider has no implicit accessible name; add `aria-label` or `aria-labelledby` only when the boundary needs a specific announced name.

Top-level `class`, `style`, native, ARIA, and data attributes are forwarded to the root. The managed `role`, `aria-orientation`, and content-derived `aria-labelledby` cannot be overridden. Alignment and inset styling use logical properties, so start/end layout follows the document direction. The component exposes its native `element` and defines no component-specific events. React slot customization for the root and wrapper is intentionally translated to Vue's fixed semantic root plus default content slot.

## Image

`FImage` renders one native `<img>` with Fluent shape, fit, border, shadow, and block styling. It is adapted from the released `@fluentui/react-image@9.4.4` package.

```vue
<FImage src="/team-photo.jpg" alt="The product team at the launch event" shape="rounded" />
<FImage src="/texture.png" alt="" bordered shadow />

<div style="width: 20rem; height: 12rem">
  <FImage src="/landscape.jpg" alt="Mountain landscape" fit="cover" />
</div>
```

Key props:

- `shape`: `square | rounded | circular`
- `fit`: `default | none | center | contain | cover`
- `block` to set the image width to its container width
- `bordered` for a Fluent neutral rectangular border
- `shadow` for Fluent elevation shadow 4

The root is always a native `<img>`. Native image attributes, ARIA and data attributes, event listeners, `class`, and `style` are forwarded to it. The component exposes the native `element`; it does not add fallback markup or component error state, so native `load` and `error` behavior is preserved.

For non-default fit modes, when neither a native `width` nor `height` attribute is supplied, the image receives `width: 100%` and `height: 100%`, matching the reviewed Fluent implementation. Put it in a container with explicit dimensions so `object-fit` has defined bounds. Supplying either dimension prevents this inferred fill sizing. `none` positions at the physical left top, while `center`, `contain`, and `cover` center the image; this matches upstream and does not change in RTL.

Every meaningful image must have concise alternative text that conveys its purpose. Decorative images must use `alt=""`. Do not omit `alt`: an omitted attribute can cause assistive technology to announce the filename or URL. Image loading failures remain the browser's native behavior; applications that need a replacement can listen for the native `error` event and update `src` or render application-owned fallback UI.

React root slot replacement and Fluent's internal custom-style hook are intentionally omitted. Vue uses a fixed semantic image root, fallthrough attributes, and application-controlled CSS classes/styles instead.

## Badge family

`FBadge`, `FCounterBadge`, and `FPresenceBadge` are non-interactive visual descriptors adapted from the released `@fluentui/react-badge@9.5.5` package.

```vue
<FBadge appearance="tint" color="success" shape="rounded">Verified</FBadge>

<FCounterBadge
  :count="120"
  :overflow-count="99"
  role="img"
  aria-label="More than 99 notifications"
/>
<FCounterBadge dot role="img" aria-label="New notification" />

<FPresenceBadge status="available" aria-label="Available for pair programming" />
<FPresenceBadge status="away" out-of-office />
```

`FBadge` key props:

- `appearance`: `filled | ghost | outline | tint`
- `color`: `brand | danger | important | informative | severe | subtle | success | warning`
- `shape`: `circular | rounded | square`
- `size`: `tiny | extra-small | small | medium | large | extra-large`
- `iconPosition`: `before | after`

`FCounterBadge` restricts appearances to `filled | ghost`, colors to `brand | danger | important | informative`, and shapes to `circular | rounded`. `count` defaults to `0`; zero is hidden unless `showZero` is true. Values above `overflowCount` (default `99`) render as `N+`. `dot` renders a 6px indicator and suppresses generated numeric content. Supplying the default slot replaces generated count text, including for a zero or dot badge.

`FPresenceBadge` supports `available`, `away`, `busy`, `do-not-disturb`, `blocked`, `offline`, `out-of-office`, and `unknown`, plus `outOfOffice` combinations and all six badge sizes. Its root defaults to `role="img"` with a status-derived `aria-label`; consumers may override either attribute when a more useful contextual label is available. The fallback status SVG is decorative and nonfocusable.

All badge roots are fixed `<div>` elements, forward top-level `class`, `style`, native, ARIA, data attributes, and listeners, expose the native `element`, and define no component events. They are not interactive and do not enter the tab order unless a consumer explicitly adds focusability, which is normally inappropriate; put a badge beside or inside the relevant interactive control instead. Counter values and dots communicate information visually, so provide equivalent surrounding text when possible. If a standalone `FBadge` or `FCounterBadge` needs an `aria-label` or `aria-labelledby`, also supply an appropriate semantic role such as `role="img"`; ARIA naming is not valid on a generic unroled `<div>`.

Slots:

- `FBadge` and `FCounterBadge` use the default slot for visible content and `icon` for optional visual content.
- `FPresenceBadge` uses `icon` to replace the package fallback status SVG.
- Consumer-provided icon slots are **not automatically `aria-hidden`** because arbitrary slot content may carry intended semantics. If the root or visible text already supplies the accessible name, mark the slotted SVG or icon `aria-hidden="true"` and `focusable="false"`. If the icon itself must contribute to the name, give it appropriate accessible semantics and avoid duplicating the root label. Never place interactive controls in these icon slots.

The private fallback presence SVG path data is adapted from `@fluentui/react-icons@2.0.245`; it is bundled as internal data rather than exposing React or a runtime icon dependency. React root/icon slot objects are intentionally translated to fixed Vue roots, typed Vue slots, and fallthrough attributes.

## Spinner

`FSpinner` is an indeterminate `role="progressbar"` adapted from the released `@fluentui/react-spinner@9.8.5` package. Use it when progress is active but a meaningful completion percentage is not available.

```vue
<FSpinner label="Loading account" />
<FSpinner label="Loading messages" label-position="above" size="huge" />
<FSpinner appearance="inverted" label="Submitting" />
<FSpinner as="span" aria-label="Loading inline result" size="extra-tiny" />
<FSpinner :delay="500" label="Loading search results" />

<FSpinner label="Loading with a custom indicator">
  <template #indicator>
    <MyDecorativeLoader />
  </template>
</FSpinner>
```

Key props:

- `appearance`: `primary | inverted`
- `size`: `extra-tiny | tiny | extra-small | small | medium | large | extra-large | huge`
- `labelPosition`: `above | below | before | after`
- `label` for visible progress text
- `delay` in milliseconds before the indicator and visible label appear
- `as`: `div | span`

The defaults are `as="div"`, `appearance="primary"`, `size="medium"`, `label-position="after"`, and no delay. The root always remains in the DOM with managed `role="progressbar"`, including during a positive delay; only the indicator and visible label are delayed. Positive-delay server markup is therefore deterministic and hydrates to the same empty progressbar root before the client timer reveals its contents.

A visible `label` prop or `label` slot receives a deterministic generated ID that is applied to the root through `aria-labelledby`. A consumer-supplied `aria-labelledby` remains authoritative. Without a visible label, provide `aria-label` or `aria-labelledby` whenever surrounding context does not already identify the progress operation. Do not add `aria-valuenow`, because Spinner represents indeterminate progress.

The `indicator` slot replaces the package's animated tail inside the fixed decorative `.fui-Spinner__spinner` wrapper. Its content is always inside `aria-hidden="true"`, so it must be visual-only and must not contain interactive controls or the spinner's accessible name. Top-level `class`, `style`, native, ARIA, data attributes, and listeners are forwarded to the root. The managed progressbar role cannot be overridden. The root exposes its native `element`, defines no component events, and is not focusable unless a consumer explicitly adds focusability, which is normally inappropriate.

The animation follows document direction, uses Fluent forced-color system colors, and simplifies the tail for `prefers-reduced-motion: reduce`. `appearance="inverted"` is intended for brand or dark contrasting surfaces. React root, spinner, spinner-tail, and Label slot objects are translated to a constrained Vue root plus `label` and decorative `indicator` slots. React Spinner context sizing is intentionally omitted until this package introduces a shared provider/context contract.

## ProgressBar

`FProgressBar` is a determinate or indeterminate `role="progressbar"` adapted from the released `@fluentui/react-progress@9.5.4` package. Use determinate progress when a meaningful completion value is available; omit `value` for an indeterminate operation.

```vue
<FProgressBar :value="0.5" aria-label="Uploading files" />
<FProgressBar :value="36" :max="100" thickness="large" color="success" aria-label="Upload" />
<FProgressBar aria-label="Preparing download" />
<FProgressBar :indeterminate-motion="false" aria-label="Waiting without animation" />

<FField label="Profile completion" hint="Complete the remaining account fields.">
  <FProgressBar :value="0.75" />
</FField>
```

Key props:

- `value`: a number between zero and `max`; omit it for indeterminate progress
- `max`: completion maximum, default `1`; values less than or equal to zero normalize to `1`
- `color`: `brand | error | warning | success`
- `shape`: `rounded | square`
- `thickness`: `medium | large`
- `indeterminateMotion`: whether the default indeterminate motion wrapper renders, default `true`

The fixed root is a `<div role="progressbar">`. Determinate bars expose managed `aria-valuemin="0"`, `aria-valuemax`, and clamped `aria-valuenow`, and size the inner bar as `value / max`. Indeterminate bars omit all three value attributes. Invalid `max` and out-of-range `value` inputs are clamped like the reviewed Fluent utilities and produce development-only console errors.

`FProgressBar` integrates automatically with `FField`: it receives the generated control ID and label relationship, prepends validation and hint IDs to `aria-describedby`, and inherits `error`, `warning`, or `success` color when no explicit `color` is supplied. Explicit root IDs, accessible-label attributes, descriptions, and colors remain authoritative. Outside a Field, provide `aria-label` or `aria-labelledby` whenever surrounding context does not already identify the operation.

Top-level `class`, `style`, native, ARIA, data attributes, and listeners are forwarded to the root, while the managed role and determinate value attributes cannot be overridden. The root exposes its native `element`, defines no component events, and is not focusable unless a consumer explicitly adds focusability, which is normally inappropriate.

Indeterminate motion uses the released three-second linear slide. Under `prefers-reduced-motion: reduce`, it changes to an opacity pulse without translation. Forced-colors mode uses `CanvasText` for the track and `Highlight` for the bar. The upstream React root and bar slot objects are translated to a fixed semantic Vue structure; `indeterminateMotion={null}` is represented by `:indeterminate-motion="false"`. Fluent's internal custom-style hook is intentionally omitted in favor of fallthrough classes, styles, and CSS token overrides.

## Rating family

`FRating` is an interactive native-radio rating control, `FRatingItem` is its context-aware composition primitive, and `FRatingDisplay` is a non-interactive rating summary. They are adapted from `@fluentui/react-rating@9.4.4`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FRating, FRatingDisplay } from '@mrpvi/fluentui-vue';

const rating = ref(3);
</script>

<template>
  <FField label="Rate this item" hint="Choose one to five stars." required>
    <FRating v-model="rating" name="product-rating" />
  </FField>
  <FRating :default-value="2.5" :step="0.5" aria-label="Detailed rating" />
  <FRatingDisplay :value="4.2" :count="1160" aria-label="4.2 out of 5 from 1,160 ratings" />
</template>
```

`FRating` supports controlled `modelValue` and initialization-only `defaultValue`, `max`, `step` (`1 | 0.5`), `color`, `size`, `name`, `itemLabel`, `disabled`, and `readOnly`. Explicitly binding `undefined` is controlled. Invalid runtime `max` and `step` values safely fall back to the released defaults. The fixed root is a managed `role="radiogroup"`; selectable values are native radios, preserving browser keyboard behavior, checked state, constraint validation, form data, form reset, and external `form="id"` ownership. `required`, `form`, and `autocomplete` route to each native radio, while Field labeling, descriptions, invalid state, and required state remain on the correct semantic targets. Consumer mouseover and mouseleave listeners compose with hover preview behavior. The root exposes `element` and `focus()`.

The default slot may contain exported `FRatingItem` children, which are intended for composition only inside `FRating` or `FRatingDisplay`. The `selected-icon` and `unselected-icon` slots receive `{ value, fill }`; their wrappers are decorative, so they must not contain interactive or accessible naming content.

`FRatingDisplay` renders a fixed `role="img"` with full or compact icon presentation, optional localized count text, and `color`, `size`, and `max` variants. Its visible value text and fallback accessible name use the same normalized/clamped value. Explicit `aria-label` suppresses generated `aria-labelledby`; explicit `aria-labelledby` remains authoritative; generated value/count IDs are used only when no consumer or Field name exists. The `icon`, `value-text`, and `count-text` slots are presentation-only and must not contain interactive controls inside the image-role subtree. The root exposes `element`.

Both components use deterministic Vue IDs for SSR/hydration, logical RTL styling, forced-color focus/state colors, and reduced-motion safeguards. React slot objects become typed Vue slots and fixed native semantics; no React or React icon runtime is bundled.

## SpinButton

`FSpinButton` is a text-editable ARIA spinbutton with increment/decrement controls, keyboard stepping, optional bounds, precision, formatted controlled values, native form participation, and automatic `FField` integration. It is adapted from `@fluentui/react-spinbutton@9.6.5`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FSpinButton } from '@mrpvi/fluentui-vue';

const price = ref<number | null>(10);
const formattedPrice = ref('$10.00');

function updatePrice(value: number | null) {
  price.value = value;
  formattedPrice.value = value === null ? '(none)' : `$${value.toFixed(2)}`;
}
</script>

<template>
  <FField label="Quantity" hint="Choose between 0 and 20." required>
    <FSpinButton :default-value="5" :min="0" :max="20" :step="1" :step-page="10" />
  </FField>

  <FSpinButton
    :model-value="price"
    :display-value="formattedPrice"
    aria-label="Price"
    @update:model-value="updatePrice"
  />
</template>
```

Key props:

- `modelValue`: controlled `number | null`; prop presence, including explicit `undefined`, selects controlled mode
- `defaultValue`: initial uncontrolled `number | null`, default `0`
- `displayValue`: formatted text for controlled usage; also supplies `aria-valuetext` unless explicitly overridden
- `min`, `max`, `step` (default `1`), `stepPage` (default `1`), and `precision`
- `appearance`: `outline | underline | filled-darker | filled-lighter`
- `size`: `small | medium`
- `disabled` and `readOnly`

The fixed visual root is a `<span>`. Top-level `class` and `style` apply to that root; native input, form, ARIA, data, and supported event attributes are routed to the internal `<input type="text" role="spinbutton">`. Managed `type`, `role`, value and range ARIA attributes remain authoritative. Increment/decrement buttons are removed from the tab order, have accessible labels, preserve input focus on mouse press, disable at exact bounds, and repeat while held.

Typing remains uncommitted until blur or Enter. Escape restores the prior displayed value. Text commits emit `update:modelValue` plus `change` data containing `{ displayValue }`; step, Page, Home, End, and button commits contain `{ value }`. In controlled mode the DOM rolls back to `modelValue`/`displayValue` until the parent updates. Directly typed numeric values are intentionally not clamped to `min`/`max`, matching upstream; subsequent step operations clamp them. Arrow Up/Down use `step`, Page Up/Down use `stepPage`, and unshifted Home/End move to defined bounds.

The native text input participates in form data using its current displayed value. Form reset restores the original uncontrolled default or the current controlled value without emitting a change. `FField` supplies the generated label relationship, descriptions, required/invalid state, and size unless explicitly overridden. The component exposes the native `element` and `focus()`.

The focus underline respects reduced motion, custom controls retain forced-color system colors, and logical positioning moves the step buttons to the inline end in both LTR and RTL. React root/input/button slot replacement and shared input-appearance context are intentionally omitted; Vue uses the fixed accessible structure, fallthrough attributes, props, and CSS token overrides.

## Switch

`FSwitch` is a native checkbox input with `role="switch"`, adapted from the released `@fluentui/react-switch@9.7.5` package. Use it for settings that take effect immediately; use a checkbox when users must submit or confirm a group of choices.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FSwitch } from '@mrpvi/fluentui-vue';

const enabled = ref(false);
</script>

<template>
  <FSwitch v-model="enabled" label="Enable notifications" />
  <FSwitch default-checked label="Compact mode" size="small" />
  <FSwitch label="Show previews" label-position="before" />
  <FSwitch label="Unavailable setting" disabled-focusable />

  <FField label="Enable alerts" hint="Applies immediately." required>
    <FSwitch name="alerts" value="enabled" />
  </FField>
</template>
```

Key props:

- `modelValue` for controlled Vue usage
- `defaultChecked` for initial uncontrolled state
- `label` or the `label` slot
- `labelPosition`: `above | after | before`
- `size`: `small | medium`
- `disabled` and `disabledFocusable`

The default size is `medium`, the default label position is `after`, and the default state is unchecked. Supplying `modelValue` makes the component controlled even when its value is `undefined`; controlled `undefined` renders unchecked. A user interaction emits `update:modelValue` and `change` with the native event plus `{ checked }`. Until the parent updates a controlled value, the native input rolls back to the current prop value. Uncontrolled switches retain their initial `defaultChecked` value for native form reset.

Top-level `class` and `style` apply to the visual root. Native input, form, ARIA, and data attributes are routed to the hidden checkbox input, while managed `type="checkbox"`, `role="switch"`, checked state, disabled semantics, and internal handlers remain authoritative. `disabled` uses native input disabling. `disabledFocusable` keeps the switch in the tab order with `aria-disabled="true"` while suppressing pointer, Space, and Enter activation. The component exposes the native `element` and a `focus()` method.

A visible component-owned label uses `FLabel`, including the upstream required marker and disabled styling. Label positions preserve the released DOM order and long labels wrap while the track remains aligned to the first line. When nested in `FField`, the Switch consumes the Field-generated ID, external label association, required state, invalid state, and validation/hint descriptions; avoid also setting the Switch's own `label` unless a second visible label is intentional.

The `indicator` slot replaces the package-owned thumb inside the fixed track wrapper. It is decorative and always hidden from assistive technology, so it must not contain interactive content or the accessible name. Native click and Space behavior come from the checkbox input. The thumb movement reverses in RTL, transitions collapse under `prefers-reduced-motion: reduce`, and custom track, checked, disabled, invalid, and focus states use system colors in forced-color mode. React root/input/indicator/Label slot objects are translated to a fixed Vue structure, root fallthrough styling, native control attributes, and typed `label` plus decorative `indicator` slots.

## Skeleton

`FSkeleton` groups visual placeholders for content that is still loading, and `FSkeletonItem` renders the individual wave or pulse stencil. They are adapted from the released `@fluentui/react-skeleton@9.7.5` package.

```vue
<FSkeleton aria-label="Loading profile" class="profile-skeleton">
  <FSkeletonItem shape="circle" :size="48" />
  <FSkeletonItem style="width: 70%" />
  <FSkeletonItem animation="pulse" appearance="translucent" style="width: 45%" />
</FSkeleton>
```

Key props shared through the nearest `FSkeleton` context:

- `animation`: `wave | pulse`, default `wave`
- `appearance`: `opaque | translucent`, default `opaque`
- `size`: `8 | 12 | 14 | 16 | 20 | 22 | 24 | 28 | 32 | 36 | 40 | 48 | 52 | 56 | 64 | 72 | 92 | 96 | 120 | 128`
- `shape`: `rectangle | square | circle`, with item default `rectangle`
- `as`: `div | span` on both components

`FSkeleton` defaults to `role="progressbar"` and `aria-busy="true"`, matching the released component. Supply a concise `aria-label` or `aria-labelledby` when the Skeleton is the loading indicator that needs its own name. For a larger region containing several placeholders, put `aria-busy="true"` and the useful accessible name on the nameable content container instead, and override the Skeleton semantics only when that produces a clearer accessibility tree. Do not create a live region for every item.

`FSkeletonItem` is visual and has no role by default. Individual item props override context values; omitted animation and appearance values inherit through nested Skeletons, while an inner Skeleton without `size` or `shape` starts a new item-sizing context. Both roots forward native, ARIA, data, listener, class, and style attributes and expose only their native `element`. They are non-interactive and should not be made focusable.

Rectangle items are 100% wide and use the selected size as height; set a class or inline style on an item to approximate the width of the content it replaces. Circle and square items use the selected size for both dimensions. The deprecated Skeleton `width` prop remains accepted and is translated to inline CSS (numbers become pixels), but new code should use class or style. Wave motion follows LTR/RTL direction, both animations stop after one near-instant iteration under reduced motion, and the released forced-color wave fallback is preserved.

React root slot objects and context hooks are translated to fixed Vue `div`/`span` roots, a default slot, and a private typed Vue injection context. The released package's deprecated width field reaches a React intrinsic-prop path without a reliable visual result; Vue intentionally retains its documented width behavior through inline CSS for compatibility.

## Slider

`FSlider` is a native range input with Fluent rail and thumb visuals, adapted from the released `@fluentui/react-slider@9.6.5` package. Use it for selecting one approximate numeric value from three or more meaningful choices.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FSlider } from '@mrpvi/fluentui-vue';

const volume = ref(40);
</script>

<template>
  <FField label="Volume" hint="Use arrow keys for single steps.">
    <FSlider v-model="volume" name="volume" :min="0" :max="100" :step="5" />
  </FField>
  <FSlider aria-label="Vertical level" :default-value="6" :min="0" :max="10" :step="2" vertical />
</template>
```

Key props:

- `modelValue` for controlled Vue usage
- `defaultValue` for uncontrolled usage
- `min`, `max`, and positive `step` numeric constraints
- `size`: `small | medium`
- `vertical` for a bottom-to-top vertical control
- `disabled`

The defaults are `min=0`, `max=100`, `step=1`, size `medium`, horizontal orientation, and initial value `0`. Initial and updated values are clamped to the range and normalized to the closest step relative to `min`, including decimal steps. Controlledness is determined by whether `modelValue` was supplied; an explicitly bound `undefined` is controlled and renders the normalized fallback value. User input emits `update:modelValue` and typed native `input`/`change` events with `{ value }`. A controlled slider immediately restores its prop value until its parent accepts the update. Changes to `defaultValue` after mount do not change either the live uncontrolled value or the native reset default.

The native `<input type="range">` is the primary control and retains browser keyboard, pointer, focus, form submission, reset, disabled, and accessibility behavior. Arrow keys move by one step, Page Up/Down use the browser's larger range increment, and Home/End select the bounds. Top-level `class` and `style` apply to the visual root; native, form, ARIA, data, and event-listener attributes are routed to the input. The input exposes its native `element` and a `focus()` method. Supply an accessible name with `FField`, `FLabel`, `aria-label`, or `aria-labelledby`; `aria-valuetext` is forwarded for application-specific value descriptions.

Horizontal progress follows document direction and reverses in RTL. Vertical progress runs from bottom to top and sets Firefox's non-standard `orient="vertical"` attribute in addition to the CSS writing-mode/fallback behavior. Small and medium thumb/rail geometry, discrete step markers, disabled styling, invalid Field styling, forced-color system colors, and reduced-motion-safe styling follow the reviewed upstream release. The rail and thumb are decorative and hidden from assistive technology.

React's root/input/rail/thumb slot objects are intentionally translated to a fixed Vue root and native input with fallthrough attributes; visual-part replacement is not exposed because it could break control geometry or semantics. The upstream component has no marks or two-thumb range-selection API. Vue adds native `input` and `change` emits and deterministic native form-reset synchronization. Do not use Slider for binary choices, fewer than three values, or ranges where exact typed entry is required.

## SearchBox

`FSearchBox` is a native search input adapted from the released `@fluentui/react-search@9.4.6` package. It combines an `<input type="search">` with Fluent leading content, focus-only trailing content, and a non-tabbable dismiss control.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FSearchBox } from '@mrpvi/fluentui-vue';

const query = ref('');
</script>

<template>
  <FField label="Product search" hint="Search by product name." required>
    <FSearchBox v-model="query" name="query" placeholder="Search products" />
  </FField>

  <FSearchBox default-value="Fluent Vue" aria-label="Search documentation">
    <template #content-before><span>Docs:</span></template>
    <template #content-after><button type="button">Voice</button></template>
    <template #dismiss><span aria-hidden="true">×</span></template>
  </FSearchBox>
</template>
```

Key props and events:

- `modelValue` for controlled Vue usage and `defaultValue` for uncontrolled initial state
- `appearance`: `outline | underline | filled-darker | filled-lighter`
- `size`: `small | medium | large`
- native input attributes including `name`, `form`, `placeholder`, `autocomplete`, `readonly`, `disabled`, and `required`
- `update:modelValue`, `input`, `change`, `search`, and `clear` emits
- `content-before`, `content-after`, and `dismiss` slots

Controlledness is determined by prop presence, including a kebab-case template `model-value` binding. User input emits the proposed value and immediately restores the controlled prop until the parent updates it. Uncontrolled values participate in native form data and reset to their original `defaultValue`. Escape and the dismiss control clear an editable value, emit the native-style update events plus `clear`, prevent pointer activation defaults, and reliably return focus to the search input. Disabled and read-only values cannot be cleared.

Top-level `class` and `style` apply to the visual root; native, form, ARIA, data, and listener attributes route to the input. `FField` supplies the generated ID, label, required and invalid state, descriptions, and inherited size. Use `FField`, `FLabel`, `aria-label`, or `aria-labelledby` for the accessible name. The dismiss control remains exposed to assistive technology but is removed from sequential keyboard navigation. `content-after` appears while focus remains within the SearchBox and may contain an accessible interactive control.

The four released appearances and three sizes are supported. Logical spacing follows RTL. Focus-border transitions collapse under reduced motion, and forced-colors mode uses system colors for the root, focus, invalid, disabled, and input states. Typeahead/autocomplete behavior remains application-owned and requires appropriate combobox/listbox semantics when added.

## Card

The Card family provides a topic container plus structured preview, header, and footer parts. It is adapted from the exact `@fluentui/react-card@9.7.2` release.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FButton, FCard, FCardFooter, FCardHeader, FCardPreview } from '@mrpvi/fluentui-vue';

const selected = ref(false);
</script>

<template>
  <FCard v-model="selected" name="selected-card" value="quarterly">
    <FCardPreview>
      <img src="/quarterly.png" alt="Quarterly report preview" />
    </FCardPreview>
    <FCardHeader>
      <template #header><h2>Quarterly report</h2></template>
      <template #description>Updated today</template>
      <template #action><FButton appearance="subtle">More</FButton></template>
    </FCardHeader>
    <p>Revenue and retention summary.</p>
    <FCardFooter><FButton appearance="primary">Open</FButton></FCardFooter>
  </FCard>
</template>
```

Key `FCard` props:

- `appearance`: `filled | filled-alternative | outline | subtle`
- `size`: `small | medium | large`
- `orientation`: `vertical | horizontal`
- `focusMode`: `off | no-tab | tab-exit | tab-only`
- `modelValue` and `defaultSelected` for controlled and uncontrolled selection
- `disabled`
- `as`: `div | article | section | button | a` for nonselectable semantic roots

A selectable card renders a visually hidden native checkbox. Native checkbox attributes including `name`, `value`, `form`, and `required` route to that input, so selection participates in form data and reset behavior. Controlled selection emits the requested value and restores the prop value until the parent updates; uncontrolled selection initializes once and returns to `defaultSelected` on native form reset. The checkbox accessible name is derived from the CardHeader title ID, or from the direct preview image description/alternative text when there is no header title. Provide a meaningful title or explicit floating selection control.

Clicking the card surface or pressing Enter on the internal checkbox toggles selection. Clicks and Enter presses originating from nested focusable controls do not toggle the card. The optional `floating-action` slot replaces the internal checkbox wrapper and is responsible for its own visible selection control and accessible name. `disabled` suppresses card activation and disables the internal checkbox, but, matching upstream, does not automatically disable slotted child controls.

Focus modes translate the reviewed Fluent focus-group behavior without bundling React Tabster. `off` leaves the card out of the tab order. The other modes make a nonselectable card focusable; Enter moves focus to its first inner control and Escape returns focus to the card. `no-tab` cycles Tab within the inner controls, while `tab-exit` and `tab-only` allow Tab to leave at the edge. Focusable cards must have a meaningful `aria-label` or `aria-labelledby` and relevant `aria-describedby` text.

`FCardHeader` exposes `image`, `header`, `description`, and `action` slots. `FCardPreview` renders default preview content followed by an optional `logo` overlay. `FCardFooter` renders its default actions followed by an optional far-edge `action` slot. All four components forward root classes, styles, native, ARIA, and data attributes and expose their native `element`; `FCard` additionally exposes `focus()`.

The family preserves released appearance, selected, disabled, focus, size, vertical/horizontal, RTL, forced-color, and reduced-motion styles. React root/part slot objects and provider direction are translated to fixed Vue part structures, typed slots, root fallthrough attributes, and logical CSS. Semantic root customization is a Vue extension for nonselectable cards; selectable cards always render a `div` so the internal checkbox remains valid HTML.

## Radio

`FRadio` wraps a native radio input and optional label. `FRadioGroup` provides a semantic `radiogroup`, a stable common name, controlled or uncontrolled selection, layout, and automatic `FField` integration. Both are adapted from the released `@fluentui/react-radio@9.6.5` package.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FRadio, FRadioGroup } from '@mrpvi/fluentui-vue';

const contactMethod = ref('email');
</script>

<template>
  <FField
    label="Preferred contact"
    hint="Choose how the team should contact you."
    validation-message="A contact method is required."
    required
  >
    <FRadioGroup v-model="contactMethod" name="contact-method" layout="horizontal">
      <FRadio value="email" label="Email" />
      <FRadio value="chat" label="Chat" />
      <FRadio value="phone" label="Phone" />
    </FRadioGroup>
  </FField>
</template>
```

`FRadio` key props:

- required `value` for submission and group selection
- `modelValue` for controlled standalone checked state
- `defaultChecked` for uncontrolled standalone state
- `label` or the semantic `label` slot
- `labelPosition`: `after | below`
- `disabled`

`FRadioGroup` key props:

- `modelValue` for controlled selection
- `defaultValue` for uncontrolled initial selection
- `name`; one deterministic common name is generated when omitted
- `layout`: `vertical | horizontal | horizontal-stacked`
- `disabled` and `required`, inherited by child radios unless explicitly overridden

Both controlled contracts use prop presence: an explicitly bound `undefined` value is controlled. A controlled radio or group emits the requested update and immediately restores the rendered prop state until its parent updates. Uncontrolled defaults initialize once, and native form reset restores the initial selection. `FRadioGroup` emits `update:modelValue` and `change` with `{ value }`; a selected `FRadio` emits `update:modelValue` with `true` and `change` with the same value data. Radio change is not emitted on deselection.

All radios with the same native `name` use browser selection and arrow-key behavior; the components intentionally add no custom keyboard handler. `FRadioGroup` generates a common name so its children remain one native group. A radio may explicitly override inherited `name`, checked state, disabled, required, label position, `aria-describedby`, or `aria-invalid` values.

Top-level `class` and `style` on `FRadio` apply to its visual `<span>` root. Remaining native, ARIA, data, and form attributes apply to the hidden native `<input type="radio">`; managed type, checked state, and change handling remain authoritative. The generated or explicit input ID is associated with the radio-owned `<label>`. The `indicator` slot is decorative, receives `{ checked }`, and is hidden from assistive technology. `FRadioGroup` forwards root attributes to its fixed `<div role="radiogroup">`, while `name` is applied to its child inputs.

Inside `FField`, RadioGroup receives the Field label through `aria-labelledby`, descriptions through `aria-describedby`, required state through `aria-required`, and invalid state. Required, description, and invalid semantics are also propagated to child native inputs. Use `FField` for the group label rather than adding separate unrelated labels to each option. Horizontal-stacked groups default child labels below their indicators; explicit radio label positions remain authoritative. Logical spacing supports RTL, and radio styles include hover, active, checked, disabled, focus, invalid, dark-theme, and forced-color states.

The React root, input, label, and indicator slot-object APIs are translated to a fixed semantic Vue structure, fallthrough attributes, and typed `label`/decorative `indicator` slots. React Tabster focus helpers are not bundled; native input focus and CSS `:focus-within` provide the released observable behavior.

## Select

`FSelect` is a styled wrapper around the native single-value `<select>` element, adapted from `@fluentui/react-select@9.5.5`. Prefer it over a custom combobox when filtering, freeform input, virtualization, multiple selection, and custom option rendering are not required; native select behavior offers stronger mobile and cross-platform accessibility.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FSelect } from '@mrpvi/fluentui-vue';

const animal = ref('dog');
</script>

<template>
  <FField label="Companion" hint="Choose one animal." required>
    <FSelect v-model="animal" name="companion">
      <option value="">Choose a companion</option>
      <optgroup label="Land animals">
        <option value="cat">Cat</option>
        <option value="dog">Dog</option>
      </optgroup>
      <optgroup label="Water animals">
        <option value="seal">Seal</option>
      </optgroup>
    </FSelect>
  </FField>
</template>
```

Key props:

- `modelValue` for controlled Vue usage
- `defaultValue` for uncontrolled initial selection
- `appearance`: `outline | underline | filled-darker | filled-lighter`
- `size`: `small | medium | large`
- native select attributes such as `name`, `form`, `required`, `disabled`, `autocomplete`, and ARIA attributes

The defaults are `appearance="outline"` and `size="medium"`. Top-level `class` and `style` apply to the visual `<span>` root; native and ARIA attributes route to the internal `<select>`. The default slot must contain native `<option>` or `<optgroup>` content. The `icon` slot replaces the decorative chevron and is always inside an `aria-hidden="true"`, pointer-inert wrapper, so it must not contain interactive content or an accessible name.

`FSelect` emits `update:modelValue` and `change`, with the native event and `{ value }` data for `change`. Controlledness is determined by prop presence. An explicitly bound `:model-value="undefined"` is controlled and renders the empty-string option. If a user chooses another option before the parent updates the prop, the native DOM selection rolls back immediately to the controlled value. In uncontrolled mode, `defaultValue` initializes selection once and native form reset restores it; a controlled value is reapplied after reset.

Inside `FField`, Select inherits the generated ID, native label association, required state, validation/hint descriptions, invalid state, and Field size. Explicit Select attributes and an explicit `size` remain authoritative. The component exposes the native `element` and `focus()`.

Native select keyboard behavior, option grouping, form serialization, validation, and mobile picker UI are intentionally left to the browser. The public value/event contract is scalar. Native `multiple` may still be forwarded as a raw fallthrough attribute for released-runtime compatibility, but it is unsupported because Fluent Select is designed as a basic single-select; use a future Combobox/Listbox family or a native `<select multiple>` directly when multiple selection is required. The native numeric `size` attribute is also reserved for the styled `small | medium | large` component prop and is not forwarded.

Filled appearances require sufficient contrast with the surrounding surface. Prefer outline or underline when the adjacent fill does not provide at least a 3:1 boundary contrast. React root/select slot objects, provider-driven input appearance overrides, and React callback APIs are translated to a fixed Vue root, native option children, an icon slot, Vue `v-model`, and typed emits.

## Input

```vue
<FInput v-model="value" appearance="outline" size="medium">
  <template #content-before>$</template>
  <template #content-after>USD</template>
</FInput>
```

Key props:

- `modelValue` for controlled Vue usage
- `defaultValue` for uncontrolled usage
- `appearance`: `outline | underline | filled-darker | filled-lighter`
- `size`: `small | medium | large`
- native input attributes are forwarded to the `<input>`

Top-level `class` and `style` are applied to the visual root. The component emits `update:modelValue`, `input`, and `change`.

`content-before` and `content-after` are typed semantic slots. Their content is not hidden from assistive technology, so text and interactive controls are supported. Consumers remain responsible for giving interactive adornments an accessible name.

Controlledness is determined by whether `modelValue` was supplied, not by its value. An explicitly bound `:model-value="undefined"` is controlled and renders as an empty string. In uncontrolled mode, `defaultValue` initializes the native input once and native form reset restores that default.

The shadow appearances are retained for source compatibility but are deprecated, matching Fluent UI React.

## Textarea

`FTextarea` is a native multiline text control with Fluent appearances, sizes, resize behavior, Vue-controlled state, and automatic `FField` integration.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FTextarea } from '@mrpvi/fluentui-vue';

const biography = ref('');
</script>

<template>
  <FField
    label="Biography"
    hint="Write a short profile."
    validation-message="A biography is required."
    required
  >
    <FTextarea v-model="biography" placeholder="Tell us about yourself" resize="vertical" />
  </FField>
</template>
```

Key props:

- `modelValue` for controlled Vue usage
- `defaultValue` for uncontrolled usage
- `appearance`: `outline | filled-darker | filled-lighter`
- `size`: `small | medium | large`
- `resize`: `none | horizontal | vertical | both`
- native textarea attributes such as `rows`, `cols`, `maxlength`, `minlength`, `placeholder`, `name`, `form`, `autocomplete`, `readonly`, `disabled`, and `required`

The default appearance is `outline`, size is `medium`, and resizing is disabled with `resize="none"`. The shadow-filled appearances remain available for Fluent source compatibility but are deprecated and produce a development warning.

Top-level `class` and `style` apply to the visual root. Other fallthrough attributes are routed to the native `<textarea>`. The component emits `update:modelValue`, `input`, and `change`, with the native event and `{ value }` data for the last two events.

Controlledness is determined by prop presence. An explicitly bound `:model-value="undefined"` is controlled and renders as an empty string. In uncontrolled mode, `defaultValue` initializes the textarea once, and native form reset restores the original default. The component exposes the native `element`, `focus()`, and `select()`.

When used inside `FField`, Textarea automatically inherits the generated ID, label association, required state, validation and hint descriptions, invalid state, and Field size. An explicit Textarea size or explicit ARIA/native control attribute remains authoritative.

Use `FField`, `FLabel`, `aria-label`, or `aria-labelledby` to provide an accessible name. `FTextarea` intentionally has no built-in label or content slots because the native control cannot contain arbitrary children.

## Checkbox

```vue
<script setup lang="ts">
import { ref } from 'vue';
import type { CheckboxValue } from '@mrpvi/fluentui-vue';

const state = ref<CheckboxValue>('mixed');
</script>

<template>
  <FCheckbox v-model="state" label="Select all" />
</template>
```

Key props:

- `modelValue`: `boolean | 'mixed'`
- `defaultChecked`: `boolean | 'mixed'`
- `label` or the `label` slot
- `labelPosition`: `before | after`
- `shape`: `square | circular`
- `size`: `medium | large`

The mixed state uses the native `HTMLInputElement.indeterminate` property. Native form, required, disabled, name, value, and ARIA attributes are forwarded to the checkbox input.

The `label` slot supplies semantic label content. The scoped `indicator` slot receives `{ checked }`, is decorative, and is hidden from assistive technology because the native checkbox exposes checked and mixed state.

As with Input, supplying `modelValue` makes the component controlled even when the bound value is `undefined`; controlled `undefined` renders as unchecked. In uncontrolled mode, `defaultChecked` initializes the native checkbox once and native form reset restores the initial state.

## Themes

`src/styles/tokens.css` is generated from the complete 459-token `webLightTheme` and `webDarkTheme` exports in the pinned `@fluentui/react-theme@9.2.2` dependency. Invariant values are emitted once and theme-specific values are emitted in stable sorted light/dark blocks. Do not edit the generated file directly; use `npm run tokens:generate`, and use `npm run tokens:check` to detect stale output.

The default variables use Fluent's web light token values. Apply `.fui-theme-dark` to an ancestor to use the included dark values:

```html
<div class="fui-theme-dark">
  <!-- components -->
</div>
```

All theme values are CSS custom properties and can be overridden by applications.

## Intentional scope limits

- This is an early nineteen-component parity slice, not a complete Fluent UI Vue library.
- `FField` integrates the current Input, Checkbox, Textarea, Switch, RadioGroup, Select, SearchBox, ProgressBar, Slider, and SpinButton controls; future form controls will adopt the same internal context contract as they are ported.
- The default checkbox marks are package-owned SVG/CSS primitives. Presence fallback SVG paths are the only privately bundled Fluent System Icons adaptation and are covered by the third-party notice.
- Griffel and React-specific Tabster bindings are not included.
- Visual parity is based on the reviewed upstream versions and should be regression-tested before public release.

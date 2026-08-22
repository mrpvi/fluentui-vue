# @local/fluent-vue

A native Vue 3 adaptation of selected Microsoft Fluent UI React v9 components. This package does not require React and does not wrap Fluent Web Components.

> The package name is temporary and the package is currently private. It is not an official Microsoft package.

## Current components

- `FButton` — adapted from `@fluentui/react-button` 9.11.0
- `FInput` — adapted from `@fluentui/react-input` 9.8.6
- `FCheckbox` — adapted from `@fluentui/react-checkbox` 9.6.4
- `FDivider` — adapted from `@fluentui/react-divider` 9.7.4
- `FImage` — adapted from `@fluentui/react-image` 9.4.4
- `FBadge`, `FCounterBadge`, and `FPresenceBadge` — adapted from `@fluentui/react-badge` 9.5.5
- `FSpinner` — adapted from `@fluentui/react-spinner` 9.8.5
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
local-fluent-vue-0.1.0.tgz
```

The package is marked `private`, which prevents accidental npm publication but does not prevent local installation.

### 2. Install the tarball in another Vue project

Using npm:

```bash
cd /path/to/your-vue-project
npm install /Users/ali/Desktop/flaunt-convert-react/local-fluent-vue-0.1.0.tgz
```

Using pnpm:

```bash
pnpm add /Users/ali/Desktop/flaunt-convert-react/local-fluent-vue-0.1.0.tgz
```

Using Yarn:

```bash
yarn add file:/Users/ali/Desktop/flaunt-convert-react/local-fluent-vue-0.1.0.tgz
```

The consuming application must use Vue 3.5 or later because Vue is a peer dependency:

```bash
npm install vue@^3.5.0
```

### 3. Import the required stylesheet

Import the emitted stylesheet once in the consuming application's entry file. JavaScript imports do not load the global tokens and shared foundations automatically, so this explicit stylesheet import is required:

```ts
import { createApp } from 'vue';
import { FluentVue } from '@local/fluent-vue';
import '@local/fluent-vue/style.css';
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
  FCheckbox,
  FCounterBadge,
  FDivider,
  FField,
  FImage,
  FInput,
  FLabel,
  FLink,
  FPresenceBadge,
  FSpinner,
  FText,
  FTextarea,
  type CheckboxValue,
} from '@local/fluent-vue';
import { ref } from 'vue';

const name = ref('');
const biography = ref('');
const accepted = ref<CheckboxValue>(false);
</script>

<template>
  <FField label="Your name" required>
    <FInput v-model="name" placeholder="Your name" />
  </FField>
  <FField label="Biography">
    <FTextarea v-model="biography" resize="vertical" />
  </FField>
  <FCheckbox v-model="accepted" label="Accept terms" />
  <FDivider>Review</FDivider>
  <FImage src="/summary.png" alt="Account summary chart" shape="rounded" />
  <FBadge appearance="tint" color="success">Verified</FBadge>
  <FCounterBadge :count="120" role="img" aria-label="120 unread notifications" />
  <FPresenceBadge status="available" aria-label="Available for support" />
  <FSpinner label="Loading account" size="large" />
  <FLink inline href="/privacy">Read the privacy policy</FLink>
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
npm install /Users/ali/Desktop/flaunt-convert-react/local-fluent-vue-0.1.0.tgz --force
```

Restart the consuming project's development server. If Vite still uses a cached package copy, remove its dependency cache and start it again:

```bash
rm -rf node_modules/.vite
npm run dev
```

For frequent iterations, incrementing the package version before packing—such as `0.1.1`, `0.1.2`, and so on—also avoids package-manager cache ambiguity.

## Future npm installation

After the package receives an approved publishable name and is published, installation will use the npm registry instead of a local tarball:

```bash
npm install @local/fluent-vue
```

The package name is currently temporary, so this registry command is not available yet.

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
import { FField, FInput } from '@local/fluent-vue';
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

`FInput`, `FCheckbox`, and `FTextarea` automatically consume the enclosing Field context. Field generates the control ID, connects `label for` to that ID, merges validation and hint IDs into `aria-describedby`, applies native `required`, and defaults `aria-invalid="true"` for errors. Explicit control attributes remain authoritative; for example, an explicit `aria-invalid="false"` or `:required="false"` is preserved.

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
import { FField, FTextarea } from '@local/fluent-vue';

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
import type { CheckboxValue } from '@local/fluent-vue';

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

- This is an early thirteen-component parity slice, not a complete Fluent UI Vue library.
- `FField` integrates the current Input, Checkbox, and Textarea controls; future form controls will adopt the same internal context contract as they are ported.
- The default checkbox marks are package-owned SVG/CSS primitives. Presence fallback SVG paths are the only privately bundled Fluent System Icons adaptation and are covered by the third-party notice.
- Griffel and React-specific Tabster bindings are not included.
- Visual parity is based on the reviewed upstream versions and should be regression-tested before public release.

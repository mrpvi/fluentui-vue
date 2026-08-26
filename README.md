# @mrpvi/fluentui-vue

Native Vue 3 components adapted from Microsoft Fluent UI React v9.

> This is an independent, unofficial package and is not affiliated with or endorsed by Microsoft.

## Features

- Native Vue 3 components with idiomatic props, events, slots, and `v-model` APIs
- No React runtime and no Fluent Web Components wrapper
- TypeScript declarations, ESM, and CommonJS builds
- Accessible native semantics, keyboard behavior, focus states, and form integration
- SSR and hydration support
- Light and dark themes using Fluent design tokens
- Logical RTL styling, forced-colors support, and reduced-motion handling

## Installation

```bash
npm install @mrpvi/fluentui-vue
```

Vue `^3.5.0` is required as a peer dependency.

Import the package stylesheet once in your application entry file. Component imports alone do not load the shared tokens and foundations.

```ts
import '@mrpvi/fluentui-vue/style.css';
```

## Quick start

### Register all components

```ts
import { createApp } from 'vue';
import { FluentVue } from '@mrpvi/fluentui-vue';
import '@mrpvi/fluentui-vue/style.css';
import App from './App.vue';

createApp(App).use(FluentVue).mount('#app');
```

The plugin globally registers all exported `F*` components.

### Import components individually

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FButton, FField, FInput } from '@mrpvi/fluentui-vue';
import '@mrpvi/fluentui-vue/style.css';

const name = ref('');
</script>

<template>
  <FField label="Name" required>
    <FInput v-model="name" placeholder="Your name" />
  </FField>

  <FButton appearance="primary">Save</FButton>
</template>
```

## Components

### Actions and navigation

`FButton`, `FCompoundButton`, `FToggleButton`, `FLink`

### Forms and inputs

`FField`, `FLabel`, `FInput`, `FTextarea`, `FCheckbox`, `FSwitch`, `FRadio`, `FRadioGroup`, `FSelect`, `FSearchBox`, `FSlider`, `FSpinButton`, `FRating`, `FRatingItem`, `FRatingDisplay`, `FListbox`, `FOption`, `FOptionGroup`, `FDropdown`

### Content and layout

`FText`, `FDivider`, `FImage`, `FCard`, `FCardHeader`, `FCardPreview`, `FCardFooter`, `FAccordion`, `FAccordionItem`, `FAccordionHeader`, `FAccordionPanel`, `FTabList`, `FTab`, `FBreadcrumb`, `FBreadcrumbItem`, `FBreadcrumbButton`, `FBreadcrumbDivider`, `FList`, `FListItem`, `FAvatar`, `FAvatarGroup`, `FAvatarGroupItem`, `FAvatarGroupPopover`, `FPersona`

### Feedback and status

`FBadge`, `FCounterBadge`, `FPresenceBadge`, `FSpinner`, `FProgressBar`, `FSkeleton`, `FSkeletonItem`

## Themes

Light tokens are applied by default. Add `.fui-theme-dark` to an ancestor to use the included dark theme.

```vue
<template>
  <main class="fui-theme-dark">
    <FButton appearance="primary">Dark theme</FButton>
  </main>
</template>
```

Applications can override the exported `--color*`, `--font*`, and related CSS custom properties to define their own themes.

## Compatibility and scope

- Requires Vue `^3.5.0`
- Supports the selected components listed above; this is not a complete Fluent UI Vue implementation
- Components are native Vue adaptations of reviewed Fluent UI React v9 behavior
- React is neither required nor bundled
- Exact upstream versions, provenance, and intentional differences are documented in [UPSTREAM.md](./UPSTREAM.md)

## Documentation

- [Changelog](./CHANGELOG.md)
- [Upstream provenance](./UPSTREAM.md)
- [Third-party notices](./THIRD_PARTY_NOTICES.md)
- [Architecture and engineering rules](https://github.com/mrpvi/fluentui-vue/blob/main/ARCHITECTURE.md)
- [Component roadmap](https://github.com/mrpvi/fluentui-vue/blob/main/COMPONENT_ROADMAP.md)
- [Source code](https://github.com/mrpvi/fluentui-vue/tree/main/src)

Public exports and generated TypeScript declarations provide the detailed component API surface.

## Development

```bash
npm install
npm run dev
npm run check
```

Browser tests require local Playwright binaries:

```bash
npx playwright install chromium firefox webkit
npm run test:browser
npm run test:visual
```

See [ARCHITECTURE.md](https://github.com/mrpvi/fluentui-vue/blob/main/ARCHITECTURE.md) for the complete development and quality requirements.

## License and attribution

Released under the [MIT License](./LICENSE).

This project adapts selected components from Microsoft Fluent UI. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) and [UPSTREAM.md](./UPSTREAM.md) for attribution and provenance.

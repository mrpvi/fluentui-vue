# Setup and theming

Use for initial integration, missing styles, named/global imports, theme tokens,
RTL, or popups rendered outside a themed section. Examples target the `1.0.1`
package contract; check the installed declarations if versions differ.

## Install and import

Use the consuming app's existing package manager. With npm:

```bash
npm install @mrpvi/fluentui-vue
```

Vue `^3.5.0` is a peer dependency. Do not install React or Fluent Web Components
for this library. The plugin skill is documentation; installing it does not
install the npm package.

### Default: named component imports

In a client-rendered Vue app, put the shared stylesheet in `main.ts`:

```ts
import { createApp } from 'vue';
import '@mrpvi/fluentui-vue/style.css';
import App from './App.vue';

createApp(App).mount('#app');
```

`App.vue` (no additional stylesheet import):

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FButton, FField, FInput } from '@mrpvi/fluentui-vue';

const name = ref('');
</script>

<template>
  <main>
    <FField label="Name" required>
      <FInput v-model="name" placeholder="Your name" />
    </FField>
    <FButton appearance="primary">Save</FButton>
    <section class="fui-theme-dark" aria-label="Dark preview">
      <FButton appearance="primary">Preview action</FButton>
    </section>
  </main>
</template>
```

Do not turn a missing stylesheet into scattered overrides of `.fui-*` classes.
Import components and exported types from the package root, not component subpaths
or private implementation modules.

### Existing global registration

If the application uses global registration, keep it. This alternative `main.ts`
registers all exported `F*` components:

```ts
import { createApp } from 'vue';
import { FluentVue } from '@mrpvi/fluentui-vue';
import '@mrpvi/fluentui-vue/style.css';
import App from './App.vue';

createApp(App).use(FluentVue).mount('#app');
```

Use one setup approach, not both entry files. Global runtime registration does
not by itself guarantee the app's template type checker knows every component;
retain named imports where its typing setup requires them.

For Nuxt or another SSR framework, use that application's shared CSS entry and
existing app/plugin lifecycle instead of adding a client-only `createApp` entry.
Do not assume this library ships a Nuxt module. Keep hydration state deterministic
and use the framework's supported teleport targets; do not access `document` in
server setup just to choose a target.

## Themes and CSS variables

Light tokens are supplied by default. Place `.fui-theme-dark` on the physical DOM
ancestor of elements that need dark tokens. There is no required Vue/React
`FluentProvider`, `webLightTheme`, or `webDarkTheme` object.

Scoped theme CSS can use exported variables without changing package files:

```css
.account-panel {
  color: var(--colorNeutralForeground1);
  background: var(--colorNeutralBackground1);
  padding: var(--spacingHorizontalM);
}
```

For brand overrides, inspect the shipped `style.css` for exact token names and
set the relevant custom properties on an application-owned ancestor. Check both
foreground/background contrast and hover/pressed/disabled tokens; overriding one
brand color does not define an accessible full theme. Do not edit generated
package tokens or install the React theme runtime to apply CSS variables.

### Popup theme and direction inheritance

Vue injection follows the component tree, but CSS variables and `dir` follow the
rendered DOM. Most popup families can teleport to `body`, outside a locally
styled section. A dark wrapper around the trigger is insufficient in that case.

For an application-wide theme, apply the class and direction to a common document
ancestor that contains popup targets, using the app's existing theme management.
For section-local themes, use a mounted target inside the themed section or an
inline rendering option only where supported:

| Family                               | Inline prop    | Target prop  |
| ------------------------------------ | -------------- | ------------ |
| `FCombobox`, `FDropdown`, `FPopover` | `inline-popup` | `mount-node` |
| `FMenu`, `FToaster`                  | `inline`       | `mount-node` |
| `FDialog`                            | No inline prop | `mount-node` |

Check the installed component types; don't spread `inline-popup` onto every
surface. A custom teleport target must exist when the overlay renders. Inline
rendering also changes clipping/stacking behavior; verify it under scrolling and
`overflow: hidden`, not just in an isolated demo. For RTL, set `dir="rtl"` on the
physical ancestor and preserve logical spacing properties in app overrides.

## Verify setup

1. Use the app's existing typecheck/build scripts. Check the exported types at the
   installed package's `types` entry if an import or prop fails.
2. Confirm the browser loads the shared stylesheet once and the component gets
   its expected computed token values. A missing CSS variable is a setup issue,
   not a reason to rewrite the component.
3. Inspect both the trigger and open popup in light/dark themes and relevant RTL
   layouts. Check keyboard focus visibility and accessible names.
4. When applicable, exercise forced-colors and reduced-motion modes without
   overriding the library's focus outlines or motion preferences.
5. For SSR, run the app's server render/hydration checks too; a client build alone
   does not prove teleport hydration correctness.

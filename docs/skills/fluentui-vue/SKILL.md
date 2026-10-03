---
name: fluentui-vue
description: >
  Use this skill when building, integrating, or troubleshooting Vue applications
  with @mrpvi/fluentui-vue (Fluent UI Vue): installing the library, using F*
  components, binding forms and selections, composing menus/dialogs/popovers,
  rendering data grids, dispatching toasts, or fixing themes, accessibility,
  slots, events, popup placement, and component TypeScript errors. Also use it
  for UI changes in an application already using this package, even when the
  request does not repeat the package name. This is consumer guidance, not for
  maintaining the library, unrelated Vue UI libraries, Fluent UI React-only
  code, or Fluent Web Components.
license: MIT
---

# Fluent UI Vue

Build applications with `@mrpvi/fluentui-vue`, an independent, unofficial native
Vue adaptation of selected Fluent UI React v9 components. React examples are not
this package's API. Neither React nor Fluent Web Components is required.

## Workflow

1. **Inspect the consuming app first.** Check its package manager/lockfile, Vue
   version, installed `@mrpvi/fluentui-vue` version, app entry, stylesheet imports,
   and existing component conventions. Do not scaffold a new app or replace its
   architecture unless requested.
2. **Confirm setup.** Vue `^3.5.0` is required. Install the package using the
   application's package manager if missing. Import
   `@mrpvi/fluentui-vue/style.css` once in the app's shared entry. Prefer named
   `F*` imports from `@mrpvi/fluentui-vue`; preserve existing global `FluentVue`
   registration rather than migrating it unnecessarily.
3. **Load only the reference needed for the task:**
   - Read [setup and theming](references/setup-and-theming.md) for installation,
     registration, dark mode, CSS variables, RTL, SSR setup, or unstyled popups.
   - Read [forms and state](references/forms-and-state.md) for fields, inputs,
     selection controls, `v-model`, defaults, and event payloads.
   - Read [compound components](references/compound-components.md) for menus,
     dialogs, popovers, toast providers, scoped-slot grids, or focus/dismissal.
4. **Verify the exact API against the installed version.** Resolve the package's
   `package.json`; follow its `exports` and `types` entry to generated declarations
   (currently `dist/index.d.ts` and declarations it re-exports). Inspect the
   component's props, emits, slots, and related types. Do not guess a prop from
   its React counterpart or assume all `F*` components share the same model.
5. **Implement Vue-native composition.** Use `<script setup lang="ts">`, Vue
   slots, and the component's actual model/event contracts, following the app's
   existing style. Keep state ownership explicit and give interactive controls
   accessible labels. Prefer built-in focus/keyboard behavior over reimplementing it.
6. **Verify in the consumer application.** Run its existing typecheck, build, and
   relevant tests. For interactive changes, exercise keyboard navigation, Escape,
   focus return, and accessible names; inspect teleported UI under the actual
   theme. Report exactly which checks ran and which were unavailable.

## Gotchas to check before coding

- **Components alone do not load shared foundations.** Import `style.css` once;
  do not inject it into every component, and do not import internal `src/` paths.
  The current public subpaths are the root, `style.css`, and `package.json`, not
  `@mrpvi/fluentui-vue/Button` or arbitrary `dist/` modules.
- **No React provider or React slot objects.** Use Vue named slots such as
  `#icon`, not React `icon={{ children: ... }}`. There is no exported
  `FluentProvider` to install for theming; use CSS token classes/overrides.
- **Models are component-specific.** `FInput` uses string `v-model`;
  `FDropdown`/`FCombobox` separate display/input text (`v-model`) from selected
  values (`v-model:selected-options`, a `string[]`, even for single selection).
  Their popup state is `v-model:open`. Do not use bare `v-model` for their selection.
- **Omission is not the same as undefined.** Some controls use prop presence to
  determine controlledness. Binding a model to `undefined` can still make it
  controlled and empty. Use `default*` props for uncontrolled initial state, or
  initialized refs and update bindings for controlled state; do not mix both for
  the same state channel.
- **`FField` provides control context.** Put the supported control in its default
  slot; don't put multiple independently labelled inputs under one field. Native
  or third-party controls need the field's scoped control attributes explicitly.
- **`FSelect` takes native `<option>`/`<optgroup>`.** `FOption` belongs to listbox,
  dropdown, and combobox families; it is not a universal option component.
- **Triggers render elements, not React child enhancement.** `FDialogTrigger`,
  `FPopoverTrigger`, and `FMenuTrigger` default to native buttons. Put text or
  decorative content inside them, not another button. Use `type="button"` on
  `FMenuTrigger` in forms. Icon-only triggers still need an accessible name.
- **Compound children need their root's context.** Keep dialog/menu/popover parts
  inside their corresponding root. In the checked dialog implementation, mount
  `FDialogSurface` with `v-if="open"` so its focus target registers when opened;
  see the version-specific workaround in the compound reference. Call
  `useToastController()` in a descendant component of `FToaster`, not in the same
  component that renders the provider.
- **Teleport preserves Vue context, not CSS ancestry.** A popup in `body` may
  leave a section's dark theme, token overrides, or `dir`. Theme the physical
  target ancestor or use the component's supported placement controls. The prop
  is `inline-popup` on combobox/dropdown/popover, but `inline` on menu/toaster;
  dialog has `mount-node`, not `inline-popup`.
- **Do not infer complete Fluent React parity.** Check public exports before
  proposing components, hooks, virtualization, slot callbacks, or theme helpers.

## Source of truth and version handling

These examples were checked against the repository's package version `1.0.1`.
The consumer's installed version may differ. Read its actual metadata and
exported declarations before adapting an example; do not silently upgrade it.
Do not use the exported `packageVersion` constant as the version authority.

If declarations do not explain behavior, consult examples/tests in the
[package repository](https://github.com/mrpvi/fluentui-vue) for the matching
release. `main` may be newer than the installed package. A repository checkout is
optional: never require a consumer to have `src/`, `playground/`, or repository
maintenance scripts in their app. If an API cannot be verified, say so instead
of presenting a plausible React translation as working Vue code.

## Completion checklist

- [ ] Root imports resolve and the stylesheet is loaded once.
- [ ] Model shapes, defaults, event arguments, and slots match installed types.
- [ ] Controls have labels; triggers avoid nested interactive elements.
- [ ] Compound parts and composables have the required ancestor context.
- [ ] Dark/RTL behavior covers teleported content when relevant.
- [ ] Consumer typecheck/build and relevant interaction checks ran, or skips are stated.

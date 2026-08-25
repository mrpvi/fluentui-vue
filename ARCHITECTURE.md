# Architecture and engineering rules

This document defines the architecture, quality standards, and implementation rules for `@mrpvi/fluentui-vue`.

The project is a native Vue 3 adaptation of selected Microsoft Fluent UI React v9 components. It must preserve Fluent UI's design intent, accessibility, behavior, and visual states while exposing idiomatic Vue APIs. It must not depend on React or mechanically reproduce React-specific architecture.

## 1. Core principles

1. **Vue-native first**
   - Use Vue 3 Composition API, `<script setup>`, TypeScript, slots, emits, and `v-model`.
   - Translate React concepts rather than imitating hooks, contexts, JSX runtime, or React slot utilities.

2. **Accessible by default**
   - Prefer native HTML semantics.
   - Keyboard, focus, disabled, labeling, form, and ARIA behavior are part of the component contract.
   - Visual similarity is not sufficient without behavioral and accessibility parity.

3. **Small public API**
   - Export only stable APIs needed by consumers.
   - Keep internal utilities private until at least two or three components need the same behavior.
   - Avoid speculative abstractions.

4. **Predictable source parity**
   - Record the upstream package version, source path, and commit used for every port.
   - Explicitly document intentional differences from Fluent UI React.
   - Do not claim complete parity unless tests demonstrate it.

5. **Framework independence at the foundation**
   - Theme tokens and component styles should use CSS custom properties and plain CSS.
   - Shared foundations must not depend on React, Griffel React, or React-specific Tabster bindings.

6. **Tree-shakable and type-safe**
   - Components must support individual named imports.
   - Vue remains a peer dependency and is externalized from the package bundle.
   - Public props, emits, slot contracts, and exported utilities must be typed.

## 2. Target directory structure

Use this structure as the project grows:

```text
.
├── playground/                    # Local development application
│   ├── App.vue
│   └── main.ts
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.vue
│   │   │   ├── Button.types.ts
│   │   │   ├── button.css
│   │   │   ├── Button.test.ts     # Move tests beside source when practical
│   │   │   └── index.ts
│   │   └── ...
│   ├── composables/               # Reusable Vue state and behavior only
│   ├── utilities/                 # Framework-neutral helpers
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── shared.css
│   │   └── index.css
│   ├── index.ts                   # Public package exports
│   ├── plugin.ts                  # Optional global component registration
│   └── types.ts                   # Truly package-wide public types only
├── scripts/                       # Token generation and maintenance scripts
├── tests/                         # Integration and package-level tests
├── ARCHITECTURE.md
├── README.md
├── UPSTREAM.md
└── THIRD_PARTY_NOTICES.md
```

### Directory rules

- Each component owns its Vue implementation, types, styles, tests, and barrel export.
- Do not create a global component type file for types used by only one component.
- Put reusable Vue state in `src/composables`.
- Put DOM, string, object, or token helpers that do not depend on Vue in `src/utilities`.
- Keep the playground outside `src` so it can never become part of the library entry graph.
- Keep package-level integration tests in `tests`; component unit tests may be colocated as the library grows.

## 3. Component architecture

Every component should follow the same implementation layers.

### 3.1 Public types

`ComponentName.types.ts` defines:

- Public prop types
- Public emit types
- Public state/value types needed by consumers
- Documented string unions for variants, sizes, shapes, and appearances

Example:

```ts
export type ButtonAppearance = 'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent';

export interface ButtonProps {
  appearance?: ButtonAppearance;
  disabled?: boolean;
}

export interface ButtonEmits {
  click: [event: MouseEvent];
}
```

Rules:

- Do not expose internal DOM-state types.
- Prefer explicit unions over unrestricted strings when Fluent defines finite values.
- Use `boolean | 'mixed'` only where a real tri-state contract exists.
- Avoid `any`; use `unknown` and narrow it when an external value is genuinely unknown.

### 3.2 Vue implementation

Each `.vue` component should:

- Use `<script setup lang="ts">`.
- Call `defineOptions({ name, inheritAttrs })` when custom attribute routing is needed.
- Use `withDefaults(defineProps<...>(), ...)` for documented defaults.
- Use typed `defineEmits`.
- Use `computed` for derived state and modifier classes.
- Expose the primary native element and essential imperative operations through `defineExpose` only when useful.
- For static DOM template refs, prefer Vue 3.5 `useTemplateRef<T>()`; otherwise initialize refs explicitly as `ref<T | null>(null)`.
- Treat template refs as nullable after conditional rendering and after asynchronous boundaries.
- Avoid watchers when the same behavior can be expressed with computed state.
- Use `flush: 'post'` only when an effect must read or synchronize the patched DOM; avoid `flush: 'sync'` except for documented correctness requirements.
- Create watchers synchronously in `setup()` or lifecycle hooks so Vue disposes them automatically. A watcher created after an async boundary must retain and call its stop handle during cleanup.
- Clean up every event listener, observer, timer, watcher, and subscription created by the component.

### 3.3 Controlled and uncontrolled state

Components may support both Vue-controlled and uncontrolled usage when the upstream component supports both.

Controlled example:

```vue
<FInput v-model="value" />
```

Uncontrolled example:

```vue
<FInput default-value="Initial value" />
```

Rules:

- `modelValue` is the controlled value.
- `defaultValue` or `defaultChecked` initializes internal state once.
- Changes to a default prop after mount must not reset internal state.
- User interaction emits `update:modelValue` in both modes.
- A controlled component must render the prop value until the parent updates it.
- Prop-only updates must not emit user-interaction events.
- Define controlledness by a documented, package-wide prop-presence rule rather than truthiness.
- Decide and document whether an explicitly bound `undefined` model value is controlled; all components must apply the same decision.
- If model modifiers are supported, document and test them. Unsupported modifiers must not silently alter the component contract.
- Extract a shared `useControllableState` composable when a third component needs this pattern or when duplication becomes error-prone.

### 3.4 Attribute routing

Every component must document where fallthrough attributes go.

- Single-root native controls may forward attributes directly.
- Composite controls must use `inheritAttrs: false` and route attributes deliberately.
- `class` and `style` normally belong to the visual root.
- Form and ARIA attributes normally belong to the native input/control.
- Do not let `v-bind="$attrs"` silently override managed state such as `disabled`, `checked`, `value`, `role`, or event handlers.
- Preserve consumer event handlers where they are part of the supported public contract.

### 3.5 Slots

- Use the default slot for primary content.
- Use kebab-case names in templates: `content-before`, `content-after`.
- Use named slots for visual composition: `icon`, `label`, `indicator`, `trigger`, `actions`.
- Use scoped slots only when consumers need component state.
- Public named and scoped slots are part of the component API and must be documented alongside props and emits.
- Use typed `defineSlots` when an exported component has named slots or exposes slot props.
- Slot-prop names and types are stable public API and may change only in a breaking release.
- Render a slot wrapper only when the relevant slot exists or when the wrapper provides required semantics.
- Slot content must not break native semantics or accessible labeling.
- A slot that permits interactive content must never be placed inside an `aria-hidden` wrapper.
- Decorative-only slots must be documented as decorative before their wrappers use `aria-hidden="true"`.

### 3.6 Emits

- Use `update:modelValue` for `v-model`.
- Prefer native event names when behavior corresponds to a native event.
- Include the original native event when consumers may need it.
- Add a typed data object when the native event does not expose the component-level value conveniently.
- Never emit the same model update twice for one user action.

Example:

```ts
export interface InputEmits {
  'update:modelValue': [value: string];
  input: [event: Event, data: { value: string }];
  change: [event: Event, data: { value: string }];
}
```

### 3.7 SSR and hydration

Unless a component is explicitly documented as client-only:

- Initial server-rendered markup must be deterministic and valid HTML.
- Do not read `window`, `document`, `navigator`, media queries, storage, layout, or time-dependent values during setup or render without a server-safe guard.
- DOM measurements, positioning, observers, and browser listeners must start on the client and degrade safely when mounted hooks do not run.
- Do not render random IDs, locale-dependent text, current time, or client-only state differently on the server and client.
- Treat hydration warnings as defects. `data-allow-mismatch` may be used only for a documented, unavoidable, narrowly scoped mismatch; it must not suppress nondeterministic rendering.
- Add SSR and hydration coverage before publishing a component that generates IDs, teleports content, measures the DOM, or renders browser-derived state.

## 4. Naming conventions

### Files

- Vue component: `Button.vue`
- Public types: `Button.types.ts`
- Styles: `button.css`
- Tests: `Button.test.ts`
- Barrel: `index.ts`
- Composable: `useControllableState.ts`
- Framework-neutral utility: `mergeIds.ts`

### Public components

Use an `F` prefix to avoid collisions with native HTML and generic application components:

```text
FButton
FInput
FCheckbox
```

The prefix may be revisited when the final package name is selected, but it must remain consistent within a release line.

### CSS

Use stable Fluent-style class names:

```css
.fui-Button {
}
.fui-Button__icon {
}
.fui-Button--primary {
}
.fui-Button--disabled {
}
```

Rules:

- Root: `.fui-Component`
- Slot/part: `.fui-Component__part`
- Variant/state: `.fui-Component--modifier`
- Do not style components using generated Vue scope attributes as a public contract.
- Do not require consumers to target internal classes unless those classes are explicitly documented.

## 5. Styling architecture

### 5.1 Design tokens

All reusable design decisions must use CSS custom properties.

```css
.fui-Button {
  color: var(--fui-color-neutral-foreground-1);
  border-radius: var(--fui-border-radius-medium);
}
```

Rules:

- Do not add hardcoded Fluent colors inside component CSS when a token exists.
- Component-only dimensions may be literal when they are part of the upstream component specification.
- Use semantic token names rather than raw palette names wherever upstream Fluent uses semantic tokens.
- Light values belong to `:root, .fui-theme-light`.
- Dark overrides belong to `.fui-theme-dark`.
- Consumer-defined token overrides must work without rebuilding the library.

### 5.2 Token generation

The current hand-maintained token subset is acceptable only for the initial three-component prototype. Before broad component expansion:

1. Add a deterministic token-generation script.
2. Source values from pinned Fluent theme exports.
3. Generate both light and dark CSS variables.
4. Sort output consistently.
5. Include a generated-file header with source package and commit.
6. Add a test that detects stale generated output.
7. Never hand-edit a generated token file.

Generated output should preserve the conversion:

```text
colorBrandBackground
→ --fui-color-brand-background
```

### 5.3 Component CSS

- Keep component CSS next to the component.
- Import component CSS through the component so Vite collects it into the package stylesheet.
- Cover base, hover, active, focus-visible/focus-within, disabled, invalid, checked, and mixed states as applicable.
- Add `forced-colors: active` behavior for interactive controls.
- Respect `prefers-reduced-motion` for animated state changes.
- Use logical CSS properties when direction-sensitive layout is introduced.
- Test RTL behavior for components whose layout or keyboard behavior changes with direction.

### 5.4 Theme ownership

- Components consume variables; they do not own global theme state.
- Applications choose a theme by applying a theme class or overriding variables.
- A future `FProvider` may provide theme classes, direction, and configuration, but it must remain optional unless a component truly requires context.
- If an `FProvider` is introduced, use a typed `InjectionKey<T>` symbol rather than a string key.
- Provider consumers receive readonly configuration and state plus explicit actions, not a publicly mutable reactive object.
- The library must not require Pinia, a global singleton store, or application-owned context for basic component operation.
- Provider options and defaults are public API and require unit and integration tests.

## 6. Accessibility requirements

Every interactive component must meet these rules before being considered complete:

- Prefer the correct native HTML control.
- Provide a visible focus indicator.
- Support keyboard interactions defined by the native element or WAI-ARIA pattern.
- Preserve focus behavior when disabled-focusable behavior is supported.
- Ensure labels are programmatically associated with controls.
- Forward `aria-*`, `required`, `name`, `value`, and form attributes to the correct native element.
- Keep decorative icons hidden from assistive technology.
- An icon-only interactive component must have an accessible name through visible text, `aria-label`, or `aria-labelledby`; development warnings and tests should enforce this when it cannot be inferred.
- A visual slot is decorative only when its public contract says so. Do not hide arbitrary consumer slot content from assistive technology.
- Do not replace native semantics with ARIA unless native HTML cannot express the behavior.
- Test disabled, invalid, checked, mixed, and expanded states where applicable.
- Test in forced-color mode for components with custom visual controls.

Required tooling before public release:

- Automated accessibility tests with `axe-core` or equivalent
- Keyboard-focused unit tests
- Manual screen-reader spot checks for complex components
- Browser tests for focus order and focus restoration

## 7. Testing strategy

Use a testing pyramid.

### 7.1 Unit/component tests

Use Vitest and Vue Test Utils to cover:

- Default rendering
- Prop defaults and variants
- Controlled and uncontrolled state
- Native attribute routing
- Slots and DOM order
- Emitted event count and payloads
- Ref exposure
- Disabled behavior
- Keyboard interaction
- ARIA and native semantics
- Upstream regression cases

Rules:

- Treat exported components as black boxes: assert public DOM, accessible roles, names and states, user interaction, slots, and emitted public events rather than private refs or computed values.
- Prefer role-and-accessible-name queries. Use semantic element queries when they are clearer, and add test IDs only when no durable semantic query exists.
- Avoid large snapshots as the primary assertion.
- A happy-dom or jsdom test must not be used as proof of native focus behavior, computed styles, transitions, forced-color rendering, form behavior, or cross-browser interaction.
- Every fixed bug must receive a regression test.
- Port relevant upstream tests rather than relying only on visual inspection.

### 7.2 Visual regression tests

Before scaling beyond basic components, add browser-based screenshots for:

- Every appearance, size, and shape
- Light and dark themes
- Hover, pressed, focus, disabled, invalid, checked, and mixed states
- High-contrast/forced-color behavior where supported by the test environment
- RTL when applicable

### 7.3 Integration tests

Use Playwright for:

- Real keyboard navigation
- Native form submission and reset behavior
- Focus order and restoration
- Computed focus styles and other browser-rendered states
- Controlled component integration
- Teleport/overlay behavior
- Browser-specific input and accessibility behavior
- Forced-color behavior where supported by the environment

Keep browser tests separate from the fast unit suite and use them narrowly for contracts that a DOM emulator cannot prove.

### 7.4 Required verification

A change is complete only when these pass:

```bash
npm run test:run
npm run typecheck
npm run build
npm run pack:check
```

Also run the playground and confirm there are no browser console errors.

## 8. Package architecture

### Exports

The root package should export:

- Components
- Public component types
- Plugin registration
- Package-wide public types

Do not export internal composables or utilities accidentally.

As the package grows, add explicit subpath exports:

```json
{
  "exports": {
    ".": {},
    "./button": {},
    "./input": {},
    "./checkbox": {},
    "./style.css": "./dist/style.css"
  }
}
```

Subpath exports must be added deliberately and tested from a temporary consumer project.

### Dependencies

- `vue` must remain a peer dependency and a development dependency.
- Do not bundle Vue.
- Avoid dependencies for behavior that can be implemented reliably in a small internal utility.
- Use mature accessibility/focus libraries for complex patterns instead of rebuilding them casually.
- Document why every runtime dependency is needed.

### Build output

The published package must contain only:

- Runtime bundles
- Type declarations
- Stylesheet
- README and architecture/provenance documentation as appropriate
- License and third-party notices

Do not publish tests, playground code, screenshots, temporary output, or source-research files unless intentionally included.

## 9. Upstream-port workflow

Use this process for every new component.

### Step 1: Pin the source

Record:

- Upstream repository
- Exact commit SHA
- Component package and version
- Relevant source paths
- Relevant tests and stories

### Step 2: Build a parity matrix

Document:

- Public props and defaults
- Slots
- DOM structure
- Controlled/uncontrolled behavior
- Events
- Keyboard behavior
- Accessibility semantics
- Visual variants and states
- Theme tokens
- Upstream test cases

### Step 3: Design the Vue API

Classify every upstream API as one of:

- Preserved as-is
- Renamed to a Vue convention
- Replaced with a slot
- Replaced with `v-model`
- Omitted with a documented reason

### Step 4: Implement foundation before component

If the component requires a reusable primitive—positioning, focus management, IDs, controllable state, motion, portals—implement or select that foundation first. Do not hide a component-specific workaround inside a public component.

### Step 5: Port behavior and tests

Implement native Vue behavior and port externally observable upstream tests. Do not translate React internals line by line.

### Step 6: Verify visual parity

Review all states in the playground and with visual regression tests.

### Step 7: Document differences

Update `README.md`, `UPSTREAM.md`, and third-party notices when relevant.

## 10. Shared abstraction rules

Create a shared abstraction only when at least one of these is true:

- The same non-trivial behavior exists in three components.
- The behavior is security-, accessibility-, or correctness-sensitive.
- Keeping separate implementations has already caused divergence or bugs.
- The abstraction matches an established platform concept such as controllable state, merged refs, generated IDs, focus restoration, or positioning.

Do not create abstractions solely to reduce a few lines of code.

Good future candidates:

```text
useControllableState
useMergedTemplateRef
useEventListener
useFocusWithin
useFluentProvider
resolveComponentId
```

Each shared abstraction requires its own tests.

### Composable contract rules

- A composable has one behavior-focused purpose and returns only the reactive state and named actions needed for that purpose.
- Keep mutable internal state private; expose readonly state when consumers must mutate it only through actions.
- Accept `MaybeRefOrGetter<T>` only when callers genuinely benefit from reactive inputs. Resolve it with `toValue()` inside the relevant computed or watch effect.
- Keep callbacks, predicates, and comparators as ordinary function parameters rather than treating them as reactive getters.
- Do not implicitly access application stores, mutate global state, query the document, or inject optional dependencies. Pass dependencies explicitly or document a required typed injection contract.
- Pure composables may be tested directly. Composables using lifecycle hooks or injection must be tested in a mounted host and explicitly verified to clean up on unmount.

## 11. Code-quality rules

- Enable and maintain strict TypeScript.
- Add ESLint with Vue and TypeScript rules before the next major component batch.
- Add Prettier or another deterministic formatter.
- Do not commit commented-out implementations or debugging logs.
- Development-only warnings must be actionable and guarded by `import.meta.env.DEV`.
- Functions should have one clear responsibility.
- Prefer descriptive names such as `isControlled`, `currentValue`, and `syncNativeState`.
- Comments should explain non-obvious platform behavior or upstream parity decisions, not restate the code.
- Avoid files that grow beyond a clearly reviewable responsibility; extract composables or utilities based on behavior, not arbitrary line limits.

### 11.1 Performance rules

- Start with clear reactive code. Add `v-once`, `v-memo`, manual computed-reference reuse, virtualization, or render-function optimization only after profiling identifies a material hotspot.
- Never use `v-once` for content that can change through props, slots, theme, locale, state, or accessibility attributes.
- Use `v-memo` only for a profiled expensive list subtree and include every prop, state, and slot dependency that must invalidate it.
- In dense or virtualized collections, avoid layers of components that contribute only presentation markup; retain abstractions that provide semantics, keyboard behavior, accessibility, or reusable state.
- Prefer `computed` for expensive derived data and keep computed functions and template expressions pure.
- Use `shallowRef` for opaque external instances or intentionally shallow large data, not as a default replacement for `ref` with primitive state.

## 12. CI and release requirements

Before public release, CI must run on every pull request:

1. Dependency installation with the lockfile
2. Lint and formatting checks
3. Type checking
4. Unit tests
5. Accessibility tests
6. Production library build
7. Package-content validation
8. Visual tests for affected components

Release requirements:

- The release package name is `@mrpvi/fluentui-vue`; recheck registry availability immediately before publishing.
- Keep the README's independent, unofficial-project disclaimer and review npm-name and trademark considerations before each public release.
- Publication is approved and the package is configured as public.
- Pin upstream commit SHAs.
- Maintain [`CHANGELOG.md`](./CHANGELOG.md) under Semantic Versioning.
- Verify the packed tarball from a clean consumer Vue project.
- Confirm all Microsoft copyright and MIT notices are present.
- Review icon, font, and brand asset licenses separately.

## 13. Definition of done for a component

A component is complete when:

- Its Vue API is documented and idiomatic.
- Its upstream version and source commit are recorded.
- Native semantics and keyboard behavior are correct.
- Controlled/uncontrolled state behaves correctly where supported.
- All relevant attributes are routed correctly.
- Light, dark, disabled, focus, forced-color, and reduced-motion states are implemented where applicable.
- Unit, accessibility, and relevant browser tests pass.
- The playground demonstrates its major states.
- Types and package exports are correct.
- Intentional upstream differences are documented.
- Build and package checks pass without warnings or console errors.

## 14. Current technical debt

The current eight-component implementation now has the Phase 0 quality baseline: complete generated light/dark theme tokens, ESLint and Prettier, split TypeScript configurations, axe checks, SSR/hydration coverage, multi-engine browser tests, Chromium visual baselines, packed-consumer validation, and CI.

Remaining work before broad public release:

1. Pin exact Fluent UI upstream commit SHAs in `UPSTREAM.md`.
2. Add tested component-family subpath exports as the library grows.
3. Extract controlled/uncontrolled state only when the next components confirm the shared contract.
4. Introduce a provider only when theme, direction, or shared configuration requires one.
5. Add targeted SSR and hydration tests for future Teleport or browser-measured components.
6. Expand visual matrices from the baseline playground coverage to every component state, RTL case, and supported forced-color scenario.
7. Perform and record manual screen-reader verification for complex components before public release.

These are planned improvements, not reasons to introduce premature abstractions into the current codebase.

## 15. Research sources and interpretation

The project rules are informed by official Vue, Vite, WAI-ARIA, and Fluent UI documentation plus selected community guidance. Community guidance is evaluated rather than copied as a universal rule.

A targeted review of [`mrpvi/vue3-skills`](https://github.com/mrpvi/vue3-skills) at commit [`c9d355ff23f654309dd02006be671859df0a134c`](https://github.com/mrpvi/vue3-skills/tree/c9d355ff23f654309dd02006be671859df0a134c) contributed guidance on:

- typed slot contracts,
- SSR and hydration safety,
- template-ref nullability,
- watcher timing and cleanup,
- composable API isolation,
- black-box component testing,
- the boundary between DOM-emulator and real-browser tests,
- provider injection contracts, and
- measured rather than speculative optimization.

The following repository opinions are intentionally **not** treated as unconditional project rules:

- `shallowRef` is not preferred for primitive state by default.
- Scoped SFC CSS is not required because stable global `.fui-*` classes and CSS variables are part of this library's styling contract.
- `defineModel` is optional; explicit `modelValue` and `update:modelValue` remain appropriate where controlled/uncontrolled parity and event semantics must be visible.
- `v-once`, `v-memo`, async components, virtualization, and removal of component boundaries require demonstrated need or profiling.
- Pinia, VueUse, or another runtime dependency is never added solely because a generic best-practice guide recommends it.

Relevant reviewed files include:

- [`component-slots.md`](https://github.com/mrpvi/vue3-skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-best-practices/references/component-slots.md)
- [`composables.md`](https://github.com/mrpvi/vue3-skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-best-practices/references/composables.md)
- [`lifecycle-ssr-awareness.md`](https://github.com/mrpvi/vue3-skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-debug-guides/reference/lifecycle-ssr-awareness.md)
- [`ssr-hydration-mismatch-causes.md`](https://github.com/mrpvi/vue3-skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-debug-guides/reference/ssr-hydration-mismatch-causes.md)
- [`watch-flush-timing.md`](https://github.com/mrpvi/vue3-skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-debug-guides/reference/watch-flush-timing.md)
- [`testing-component-blackbox-approach.md`](https://github.com/mrpvi/vue3-skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-component-blackbox-approach.md)
- [`testing-browser-vs-node-runners.md`](https://github.com/mrpvi/vue3-skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-testing-best-practices/reference/testing-browser-vs-node-runners.md)
- [`perf-v-once-v-memo-directives.md`](https://github.com/mrpvi/vue3-skills/blob/c9d355ff23f654309dd02006be671859df0a134c/skills/vue-best-practices/references/perf-v-once-v-memo-directives.md)

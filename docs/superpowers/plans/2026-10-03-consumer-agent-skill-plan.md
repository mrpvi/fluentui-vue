# Consumer Agent Skill and Claude Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a portable `fluentui-vue` consumer skill under `docs/skills/` and expose the same canonical skill through an installable Claude Code plugin and marketplace.

**Architecture:** Keep one source of truth at `docs/skills/fluentui-vue/`; the Claude plugin manifest scans that directory directly, and the marketplace entry points at the repository root. The skill teaches application consumers to use the published package’s Vue APIs and types, while references and eval fixtures provide progressive detail and repeatable quality checks. Root README documentation explains both Claude installation and portable installation without changing npm package contents.

**Tech Stack:** Markdown, YAML frontmatter, JSON manifests/eval fixtures, Claude Code plugin validation, Agent Skills `skills-ref` validation, Vue 3.5+, TypeScript, npm/Prettier.

**Spec:** `docs/superpowers/specs/2026-10-03-consumer-agent-skill-design.md`

## Global Constraints

- The skill is for agents building applications with `@mrpvi/fluentui-vue`, not for maintaining this repository or implementing generic Fluent UI React code.
- The canonical skill directory is `docs/skills/fluentui-vue/`; do not create a duplicate under `.agents/skills/`, `.claude/skills/`, or another plugin directory.
- `SKILL.md` must use valid Agent Skills frontmatter, stay under 500 lines/about 5,000 tokens, and use a description no longer than 1,024 characters.
- Use only the package’s native Vue APIs: `F*` components, props, events, slots, `v-model`, `default*` props, and compound component nesting.
- State that Vue `^3.5.0` is required and that `@mrpvi/fluentui-vue/style.css` must be imported once; do not introduce React runtime or provider assumptions.
- Treat the consuming project’s installed package exports and generated declarations as the API authority; repository source paths are optional corroboration, not a consumer prerequisite.
- Set both Claude identities to Ali Parvizi: plugin `author.name` and marketplace `owner.name`.
- Keep `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` free of unsupported fields; use `skills: ["./docs/skills/"]` and marketplace plugin source `"./"`.
- Do not change `package.json`’s npm `files` allowlist, runtime source, generated tokens, or published package contents.
- Do not commit, push, publish, or modify the user’s persistent Claude settings during implementation.

## Review Focus

- **Installed consumers without repository access:** skill instructions and examples must work from package exports/declarations alone; test by copying the skill to a temporary directory.
- **CSS omitted or imported repeatedly:** setup guidance must require one shared stylesheet import and preserve existing app entry conventions; pin in the setup reference and eval.
- **React-shaped state/event assumptions:** dropdown/combobox selection versus display text and Vue event payloads must be explicit; pin in forms reference and eval.
- **Standalone compound children:** dialogs, popovers, and menus must show their required context/trigger/surface composition and accessible naming; pin in compound reference and eval.
- **Plugin path/name drift:** Claude validation must resolve the exact canonical skill and namespace it as `/fluentui-vue:fluentui-vue`; pin in manifests, README commands, and validation steps.

---

### Task 1: Create the canonical skill instructions

**Files:**

- Create: `docs/skills/fluentui-vue/SKILL.md`
- Read for API verification: `README.md`, `src/index.ts`, representative `src/components/*/*.types.ts` and `.vue` files, `ARCHITECTURE.md`, `UPSTREAM.md`

**Interfaces:**

- Consumes: The published package contract and the three references created in later tasks.
- Produces: An Agent Skills directory named `fluentui-vue` with activation metadata, an application-consumer workflow, gotchas, and direct links to `references/setup-and-theming.md`, `references/forms-and-state.md`, and `references/compound-components.md`.

- [ ] **Step 1: Verify the exact public facts before writing prose**

Confirm the following from current source/types and preserve the package name exactly: `@mrpvi/fluentui-vue`, Vue `^3.5.0`, `@mrpvi/fluentui-vue/style.css`, `FluentVue`, `FField`, `FInput`, `FButton`, `FDropdown`, `FCombobox`, `FDialog`, `FPopover`, `FMenu`, `FToaster`, `useToastController`, `.fui-theme-dark`, and root exports from `src/index.ts`. Record any version-sensitive behavior as “verify against the installed package.”

- [ ] **Step 2: Write valid frontmatter and an activation-focused description**

Use this shape, revising wording only to keep it precise and under the 1,024-character description limit:

```yaml
---
name: fluentui-vue
description: >
  Build, integrate, and troubleshoot Vue applications using @mrpvi/fluentui-vue,
  the native Vue 3 component library adapted from Fluent UI React. Use this skill
  when installing the package, importing F* components, wiring v-model or
  default* state, composing fields/forms, menus, dialogs, popovers, data grids,
  or toasts, applying Fluent themes, or debugging accessibility, slots, events,
  selection models, popup placement, or TypeScript errors. Prefer it for
  consumer application work with fluentui-vue; do not use it for unrelated Vue
  libraries, Fluent UI React code, or package-maintainer implementation tasks.
---
```

- [ ] **Step 3: Add the consumer workflow and gotchas**

Write concise imperative sections covering:

1. Inspect the consuming app’s package manager, installed package version, Vue version, existing registration/style conventions, and current component types before editing.
2. Install/verify the package and import the stylesheet once; choose named imports by default and retain an existing `FluentVue` plugin registration when present.
3. Load only the focused reference needed for the requested family.
4. Check declarations/exports for exact props, slots, event payloads, and model shapes instead of translating React examples mechanically.
5. Implement accessible names, labels, native semantics, and required compound context.
6. Run the consumer’s typecheck, build, and relevant tests; report skipped checks.

Keep gotchas visible in `SKILL.md`: no React runtime, `F*` naming, `v-model`/`default*` rather than `value/onChange`, controlledness can depend on prop presence, array-valued selection, separate combobox/dropdown display and selection state, compound context, `FField` default-slot control composition, popup `mountNode`/teleport implications, theme ancestor inheritance, and current declarations over README inventories.

- [ ] **Step 4: Link references progressively and add a minimal output checklist**

Link each reference with a “Read when…” sentence. End with a verification checklist requiring: stylesheet loaded once; imports/types compile; labels and accessible names are present; controlled/default behavior is intentional; compound children are nested correctly; theme/popup behavior is checked; relevant tests/build ran.

- [ ] **Step 5: Check the skill metadata locally**

Run a YAML/frontmatter parse or the official validator once the directory exists. Also run a line/token count check so the body remains below the agreed limits. Expected result: one valid `SKILL.md`, no duplicate skill name, and no absolute local paths in instructions.

### Task 2: Add setup and theming reference

**Files:**

- Create: `docs/skills/fluentui-vue/references/setup-and-theming.md`
- Test via: `docs/skills/fluentui-vue/evals/evals.json` setup case

**Interfaces:**

- Consumes: Public README setup and theme contract; Task 1 links this file.
- Produces: A self-contained reference for package installation, root imports, stylesheet loading, plugin versus named registration, theme classes, and consumer verification.

- [ ] **Step 1: Write the setup reference with complete Vue snippets**

Include two complete examples: a `main.ts` using `createApp(App).use(FluentVue)` and a `<script setup lang="ts">` named-import example. Both must import `@mrpvi/fluentui-vue/style.css` exactly once in their shown application setup. State Vue `^3.5.0`, no React dependency, root import preference, and that the plugin globally registers exported `F*` components.

- [ ] **Step 2: Document themes without inventing providers**

Show `.fui-theme-dark` on an ancestor and explain that light is the default. Explain CSS custom-property overrides, token inheritance, and checking popup/teleport placement when a themed ancestor does not contain the rendered surface. Do not prescribe editing generated token CSS or a React `FluentProvider`.

- [ ] **Step 3: Add a verification subsection**

Give concrete checks: inspect the browser/document styles for the package stylesheet, confirm a themed descendant resolves Fluent variables, run the app’s typecheck/build, and check RTL/forced-colors/reduced-motion behavior when the app supports those modes.

- [ ] **Step 4: Validate examples against the repository**

Use the existing TypeScript/Vue toolchain or a temporary fixture to ensure imports and component names resolve. Fix any example that relies on a non-exported symbol.

### Task 3: Add forms and state reference

**Files:**

- Create: `docs/skills/fluentui-vue/references/forms-and-state.md`
- Test via: `docs/skills/fluentui-vue/evals/evals.json` form/selection case

**Interfaces:**

- Consumes: `FField`, `FInput`, `FDropdown`, `FCombobox`, `FOption` declarations and implementation behavior; Task 1 links this file.
- Produces: Correct Vue form and selection guidance with snippets that distinguish text state, selected-option state, events, labels, and controlled/default behavior.

- [ ] **Step 1: Document `FField` control composition**

Show a labelled required `FField` with an `FInput` in the default slot. Explain that the field supplies IDs and accessibility attributes to the slotted control and that a label wrapper alone is not a substitute for the field/control composition.

- [ ] **Step 2: Document ordinary input state and events**

Show `ref('')` with `v-model` and state that consumers should inspect installed declarations for event payloads rather than assume React `onChange` signatures. Mention native form reset support only if verified in current implementation.

- [ ] **Step 3: Document dropdown and combobox model separation**

Provide a complete snippet where input/display text and selected options are represented separately. State that selection is commonly array-valued, option `value` and visible text can differ, and `FOption` may need explicit `text` when slot content is not plain text. Show `v-model:selected-options` or the exact current syntax verified from declarations; do not collapse the two models into one string.

- [ ] **Step 4: Explain controlled/default state precisely**

Describe `default*` for uncontrolled initial state and the installed component’s controlled model props/events for controlled state. Warn agents not to infer controlledness solely from truthiness or to bind `undefined` without checking the component contract.

- [ ] **Step 5: Validate a representative form fixture**

Create a temporary or eval fixture that type-checks a required field, an input, and a dropdown/combobox selection. Confirm labels, model names, and event syntax against `*.types.ts` files.

### Task 4: Add compound component reference

**Files:**

- Create: `docs/skills/fluentui-vue/references/compound-components.md`
- Test via: `docs/skills/fluentui-vue/evals/evals.json` overlay case

**Interfaces:**

- Consumes: `FDialog`, `FPopover`, `FMenu`, `FToaster`, and `FDataGrid` public composition contracts; Task 1 links this file.
- Produces: Correct compound-component examples and context/teleport/accessibility guardrails.

- [ ] **Step 1: Document dialog, popover, and menu nesting**

Show minimal valid compositions using each family’s root, trigger, and surface/list parts. Explain that these children are not independent primitives, triggers should not create nested interactive elements, and icon-only triggers require accessible names. Include controlled `v-model` guidance only where verified.

- [ ] **Step 2: Document popup placement and dismissal checks**

Explain `mountNode`/teleport and `inline-popup` as API options to inspect when theme inheritance, clipping, stacking, focus return, Escape, or outside-click behavior is involved. Do not promise a specific DOM location without checking the installed version.

- [ ] **Step 3: Document toaster context**

Show `FToaster` wrapping the consuming subtree and `useToastController()` being called within that subtree. State that controller use outside the provider context is invalid and that toast content/timeout behavior should be confirmed from installed types.

- [ ] **Step 4: Add a scoped DataGrid note only for verified behavior**

Explain that consumers provide `items`, typed `columns`, and row/cell composition or scoped slots rather than React render callbacks. Include a small shape example only after checking current declarations; otherwise link to the declarations without inventing a full API.

- [ ] **Step 5: Validate overlay examples**

Type-check or compile the dialog/popover/menu/toaster snippets and use existing tests as the behavior authority for focus, dismissal, and context assumptions. Correct any invalid slot or component names before proceeding.

### Task 5: Add evaluation fixtures and trigger corpus

**Files:**

- Create: `docs/skills/fluentui-vue/evals/evals.json`
- Create: `docs/skills/fluentui-vue/evals/triggers.json`
- Create: `docs/skills/fluentui-vue/evals/README.md`

**Interfaces:**

- Consumes: Tasks 1–4 skill content and references.
- Produces: Three behavioral cases plus at least 20 fixed trigger/non-trigger prompts with a documented 60/40 train/validation split.

- [ ] **Step 1: Write three behavioral eval cases before assertions**

Use these prompts and expected outcomes:

```json
[
  {
    "id": "setup-theme",
    "prompt": "Add fluentui-vue to this Vue 3 app, add a primary button, and make one section use the dark Fluent theme.",
    "expected_output": "A working setup that imports the shared stylesheet once, uses a valid FButton import/registration, and applies fui-theme-dark to an ancestor."
  },
  {
    "id": "field-selection",
    "prompt": "Build a labelled required customer form with a text input and a multi-select fluentui-vue combobox whose selected values remain separate from the typed search text.",
    "expected_output": "A Vue SFC using FField correctly, accessible labels, separate text and selected-option models, and package-valid component/slot/event syntax."
  },
  {
    "id": "compound-overlay",
    "prompt": "Add a menu button that opens a dialog from a fluentui-vue page and show a toast after saving.",
    "expected_output": "Correctly nested menu/dialog/toaster composition with accessible trigger names, provider/controller context, and relevant focus/dismissal behavior."
  }
]
```

- [ ] **Step 2: Add observable assertions after reviewing first outputs**

Use assertions that can be checked from generated code: stylesheet import exists once; imports resolve from `@mrpvi/fluentui-vue`; no React provider or `onChange` translation appears; `FField` wraps the control; separate selection/text models exist; compound parts are nested; accessible names/labels exist; and verification commands are reported.

- [ ] **Step 3: Write 10 positive trigger prompts**

Cover explicit and indirect requests such as installing the library, replacing a React Fluent button with Vue, fixing a missing stylesheet, binding `FCombobox`, adding a dark Fluent section, composing a dialog/popover/menu, wiring `FField`, troubleshooting a TypeScript prop error, using toast controller context, and rendering a DataGrid.

- [ ] **Step 4: Write 10 near-miss negative prompts**

Cover unrelated Vue libraries, Fluent UI React-only implementation, generic CSS theme work, backend API work, arbitrary React state refactoring, npm publishing, package contributor bug fixes, generic accessibility review, unrelated dropdown implementation, and general TypeScript debugging. Keep keyword overlap where possible and label each `should_trigger: false`.

- [ ] **Step 5: Document fixed split and evaluation procedure**

In `evals/README.md`, assign stable IDs to a 60% training split and 40% validation split, instruct evaluators to run fresh contexts, record with-skill and baseline outputs separately, and distinguish static corpus review from live activation testing. Do not claim trigger rates or quality deltas until runs have actually been performed.

### Task 6: Add Claude plugin and marketplace manifests

**Files:**

- Create: `.claude-plugin/plugin.json`
- Create: `.claude-plugin/marketplace.json`

**Interfaces:**

- Consumes: Canonical skill directory from Tasks 1–5.
- Produces: A repository-root Claude plugin whose namespaced skill is `fluentui-vue:fluentui-vue`, plus a marketplace entry installable as `fluentui-vue@fluentui-vue-marketplace`.

- [ ] **Step 1: Write the plugin manifest**

Use this manifest shape, preserving valid JSON and repository formatting:

```json
{
  "name": "fluentui-vue",
  "displayName": "Fluent UI Vue Consumer Skill",
  "version": "1.0.0",
  "description": "Consumer guidance for building Vue applications with @mrpvi/fluentui-vue.",
  "author": {
    "name": "Ali Parvizi"
  },
  "repository": "https://github.com/mrpvi/fluentui-vue",
  "license": "MIT",
  "keywords": ["vue", "vue3", "fluent-ui", "fluentui-vue", "components"],
  "skills": ["./docs/skills/"]
}
```

Do not add `owner`, hooks, MCP servers, commands, agents, or a second skill path.

- [ ] **Step 2: Write the marketplace manifest**

Use this shape:

```json
{
  "name": "fluentui-vue-marketplace",
  "description": "Claude Code plugins for building Vue applications with Fluent UI Vue.",
  "owner": {
    "name": "Ali Parvizi"
  },
  "plugins": [
    {
      "name": "fluentui-vue",
      "source": "./",
      "description": "Consumer guidance for building Vue applications with @mrpvi/fluentui-vue."
    }
  ]
}
```

Keep entry and manifest names identical so installation, details, and skill namespace agree.

- [ ] **Step 3: Validate the manifests before README work**

Run:

```bash
claude plugin validate --strict .
claude plugin validate --strict .claude-plugin/plugin.json
```

If the CLI expects a directory rather than a manifest file, use the repository root for the first command and report the exact accepted invocation for the second; do not weaken `--strict` to hide warnings. Expected result: validation passes with no unsupported-field, missing-path, or name mismatch errors.

- [ ] **Step 4: Inspect plugin inventory without changing settings**

Run the local equivalent of `claude plugin details fluentui-vue` or load the repository with `claude --plugin-dir "$PWD"` in a temporary/nonpersistent test context. Confirm one skill is listed and its explicit namespace is `/fluentui-vue:fluentui-vue`. Do not run `claude plugin marketplace add` or `claude plugin install` against the user’s persistent settings.

### Task 7: Document installation and discovery in the root README

**Files:**

- Modify: `README.md` near the documentation section
- Verify: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `docs/skills/fluentui-vue/`

**Interfaces:**

- Consumes: Task 6 installation identifiers and Task 1 canonical skill location.
- Produces: User-visible installation instructions for Claude Code and compatible agents without implying the npm package bundles the skill.

- [ ] **Step 1: Add an AI coding-agent documentation section**

Add a section before development or alongside documentation with this exact command flow:

```bash
claude plugin marketplace add mrpvi/fluentui-vue
claude plugin install fluentui-vue@fluentui-vue-marketplace
```

Explain that users can explicitly invoke `/fluentui-vue:fluentui-vue`, while Claude can also select the skill automatically for matching consumer tasks. State that plugin installation does not install `@mrpvi/fluentui-vue` into the application.

- [ ] **Step 2: Document local plugin testing**

Show:

```bash
claude --plugin-dir /path/to/fluentui-vue
```

Explain that this is for local testing and avoids changing persistent marketplace/plugin settings.

- [ ] **Step 3: Document portable Agent Skills installation**

Link to `docs/skills/fluentui-vue/` on GitHub and explain copying the complete directory to the consuming project’s `.agents/skills/fluentui-vue/` or the target client’s supported skill directory. State that discovery conventions vary by agent and that the directory must retain `SKILL.md` and its `references/` files.

- [ ] **Step 4: Add a documentation link to the canonical skill**

Use a repository-relative link for local browsing and an absolute GitHub link where npm users need access, because `docs/` remains excluded from the package’s current npm `files` allowlist.

- [ ] **Step 5: Check README commands and prose**

Verify the marketplace/plugin names match both manifests, the owner/author is not incorrectly presented as a package maintainer, and no statement claims automatic installation or support for agents that do not implement the Agent Skills convention.

### Task 8: Validate, evaluate, and prepare the final change

**Files:**

- Verify all files created/modified in Tasks 1–7
- Do not modify npm package allowlists or runtime source

**Interfaces:**

- Consumes: Complete skill, references, evals, manifests, and README.
- Produces: A validated, reviewable working tree with explicit test results and no accidental package/runtime changes.

- [ ] **Step 1: Run formatting and repository hygiene checks**

Run:

```bash
npx prettier --check README.md .claude-plugin docs/skills docs/superpowers/specs/2026-10-03-consumer-agent-skill-design.md docs/superpowers/plans/2026-10-03-consumer-agent-skill-plan.md
git diff --check
git status --short
```

Expected result: Prettier passes, no whitespace errors, and only the intended documentation/manifest files are changed.

- [ ] **Step 2: Run Agent Skills validation**

If `skills-ref` is available, run:

```bash
skills-ref validate docs/skills/fluentui-vue
```

If it is unavailable, install/use the official reference validator in a temporary environment without adding a repository dependency, then rerun the same command. Expected result: valid frontmatter, matching directory/name, and no broken skill structure.

- [ ] **Step 3: Run Claude validation and inspect resolution**

Run:

```bash
claude plugin validate --strict .
claude --plugin-dir "$PWD"
```

In the temporary session, inspect plugin details or invoke `/fluentui-vue:fluentui-vue`; confirm the canonical skill loads and references resolve. Stop the temporary session without installing into user settings.

- [ ] **Step 4: Run the behavioral evals**

For each of the three cases in `evals/evals.json`, run a fresh-context baseline and with-skill attempt. Record concrete assertion evidence in temporary evaluation output or the requested report; revise the skill only when an observed failure is reproducible. Do not add generated output to the repository unless the evaluation format requires it.

- [ ] **Step 5: Check relocation and publication boundaries**

Copy `docs/skills/fluentui-vue/` to a temporary directory and verify all relative links remain valid. Run `npm pack --dry-run --json` or `npm run pack:check` and confirm the new docs/plugin files are not unintentionally included in the npm package. The README link must still point to a hosted repository path after packaging.

- [ ] **Step 6: Perform final diff review**

Review the complete diff for unsupported claims, absolute home-directory paths, React-specific instructions, duplicate skills, malformed JSON, or accidental source changes. Report every skipped browser/runtime test and every validator unavailable in the final response.

- [ ] **Step 7: Commit only after user requests a commit**

If the user asks for a commit, stage only the intended files and use a message ending exactly with:

```text
Co-Authored-By: Claude Code <noreply@anthropic.com>
```

Do not push unless separately requested.

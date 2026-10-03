# Consumer Agent Skill and Claude Plugin

## Intent and acceptance criteria

Help coding agents build applications with `@mrpvi/fluentui-vue`, not maintain the library itself. The skill must teach the package's actual Vue APIs rather than assume Fluent UI React compatibility. Users should discover it through the root README and install it either as a portable Agent Skill or as a Claude Code plugin.

The user approved:

- A canonical, consumer-facing skill at `docs/skills/fluentui-vue/`.
- A concise `SKILL.md`, focused references, and evaluation cases.
- Root README installation instructions for portable and Claude plugin use.
- A repository-root plugin and single-plugin marketplace using the same skill files.
- **Ali Parvizi** as the marketplace owner and plugin author (the plugin schema uses `author`, not `owner`).

Success means the skill is discoverable, relocatable, format-valid, grounded in public package APIs, and demonstrably useful on representative consumer tasks. The Claude manifests must validate and resolve the canonical skill without duplication.

## Scope

Create documentation, skill evaluation fixtures, and Claude plugin metadata. Do not change component implementations, fix unrelated repository inconsistencies, introduce application dependencies, change npm exports or packaged contents, or add hooks, MCP servers, commands, agents, or permission settings.

Do not commit, push, publish, or install the plugin into the user's personal configuration as part of this work. Remote installation instructions become usable after the new files are available on the repository's default branch.

## Layout

```text
.claude-plugin/
  plugin.json
  marketplace.json
docs/skills/fluentui-vue/
  SKILL.md
  references/
    setup-and-theming.md
    forms-and-state.md
    compound-components.md
  evals/
    evals.json
    triggers.json
    README.md
README.md
```

`docs/superpowers/` contains design and implementation records, not skill runtime resources. No `.agents/skills/` copy, symlink, generated duplicate, or separate plugin repository is needed.

## Skill contract

Use the open Agent Skills format: YAML `name: fluentui-vue`, a nonempty imperative description of at most 1,024 characters, and Markdown instructions under 500 lines and approximately 5,000 tokens. Avoid client-specific tools and permissions in the portable skill.

The description targets creating, integrating, and troubleshooting Vue applications using `@mrpvi/fluentui-vue`, including tasks in an application already using the package. It must not claim applicability to unrelated Vue component libraries, Fluent UI React, or Fluent Web Components.

The main instructions give agents a procedure:

1. Inspect the consuming application's installed package version and conventions.
2. Confirm Vue `^3.5.0`, the single shared stylesheet import, and component registration/imports.
3. Load only the reference needed for the requested component family.
4. Check the installed package's exports and TypeScript declarations for exact props, events, slots, and model shapes.
5. Implement using native Vue patterns and accessible semantics.
6. Run the consuming application's existing type checks, build, and relevant interaction tests; report skipped checks honestly.

Prefer named imports from the package root; retain an existing `FluentVue` registration setup rather than rewrite it. Public package metadata and declarations are the version/API authority. Repository-relative `src/` paths and repository checkout access are not prerequisites for installed consumers.

Keep essential gotchas in `SKILL.md`: stylesheet requirement, no React runtime/provider assumptions, `F*` naming, component-specific model shapes, explicit controlled versus default state, compound-component nesting, accessible names, and popup placement/theme inheritance. Confirm each statement against implementation before including it.

## Focused references

- **Setup and theming:** installation, root imports, global registration alternative, CSS entry, light/dark token classes, scoped custom tokens, RTL and popup theme considerations. No assumed React theme provider.
- **Forms and state:** `FField`, ordinary input bindings, selected-options arrays versus display text in dropdowns/comboboxes, option text, controlled/default state distinctions, relevant event signatures and labels.
- **Compound components:** representative menus/dialogs/popovers and their actual trigger semantics, avoiding nested interactive elements, focus/dismissal and popup placement. Include concise guidance on scoped-slot DataGrid composition and toaster descendant injection when those APIs are verified.

Examples must be usable Vue SFC snippets with declared imports/state. Mark fragments as fragments. Keep references one level beneath the skill root and link them directly from `SKILL.md` with instructions describing when to load each. Treat package versions newer or older than the checked source as potentially different.

## Claude plugin and marketplace

The repository is the plugin root. `.claude-plugin/plugin.json` uses:

- `name`: `fluentui-vue`
- `version`: `1.0.0` (plugin version, independent of npm package version)
- `author`: `{ "name": "Ali Parvizi" }`
- `repository`: `https://github.com/mrpvi/fluentui-vue`
- `license`: `MIT`
- `skills`: `["./docs/skills/"]`
- A concise consumer-focused description and relevant keywords.

`.claude-plugin/marketplace.json` uses:

- `name`: `fluentui-vue-marketplace`
- `owner`: `{ "name": "Ali Parvizi" }`
- One plugin entry with `name: fluentui-vue` and `source: ./`.

Keep the skill-path declaration in the plugin manifest, not duplicated in the marketplace entry. Do not invent an unsupported plugin `owner` field. Bump the plugin version for future skill releases so cached marketplace installations can update.

## Installation documentation

The root README gets a visible AI coding-agent section with:

```bash
claude plugin marketplace add mrpvi/fluentui-vue
claude plugin install fluentui-vue@fluentui-vue-marketplace
```

Document the namespaced invocation `/fluentui-vue:fluentui-vue` and that Claude may select it automatically on relevant tasks. Installing the skill does not install the npm package.

For other compatible agents, explain copying the entire `docs/skills/fluentui-vue/` directory to the consumer application's `.agents/skills/fluentui-vue/` or the client's supported skill directory. Do not imply universal `.agents/skills/` support.

Use a GitHub link to the canonical skill from the root README because the npm package includes README but excludes `docs/`. Keep the npm `files` allowlist unchanged. Explain local testing through `claude --plugin-dir /path/to/fluentui-vue` without requiring persistent installation.

## Validation and evaluation

1. Run the official `skills-ref validate` against the skill, using an isolated tool environment if installation is needed. Do not add it as a library dependency.
2. Validate both Claude manifests explicitly with `claude plugin validate --strict`, and check the resolved skill path.
3. Test plugin discovery in a temporary Claude configuration or a nonpersistent `--plugin-dir` session, not the user's installed-plugin settings. If environment limitations prevent this, report manifest validation and runtime discovery separately.
4. Check all relative skill links and relocation by copying the skill to a temporary consumer location.
5. Check code examples against exports and declarations, and type-check representative complete examples using the repository's existing Vue/TypeScript tools where available.
6. Start with three behavioral evaluation cases: setup/theming, a labelled form with separated selection/display state, and a correctly composed overlay. Compare fresh-context outputs with and without the skill, record concrete evidence, and revise actual failures.
7. Provide at least 20 trigger prompts, balanced between positives and near-miss negatives, with fixed 60/40 train/validation splits. Repeated live activation testing is distinct from static prompt classification; record exactly which evaluation was run and never claim unperformed optimization.
8. Format changed Markdown and JSON with the repository's Prettier configuration and run `git diff --check`. Verify npm's publication allowlist still excludes skill/plugin files.

Existing unrelated issues such as provenance conflict markers and inconsistent runtime version constants are not part of this change. Do not use those files/constants as authority for unverified skill claims.

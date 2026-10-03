# Skill evaluation fixtures

These fixtures are a starting point for evaluating `fluentui-vue` consumer
skill quality. They are not claims that live activation or baseline comparisons
have already been run.

## Behavioral cases

`evals.json` contains three fresh-context application tasks:

1. setup and dark-theme stylesheet handling;
2. labelled forms with separate combobox text and selection models;
3. menu/dialog/toast composition and focus behavior.

Run each prompt twice in isolated contexts: once with the skill available and
once without it. Add concrete, observable assertions only after inspecting the
first outputs. The checked-in assertions were added after the initial with-skill
smoke output: they cover root imports, one stylesheet import, absence of
React-provider assumptions, correct `FField` slot usage, separate selection/text
refs, valid compound nesting, accessible names, and reported verification checks.
The overlay assertions also pin the checked-version conditional surface mount
needed for first-open and reopen focus registration.

A smoke run is not proof of runtime accessibility. Compile generated SFCs and
exercise keyboard-first flows too: a focus target captured only on `click` will
not be available when a menu opens from ArrowDown or Enter handlers that prevent
the native click. Verify close/save/Escape focus restoration, not just that the
answer says to check it.

Keep generated outputs outside this directory unless a runner specifically
requires checked-in artifacts. Record skipped checks instead of treating silence
as a pass.

## Initial smoke evaluation

One Sonnet agent per condition answered all three prompts; the baseline had no
skill or source access, and the with-skill agent read only the skill/references.
This is a qualitative smoke comparison, not an independent-per-case benchmark or
a live activation measurement.

- **Baseline:** explicitly labelled its APIs as assumptions, but generated
  nonexistent `Button`, `FluentProvider`, and `webDarkTheme` exports; used
  `v-model:value` for combobox text; and assumed child-enhancing menu triggers
  plus `useToastController(toasterId)` in the same component as the toaster.
  Content coverage did not make these examples valid for this package.
- **With skill:** used the actual `F*` imports, stylesheet and CSS theme class,
  separate text/selection bindings, native trigger content, and descendant toast
  controller injection. The first overlay output exposed the checked-version
  dialog focus-registration problem, independently reproduced with a failing
  runtime test. The reference now conditionally mounts the surface; the test
  passes on first open and reopen with Tab containment and focus restoration.
- **Remaining limit:** a revised generated menu/dialog example captured its
  focus-return target only on click. The guidance now explicitly covers
  keyboard-first target acquisition. This generated flow was not declared a full
  runtime pass, and no aggregate improvement percentage is claimed.

All 11 complete reference SFCs were type-checked against built declarations.
Browser-level interaction checks and repeated trigger optimization remain
separate work; passing a type check does not establish focus correctness.

## Trigger corpus

`triggers.json` has 20 fixed prompts: 10 should-trigger and 10 near-miss
should-not-trigger cases. The `split` field is stable:

- **Train:** positive-01 through positive-06 and negative-01 through negative-06
  (12 cases, 60%).
- **Validation:** positive-07 through positive-10 and negative-07 through
  negative-10 (8 cases, 40%).

For activation reliability, run each prompt at least three times in a fresh
session and record whether the skill was selected. A should-trigger query passes
when activation is above 0.5; a should-not-trigger query passes when it remains
below 0.5. Do not tune the description against validation failures until the
training set has been reviewed. Add fresh prompts for a final sanity check.

Static fixture review and live activation testing answer different questions:
the corpus checks intended scope and the live run checks actual model behavior.

# Upstream provenance

This package is a native Vue adaptation of selected Microsoft Fluent UI React v9 components. It does not embed React or wrap the React packages.

| Vue component | Upstream npm package | Version reviewed | Upstream source |
| --- | --- | ---: | --- |
| Button | `@fluentui/react-button` | 9.11.0 | `packages/react-components/react-button/library/src/components/Button` |
| Input | `@fluentui/react-input` | 9.8.6 | `packages/react-components/react-input/library/src/components/Input` |
| Checkbox | `@fluentui/react-checkbox` | 9.6.4 | `packages/react-components/react-checkbox/library/src/components/Checkbox` |
| Text | `@fluentui/react-text` | 9.6.19 | `packages/react-components/react-text/library/src/components/Text` |
| Label | `@fluentui/react-label` | 9.4.4 | `packages/react-components/react-label/library/src/components/Label` |
| Field | `@fluentui/react-field` | 9.5.4 | `packages/react-components/react-field/library/src/components/Field` |
| Textarea | `@fluentui/react-textarea` | 9.7.6 | `packages/react-components/react-textarea/library/src/components/Textarea` |
| Link | `@fluentui/react-link` | 9.8.4 | `packages/react-components/react-link/library/src/components/Link` |

Source repository: https://github.com/microsoft/fluentui

Pinned source commits:

- Text: `9f5caa6307ef35a60f6d8c28e95ff336d5dbb222`
- Label: `2dd2a9a96210919c35b210a1aa8e873ab67dbada`
- Field: `2dd2a9a96210919c35b210a1aa8e873ab67dbada`
- Textarea registry source: `2dd2a9a96210919c35b210a1aa8e873ab67dbada`
- Textarea 9.7.6 release tag: `b6351802032e9af61bf03033d22cb354b2e2822c`
- Link registry source: `2dd2a9a96210919c35b210a1aa8e873ab67dbada`
- Link 9.8.4 release tag object: `a92d5fe17e27b38c0242da828d69ada50eb0269c`
- Link 9.8.4 release tag commit: `b6351802032e9af61bf03033d22cb354b2e2822c`

The Text review included its implementation, public types, styling, tests, package README, stories, and the global Fluent typography tokens used to generate `src/styles/typography-tokens.css`. The Label review included its native label semantics, required-indicator contract, sizes, weights, disabled styling, tests, and stories. The Field review included its component and base hooks, render structure, public types, context/control-prop merging, styles, tests, stories, and status-icon behavior. The Textarea review included its component and base hooks, public types, native root/control structure, controlled and uncontrolled value handling, Field size and control-prop integration, appearances, resize modes, size constraints, disabled/read-only/invalid styling, tests, stories, and best-practice guidance. Its React `value` and `onChange` API is translated to Vue `modelValue`, `update:modelValue`, and typed native `input`/`change` emits; React slot customization is intentionally not exposed. The Link review included its component and base hooks, public types, dynamic anchor/button/span root selection, click and keyboard state processing, default/subtle/inline styles, disabled and disabled-focusable behavior, tests, stories, accessibility guidance, and forced-color behavior. Vue translates React callbacks to typed native `click` and `keydown` emits while retaining released event ordering and suppression. Released source and tests are authoritative where the older Link SPEC’s role wording differs. Fluent’s internal background-appearance and inline context integration is intentionally omitted until this package has a shared provider/background context; explicit `inline` remains supported.

The implementation preserves public behavior, DOM semantics, accessibility intent, and relevant design-token values while translating the API to Vue conventions. It does not copy Fluent UI fonts or packaged icon assets. Before a public release, pin this document to an exact upstream commit SHA and re-run parity tests against that revision.

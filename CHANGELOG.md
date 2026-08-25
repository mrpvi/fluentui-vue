# Changelog

All notable changes to this project will be documented in this file.

The project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- Accordion, AccordionItem, AccordionHeader, and AccordionPanel adaptations with controlled and uncontrolled expansion, disclosure semantics, disabled states, RTL, reduced-motion, SSR, accessibility, browser, and packed-consumer coverage.
- Avatar, AvatarGroup, AvatarGroupItem, and AvatarGroupPopover adaptations with image/initial/icon fallbacks, deterministic colorful palettes, presence and active states, released sizes and shapes, spread/stack/pie layouts, partitioning, controlled and uncontrolled overflow, focus trapping, RTL, forced colors, reduced motion, SSR, accessibility, browser, and packed-consumer coverage.
- Breadcrumb, BreadcrumbItem, BreadcrumbButton, and BreadcrumbDivider adaptations with native navigation/list semantics, link and button roots, current and disabled states, tab and circular arrow focus modes, released sizing, utilities, RTL dividers, forced colors, SSR, accessibility, browser, and packed-consumer coverage.
- List and ListItem adaptations with semantic list, listbox, and grid roles; controlled and uncontrolled selection; cancelable bubbling actions; item and composite keyboard navigation; accessible checkmarks; disabled-selection behavior; SSR, accessibility, browser, and packed-consumer coverage.
- Persona adaptation with Avatar and standalone presence composition, six released sizes, four text levels, before/after/below positioning, start/center alignment, Vue-native typed named slots, RTL logical layout, forced colors, SSR, accessibility, browser, visual, and packed-consumer coverage.
- TabList and Tab adaptations with controlled and uncontrolled selection, manual and automatic activation, circular roving focus, disabled states, four appearances, sizes, vertical layout, RTL, forced colors, reduced motion, SSR, accessibility, browser, and packed-consumer coverage.

## [0.1.0] - 2026-08-23

### Added

- Initial public release of `@mrpvi/fluentui-vue`.
- Vue 3 and TypeScript adaptations of Fluent UI React v9 components:
  - Badge, CounterBadge, and PresenceBadge
  - Button, ToggleButton, and CompoundButton
  - Card, CardHeader, CardPreview, and CardFooter
  - Checkbox, Divider, Field, Image, Input, Label, and Link
  - ProgressBar, Radio, RadioGroup, Rating, RatingItem, and RatingDisplay
  - SearchBox, Select, Skeleton, SkeletonItem, Slider, SpinButton, Spinner, Switch, Text, and Textarea
- Native Vue props, slots, emits, `v-model`, form behavior, and semantic HTML without a React runtime dependency.
- Light and dark Fluent themes, RTL logical layout, forced-colors support, and reduced-motion safeguards.
- Accessible keyboard, focus, labeling, disabled, and validation behavior with automated Axe coverage.
- Server rendering and hydration support.
- ESM, CommonJS, TypeScript declarations, and a standalone stylesheet.
- Unit, Chromium, Firefox, WebKit, visual-regression, packed-package, and clean-consumer verification.

[0.1.0]: https://github.com/mrpvi/fluentui-vue/releases/tag/v0.1.0

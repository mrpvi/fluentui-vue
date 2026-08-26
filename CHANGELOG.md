# Changelog

All notable changes to this project will be documented in this file.

The project follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- Tag, TagGroup, InteractionTag, InteractionTagPrimary, and InteractionTagSecondary adaptations with appearances, shapes, sizes, media and text slots, controlled selection, dismiss actions, accessible grouped semantics, circular keyboard navigation, focus handoff, RTL, forced colors, and focused unit coverage.
- TagPicker, TagPickerControl, TagPickerInput, TagPickerButton, TagPickerList, TagPickerOption, TagPickerOptionGroup, and TagPickerGroup adaptations with controlled and uncontrolled selection/open state, editable or button triggers, filtering, active-descendant keyboard selection, inline or teleported popup positioning, selected-tag dismissal, outside/Escape cleanup, Field-ready attributes, RTL, forced colors, and focused unit coverage.
- Table and DataGrid family adaptations with native or div-backed semantics, size and appearance variants, cell layouts and actions, checkbox/radio selection, controlled and uncontrolled row state, sorting, item rendering, two-dimensional keyboard navigation, accessible column resizing, RTL/forced-color/reduced-motion styling, and focused unit coverage.
- Tree, FlatTree, TreeItem, TreeItemLayout, TreeItemPersonaLayout, FlatTreeItem, Overflow, OverflowItem, and OverflowDivider adaptations with nested and flat tree semantics, expansion and selection state, keyboard navigation, typeahead, measurement-aware overflow visibility, observer cleanup, RTL, forced colors, reduced motion, SSR, and focused unit coverage.
- Accordion, AccordionItem, AccordionHeader, and AccordionPanel adaptations with controlled and uncontrolled expansion, disclosure semantics, disabled states, RTL, reduced-motion, SSR, accessibility, browser, and packed-consumer coverage.
- Avatar, AvatarGroup, AvatarGroupItem, and AvatarGroupPopover adaptations with image/initial/icon fallbacks, deterministic colorful palettes, presence and active states, released sizes and shapes, spread/stack/pie layouts, partitioning, controlled and uncontrolled overflow, focus trapping, RTL, forced colors, reduced motion, SSR, accessibility, browser, and packed-consumer coverage.
- Breadcrumb, BreadcrumbItem, BreadcrumbButton, and BreadcrumbDivider adaptations with native navigation/list semantics, link and button roots, current and disabled states, tab and circular arrow focus modes, released sizing, utilities, RTL dividers, forced colors, SSR, accessibility, browser, and packed-consumer coverage.
- List and ListItem adaptations with semantic list, listbox, and grid roles; controlled and uncontrolled selection; cancelable bubbling actions; item and composite keyboard navigation; accessible checkmarks; disabled-selection behavior; SSR, accessibility, browser, and packed-consumer coverage.
- Listbox, Option, and OptionGroup adaptations with active-descendant focus, controlled and uncontrolled single or multiple selection, released menu-checkbox multiselect semantics, grouped options, disabled-option navigation, Field integration, RTL, forced colors, SSR, accessibility, browser, visual, and packed-consumer coverage.
- Dropdown adaptation with controlled and uncontrolled open and selected-option state, single or multiselect trigger text, Listbox/Option composition, typeahead, keyboard and outside-dismiss behavior, Field integration, RTL, forced colors, SSR, accessibility, browser, visual, and packed-consumer coverage.
- Combobox adaptation with editable input filtering, active-descendant option navigation, controlled and uncontrolled values and selection, inline or teleported popups, Field integration, keyboard selection, SSR, accessibility, browser, and packed-consumer coverage.
- Portal foundation with SSR-safe configurable Teleport targets and inline rendering mode for overlay composition.
- Popover, PopoverTrigger, and PopoverSurface adaptations with controlled and uncontrolled open state, anchored positioning, Teleport or inline rendering, Escape and outside dismissal, focus restoration, focus trapping, SSR, accessibility, browser, and packed-consumer coverage.
- Tooltip adaptation with delayed hover/focus visibility, controlled and uncontrolled state, accessible relationships, appearance variants, arrow support, anchored Teleport or inline rendering, Escape dismissal, SSR-safe rendering, and focused unit coverage.
- Dialog family adaptations with modal, non-modal, and alert modes, compound trigger/surface/body/title/content/actions components, controlled and uncontrolled state, backdrop and Escape dismissal, focus trapping/restoration, inert focus trapping, body scroll locking, Teleport rendering, SSR-safe cleanup, and focused unit coverage.
- Drawer family adaptations with overlay and inline variants, position and size options, modal and non-modal behavior, backdrop and Escape dismissal, focus trapping/restoration, inert focus trapping, body scroll locking, scroll-state-aware header/footer separators, Teleport rendering, SSR-safe cleanup, and focused unit coverage.
- Menu family adaptations with trigger/popover/list composition, controlled and uncontrolled open state, fixed positioning, outside and Escape dismissal, keyboard navigation, typeahead, selectable checkbox/radio/switch items, links, groups, dividers, split groups, Teleport or inline rendering, SSR-safe cleanup, and focused unit coverage.
- MenuButton and SplitButton adaptations with native button semantics, controlled and uncontrolled menu-open state, primary/menu action separation, disabled-focusable behavior, keyboard menu activation, released Button appearances, sizes, shapes, RTL, forced colors, and focused unit coverage.
- Toolbar family adaptations with semantic horizontal and vertical toolbars, circular arrow navigation, inherited sizing, action/toggle/radio controls, controlled and uncontrolled checked-value maps, groups, radio groups, dividers, RTL, forced colors, and focused unit coverage.
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

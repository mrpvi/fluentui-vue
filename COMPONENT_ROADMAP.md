# Component development roadmap

This roadmap defines the recommended order for porting Microsoft Fluent UI React v9 component families to native Vue 3 components.

The order is dependency-driven: foundational elements and form controls come first, followed by composition components, overlays, complex collection widgets, and advanced navigation.

Status legend:

- ✅ Developed
- ⏳ Recommended next
- ❌ Not developed

## Phase 1 — Existing foundation

1. ✅ **Button → `FButton`**
2. ✅ **Input → `FInput`**
3. ✅ **Checkbox → `FCheckbox`**

## Phase 2 — Typography and basic elements

4. ✅ **Text → `FText`**
5. ✅ **Label → `FLabel`**
6. ✅ **Field → `FField`**
7. ✅ **Link → `FLink`**
8. ✅ **Divider → `FDivider`** — definition-of-done gates complete for `@fluentui/react-divider@9.7.4`
9. ✅ **Image → `FImage`**
10. ✅ **Badge family** — definition-of-done gates complete for `@fluentui/react-badge@9.5.5`
    - `FBadge`
    - `FCounterBadge`
    - `FPresenceBadge`
11. ✅ **Spinner → `FSpinner`** — definition-of-done gates complete for `@fluentui/react-spinner@9.8.5`
12. ✅ **ProgressBar → `FProgressBar`** — definition-of-done gates complete for `@fluentui/react-progress@9.5.4`
13. ✅ **Skeleton family** — definition-of-done gates complete for `@fluentui/react-skeleton@9.7.5`
    - `FSkeleton`
    - `FSkeletonItem`

`FField` should integrate with Input, Checkbox, and later form controls to provide labels, hints, validation messages, and ARIA associations.

## Phase 3 — Form controls

14. ✅ **Textarea → `FTextarea`**
15. ✅ **Switch → `FSwitch`** — definition-of-done gates complete for `@fluentui/react-switch@9.7.5`
16. ✅ **Radio family** — definition-of-done gates complete for `@fluentui/react-radio@9.6.5`
    - `FRadio`
    - `FRadioGroup`
17. ✅ **Select → `FSelect`** — definition-of-done gates complete for `@fluentui/react-select@9.5.5`
18. ✅ **Slider → `FSlider`** — definition-of-done gates complete for `@fluentui/react-slider@9.6.5`
19. ✅ **SpinButton → `FSpinButton`** — definition-of-done gates complete for `@fluentui/react-spinbutton@9.6.5`
20. ✅ **SearchBox → `FSearchBox`** — definition-of-done gates complete for `@fluentui/react-search@9.4.6`
21. ✅ **Rating family** — definition-of-done gates complete for `@fluentui/react-rating@9.4.4`
    - `FRating`
    - `FRatingItem`
    - `FRatingDisplay`

These components should reuse the controlled/uncontrolled state, native form behavior, attribute routing, and accessibility conventions established by Input and Checkbox.

## Phase 4 — Remaining Button family

22. ✅ **ToggleButton → `FToggleButton`** — definition-of-done gates complete for `@fluentui/react-button@9.11.0`
23. ✅ **CompoundButton → `FCompoundButton`**

Delay these components until Menu exists:

- `FMenuButton`
- `FSplitButton`

## Phase 5 — Simple content containers

24. ✅ **Card family** — definition-of-done gates complete for `@fluentui/react-card@9.7.2`
    - `FCard`
    - `FCardHeader`
    - `FCardPreview`
    - `FCardFooter`
25. ✅ **Accordion family** — definition-of-done gates complete for `@fluentui/react-accordion@9.12.3`
    - `FAccordion`
    - `FAccordionItem`
    - `FAccordionHeader`
    - `FAccordionPanel`
26. ✅ **Tabs family** — definition-of-done gates complete for `@fluentui/react-tabs@9.12.4`
    - `FTabList`
    - `FTab`
27. ✅ **Breadcrumb family** — definition-of-done gates complete for `@fluentui/react-breadcrumb@9.4.5`
    - `FBreadcrumb`
    - `FBreadcrumbItem`
    - `FBreadcrumbButton`
    - `FBreadcrumbDivider`
28. ✅ **List family** — definition-of-done gates complete for `@fluentui/react-list@9.6.18`
    - `FList`
    - `FListItem`

## Phase 6 — Identity components

29. ✅ **Avatar family** — definition-of-done gates complete for `@fluentui/react-avatar@9.11.6`
    - `FAvatar`
    - `FAvatarGroup`
    - `FAvatarGroupItem`
    - `FAvatarGroupPopover`
30. ✅ **Persona → `FPersona`** — definition-of-done gates complete for `@fluentui/react-persona@9.7.8`

Avatar should be implemented before Persona because Persona composes avatar, text, secondary information, and presence state.

## Phase 7 — Selection and Combobox foundations

31. ✅ **Listbox family** — definition-of-done gates complete for `@fluentui/react-combobox@9.17.5`
    - `FListbox`
    - `FOption`
    - `FOptionGroup`
32. ✅ **Dropdown → `FDropdown`** — definition-of-done gates complete for `@fluentui/react-combobox@9.17.5`
33. ✅ **Combobox → `FCombobox`** — definition-of-done gates complete for `@fluentui/react-combobox@9.17.5`

Listbox and Option come first because Dropdown and Combobox depend on their option model, keyboard navigation, active-descendant behavior, and selection state.

## Phase 8 — Overlay foundations

34. ✅ **Portal → `FPortal`** — foundation complete for SSR-safe Teleport rendering
35. ✅ **Popover family** — definition-of-done gates complete for `@fluentui/react-popover@9.13.0`
    - `FPopover`
    - `FPopoverTrigger`
    - `FPopoverSurface`
36. ✅ **Tooltip → `FTooltip`** — definition-of-done gates complete for `@fluentui/react-tooltip@9.2.0`
37. ✅ **Dialog family** — definition-of-done gates complete for `@fluentui/react-dialog@9.18.4`
    - `FDialog`
    - `FDialogTrigger`
    - `FDialogSurface`
    - `FDialogBody`
    - `FDialogTitle`
    - `FDialogContent`
    - `FDialogActions`
38. ✅ **Drawer family** — definition-of-done gates complete for `@fluentui/react-drawer@9.13.3`
    - `FDrawer`
    - `FOverlayDrawer`
    - `FInlineDrawer`
    - `FDrawerHeader`
    - `FDrawerHeaderTitle`
    - `FDrawerHeaderNavigation`
    - `FDrawerBody`
    - `FDrawerFooter`

Before these components, establish shared internal foundations for:

- Portal rendering
- Focus trapping
- Focus restoration
- Escape-key dismissal
- Outside-click handling
- Scroll locking
- Positioning
- SSR-safe Teleport behavior

## Phase 9 — Menu and toolbar

39. ✅ **Menu family** — definition-of-done gates complete for `@fluentui/react-menu@9.25.4`
    - `FMenu`
    - `FMenuTrigger`
    - `FMenuPopover`
    - `FMenuList`
    - `FMenuItem`
    - `FMenuItemLink`
    - `FMenuItemCheckbox`
    - `FMenuItemRadio`
    - `FMenuItemSwitch`
    - `FMenuDivider`
    - `FMenuGroup`
    - `FMenuGroupHeader`
    - `FMenuSplitGroup`
40. ✅ **MenuButton → `FMenuButton`** — definition-of-done gates complete for `@fluentui/react-button@9.11.0`
41. ✅ **SplitButton → `FSplitButton`** — definition-of-done gates complete for `@fluentui/react-button@9.11.0`
42. ✅ **Toolbar family** — definition-of-done gates complete for `@fluentui/react-toolbar@9.8.4`
    - `FToolbar`
    - `FToolbarButton`
    - `FToolbarToggleButton`
    - `FToolbarRadioButton`
    - `FToolbarRadioGroup`
    - `FToolbarGroup`
    - `FToolbarDivider`

Menu comes after Popover because it depends on positioning, dismissal, focus movement, and overlay behavior.

## Phase 10 — Status and notification components

43. ✅ **ARIA live announcer foundation**
    - `FAriaLiveAnnouncer`
44. ✅ **MessageBar family**
    - `FMessageBar`
    - `FMessageBarTitle`
    - `FMessageBarBody`
    - `FMessageBarActions`
    - `FMessageBarGroup`
45. ✅ **Toast family**
    - `FToaster`
    - `FToast`
    - `FToastTrigger`
    - `FToastTitle`
    - `FToastBody`
    - `FToastFooter`
46. ✅ **InfoLabel family**
    - `FInfoLabel`
    - `FInfoButton`

The ARIA announcer should precede notifications so dynamic messages can be announced correctly.

## Phase 11 — Tags and pickers

47. ✅ **Tag family** — definition-of-done gates complete for `@fluentui/react-tags@9.9.5`
    - `FTag`
    - `FTagGroup`
    - `FInteractionTag`
    - `FInteractionTagPrimary`
    - `FInteractionTagSecondary`
48. ✅ **TagPicker family** — definition-of-done gates complete for `@fluentui/react-tag-picker@9.10.3`
    - `FTagPicker`
    - `FTagPickerControl`
    - `FTagPickerInput`
    - `FTagPickerButton`
    - `FTagPickerList`
    - `FTagPickerOption`
    - `FTagPickerOptionGroup`
    - `FTagPickerGroup`

TagPicker should come after Tag, Combobox, Listbox, Popover, and keyboard-selection foundations.

## Phase 12 — Data components

49. ✅ **Table family** — semantic table adaptation complete for `@fluentui/react-table@9.19.20`
    - `FTable`
    - `FTableHeader`
    - `FTableHeaderCell`
    - `FTableBody`
    - `FTableRow`
    - `FTableCell`
    - `FTableSelectionCell`
    - `FTableCellLayout`
    - `FTableCellActions`
    - `FTableResizeHandle`
50. ✅ **DataGrid family** — selection, sorting, keyboard navigation, and practical resizing complete for `@fluentui/react-table@9.19.20`
    - `FDataGrid`
    - `FDataGridHeader`
    - `FDataGridHeaderCell`
    - `FDataGridBody`
    - `FDataGridRow`
    - `FDataGridCell`
    - `FDataGridSelectionCell`

Implement semantic Table first. DataGrid adds sorting, selection, keyboard navigation, resizing, and advanced collection state.

## Phase 13 — Hierarchical components

51. ✅ **Tree family**
    - `FTree`
    - `FTreeItem`
    - `FTreeItemLayout`
    - `FTreeItemPersonaLayout`
    - `FFlatTree`
    - `FFlatTreeItem`
52. ✅ **Overflow family**
    - `FOverflow`
    - `FOverflowItem`
    - `FOverflowDivider`

These components require advanced keyboard, measurement, observer, and collection-management infrastructure.

## Phase 14 — Color controls

53. ❌ **ColorPicker family**
    - `FColorPicker`
    - `FColorArea`
    - `FColorSlider`
    - `FAlphaSlider`
54. ❌ **SwatchPicker family**
    - `FSwatchPicker`
    - `FSwatchPickerRow`
    - `FColorSwatch`
    - `FImageSwatch`
    - `FEmptySwatch`

Color controls need pointer, keyboard, RTL, value-clamping, and forced-color testing.

## Phase 15 — Advanced navigation and presentation

55. ✅ **Carousel family** — definition-of-done gates complete for `@fluentui/react-carousel@9.9.12`
    - `FCarousel`
    - `FCarouselViewport`
    - `FCarouselSlider`
    - `FCarouselCard`
    - `FCarouselButton`
    - `FCarouselAutoplayButton`
    - `FCarouselNav`
    - `FCarouselNavButton`
    - `FCarouselNavImageButton`
    - `FCarouselNavContainer`
56. ✅ **Navigation family** — definition-of-done gates complete for `@fluentui/react-nav-preview@0.13.9`
    - `FNav`
    - `FNavItem`
    - `FNavSubItem`
    - `FNavSubItemGroup`
    - `FNavCategory`
    - `FNavCategoryItem`
    - `FNavSectionHeader`
    - `FNavDivider`
    - `FNavDrawer`
    - `FNavDrawerHeader`
    - `FNavDrawerBody`
    - `FNavDrawerFooter`
    - `FHamburger`
    - `FAppItem`
    - `FAppItemStatic`
    - `FSplitNavItem`
57. ✅ **TeachingPopover family** — definition-of-done gates complete for `@fluentui/react-teaching-popover@9.7.5`
    - `FTeachingPopover`
    - `FTeachingPopoverTrigger`
    - `FTeachingPopoverSurface`
    - `FTeachingPopoverHeader`
    - `FTeachingPopoverTitle`
    - `FTeachingPopoverBody`
    - `FTeachingPopoverFooter`
    - TeachingPopover carousel components

These components come last because they combine overlays, focus management, navigation, complex composition, measurement, and responsive behavior.

## Immediate next development batch

The roadmap component families are complete through TeachingPopover. Future batches should focus on shared hardening, integration coverage, and release verification rather than introducing unlisted families.

## Rules for updating this roadmap

- Update a component from ❌ or ⏳ to ✅ only after it meets the definition of done in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
- Record reviewed upstream versions and source paths in [`UPSTREAM.md`](./UPSTREAM.md).
- Do not change dependency order only to increase the component count.
- Implement shared foundations before components that depend on them.
- Keep family subcomponents in the same phase unless a documented dependency requires splitting them.

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
8. ⏳ **Divider → `FDivider`**
9. ❌ **Image → `FImage`**
10. ❌ **Badge family**
    - `FBadge`
    - `FCounterBadge`
    - `FPresenceBadge`
11. ❌ **Spinner → `FSpinner`**
12. ❌ **ProgressBar → `FProgressBar`**
13. ❌ **Skeleton family**
    - `FSkeleton`
    - `FSkeletonItem`

`FField` should integrate with Input, Checkbox, and later form controls to provide labels, hints, validation messages, and ARIA associations.

## Phase 3 — Form controls

14. ✅ **Textarea → `FTextarea`**
15. ⏳ **Switch → `FSwitch`**
16. ⏳ **Radio family**
    - `FRadio`
    - `FRadioGroup`
17. ⏳ **Select → `FSelect`**
18. ❌ **Slider → `FSlider`**
19. ❌ **SpinButton → `FSpinButton`**
20. ❌ **SearchBox → `FSearchBox`**
21. ❌ **Rating family**
    - `FRating`
    - `FRatingItem`
    - `FRatingDisplay`

These components should reuse the controlled/uncontrolled state, native form behavior, attribute routing, and accessibility conventions established by Input and Checkbox.

## Phase 4 — Remaining Button family

22. ❌ **ToggleButton → `FToggleButton`**
23. ❌ **CompoundButton → `FCompoundButton`**

Delay these components until Menu exists:

- `FMenuButton`
- `FSplitButton`

## Phase 5 — Simple content containers

24. ❌ **Card family**
    - `FCard`
    - `FCardHeader`
    - `FCardPreview`
    - `FCardFooter`
25. ❌ **Accordion family**
    - `FAccordion`
    - `FAccordionItem`
    - `FAccordionHeader`
    - `FAccordionPanel`
26. ❌ **Tabs family**
    - `FTabList`
    - `FTab`
27. ❌ **Breadcrumb family**
    - `FBreadcrumb`
    - `FBreadcrumbItem`
    - `FBreadcrumbButton`
    - `FBreadcrumbDivider`
28. ❌ **List family**
    - `FList`
    - `FListItem`

## Phase 6 — Identity components

29. ❌ **Avatar family**
    - `FAvatar`
    - `FAvatarGroup`
    - `FAvatarGroupItem`
    - `FAvatarGroupPopover`
30. ❌ **Persona → `FPersona`**

Avatar should be implemented before Persona because Persona composes avatar, text, secondary information, and presence state.

## Phase 7 — Selection and Combobox foundations

31. ❌ **Listbox family**
    - `FListbox`
    - `FOption`
    - `FOptionGroup`
32. ❌ **Dropdown → `FDropdown`**
33. ❌ **Combobox → `FCombobox`**

Listbox and Option come first because Dropdown and Combobox depend on their option model, keyboard navigation, active-descendant behavior, and selection state.

## Phase 8 — Overlay foundations

34. ❌ **Portal → `FPortal`**
35. ❌ **Popover family**
    - `FPopover`
    - `FPopoverTrigger`
    - `FPopoverSurface`
36. ❌ **Tooltip → `FTooltip`**
37. ❌ **Dialog family**
    - `FDialog`
    - `FDialogTrigger`
    - `FDialogSurface`
    - `FDialogBody`
    - `FDialogTitle`
    - `FDialogContent`
    - `FDialogActions`
38. ❌ **Drawer family**
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

39. ❌ **Menu family**
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
40. ❌ **MenuButton → `FMenuButton`**
41. ❌ **SplitButton → `FSplitButton`**
42. ❌ **Toolbar family**
    - `FToolbar`
    - `FToolbarButton`
    - `FToolbarToggleButton`
    - `FToolbarRadioButton`
    - `FToolbarRadioGroup`
    - `FToolbarGroup`
    - `FToolbarDivider`

Menu comes after Popover because it depends on positioning, dismissal, focus movement, and overlay behavior.

## Phase 10 — Status and notification components

43. ❌ **ARIA live announcer foundation**
    - `FAriaLiveAnnouncer`
44. ❌ **MessageBar family**
    - `FMessageBar`
    - `FMessageBarTitle`
    - `FMessageBarBody`
    - `FMessageBarActions`
    - `FMessageBarGroup`
45. ❌ **Toast family**
    - `FToaster`
    - `FToast`
    - `FToastTrigger`
    - `FToastTitle`
    - `FToastBody`
    - `FToastFooter`
46. ❌ **InfoLabel family**
    - `FInfoLabel`
    - `FInfoButton`

The ARIA announcer should precede notifications so dynamic messages can be announced correctly.

## Phase 11 — Tags and pickers

47. ❌ **Tag family**
    - `FTag`
    - `FTagGroup`
    - `FInteractionTag`
    - `FInteractionTagPrimary`
    - `FInteractionTagSecondary`
48. ❌ **TagPicker family**
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

49. ❌ **Table family**
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
50. ❌ **DataGrid family**
    - `FDataGrid`
    - `FDataGridHeader`
    - `FDataGridHeaderCell`
    - `FDataGridBody`
    - `FDataGridRow`
    - `FDataGridCell`
    - `FDataGridSelectionCell`

Implement semantic Table first. DataGrid adds sorting, selection, keyboard navigation, resizing, and advanced collection state.

## Phase 13 — Hierarchical components

51. ❌ **Tree family**
    - `FTree`
    - `FTreeItem`
    - `FTreeItemLayout`
    - `FTreeItemPersonaLayout`
    - `FFlatTree`
    - `FFlatTreeItem`
52. ❌ **Overflow family**
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

55. ❌ **Carousel family**
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
56. ❌ **Navigation family**
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
57. ❌ **TeachingPopover family**
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

The next practical batch is:

1. `FDivider`
2. `FSwitch`
3. `FRadio`
4. `FRadioGroup`
5. `FSelect`

This batch expands the library's basic and form capabilities without first requiring complex overlay or positioning infrastructure.

## Rules for updating this roadmap

- Update a component from ❌ or ⏳ to ✅ only after it meets the definition of done in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
- Record reviewed upstream versions and source paths in [`UPSTREAM.md`](./UPSTREAM.md).
- Do not change dependency order only to increase the component count.
- Implement shared foundations before components that depend on them.
- Keep family subcomponents in the same phase unless a documented dependency requires splitting them.

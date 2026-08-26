import type { App, Plugin } from 'vue';
import { FAccordion } from './components/Accordion';
import { FAccordionHeader } from './components/AccordionHeader';
import { FAccordionItem } from './components/AccordionItem';
import { FAccordionPanel } from './components/AccordionPanel';
import { FAvatar } from './components/Avatar';
import { FAvatarGroup } from './components/AvatarGroup';
import { FAvatarGroupItem } from './components/AvatarGroupItem';
import { FAvatarGroupPopover } from './components/AvatarGroupPopover';
import { FBadge } from './components/Badge';
import { FBreadcrumb } from './components/Breadcrumb';
import { FBreadcrumbButton } from './components/BreadcrumbButton';
import { FBreadcrumbDivider } from './components/BreadcrumbDivider';
import { FBreadcrumbItem } from './components/BreadcrumbItem';
import { FButton } from './components/Button';
import { FCard } from './components/Card';
import { FCardFooter } from './components/CardFooter';
import { FCardHeader } from './components/CardHeader';
import { FCardPreview } from './components/CardPreview';
import { FCheckbox } from './components/Checkbox';
import { FCompoundButton } from './components/CompoundButton';
import { FCombobox } from './components/Combobox';
import { FCounterBadge } from './components/CounterBadge';
import { FDivider } from './components/Divider';
import { FDropdown } from './components/Dropdown';
import { FField } from './components/Field';
import { FFlatTree } from './components/FlatTree';
import { FFlatTreeItem } from './components/FlatTreeItem';
import { FImage } from './components/Image';
import { FInput } from './components/Input';
import { FLabel } from './components/Label';
import { FPersona } from './components/Persona';
import { FPortal } from './components/Portal';
import { FPopover, FPopoverSurface, FPopoverTrigger } from './components/Popover';
import { FPresenceBadge } from './components/PresenceBadge';
import { FProgressBar } from './components/ProgressBar';
import { FRadio } from './components/Radio';
import { FRadioGroup } from './components/RadioGroup';
import { FRating } from './components/Rating';
import { FRatingDisplay } from './components/RatingDisplay';
import { FRatingItem } from './components/RatingItem';
import { FSearchBox } from './components/SearchBox';
import { FSelect } from './components/Select';
import { FLink } from './components/Link';
import { FList } from './components/List';
import { FListbox } from './components/Listbox';
import { FListItem } from './components/ListItem';
import { FOption } from './components/Option';
import { FOptionGroup } from './components/OptionGroup';
import { FOverflow } from './components/Overflow';
import { FOverflowDivider } from './components/OverflowDivider';
import { FOverflowItem } from './components/OverflowItem';
import { FSkeleton } from './components/Skeleton';
import { FSkeletonItem } from './components/SkeletonItem';
import { FSlider } from './components/Slider';
import { FSpinner } from './components/Spinner';
import { FSpinButton } from './components/SpinButton';
import { FSwitch } from './components/Switch';
import {
  FTable,
  FTableHeader,
  FTableHeaderCell,
  FTableBody,
  FTableRow,
  FTableCell,
  FTableSelectionCell,
  FTableCellLayout,
  FTableCellActions,
  FTableResizeHandle,
} from './components/Table';
import {
  FDataGrid,
  FDataGridHeader,
  FDataGridHeaderCell,
  FDataGridBody,
  FDataGridRow,
  FDataGridCell,
  FDataGridSelectionCell,
} from './components/DataGrid';
import { FTab } from './components/Tab';
import { FTabList } from './components/TabList';
import {
  FInteractionTag,
  FInteractionTagPrimary,
  FInteractionTagSecondary,
  FTag,
  FTagGroup,
} from './components/Tag';
import {
  FTagPicker,
  FTagPickerButton,
  FTagPickerControl,
  FTagPickerGroup,
  FTagPickerInput,
  FTagPickerList,
  FTagPickerOption,
  FTagPickerOptionGroup,
} from './components/TagPicker';
import { FText } from './components/Text';
import { FTextarea } from './components/Textarea';
import { FToggleButton } from './components/ToggleButton';
import { FTooltip } from './components/Tooltip';
import { FTree } from './components/Tree';
import { FTreeItem } from './components/TreeItem';
import { FTreeItemLayout } from './components/TreeItemLayout';
import { FTreeItemPersonaLayout } from './components/TreeItemPersonaLayout';
import {
  FDialog,
  FDialogActions,
  FDialogBody,
  FDialogContent,
  FDialogSurface,
  FDialogTitle,
  FDialogTrigger,
} from './components/Dialog';
import {
  FDrawer,
  FDrawerBody,
  FDrawerFooter,
  FDrawerHeader,
  FDrawerHeaderNavigation,
  FDrawerHeaderTitle,
  FInlineDrawer,
  FOverlayDrawer,
} from './components/Drawer';
import {
  FMenu,
  FMenuDivider,
  FMenuGroup,
  FMenuGroupHeader,
  FMenuItem,
  FMenuItemCheckbox,
  FMenuItemLink,
  FMenuItemRadio,
  FMenuItemSwitch,
  FMenuList,
  FMenuPopover,
  FMenuSplitGroup,
  FMenuTrigger,
} from './components/Menu';
import { FMenuButton } from './components/MenuButton';
import { FSplitButton } from './components/SplitButton';
import {
  FToolbar,
  FToolbarButton,
  FToolbarDivider,
  FToolbarGroup,
  FToolbarRadioButton,
  FToolbarRadioGroup,
  FToolbarToggleButton,
} from './components/Toolbar';
import { FAriaLiveAnnouncer } from './components/AriaLiveAnnouncer';
import {
  FMessageBar,
  FMessageBarActions,
  FMessageBarBody,
  FMessageBarGroup,
  FMessageBarTitle,
} from './components/MessageBar';
import {
  FToast,
  FToastBody,
  FToastFooter,
  FToastTitle,
  FToastTrigger,
  FToaster,
} from './components/Toast';
import { FInfoButton, FInfoLabel } from './components/InfoLabel';
import {
  FCarousel,
  FCarouselAutoplayButton,
  FCarouselButton,
  FCarouselCard,
  FCarouselNav,
  FCarouselNavButton,
  FCarouselNavContainer,
  FCarouselNavImageButton,
  FCarouselSlider,
  FCarouselViewport,
} from './components/Carousel';
import {
  FAppItem,
  FAppItemStatic,
  FHamburger,
  FNav,
  FNavCategory,
  FNavCategoryItem,
  FNavDivider,
  FNavDrawer,
  FNavDrawerBody,
  FNavDrawerFooter,
  FNavDrawerHeader,
  FNavItem,
  FNavSectionHeader,
  FNavSubItem,
  FNavSubItemGroup,
  FSplitNavItem,
} from './components/Navigation';
import {
  FTeachingPopover,
  FTeachingPopoverBody,
  FTeachingPopoverCarousel,
  FTeachingPopoverCarouselCard,
  FTeachingPopoverCarouselFooter,
  FTeachingPopoverCarouselFooterButton,
  FTeachingPopoverCarouselNav,
  FTeachingPopoverCarouselNavButton,
  FTeachingPopoverCarouselPageCount,
  FTeachingPopoverFooter,
  FTeachingPopoverHeader,
  FTeachingPopoverSurface,
  FTeachingPopoverTitle,
  FTeachingPopoverTrigger,
} from './components/TeachingPopover';

export const FluentVue: Plugin = {
  install(app: App) {
    app.component('FAccordion', FAccordion);
    app.component('FAccordionHeader', FAccordionHeader);
    app.component('FAccordionItem', FAccordionItem);
    app.component('FAccordionPanel', FAccordionPanel);
    app.component('FAvatar', FAvatar);
    app.component('FAvatarGroup', FAvatarGroup);
    app.component('FAvatarGroupItem', FAvatarGroupItem);
    app.component('FAvatarGroupPopover', FAvatarGroupPopover);
    app.component('FBadge', FBadge);
    app.component('FBreadcrumb', FBreadcrumb);
    app.component('FBreadcrumbButton', FBreadcrumbButton);
    app.component('FBreadcrumbDivider', FBreadcrumbDivider);
    app.component('FBreadcrumbItem', FBreadcrumbItem);
    app.component('FButton', FButton);
    app.component('FCard', FCard);
    app.component('FCardFooter', FCardFooter);
    app.component('FCardHeader', FCardHeader);
    app.component('FCardPreview', FCardPreview);
    app.component('FInput', FInput);
    app.component('FSelect', FSelect);
    app.component('FCheckbox', FCheckbox);
    app.component('FCompoundButton', FCompoundButton);
    app.component('FCombobox', FCombobox);
    app.component('FCounterBadge', FCounterBadge);
    app.component('FDivider', FDivider);
    app.component('FDropdown', FDropdown);
    app.component('FField', FField);
    app.component('FFlatTree', FFlatTree);
    app.component('FFlatTreeItem', FFlatTreeItem);
    app.component('FImage', FImage);
    app.component('FPersona', FPersona);
    app.component('FPortal', FPortal);
    app.component('FPopover', FPopover);
    app.component('FPopoverSurface', FPopoverSurface);
    app.component('FPopoverTrigger', FPopoverTrigger);
    app.component('FPresenceBadge', FPresenceBadge);
    app.component('FProgressBar', FProgressBar);
    app.component('FRadio', FRadio);
    app.component('FRadioGroup', FRadioGroup);
    app.component('FRating', FRating);
    app.component('FRatingDisplay', FRatingDisplay);
    app.component('FRatingItem', FRatingItem);
    app.component('FSearchBox', FSearchBox);
    app.component('FLabel', FLabel);
    app.component('FLink', FLink);
    app.component('FList', FList);
    app.component('FListbox', FListbox);
    app.component('FListItem', FListItem);
    app.component('FOption', FOption);
    app.component('FOptionGroup', FOptionGroup);
    app.component('FOverflow', FOverflow);
    app.component('FOverflowDivider', FOverflowDivider);
    app.component('FOverflowItem', FOverflowItem);
    app.component('FSkeleton', FSkeleton);
    app.component('FSkeletonItem', FSkeletonItem);
    app.component('FSlider', FSlider);
    app.component('FSpinner', FSpinner);
    app.component('FSpinButton', FSpinButton);
    app.component('FSwitch', FSwitch);
    app.component('FTable', FTable);
    app.component('FTableHeader', FTableHeader);
    app.component('FTableHeaderCell', FTableHeaderCell);
    app.component('FTableBody', FTableBody);
    app.component('FTableRow', FTableRow);
    app.component('FTableCell', FTableCell);
    app.component('FTableSelectionCell', FTableSelectionCell);
    app.component('FTableCellLayout', FTableCellLayout);
    app.component('FTableCellActions', FTableCellActions);
    app.component('FTableResizeHandle', FTableResizeHandle);
    app.component('FDataGrid', FDataGrid);
    app.component('FDataGridHeader', FDataGridHeader);
    app.component('FDataGridHeaderCell', FDataGridHeaderCell);
    app.component('FDataGridBody', FDataGridBody);
    app.component('FDataGridRow', FDataGridRow);
    app.component('FDataGridCell', FDataGridCell);
    app.component('FDataGridSelectionCell', FDataGridSelectionCell);
    app.component('FTab', FTab);
    app.component('FTabList', FTabList);
    app.component('FTag', FTag);
    app.component('FTagGroup', FTagGroup);
    app.component('FInteractionTag', FInteractionTag);
    app.component('FInteractionTagPrimary', FInteractionTagPrimary);
    app.component('FInteractionTagSecondary', FInteractionTagSecondary);
    app.component('FTagPicker', FTagPicker);
    app.component('FTagPickerControl', FTagPickerControl);
    app.component('FTagPickerInput', FTagPickerInput);
    app.component('FTagPickerButton', FTagPickerButton);
    app.component('FTagPickerList', FTagPickerList);
    app.component('FTagPickerOption', FTagPickerOption);
    app.component('FTagPickerOptionGroup', FTagPickerOptionGroup);
    app.component('FTagPickerGroup', FTagPickerGroup);
    app.component('FText', FText);
    app.component('FTextarea', FTextarea);
    app.component('FToggleButton', FToggleButton);
    app.component('FTooltip', FTooltip);
    app.component('FTree', FTree);
    app.component('FTreeItem', FTreeItem);
    app.component('FTreeItemLayout', FTreeItemLayout);
    app.component('FTreeItemPersonaLayout', FTreeItemPersonaLayout);
    app.component('FDialog', FDialog);
    app.component('FDialogActions', FDialogActions);
    app.component('FDialogBody', FDialogBody);
    app.component('FDialogContent', FDialogContent);
    app.component('FDialogSurface', FDialogSurface);
    app.component('FDialogTitle', FDialogTitle);
    app.component('FDialogTrigger', FDialogTrigger);
    app.component('FDrawer', FDrawer);
    app.component('FOverlayDrawer', FOverlayDrawer);
    app.component('FInlineDrawer', FInlineDrawer);
    app.component('FDrawerHeader', FDrawerHeader);
    app.component('FDrawerHeaderTitle', FDrawerHeaderTitle);
    app.component('FDrawerHeaderNavigation', FDrawerHeaderNavigation);
    app.component('FDrawerBody', FDrawerBody);
    app.component('FDrawerFooter', FDrawerFooter);
    app.component('FMenu', FMenu);
    app.component('FMenuTrigger', FMenuTrigger);
    app.component('FMenuPopover', FMenuPopover);
    app.component('FMenuList', FMenuList);
    app.component('FMenuItem', FMenuItem);
    app.component('FMenuItemLink', FMenuItemLink);
    app.component('FMenuItemCheckbox', FMenuItemCheckbox);
    app.component('FMenuItemRadio', FMenuItemRadio);
    app.component('FMenuItemSwitch', FMenuItemSwitch);
    app.component('FMenuDivider', FMenuDivider);
    app.component('FMenuGroup', FMenuGroup);
    app.component('FMenuGroupHeader', FMenuGroupHeader);
    app.component('FMenuSplitGroup', FMenuSplitGroup);
    app.component('FMenuButton', FMenuButton);
    app.component('FSplitButton', FSplitButton);
    app.component('FToolbar', FToolbar);
    app.component('FToolbarButton', FToolbarButton);
    app.component('FToolbarToggleButton', FToolbarToggleButton);
    app.component('FToolbarRadioButton', FToolbarRadioButton);
    app.component('FToolbarRadioGroup', FToolbarRadioGroup);
    app.component('FToolbarGroup', FToolbarGroup);
    app.component('FToolbarDivider', FToolbarDivider);
    app.component('FAriaLiveAnnouncer', FAriaLiveAnnouncer);
    app.component('FMessageBar', FMessageBar);
    app.component('FMessageBarTitle', FMessageBarTitle);
    app.component('FMessageBarBody', FMessageBarBody);
    app.component('FMessageBarActions', FMessageBarActions);
    app.component('FMessageBarGroup', FMessageBarGroup);
    app.component('FToaster', FToaster);
    app.component('FToast', FToast);
    app.component('FToastTrigger', FToastTrigger);
    app.component('FToastTitle', FToastTitle);
    app.component('FToastBody', FToastBody);
    app.component('FToastFooter', FToastFooter);
    app.component('FInfoLabel', FInfoLabel);
    app.component('FInfoButton', FInfoButton);
    app.component('FCarousel', FCarousel);
    app.component('FCarouselViewport', FCarouselViewport);
    app.component('FCarouselSlider', FCarouselSlider);
    app.component('FCarouselCard', FCarouselCard);
    app.component('FCarouselButton', FCarouselButton);
    app.component('FCarouselAutoplayButton', FCarouselAutoplayButton);
    app.component('FCarouselNav', FCarouselNav);
    app.component('FCarouselNavButton', FCarouselNavButton);
    app.component('FCarouselNavImageButton', FCarouselNavImageButton);
    app.component('FCarouselNavContainer', FCarouselNavContainer);
    app.component('FNav', FNav);
    app.component('FNavItem', FNavItem);
    app.component('FNavSubItem', FNavSubItem);
    app.component('FNavSubItemGroup', FNavSubItemGroup);
    app.component('FNavCategory', FNavCategory);
    app.component('FNavCategoryItem', FNavCategoryItem);
    app.component('FNavSectionHeader', FNavSectionHeader);
    app.component('FNavDivider', FNavDivider);
    app.component('FNavDrawer', FNavDrawer);
    app.component('FNavDrawerHeader', FNavDrawerHeader);
    app.component('FNavDrawerBody', FNavDrawerBody);
    app.component('FNavDrawerFooter', FNavDrawerFooter);
    app.component('FHamburger', FHamburger);
    app.component('FAppItem', FAppItem);
    app.component('FAppItemStatic', FAppItemStatic);
    app.component('FSplitNavItem', FSplitNavItem);
    app.component('FTeachingPopover', FTeachingPopover);
    app.component('FTeachingPopoverTrigger', FTeachingPopoverTrigger);
    app.component('FTeachingPopoverSurface', FTeachingPopoverSurface);
    app.component('FTeachingPopoverHeader', FTeachingPopoverHeader);
    app.component('FTeachingPopoverTitle', FTeachingPopoverTitle);
    app.component('FTeachingPopoverBody', FTeachingPopoverBody);
    app.component('FTeachingPopoverFooter', FTeachingPopoverFooter);
    app.component('FTeachingPopoverCarousel', FTeachingPopoverCarousel);
    app.component('FTeachingPopoverCarouselCard', FTeachingPopoverCarouselCard);
    app.component('FTeachingPopoverCarouselFooter', FTeachingPopoverCarouselFooter);
    app.component('FTeachingPopoverCarouselFooterButton', FTeachingPopoverCarouselFooterButton);
    app.component('FTeachingPopoverCarouselNav', FTeachingPopoverCarouselNav);
    app.component('FTeachingPopoverCarouselNavButton', FTeachingPopoverCarouselNavButton);
    app.component('FTeachingPopoverCarouselPageCount', FTeachingPopoverCarouselPageCount);
  },
};

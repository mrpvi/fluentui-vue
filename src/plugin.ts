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
import { FSkeleton } from './components/Skeleton';
import { FSkeletonItem } from './components/SkeletonItem';
import { FSlider } from './components/Slider';
import { FSpinner } from './components/Spinner';
import { FSpinButton } from './components/SpinButton';
import { FSwitch } from './components/Switch';
import { FTab } from './components/Tab';
import { FTabList } from './components/TabList';
import { FText } from './components/Text';
import { FTextarea } from './components/Textarea';
import { FToggleButton } from './components/ToggleButton';
import { FTooltip } from './components/Tooltip';
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
    app.component('FSkeleton', FSkeleton);
    app.component('FSkeletonItem', FSkeletonItem);
    app.component('FSlider', FSlider);
    app.component('FSpinner', FSpinner);
    app.component('FSpinButton', FSpinButton);
    app.component('FSwitch', FSwitch);
    app.component('FTab', FTab);
    app.component('FTabList', FTabList);
    app.component('FText', FText);
    app.component('FTextarea', FTextarea);
    app.component('FToggleButton', FToggleButton);
    app.component('FTooltip', FTooltip);
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
  },
};

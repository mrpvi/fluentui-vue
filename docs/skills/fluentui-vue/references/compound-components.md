# Compound components

Use for context-dependent overlays, triggers, focus, toasts, or grids. Examples
assume one shared stylesheet import and target the package `1.0.1` API. Check
installed declarations before adding optional behavior.

## Trigger semantics

`FDialogTrigger`, `FPopoverTrigger`, and `FMenuTrigger` render their own element
(default `button`). They are not React-style wrappers that clone/enhance a child.
Use text/decorative content directly. Do not put `FButton` or another interactive
control inside their default button. Their `as` prop is a tag-name string, not a
React `asChild` mechanism. Keep native button semantics unless the application
has a specific, verified alternative.

Use `type="button"` on `FMenuTrigger` inside forms so it does not submit the form.
For icon-only content, add `aria-label` or `aria-labelledby` on the trigger.

## Dialog

Keep trigger and surface inside `FDialog`. This complete SFC binds open state and
uses a close trigger instead of manually removing a modal from the DOM:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import {
  FDialog,
  FDialogActions,
  FDialogBody,
  FDialogContent,
  FDialogSurface,
  FDialogTitle,
  FDialogTrigger,
} from '@mrpvi/fluentui-vue';

const open = ref(false);
</script>

<template>
  <FDialog v-model="open">
    <FDialogTrigger>Review changes</FDialogTrigger>
    <FDialogSurface v-if="open">
      <FDialogBody>
        <FDialogTitle>Review changes</FDialogTitle>
        <FDialogContent>Check your changes before saving.</FDialogContent>
        <FDialogActions>
          <FDialogTrigger action="close">Close</FDialogTrigger>
        </FDialogActions>
      </FDialogBody>
    </FDialogSurface>
  </FDialog>
</template>
```

**Checked-version workaround:** keep `v-if="open"` on `FDialogSurface` in this
example. In the checked `1.0.1` source, the surface registers its DOM ref only on
component mount; mounting it while closed leaves the root's focus target unset.
Conditionally mounting the surface registers it when opened, including on reopen.
Verify against the installed version before removing this workaround. Do not use
`:unmount-on-close="false"` as a substitute: this implementation can leave the
closed surface/backdrop rendered.

Check Tab/Shift+Tab, Escape, backdrop dismissal, and focus restoration under the
chosen `modal-type`; do not replace built-in focus behavior with ad hoc timers.
When opening a dialog from a menu item, set a dialog ref from the item action and
keep the dialog root/surface outside the dismissing menu subtree. Check focus
handoff after the menu closes and restore focus to a stable control if the
original opener is no longer visible. A programmatic open does not necessarily
capture the focused opener. Retain a target available for keyboard openings too
(for example, a native ref or a trigger wrapper ref whose button is resolved
after mount), not one recorded only by a click handler. Coordinate restoration
after the root's close processing and test close-button, save, and Escape paths;
a close trigger alone can leave the root pointing at an unmounted button.

## Popover

```vue
<script setup lang="ts">
import { FPopover, FPopoverSurface, FPopoverTrigger } from '@mrpvi/fluentui-vue';
</script>

<template>
  <FPopover>
    <FPopoverTrigger>Account details</FPopoverTrigger>
    <FPopoverSurface aria-label="Account details">
      <p>Your account is active.</p>
    </FPopoverSurface>
  </FPopover>
</template>
```

The surface uses dialog semantics by default; give it an accessible name, not
just the trigger. Read props before selecting focus trapping, hover behavior, or
alternative roles. A popover is not automatically a menu or tooltip.

## Menu

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FMenu, FMenuItem, FMenuList, FMenuPopover, FMenuTrigger } from '@mrpvi/fluentui-vue';

const lastAction = ref('None');
</script>

<template>
  <FMenu>
    <FMenuTrigger type="button">Actions</FMenuTrigger>
    <FMenuPopover>
      <FMenuList>
        <FMenuItem @click="lastAction = 'Edit'">Edit</FMenuItem>
        <FMenuItem @click="lastAction = 'Duplicate'">Duplicate</FMenuItem>
      </FMenuList>
    </FMenuPopover>
  </FMenu>
  <p role="status">Last action: {{ lastAction }}</p>
</template>
```

Use `FMenuItemCheckbox`/`FMenuItemRadio` with their required `name` and `value` for
selectable items; menu `checkedValues` is a `Record<string, string[]>`, not one
boolean. Check keyboard arrows, typeahead, selection, dismissal, and RTL submenu
behavior if relevant. Don't hide package focus handling under custom click-only
interactions.

## Popup placement

Configure placement on the root, not an arbitrary child. `FPopover`, `FDropdown`,
and `FCombobox` have `inline-popup` and `mount-node`; `FMenu` has `inline` and
`mount-node`; `FDialog` has `mount-node` but no inline prop. These names are not
interchangeable. Keep custom targets mounted before Teleport uses them.

Teleported elements inherit CSS variables/direction from their physical target,
not the trigger's local section. Check the open surface under local dark theme,
RTL, scroll containers, stacking contexts, and viewport edges. Inline rendering
may fix ancestry but introduce clipping. Prefer the smallest placement change
that solves the app's actual problem.

## Toaster provider and controller

Injection occurs during the consuming component's setup. Rendering `FToaster`
inside that component does not make it an ancestor of its own setup. Use separate
parent and child components.

`ToastHost.vue`:

```vue
<script setup lang="ts">
import { FToaster } from '@mrpvi/fluentui-vue';
import SaveAction from './SaveAction.vue';
</script>

<template>
  <FToaster>
    <SaveAction />
  </FToaster>
</template>
```

`SaveAction.vue`:

```vue
<script setup lang="ts">
import { FButton, useToastController } from '@mrpvi/fluentui-vue';

const { dispatchToast } = useToastController();

function notifySaved() {
  // Call after a successful save in the real application.
  dispatchToast('Changes saved.', { intent: 'success' });
}
</script>

<template>
  <FButton @click="notifySaved">Preview saved notification</FButton>
</template>
```

The controller supports `dispatchToast(content, options)`,
`dismissToast(toastId)`, `dismissAllToasts()`, and
`updateToast(toastId, content, options)`. Don't substitute the React object-only
update signature. String content is useful for simple announced status; inspect
announcer behavior before using custom VNodes for important notifications.
Toaster uses `inline`, not `inline-popup`, and can target `mount-node`. Confirm
installed defaults if timeout, priority, queue limits, or positioning matter.

## DataGrid is explicit Vue composition

Use public `DataGridColumn`, `items`, and `getRowId` with Vue scoped slots, not
React `createTableColumn`, `renderCell`, or `useTableFeatures` APIs. DataGridBody
provides `item`, `rowId`, and `index`; its `item` declaration is `unknown`, so
narrow it rather than disabling type checking. DataGridRow's default slot has no
column/render callback contract: compose cells explicitly.

The following deliberately small grid shows the shape:

```vue
<script setup lang="ts">
import {
  FDataGrid,
  FDataGridBody,
  FDataGridCell,
  FDataGridHeader,
  FDataGridHeaderCell,
  FDataGridRow,
  type DataGridColumn,
} from '@mrpvi/fluentui-vue';

type Customer = { id: string; name: string };
const customers: Customer[] = [{ id: 'acme', name: 'Acme' }];
const columns: DataGridColumn[] = [{ columnId: 'name' }];
function isCustomer(item: unknown): item is Customer {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof item.id === 'string' &&
    'name' in item &&
    typeof item.name === 'string'
  );
}
function getRowId(item: unknown, index: number) {
  return isCustomer(item) ? item.id : index;
}
</script>

<template>
  <FDataGrid :items="customers" :columns="columns" :get-row-id="getRowId" aria-label="Customers">
    <FDataGridHeader>
      <FDataGridRow>
        <FDataGridHeaderCell column-id="name">Name</FDataGridHeaderCell>
      </FDataGridRow>
    </FDataGridHeader>
    <FDataGridBody v-slot="{ item, rowId }">
      <FDataGridRow v-if="isCustomer(item)" :row-id="rowId">
        <FDataGridCell>{{ item.name }}</FDataGridCell>
      </FDataGridRow>
    </FDataGridBody>
  </FDataGrid>
</template>
```

In the checked implementation, keep `FDataGridBody` a direct component child of
`FDataGrid`: it obtains items from the immediate parent in addition to injected
grid context. Adding a wrapper component can therefore lose rows. Use stable
row IDs; verify sorting/selection after updates. Inspect declarations for
selection-cell slots, `sort-state`, comparators, and resizing before extending
this example. Do not promise virtualization or arbitrary React feature hooks.

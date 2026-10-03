# Forms and state

Use for labels, validation, controlled/default state, selection, and events. These
contracts were checked against package `1.0.1`; installed declarations take
precedence. Examples assume the shared stylesheet is already imported once.

## Labelled controls

`FField` provides IDs, required state, and validation/hint associations to supported
controls via Vue context. Put one independently labelled control in its default
slot. Do not replace this with a visual label lacking a control association.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FInput } from '@mrpvi/fluentui-vue';

const customerName = ref('');
</script>

<template>
  <FField label="Customer name" required hint="Use the name on the account.">
    <FInput v-model="customerName" name="customerName" autocomplete="name" />
  </FField>
</template>
```

For a native or third-party control that does not consume field context, bind the
field's scoped attributes. Standalone native control example:

```vue
<script setup lang="ts">
import { FField } from '@mrpvi/fluentui-vue';
</script>

<template>
  <FField v-slot="controlProps" label="Reference code" required>
    <input v-bind="controlProps" name="referenceCode" />
  </FField>
</template>
```

Use `validation-state` and `validation-message` for feedback, but implement the
application's validation rules explicitly. `required` and a displayed message
are not a complete validation/submission system. Avoid overriding a control's
`id` without verifying its resulting label association.

## Model shapes are not interchangeable

| Component                                      | Controlled state                      | Uncontrolled initial state |
| ---------------------------------------------- | ------------------------------------- | -------------------------- |
| `FInput`, `FTextarea`, `FSearchBox`, `FSelect` | String `v-model`                      | `default-value`            |
| `FListbox`                                     | `string[]` `v-model`                  | `default-selected-options` |
| `FDropdown`, `FCombobox` display/input text    | String `v-model`                      | `default-value`            |
| `FDropdown`, `FCombobox` selection             | `string[]` `v-model:selected-options` | `default-selected-options` |
| `FDropdown`, `FCombobox` popup                 | Boolean `v-model:open`                | `default-open`             |

Do not generalize this table to every component. Inspect the installed types for
checkbox, radio, accordion, tabs, tag-picker, and other model shapes.

Use initialized refs for controlled state and respond to model updates. For
uncontrolled state, omit that model prop and use its `default*` prop if needed.
Defaults initialize state; changing a default is not a controlled update. A bound
`undefined` model is not guaranteed to be uncontrolled: for example, `FDropdown`
uses prop presence and treats explicitly bound undefined as controlled/empty.
Do not bind both an open alias and `v-model:open`, or a model and its default,
unless the installed component contract explicitly calls for that combination.

## Combobox: selection is separate from input text

This multi-select example keeps IDs in `selectedCustomers` and typed/display text
in `searchText`. Choosing options does not turn the text model into an array.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FCombobox, FField, FInput, FOption } from '@mrpvi/fluentui-vue';

const customerName = ref('');
const searchText = ref('');
const selectedCustomers = ref<string[]>([]);
const customers = [
  { id: 'acme', name: 'Acme' },
  { id: 'northwind', name: 'Northwind' },
];
</script>

<template>
  <FField label="Customer name" required>
    <FInput v-model="customerName" name="customerName" />
  </FField>
  <FField label="Related customers" hint="Choose one or more accounts.">
    <FCombobox
      v-model="searchText"
      v-model:selected-options="selectedCustomers"
      multiselect
      placeholder="Choose customers"
    >
      <FOption
        v-for="customer in customers"
        :key="customer.id"
        :value="customer.id"
        :text="customer.name"
      >
        {{ customer.name }}
      </FOption>
    </FCombobox>
  </FField>
</template>
```

Typing updates the text model and supports active-option matching; don't assume
it automatically removes nonmatching options or fetches remote results. Implement
filtering/fetching deliberately when requested and preserve selected IDs.

`FDropdown` has the same separate text and selected-options channels but uses a
noneditable trigger. In single selection, the selected array still contains zero
or one ID. If you preselect controlled IDs, initialize the controlled display text
consistently too; don't expect the ID to be a human-readable label. Option `value`
is the stored ID; `text` is the label used by selection/typeahead. Supply explicit
`text` for options with icons or other rich slot content.

## Native select is different

`FSelect` uses a native select and a string model. It takes native `<option>` and
`<optgroup>`, not `FOption`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FField, FSelect } from '@mrpvi/fluentui-vue';

const country = ref('ca');
</script>

<template>
  <FField label="Country">
    <FSelect v-model="country" name="country">
      <option value="ca">Canada</option>
      <option value="jp">Japan</option>
    </FSelect>
  </FField>
</template>
```

## Events and validation

Prefer `v-model` for state synchronization. For side effects, inspect emits rather
than treating the first event argument as the new value:

- `FInput`: `update:modelValue` emits the string; `input`/`change` emit the native
  event and a second `{ value: string }` argument.
- `FCombobox`/`FDropdown`: `optionSelect` emits `(event, data)` where data includes
  `selectedOptions`, `optionValue`, and `optionText`. In templates use
  `@option-select="(event, data) => ..."` when both arguments are needed.
- `openChange` similarly carries an event plus data; the corresponding
  `update:open` model event carries the boolean.

A Vue `@change` listener is not a React `onChange` prop. Avoid manually wiring DOM
listeners to internal inputs when an exported model or event exists.

Run the consumer's typecheck and form tests. Check label activation, keyboard
selection, empty/default values, clear actions, and disabled states. For native
form submission/reset, verify what reaches `FormData` and how controlled refs
reset; complex selection state may need explicit serialization and application
reset logic. Do not assume every visual input is a native successful form control.

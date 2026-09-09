# quasar-form-builder

This package just get you props and then give you form with inputs (it's created with **FormBuilder** component) or just any input you need.

## install

```
npm i quasar-form-builder
```

## Usage

To use it in vue files, you need to import the component you want and use it like a regular component, for example:

```vue
<template>
  <form-builder v-model:inputs="inputs"
                v-model:formData="formData"
                :readonly="readonly"
                :disable="disable"
                :loading="loading"
                @inputClick="onClick"
                @keydown="onKeyPress" />
</template>

<script setup lang="ts">
import { type FormInputItem } from 'quasar-form-builder'
import { FormBuilder } from 'quasar-form-builder';

const inputs = ref<FormInputItem[]>([])
const formData = ref<Record<string, any>>({})

const readonly = ref(false)
const disable = ref(false)
const loading = ref(false)

const onClick = (data: any) => {
  console.log('data clicked:', data)
}

const onKeyPress = (data: any) => {
  console.log('key press:', data)
}
</script>
```

<!-- Generator removed: see dev/App.vue playground example -->

## Features:

### Outside label (`outsideLabel`) prop

A new optional prop `outsideLabel` (type: String) is supported by many form input components. When provided, the component renders an external label element above the input using the CSS class `outside-label`. Example in a component template:

```vue
<div v-if="outsideLabel" class="outside-label">{{ outsideLabel }}</div>
```

This prop is useful when you want to show a label outside (above) the input instead of using the component's internal `label` or `stackLabel` behavior.

Currently supported components (in `src/components`):

- FormBuilderInput
- FormBuilderInputEditor
- FormBuilderSelect
- FormBuilderCheckbox
- FormBuilderColor
- FormBuilderDate
- FormBuilderDateTime
- FormBuilderTime
- FormBuilderSlider
- FormBuilderRangeSlider
- FormBuilderOptionGroup
- FormBuilderFile
- FormBuilderTiptapEditor
- FormBuilderToggleButton
- FormBuilderButton

Usage example (inside FormBuilder JSON or component props):

```json
{
  "type": "Input",
  "outsideLabel": "External label text",
  "label": "Field label (optional)"
}
```

Styling: the class used is `outside-label`. You can override or extend it in your styles (the components include a simple default margin and font-size).


- ### FormBuilder

| props   | default | type    |
| ------- | :-----: | :------ |
| value   |   [ ]   | Array   |
| disable |  false  | Boolean |

> #### important !
>
> For any input you want,you have to specify its type.

```vue
<template>
  <form-builder v-model:value="inputs" />
</template>

<script>
import { FormBuilder } from 'quasar-form-builder';
export default {
  components: { FormBuilder },
  data() {
    return {
      inputs: [
        {
          type: 'Input', // Avatar, date, dateTime and etc.
          label: 'Label',
          //and other props of FormBuilderInput component
        },
        {
          type: 'date',
          label: 'Label' /*and other props of FormBuilderDateTime component*/,
        },
        {
          type: 'Slider',
          label: 'Label' /*and other props of FormBuilderSlider component*/,
        },
      ],
    };
  },
};
</script>
```

- ### FormBuilderAvatar
  - types
    - Avtar

| props     | default | type   |
| --------- | :-----: | :----- |
| size      |  50px   | String |
| fontSize  |  14px   | String |
| color     | primary | String |
| textColor |  white  | String |

- ### FormBuilderCheckbox
  - types
    - Checkbox

| props      | default | type                                   |
| ---------- | :-----: | :------------------------------------- |
| value      |   ' '   | Object, String, Array, Number, Boolean |
| label      |   ' '   | String                                 |
| color      | primary | String                                 |
| disable    |  false  | Boolean                                |
| trueValue  |  true   | Object, String, Array, Number, Boolean |
| falseValue |  false  | Object, String, Array, Number, Boolean |

- ### FormBuilderDateTime

  - types

    - date

      | props    | default | type          |
      | -------- | :-----: | :------------ |
      | value    |   ' '   | Object, Array |
      | calendar | persian | String        |
      | multiple |  false  | Boolean       |
      | disable  |  false  | Boolean       |

    - time

      | props   | default | type          |
      | ------- | :-----: | :------------ |
      | value   |   ' '   | Object, Array |
      | disable |  false  | Boolean       |

    - dateTime

      | props    | default | type          |
      | -------- | :-----: | :------------ |
      | value    |   ' '   | Object, Array |
      | calendar | persian | String        |
      | multiple |  false  | Boolean       |
      | disable  |  false  | Boolean       |

    - dateRange

      | props    | default | type          |
      | -------- | :-----: | :------------ |
      | value    |   ' '   | Object, Array |
      | calendar | persian | String        |
      | multiple |  false  | Boolean       |
      | disable  |  false  | Boolean       |
      | range    |  true   | Boolean       |

    - dateMultipleRange

      | props    | default | type          |
      | -------- | :-----: | :------------ |
      | value    |   ' '   | Object, Array |
      | calendar | persian | String        |
      | multiple |  true   | Boolean       |
      | disable  |  false  | Boolean       |
      | range    |  true   | Boolean       |

- ### FormBuilderFile
  - types
    - File

| props     | default | type                                   |
| --------- | :-----: | :------------------------------------- |
| value     |   ' '   | Object, String, Array, Number, Boolean |
| label     |   ' '   | String                                 |
| disable   |  false  | Boolean                                |
| clearable |  true   | Boolean                                |
| src       |   ' '   | String, Number, Boolean, Array         |

- ### FormBuilderInput
  - types
    - Input

| props   | default | type                    |
| ------- | :-----: | :---------------------- |
| value   |   ' '   | String, Number, Boolean |
| label   |   ' '   | String                  |
| disable |  false  | Boolean                 |

- ### FormBuilderInputEditor
  - types
    - InputEditor

| props   | default | type                    |
| ------- | :-----: | :---------------------- |
| value   |   ' '   | String, Number, Boolean |
| label   |   ' '   | String                  |
| disable |  false  | Boolean                 |

- ### FormBuilderOptionGroup
  - types
    - date
    - OptionGroup
    - optionGroupRadio
    - optionGroupCheckbox
    - optionGroupToggle

| props   | default | type                                   |
| ------- | :-----: | :------------------------------------- |
| value   |   ' '   | Object, String, Array, Number, Boolean |
| options |   []    | Array                                  |

- ### FormBuilderSlider
  - types
    - Slider

| props   | default | type    |
| ------- | :-----: | :------ |
| value   |    0    | Number  |
| min     |    0    | Number  |
| max     |   100   | Number  |
| disable |  false  | Boolean |

- ### FormBuilderRangeSlider
  - types
    - RangeSlider

| props   |       default       | type    |
| ------- | :-----------------: | :------ |
| value   | { min: 9, max: 35 } | Object  |
| label   |         ' '         | String  |
| disable |        false        | Boolean |
| range   |        true         | Boolean |

- ### FormBuilderSelect
  - types
    - Select

| props         | default | type                           |
| ------------- | :-----: | :----------------------------- |
| value         |   []    | Array, String, Number, Boolean |
| options       |   []    | Array                          |
| optionDisable | disable | String                         |
| optionValue   |  value  | String                         |
| optionLabel   |  label  | String                         |
| label         |   ' '   | String                         |
| disable       |  false  | Boolean                        |
| multiple      |  false  | Boolean                        |
| useChips      |  false  | Boolean                        |

#### example of options prop usage :

```vue
<template>
  <form-builder v-model:value="inputs" />
</template>

<script>
import { FormBuilder } from 'quasar-form-builder';
export default {
  components: { FormBuilder },
  data() {
    return {
      inputs: [
        {
          type: 'Select', // Avatar, date, dateTime and etc.
          label: 'Label',
          options: [
            { label: 'some label', value: 'some value' }, //for first option of select input
            { label: 'some label', value: 'some value' }, //for second option of select input
            { label: 'some label', value: 'some value' }, //for third option of select input
          ],
          optionLabel: 'label',
          optionValue: 'value',
          //and other props of FormBuilderSelect component
        },
      ],
    };
  },
};
</script>

## Playground / Example (from dev/App.vue)

The repository includes a development playground at `dev/App.vue` which demonstrates how to wire up and interact with `FormBuilder`. Below are the common integration points shown in the playground.

- Provide the inputs schema via `v-model:inputs` (an array describing each field).
- Bind current values via `v-model:formData` (an object populated as the user interacts).
- Control global states using `:readonly`, `:disable`, and `:loading` props on the `FormBuilder` component.
- Use a template `ref` (`ref="formBuilderRef"`) to call helper methods exposed by the FormBuilder instance:
  - `getNormalizedFormData(inputs)` — returns a normalized/flattened form data object based on the inputs schema.
  - `clearValues()` — clear/reset form values programmatically.
- Listen to `@inputClick` and `@keydown` events to react to input interactions.
- Register custom components as input types by passing a `shallowRef` to the `type` field of an input item.

Simplified example inspired by `dev/App.vue`:

```vue
<template>
  <form-builder
    ref="formBuilderRef"
    v-model:inputs="inputs"
    v-model:formData="formData"
    :readonly="readonly"
    :disable="disable"
    :loading="loading"
    @inputClick="onClick"
    @keydown="onKeyPress" />
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import FormBuilder from './src/FormBuilder.vue'
import CustomComponent from './dev/components/CustomComponent.vue'

const formBuilderRef = ref(null)
const CustomComponentInput = shallowRef(CustomComponent)

const inputs = ref([
  { type: 'file', label: 'just capture', multiple: true, clearable: true },
  { type: 'select', name: 'question_type', options: [ { label: 'konkur', value: 'konkur' } ] },
  { type: 'submit', label: 'submit btn' },
  { type: CustomComponentInput, props: { name: 'ali' }, name: 'ali', label: 'شناسه علی' },
  { type: 'date', name: 'last_modification_time', label: 'required date with label' }
])

const formData = ref({})

const getData = () => {
  console.log('Form Data Object: ', formData.value)
  if (formBuilderRef.value) {
    console.log('Normalized Form Data:', formBuilderRef.value.getNormalizedFormData(inputs.value))
  }
}

const clearInputValues = () => {
  if (formBuilderRef.value) formBuilderRef.value.clearValues()
}
</script>
```


The dev playground also shows several utility controls (buttons) such as: get data, clear inputs, toggle `loading`, toggle `readonly`/`disable`, and change screen `dir` between `ltr` and `rtl`.

## API / Instance Methods

When you hold a `ref` to the `FormBuilder` component instance (for example `ref="formBuilderRef"`), the playground demonstrates calling these helpers:

- `getNormalizedFormData(inputs)` — returns a normalized form data object based on the provided `inputs` schema.
- `clearValues()` — clears or resets all input values managed by the `FormBuilder` instance.

Example usage:

```js
if (formBuilderRef.value) {
  formBuilderRef.value.clearValues()
  const normalized = formBuilderRef.value.getNormalizedFormData(inputs.value)
}
```

## Events

The `FormBuilder` emits a few useful events demonstrated in the playground:

- `@inputClick` — emitted when an input is clicked.
- `@keydown` — emitted for keyboard interactions inside inputs.

Bind handlers directly on the component like:

```vue
<form-builder @inputClick="onClick" @keydown="onKeyPress" />
```

## Notes from the playground

- Use `v-model:inputs` to supply the inputs schema array.
- Use `v-model:formData` to two-way bind form values.
- Control global presentation/interaction via `:readonly`, `:disable`, and `:loading` props.
- Provide custom input components by assigning a `shallowRef` to the `type` field of an input (see the playground `CustomComponentInput`).


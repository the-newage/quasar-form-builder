<template>
  {{ formData }}
  <form-builder
      ref="formBuilderCoreRef"
      v-model:form-data="formData"
      v-model:inputs="inputs"
      :loading="loading"
      :readonly="readonly"
      :disabled="disabled"
      form-data-mode="flat"
      @change="handleChange"
      @update:formData="value => console.log('update:formData', value)"
  />
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted, watch, type PropType, type Component } from 'vue'
import { createFormBuilderValidation } from './utils/formBuilderValidation'
import FormBuilder from 'vue-form-builder-core'
import { type FormInputItem } from 'vue-form-builder-core'

import FormBuilderButton from 'src/components/FormBuilderButton.vue'
import FormBuilderCheckbox from 'src/components/FormBuilderCheckbox.vue'
import FormBuilderColor from 'src/components/FormBuilderColor.vue'
import FormBuilderDate from 'src/components/FormBuilderDate.vue'
import FormBuilderDateTime from 'src/components/FormBuilderDateTime.vue'
import FormBuilderFile from 'src/components/FormBuilderFile.vue'
import FormBuilderInput from 'src/components/FormBuilderInput.vue'
import FormBuilderInputEditor from 'src/components/FormBuilderInputEditor.vue'
import FormBuilderOptionGroup from 'src/components/FormBuilderOptionGroup.vue'
import FormBuilderRangeSlider from 'src/components/FormBuilderRangeSlider.vue'
import FormBuilderSelect from 'src/components/FormBuilderSelect.vue'
import FormBuilderSeparator from 'src/components/FormBuilderSeparator.vue'
import FormBuilderSlider from 'src/components/FormBuilderSlider.vue'
import FormBuilderTime from 'src/components/FormBuilderTime.vue'
import FormBuilderToggleButton from 'src/components/FormBuilderToggleButton.vue'

const inputs = defineModel<FormInputItem[]>('inputs', {
  default: () => []
})

const formData = defineModel<Record<string, any>>('formData', {
  default: () => ({})
})

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  i18n: {
    type: Function as PropType<(key: string, named?: Record<string, string>) => string>,
    default: undefined
  },
  customRules: {
    type: Object as PropType<Record<string, (value: any, params?: any[]) => boolean | string>>,
    default: () => ({})
  }
})

const emit = defineEmits<{
  (e: 'update:inputs', value: FormInputItem[]): void
  (e: 'update:formData', value: Record<string, any>): void
  (e: 'change', value: any): void
}>()

const formBuilderCoreRef = ref<InstanceType<typeof FormBuilder> | null>(null)

const componentMap: Record<string, Component> = {
  input: markRaw(FormBuilderInput),
  inputEditor: markRaw(FormBuilderInputEditor),
  time: markRaw(FormBuilderTime),
  date: markRaw(FormBuilderDate),
  datetime: markRaw(FormBuilderDateTime),
  select: markRaw(FormBuilderSelect),
  optionGroup: markRaw(FormBuilderOptionGroup),
  checkbox: markRaw(FormBuilderCheckbox),
  toggleButton: markRaw(FormBuilderToggleButton),
  button: markRaw(FormBuilderButton),
  file: markRaw(FormBuilderFile),
  color: markRaw(FormBuilderColor),
  slider: markRaw(FormBuilderSlider),
  rangeSlider: markRaw(FormBuilderRangeSlider),
  separator: markRaw(FormBuilderSeparator)
}

const handleChange = (data: any) => {
  emit('change', data)
}

const prepareInputItem = (
    input: FormInputItem,
    validator: ReturnType<typeof createFormBuilderValidation>
): void => {
  if (!input || typeof input !== 'object') return

  if (input.rules && typeof input.rules === 'string') {
    input.rules = validator.parseRules(input.rules, input.label || '')
  }

  if (typeof input.type === 'string' && componentMap[input.type]) {
    input.type = componentMap[input.type]
  }

  if (props.readonly && input.readonly === undefined) {
    input.readonly = true
  }

  if (Array.isArray(input.inputs)) {
    input.inputs.forEach((child) => prepareInputItem(child, validator))
  }
}

const prepareInputs = (): void => {
  if (!Array.isArray(inputs.value)) return

  const validator = createFormBuilderValidation({
    i18n: props.i18n,
    customRules: props.customRules
  })

  inputs.value.forEach((input) => prepareInputItem(input, validator))
}

onMounted(() => {
  prepareInputs()
})

watch(
    () => [inputs.value, props.customRules, props.i18n, props.readonly],
    () => {
      prepareInputs()
    },
    { deep: true }
)

/**
 * Forward the public API exposed by vue-form-builder-core.
 *
 * This makes the wrapper behave as if these methods
 * were exposed directly by this component.
 */
const focus = (): void => {
  formBuilderCoreRef.value?.focus()
}

const flattenFormData = (
    data: Record<string, any>
): Record<string, any> => {
  return formBuilderCoreRef.value?.flattenFormData(data) ?? {}
}

const getFormData = (): Record<string, any> => {
  return formBuilderCoreRef.value?.getFormData() ?? {}
}

const setFormData = (
    data: Record<string, any>
): void => {
  formBuilderCoreRef.value?.setFormData(data)
}

const getInputsByName = (
    name: string
): FormInputItem | undefined => {
  return formBuilderCoreRef.value?.getInputsByName(name)
}

const setInputByName = (
    name: string,
    value: any
): void => {
  formBuilderCoreRef.value?.setInputByName(name, value)
}

const setInputValues = (
    responseData: Record<string, any>
): void => {
  formBuilderCoreRef.value?.setInputValues(responseData)
}

const clearValues = (): void => {
  formBuilderCoreRef.value?.clearValues()
}

const disableAllInputs = (
    status: boolean
): void => {
  formBuilderCoreRef.value?.disableAllInputs(status)
}

const readonlyAllInputs = (
    status: boolean
): void => {
  formBuilderCoreRef.value?.readonlyAllInputs(status)
}

defineExpose({
  focus,
  flattenFormData,
  getFormData,
  setFormData,
  getInputsByName,
  setInputByName,
  setInputValues,
  clearValues,
  disableAllInputs,
  readonlyAllInputs
})
</script>

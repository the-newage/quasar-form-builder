<template>
  <form-builder
      ref="formBuilderCoreRef"
      v-model:form-data="formData"
      v-model:inputs="inputs"
      :custom-components="componentMap"
      v-bind="$attrs"
      @change="handleChange"
  />
</template>

<script setup lang="ts">
import {
  ref,
  provide,
  markRaw,
  type PropType,
  type Component,
} from 'vue'
import FormBuilder from 'vue-form-builder-core'
import { createFormBuilderValidation, FORM_VALIDATOR_KEY } from './composables/useInputRules'

import {type FormInputItem} from 'vue-form-builder-core'
import FormBuilderTime from 'src/components/FormBuilderTime.vue'
import FormBuilderDate from 'src/components/FormBuilderDate.vue'
import FormBuilderFile from 'src/components/FormBuilderFile.vue'
import FormBuilderColor from 'src/components/FormBuilderColor.vue'
import FormBuilderInput from 'src/components/FormBuilderInput.vue'
import FormBuilderButton from 'src/components/FormBuilderButton.vue'
import FormBuilderSelect from 'src/components/FormBuilderSelect.vue'
import FormBuilderSlider from 'src/components/FormBuilderSlider.vue'
import FormBuilderCheckbox from 'src/components/FormBuilderCheckbox.vue'
import FormBuilderDateTime from 'src/components/FormBuilderDateTime.vue'
import FormBuilderSeparator from 'src/components/FormBuilderSeparator.vue'
import FormBuilderInputEditor from 'src/components/FormBuilderInputEditor.vue'
import FormBuilderOptionGroup from 'src/components/FormBuilderOptionGroup.vue'
import FormBuilderRangeSlider from 'src/components/FormBuilderRangeSlider.vue'
import FormBuilderToggleButton from 'src/components/FormBuilderToggleButton.vue'

defineOptions({
  name: 'QuasarFormBuilder',
  inheritAttrs: false
})

const props = defineProps({
  i18n: {
    type: Function as PropType<(key: string, named?: Record<string, string>) => string>,
    default: undefined
  },
  customRules: {
    type: Object as PropType<Record<string, (value: any, params?: any[]) => boolean | string>>,
    default: () => ({})
  }
})

const inputs = defineModel<FormInputItem[]>('inputs', {
  default: () => []
})

const formData = defineModel<Record<string, any>>('formData', {
  default: () => ({})
})

const validator = createFormBuilderValidation({
  i18n: props.i18n,
  customRules: props.customRules
})
provide(FORM_VALIDATOR_KEY, validator)

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

/**
 * Forward the public API exposed by vue-form-builder-core.
 *
 * This makes the wrapper behave as if these methods
 * were exposed directly by this component.
 */
const focus = (): void => {
  formBuilderCoreRef.value?.focus()
}

const flattenFormData = (data: Record<string, any>): Record<string, any> => {
  return formBuilderCoreRef.value?.flattenFormData(data) ?? {}
}

const getFormData = (): Record<string, any> => {
  return formBuilderCoreRef.value?.getFormData() ?? {}
}

const setFormData = (data: Record<string, any>): void => {
  formBuilderCoreRef.value?.setFormData(data)
}

const getInputsByName = (name: string): FormInputItem | undefined => {
  return formBuilderCoreRef.value?.getInputsByName(name)
}

const setInputByName = (name: string, value: any): void => {
  formBuilderCoreRef.value?.setInputByName(name, value)
}

const setInputValues = (responseData: Record<string, any>): void => {
  formBuilderCoreRef.value?.setInputValues(responseData)
}

const clearValues = (): void => {
  formBuilderCoreRef.value?.clearValues()
}

defineExpose({
  focus,
  flattenFormData,
  getFormData,
  setFormData,
  getInputsByName,
  setInputByName,
  setInputValues,
  clearValues
})
</script>

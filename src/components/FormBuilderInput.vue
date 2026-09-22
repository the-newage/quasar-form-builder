<template>
  <div class="form-builder-input">
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <q-input
        ref="inputRef"
        v-bind="filteredAttrs"
        :model-value="model"
        :type="inputType"
        :rules="parsedRules"
        @update:model-value="model = $event"
        @click="onClick"
        @keypress="onKeyPress"
    />
  </div>
</template>

<script setup lang="ts">
import { QInput } from 'quasar'
import { computed, useAttrs, ref } from 'vue'
import { useInputRules } from '@/composables/useInputRules'

defineOptions({
  name: 'FormBuilderInput',
  inheritAttrs: false
})

type InputValue = string | number | null

interface Props {
  modelValue?: InputValue
  outsideLabel?: string
  label?: string
  rules?: any
  inputType?:
      | 'text'
      | 'password'
      | 'textarea'
      | 'email'
      | 'search'
      | 'tel'
      | 'file'
      | 'number'
      | 'url'
      | 'time'
      | 'date'
      | 'datetime-local'

  preventPersian?: boolean
  preventEnglish?: boolean
  justNumber?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: '',
      outsideLabel: '',
      label: '',
      rules: () => [],
      inputType: 'text',
      preventPersian: false,
      preventEnglish: false,
      justNumber: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: InputValue): void
  (e: 'change', value: InputValue): void
  (e: 'click', event: MouseEvent): void
  (e: 'keypress', event: KeyboardEvent): void
}>()

const attrs = useAttrs()

// استفاده از composable جهت پارس کردن رول‌های استرینگ به متدهای Quasar
const { parsedRules } = useInputRules({
  rules: props.rules,
  label: props.label || props.outsideLabel
})

const filteredAttrs = computed(() => {
  return filterAttrs(attrs, [
    'class',
    'style',
    'id',
    'modelValue',
    'onUpdate:modelValue',
    'inputType',
    'preventPersian',
    'preventEnglish',
    'justNumber',
    'outsideLabel',
    'rules',
    'label'
  ])
})

const inputRef = ref<any>(null)

function filterAttrs(obj: Record<string, unknown>, exclude: string[]) {
  const forbidden = new Set(exclude)
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (!forbidden.has(key)) result[key] = val
  }
  return result
}

const model = computed<InputValue>({
  get: () => props.modelValue ?? '',

  set: (value) => {
    emitModelUpdate(value)
  }
})

const emitModelUpdate = (value: InputValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const onClick = (event: MouseEvent) => {
  emit('click', event)
}

const onKeyPress = (event: KeyboardEvent) => {
  if (props.justNumber) {
    const key = event.key

    if (
        !/[0-9]/.test(key) &&
        key !== 'Backspace' &&
        key !== 'Delete' &&
        key !== 'ArrowLeft' &&
        key !== 'ArrowRight' &&
        key !== 'Tab'
    ) {
      event.preventDefault()
      return
    }
  }

  if (props.preventPersian) {
    if (/[\u0600-\u06FF]/.test(event.key)) {
      event.preventDefault()
      return
    }
  }

  if (props.preventEnglish) {
    if (/[a-zA-Z]/.test(event.key)) {
      event.preventDefault()
      return
    }
  }

  emit('keypress', event)
}
</script>

<style scoped>
</style>

<template>
  <div
      class="form-builder-input"
      :class="customClass"
  >
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <q-input
        ref="inputRef"
        v-bind="qInputAttrs"
        :model-value="model"
        :type="inputType"
        :disable="isDisabled"
        :class="customClass"
        :input-class="customClass"
        @update:model-value="model = $event"
        @click="onClick"
        @keypress="onKeyPress"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, ref } from 'vue'

defineOptions({
  name: 'FormBuilderInput',
  inheritAttrs: false
})

type InputValue = string | number | null

interface Props {
  modelValue?: InputValue

  customClass?: string

  outsideLabel?: string

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

  autogrow?: boolean

  preventPersian?: boolean
  preventEnglish?: boolean
  justNumber?: boolean

  mask?: string
  fillMask?: string
  reverseFillMask?: boolean

  maxlength?: string | number
  hint?: string

  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: '',
      customClass: '',
      outsideLabel: '',

      inputType: 'text',

      autogrow: false,

      preventPersian: false,
      preventEnglish: false,
      justNumber: false,

      mask: undefined,
      fillMask: undefined,
      reverseFillMask: undefined,

      maxlength: undefined,
      hint: undefined,

      disabled: false,
      readonly: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: InputValue): void
  (e: 'change', value: InputValue): void
  (e: 'click', event: MouseEvent): void
  (e: 'keypress', event: KeyboardEvent): void
}>()

const attrs = useAttrs()

const inputRef = ref<any>(null)

/**
 * Attributes that can be passed directly to QInput.
 *
 * Component-specific props such as:
 *   inputType
 *   preventPersian
 *   preventEnglish
 *   justNumber
 *   outsideLabel
 *
 * are intentionally not forwarded.
 */
const allowedQInputAttrs = new Set([
  'name',
  'loading',

  'filled',
  'outlined',
  'borderless',
  'standout',
  'rounded',

  'label',
  'stackLabel',
  'placeholder',

  'rules',
  'lazyRules',

  'error',
  'errorMessage',

  'hint',

  'disable',
  'readonly',

  'mask',
  'fillMask',
  'reverseFillMask',

  'clearable',

  'loading',

  'autogrow',
  'maxlength',

  'dense',

  'color',
  'bgColor',
  'labelColor',

  'hideHint',
  'hideBottomSpace',

  'counter',

  'prefix',
  'suffix',

  'debounce',

  'clearIcon',

  'bottomSlots',

  'inputClass',
  'inputStyle',

  'autocomplete',

  'autofocus',

  'tabindex'
])

const qInputAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQInputAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

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

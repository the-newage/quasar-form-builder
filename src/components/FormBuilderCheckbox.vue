<template>
  <div
      class="form-builder-checkbox"
      :class="customClass"
  >
    <div v-if="outsideLabel" class="outside-label">{{ outsideLabel }}</div>
    <q-checkbox
        ref="inputRef"
        v-bind="qCheckboxAttrs"
        :model-value="model"
        :true-value="trueValue"
        :false-value="falseValue"
        :disable="isDisabled"
        :class="customClass"
        @update:model-value="model = $event"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  useAttrs
} from 'vue'

defineOptions({
  name: 'FormBuilderCheckbox',
  inheritAttrs: false
})

type CheckboxValue =
    | string
    | number
    | boolean
    | Record<string, any>
    | Array<string | number | boolean | Record<string, any>>
    | null

interface Props {
  modelValue?: CheckboxValue

  trueValue?: CheckboxValue
  falseValue?: CheckboxValue

  customClass?: string

  outsideLabel?: string

  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: false,
      trueValue: true,
      falseValue: false,

      customClass: '',
      outsideLabel: '',

      disabled: false,
      readonly: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: CheckboxValue): void
  (e: 'change', value: CheckboxValue): void
  (e: 'click'): void
}>()

const inputRef = ref<any>(null)

const attrs = useAttrs()

/**
 * Attributes that can be passed directly to QCheckbox.
 */
const allowedQCheckboxAttrs = new Set([
  'name',
  'loading',

  'label',
  'leftLabel',

  'color',
  'keepColor',

  'size',
  'dense',

  'dark',

  'disable',
  'readonly',

  'indeterminateValue',
  'toggleIndeterminate',

  'error',
  'errorMessage',

  'checkedIcon',
  'uncheckedIcon',
  'indeterminateIcon',

  'tabindex'
])

const qCheckboxAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQCheckboxAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const model = computed<CheckboxValue>({
  get: () => props.modelValue ?? null,

  set: (value) => {
    emitModelUpdate(value)
  }
})

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

const emitModelUpdate = (
    value: CheckboxValue
) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const onClick = () => {
  emit('click')
}
</script>

<style scoped>
.form-builder-checkbox {
}
</style>

<template>
  <div
      class="form-builder-optionGroup"
      :class="customClass"
  >
    <div
        v-if="outsideLabel || label"
        class="outside-label"
    >
      {{ outsideLabel || label }}
    </div>

    <q-option-group
        ref="inputRef"
        v-bind="qOptionGroupAttrs"
        :model-value="model"
        :options="options"
        :type="typeOfInput"
        :disable="isDisabled"
        :class="customClass"
        @update:model-value="model = $event"
        @click="onClick"
    >
      <template #label="opt">
        <q-icon
            v-if="opt.icon"
            :name="opt.icon"
            color="teal"
            size="1.5em"
            class="q-ml-sm"
        />

        <span v-if="opt.label">
          {{ opt.label }}
        </span>

        <div
            v-if="opt.caption"
            class="caption text-grey-8"
        >
          {{ opt.caption }}
        </div>
      </template>
    </q-option-group>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  useAttrs
} from 'vue'

defineOptions({
  name: 'FormBuilderOptionGroup',
  inheritAttrs: false
})

type OptionValue =
    | string
    | number
    | boolean
    | Record<string, any>
    | Array<string | number | boolean | Record<string, any>>
    | null

type OptionGroupType =
    | 'radio'
    | 'checkbox'
    | 'toggle'

interface OptionGroupItem {
  label?: string
  value: any
  disable?: boolean
  icon?: string
  caption?: string
  [key: string]: any
}

interface Props {
  modelValue?: OptionValue
  options?: OptionGroupItem[]
  typeOfInput?: OptionGroupType
  label?: string
  outsideLabel?: string
  customClass?: string

  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: null,
      options: () => [],
      typeOfInput: 'radio',
      label: '',
      customClass: '',
      disabled: false,
      readonly: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: OptionValue): void
  (e: 'change', value: OptionValue): void
  (e: 'click'): void
}>()

const inputRef = ref<any>(null)

const attrs = useAttrs()

/**
 * Attributes that can be passed directly to QOptionGroup.
 */
const allowedQOptionGroupAttrs = new Set([
  'name',
  'loading',

  'color',
  'keepColor',

  'inline',
  'dense',

  'leftLabel',

  'dark',

  'optionsHtml',

  'size',

  'disable',

  'class'
])

const qOptionGroupAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQOptionGroupAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const model = computed<OptionValue>({
  get: () => props.modelValue ?? null,

  set: (value) => {
    emitModelUpdate(value)
  }
})

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

const emitModelUpdate = (
    value: OptionValue
) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const onClick = () => {
  emit('click')
}
</script>

<style scoped>
.form-builder-optionGroup {
}

.outside-label {
  margin-bottom: 4px;
}
</style>
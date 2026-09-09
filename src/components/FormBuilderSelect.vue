<template>
  <div
      class="form-builder-select"
      :class="customClass"
  >
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>
    <q-select
        ref="inputRef"
        v-bind="qSelectAttrs"
        :model-value="model"
        :options="filteredOptions"
        :class="customClass"
        use-input
        emit-value
        map-options
        input-debounce="500"
        @update:model-value="model = $event"
        @new-value="createValue"
        @filter="filterFn"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'

defineOptions({
  name: 'FormBuilderSelect',
  inheritAttrs: false
})

type SelectValue =
    | string
    | number
    | boolean
    | Record<string, any>
    | Array<string | number | boolean | Record<string, any>>
    | null

interface SelectOption {
  [key: string]: any
}

interface Props {
  customClass?: string
  createNewValue?: boolean
  modelValue?: SelectValue
  options?: SelectOption[]
  outsideLabel?: string
  onChangeValue?: (
      newValue: SelectValue,
      oldValue: SelectValue
  ) => void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  name: '',
  options: () => [],
  rules: () => [],
  outsideLabel: '',
  createNewValue: false,
  onChangeValue: () => {}
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue): void
  (e: 'change', value: SelectValue): void
  (e: 'click'): void
}>()

const inputRef = ref<any>(null)

const attrs = useAttrs()

const filteredOptions = ref<SelectOption[]>([
  ...props.options
])

/**
 * Attributes that can be passed directly to QSelect.
 */
const allowedQSelectAttrs = new Set([
  'optionLabel',
  'optionValue',
  'optionDisable',
  'loading',

  'dense',
  'borderless',
  'standout',
  'dark',

  'label',
  'stackLabel',
  'hint',
  'hideHint',
  'hideBottomSpace',

  'color',
  'bgColor',
  'labelColor',

  'loading',

  'counter',
  'hideSelected',

  'popupContentStyle',

  'autocomplete',

  'virtualScrollSliceSize',
  'virtualScrollSliceRatioBefore',
  'virtualScrollSliceRatioAfter'
])

const qSelectAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQSelectAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const model = computed<SelectValue>({
  get: () => props.modelValue ?? null,

  set: (value) => {
    emitModelUpdate(value)
  }
})

const emitModelUpdate = (value: SelectValue) => {
  const oldValue = props.modelValue ?? null

  props.onChangeValue(value, oldValue)

  emit('update:modelValue', value)
  emit('change', value)
}

watch(
    () => props.options,
    (newOptions) => {
      filteredOptions.value = [...newOptions]
    },
    {
      immediate: true,
      deep: true
    }
)

const filterFn = (
    val: string,
    update: (callback: () => void) => void
) => {
  const options = props.options

  const isObjectList =
      options.length > 0 &&
      typeof options[0] === 'object'

  if (!val) {
    update(() => {
      filteredOptions.value = [...options]
    })

    return
  }

  update(() => {
    const needle = val.toLowerCase()
    const optionLabel = typeof attrs.optionLabel === 'string'
        ? attrs.optionLabel
        : undefined
    filteredOptions.value = options.filter((option) => {
      const itemLabel = isObjectList
          ? optionLabel ? option[optionLabel] : ''
          : option

      return String(itemLabel)
          .toLowerCase()
          .includes(needle)
    })
  })
}

const createValue = (
    value: string,
    done: (
        value?: any,
        mode?: 'add' | 'add-unique' | 'toggle'
    ) => void
) => {
  if (!props.createNewValue) {
    done()
    return
  }

  done(value, attrs.newValueMode)
}

const onClick = () => {
  emit('click')
}
</script>

<style scoped lang="scss">
.form-builder-select {
  position: relative;

  .outside-label {
    font-size: 0.85rem;
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.6);
  }
}
</style>

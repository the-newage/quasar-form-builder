<template>
  <div
      class="form-builder-optionGroup"
  >
    <div
        v-if="outsideLabel || label"
        class="outside-label"
    >
      {{ outsideLabel || label }}
    </div>

    <q-option-group
        ref="inputRef"
        v-bind="filteredAttrs"
        :model-value="model"
        :options="options"
        :type="typeOfInput"
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
import { QOptionGroup, QIcon } from 'quasar'

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
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: null,
      options: () => [],
      typeOfInput: 'radio',
      label: '',
      outsideLabel: ''
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: OptionValue): void
  (e: 'change', value: OptionValue): void
  (e: 'click'): void
}>()

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'options', 'typeOfInput', 'outsideLabel', 'label'])
})

function filterAttrs(obj: Record<string, unknown>, exclude: string[]) {
  const forbidden = new Set(exclude)
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (!forbidden.has(key)) result[key] = val
  }
  return result
}

const inputRef = ref<any>(null)

const model = computed<OptionValue>({
  get: () => props.modelValue ?? null,

  set: (value) => {
    emitModelUpdate(value)
  }
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
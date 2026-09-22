<template>
  <div
      class="form-builder-checkbox"
  >
    <div v-if="outsideLabel" class="outside-label">{{ outsideLabel }}</div>
    <q-checkbox
        ref="inputRef"
        v-bind="filteredAttrs"
        :model-value="model"
        :true-value="trueValue"
        :false-value="falseValue"
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
import { QCheckbox } from 'quasar'

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
  outsideLabel?: string
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: false,
      trueValue: true,
      falseValue: false,
      outsideLabel: ''
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: CheckboxValue): void
  (e: 'change', value: CheckboxValue): void
  (e: 'click'): void
}>()

const inputRef = ref<any>(null)

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'trueValue', 'falseValue', 'outsideLabel'])
})

function filterAttrs(obj: Record<string, unknown>, exclude: string[]) {
  const forbidden = new Set(exclude)
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (!forbidden.has(key)) result[key] = val
  }
  return result
}

const model = computed<CheckboxValue>({
  get: () => props.modelValue ?? null,

  set: (value) => {
    emitModelUpdate(value)
  }
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

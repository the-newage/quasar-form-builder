<template>
  <div
      class="form-builder-toggle-button"
  >
    <div
        v-if="outsideLabel || label"
        class="outside-label"
    >
      {{ outsideLabel || label }}
    </div>

    <q-btn-toggle
        ref="inputRef"
        v-bind="filteredAttrs"
        :model-value="model"
        :options="options"
        @update:model-value="model = $event"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { QBtnToggle } from 'quasar'

defineOptions({
  name: 'FormBuilderToggleButton',
  inheritAttrs: false
})

type ToggleValue =
    | string
    | number
    | boolean
    | Record<string, any>
    | Array<string | number | boolean | Record<string, any>>
    | null

interface Props {
  options: any[]
  label?: string
  outsideLabel?: string
  modelValue?: ToggleValue
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  outsideLabel: '',
  modelValue: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ToggleValue): void
  (e: 'change', value: ToggleValue): void
  (e: 'click'): void
}>()

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'options', 'outsideLabel', 'label'])
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

const model = computed<ToggleValue>({
  get: () => props.modelValue ?? null,

  set: (value) => {
    emitModelUpdate(value)
  }
})

const emitModelUpdate = (value: ToggleValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const onClick = () => {
  emit('click')
}
</script>

<style scoped lang="scss">
.form-builder-toggle-button {
  width: 100%;
}

.outside-label {
  margin-bottom: 4px;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.6);
}
</style>
<template>
  <div
      class="form-builder-slider"
  >
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <div>
      {{ label }}: {{ model }} ({{ min }} تا {{ max }})
    </div>

    <q-slider
        ref="inputRef"
        v-bind="filteredAttrs"
        :model-value="model"
        :min="min"
        :max="max"
        @update:model-value="model = $event ?? 0"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { QSlider } from 'quasar'

defineOptions({
  name: 'FormBuilderSlider',
  inheritAttrs: false
})

interface Props {
  modelValue?: number
  outsideLabel?: string
  label?: string
  min?: number
  max?: number
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: 0,
      outsideLabel: '',
      label: '',
      min: 0,
      max: 100
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'outsideLabel', 'label', 'min', 'max'])
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

const model = computed<number>({
  get: () => props.modelValue ?? 0,

  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const onClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped>
</style>

<template>
  <div
      class="form-builder-range-slider"
  >
    <div v-if="outsideLabel" class="outside-label">{{ outsideLabel }}</div>
    <q-badge
        v-if="showBadge"
        color="secondary"
    >
      {{ formLabel }}:
      از {{ model.min }} تا {{ model.max }}
      ({{ min }} تا {{ max }})
    </q-badge>

    <q-range
        ref="inputRef"
        v-bind="filteredAttrs"
        :model-value="model"
        @update:model-value="model = $event"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { QRange, QBadge } from 'quasar'

defineOptions({
  name: 'FormBuilderRangeSlider',
  inheritAttrs: false
})

interface RangeValue {
  min: number
  max: number
}

interface Props {
  modelValue?: RangeValue
  showBadge?: boolean
  outsideLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    min: 9,
    max: 35
  }),
  showBadge: true,
  outsideLabel: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: RangeValue): void
  (e: 'change', value: RangeValue): void
  (e: 'click'): void
}>()

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'showBadge', 'outsideLabel', 'label', 'type'])
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

const model = computed<RangeValue>({
  get: () => props.modelValue,

  set: (value) => {
    emitModelUpdate(value)
  }
})

const min = computed(() => {
  const value = attrs.min

  return typeof value === 'number'
      ? value
      : Number(value ?? 0)
})

const max = computed(() => {
  const value = attrs.max

  return typeof value === 'number'
      ? value
      : Number(value ?? 100)
})

const formLabel = computed(() => {
  const value = attrs.label

  return typeof value === 'string'
      ? value
      : ''
})

const emitModelUpdate = (value: RangeValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const onClick = () => {
  emit('click')
}
</script>

<style scoped>
.form-builder-range-slider {
  width: 100%;
}
</style>
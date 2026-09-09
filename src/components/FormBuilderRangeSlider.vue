<template>
  <div
      class="form-builder-range-slider"
      :class="customClass"
  >
    <div v-if="outsideLabel" class="outside-label">{{ outsideLabel }}</div>
    <q-badge
        v-if="showBadge"
        color="secondary"
    >
      {{ label }}:
      از {{ model.min }} تا {{ model.max }}
      ({{ min }} تا {{ max }})
    </q-badge>

    <q-range
        ref="inputRef"
        v-bind="qRangeAttrs"
        :model-value="model"
        :class="customClass"
        :marker-labels-class="customClass"
        @update:model-value="model = $event"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

defineOptions({
  name: 'FormBuilderRangeSlider',
  inheritAttrs: false
})

interface RangeValue {
  min: number
  max: number
}

interface Props {
  customClass?: string
  modelValue?: RangeValue
  showBadge?: boolean
  outsideLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    min: 9,
    max: 35
  }),
  showBadge: true
  ,outsideLabel: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: RangeValue): void
  (e: 'change', value: RangeValue): void
  (e: 'click'): void
}>()

const inputRef = ref<any>(null)

const attrs = useAttrs()

/**
 * Attributes that can be passed directly to QRange.
 */
const allowedQRangeAttrs = new Set([
  'name',
  'loading',

  'min',
  'max',
  'step',
  'snap',

  'disable',
  'readonly',

  'vertical',
  'reverse',

  'color',
  'trackColor',
  'innerTrackColor',
  'markerLabelsClass',

  'label',
  'labelAlways',
  'labelColor',
  'labelTextColor',

  'markers',
  'markerLabels',

  'thumbSize',

  'dark'
])

const qRangeAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQRangeAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

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

const label = computed(() => {
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
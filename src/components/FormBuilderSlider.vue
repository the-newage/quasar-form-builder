<template>
  <div
      class="form-builder-slider"
      :class="customClass"
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
        v-bind="qSliderAttrs"
        :model-value="model"
        :name="name"
        :min="min"
        :max="max"
        :disable="isDisabled"
        :readonly="readonly"
        :class="customClass"
        :marker-labels-class="customClass"
        @update:model-value="model = $event ?? 0"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

defineOptions({
  name: 'FormBuilderSlider',
  inheritAttrs: false
})

interface Props {
  modelValue?: number
  customClass?: string
  outsideLabel?: string
  label?: string
  name?: string
  min?: number
  max?: number
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: 0,
      customClass: '',
      outsideLabel: '',
      label: '',
      name: '',
      min: 0,
      max: 100,
      disabled: false,
      readonly: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()

const inputRef = ref<any>(null)

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

const model = computed<number>({
  get: () => props.modelValue ?? 0,

  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const allowedQSliderAttrs = new Set([
  'step',
  'loading',

  'vertical',
  'reverse',

  'color',
  'trackColor',
  'innerTrackColor',
  'selectionColor',

  'trackSize',
  'thumbSize',

  'markerLabels',
  'markerLabelsClass',

  'markers',
  'markerLabels',

  'label',
  'labelColor',
  'labelTextColor',

  'switchLabelSide',

  'snap',

  'dark',

  'dense',

  'tabindex',

  'readonly',
  'disable'
])

const qSliderAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQSliderAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const onClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped>
</style>

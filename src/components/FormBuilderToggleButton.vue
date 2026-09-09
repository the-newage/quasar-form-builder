<template>
  <div
      class="form-builder-toggle-button"
      :class="customClass"
  >
    <div
        v-if="outsideLabel || label"
        class="outside-label"
    >
      {{ outsideLabel || label }}
    </div>

    <q-btn-toggle
        ref="inputRef"
        v-bind="qBtnToggleAttrs"
        :model-value="model"
        :class="customClass"
        :options="options"
        @update:model-value="model = $event"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

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
  customClass?: string
  label?: string
  outsideLabel?: string
  modelValue?: ToggleValue
}

const props = withDefaults(defineProps<Props>(), {
  customClass: '',
  label: '',
  outsideLabel: '',
  modelValue: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: ToggleValue): void
  (e: 'change', value: ToggleValue): void
  (e: 'click'): void
}>()

const inputRef = ref<any>(null)

const attrs = useAttrs()

/**
 * Attributes that can be passed directly to QBtnToggle.
 */
const allowedQBtnToggleAttrs = new Set([
  'name',
  'loading',

  'options',

  'color',
  'textColor',

  'toggleColor',
  'toggleTextColor',

  'push',
  'glossy',

  'clearable',

  'inline',
  'dense',

  'type',

  'disable',
  'readonly',

  'unelevated',
  'flat',
  'outlined',

  'rounded',

  'size',

  'ripple',

  'noCaps',
  'noWrap',

  'spread',
  'stack',
  'stretch',

  'dark'
])

const qBtnToggleAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQBtnToggleAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

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
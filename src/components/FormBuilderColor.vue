<template>
  <div
      class="form-builder-color"
      :class="customClass"
  >
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <q-input
        ref="inputRef"
        v-bind="qInputAttrs"
        :model-value="model"
        :disable="isDisabled"
        :class="customClass"
        :style="colorInputStyle"
        @click="onInputClick"
    >
      <template #append>
        <q-icon
            name="colorize"
            class="cursor-pointer"
        >
          <q-menu
              v-if="!isDisabled"
              v-model="showing"
          >
            <q-color
                v-bind="qColorAttrs"
                :model-value="model"
                :palette="palette"
                square
                flat
                default-value="#4b9c70ff"
                @update:model-value="model = $event"
                @click="onClick"
            />
          </q-menu>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  useAttrs
} from 'vue'

defineOptions({
  name: 'FormBuilderColor',
  inheritAttrs: false
})

type ColorValue = string | null

interface Props {
  modelValue?: ColorValue

  customClass?: string
  outsideLabel?: string

  palette?: string[]

  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: null,

      customClass: '',
      outsideLabel: '',

      palette: () => [],

      disabled: false,
      readonly: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: ColorValue): void
  (e: 'change', value: ColorValue): void
  (e: 'click'): void
}>()

const inputRef = ref<any>(null)

const showing = ref(false)

const attrs = useAttrs()

/**
 * Attributes that can be passed directly to QInput.
 */
const allowedQInputAttrs = new Set([
  'name',
  'loading',

  'filled',
  'outlined',
  'borderless',
  'standout',

  'label',
  'stackLabel',
  'placeholder',

  'error',
  'errorMessage',

  'loading',

  'clearable',

  'rules',
  'lazyRules',

  'dense',

  'color',
  'bgColor',
  'labelColor',

  'hideHint',
  'hideBottomSpace',

  'hint'
])

/**
 * Attributes that can be passed directly to QColor.
 */
const allowedQColorAttrs = new Set([
  'noHeader',
  'noFooter',
  'loading',

  'defaultView',

  'formatModel',

  'palette'
])

const qInputAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQInputAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const qColorAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQColorAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const model = computed<ColorValue>({
  get: () => props.modelValue ?? null,

  set: (value) => {
    emitModelUpdate(value)
  }
})

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

/**
 * رنگ انتخاب‌شده به عنوان پس‌زمینه QInput نمایش داده می‌شود.
 */
const colorInputStyle = computed(() => {
  if (!model.value) {
    return {}
  }

  return {
    '--form-builder-selected-color': model.value
  }
})

const emitModelUpdate = (
    value: ColorValue
) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const onInputClick = () => {
  if (isDisabled.value) {
    return
  }

  showing.value = true
}

const onClick = () => {
  emit('click')
}
</script>

<style scoped>
.form-builder-color {
}

.outside-label {
  margin-bottom: 4px;
}

.form-builder-color :deep(.q-field__control) {
  background: var(
      --form-builder-selected-color,
      transparent
  );
}
</style>

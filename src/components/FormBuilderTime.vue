<template>
  <div
      class="form-builder-time"
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
        :model-value="displayTime"
        readonly
        dir="ltr"
        :disable="isDisabled"
        :label="placeholder ? null : label"
        :stack-label="!!placeholder"
        :placeholder="placeholder"
        :class="customClass"
        :input-class="customClass"
        @click="onClickInput"
    >
      <template #append>
        <q-icon
            :name="clockIcon"
            class="cursor-pointer"
            @click="popupTime = true"
        >
          <q-popup-proxy
              v-model="popupTime"
              cover
              transition-show="scale"
              transition-hide="scale"
          >
            <q-time
                v-bind="qTimeAttrs"
                :model-value="time"
                mask="HH:mm:00"
                format24h
                :disable="isDisabled"
                :readonly="readonly"
                :title="title || label"
                :now-btn="nowBtn"
                @update:model-value="onChangeTime"
            >
              <div class="row items-center justify-end">
                <q-btn
                    v-close-popup
                    label="بستن"
                    color="primary"
                    flat
                />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>

        <q-btn
            v-if="clearable"
            icon="close"
            flat
            round
            class="cursor-pointer"
            @click="onClear"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

defineOptions({
  name: 'FormBuilderTime',
  inheritAttrs: false
})

interface Props {
  modelValue?: string
  customClass?: string
  outsideLabel?: string

  name?: string

  clockIcon?: string

  title?: string
  placeholder?: string

  label?: string

  nowBtn?: boolean

  clearable?: boolean

  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: '',
      customClass: '',
      outsideLabel: '',

      name: '',

      clockIcon: 'access_time',

      title: '',
      placeholder: '',

      label: '',

      nowBtn: false,

      clearable: false,

      disabled: false,
      readonly: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()

const inputRef = ref<any>(null)

const popupTime = ref(false)

const time = ref('')

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

const displayTime = computed(() => {
  if (!props.modelValue) {
    return ''
  }

  return props.modelValue
      .split(':')
      .slice(0, 2)
      .join(':')
})

const allowedQInputAttrs = new Set([
  'name',

  'loading',
  'filled',

  'error',
  'errorMessage',

  'rules',
  'lazyRules',

  'outlined',
  'borderless',
  'standout',
  'rounded',

  'dense',

  'hint',
  'hideHint',
  'hideBottomSpace',

  'color',
  'bgColor',
  'labelColor',

  'clearIcon',

  'autocomplete',

  'inputStyle'
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

const allowedQTimeAttrs = new Set([
  'color',
  'textColor',
  'loading',

  'dark',

  'landscape',

  'withSeconds',

  'hourOptions',
  'minuteOptions',
  'secondOptions',

  'hourOptions',
  'minuteOptions',
  'secondOptions',

  'format24h',

  'nowBtn',

  'options',

  'square',
  'flat'
])

const qTimeAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQTimeAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const onClickInput = (event: MouseEvent) => {
  popupTime.value = true
  emit('click', event)
}

const onChangeTime = (newValue: string) => {
  time.value = newValue

  const timeWithoutSecond = newValue
      ? newValue.split(':').slice(0, 2).join(':')
      : ''

  const value = newValue || null

  emit('update:modelValue', value)
  emit('change', value)

  // Keep the displayed value independent from the QTime mask.
  if (!newValue) {
    time.value = ''
  } else {
    time.value = newValue
  }
}

const onClear = () => {
  popupTime.value = false
  time.value = ''

  emit('update:modelValue', null)
  emit('change', null)
}
</script>

<style scoped>
</style>

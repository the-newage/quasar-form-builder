<template>
  <div
      class="form-builder-date"
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
        :model-value="displayDate"
        :disable="disabled"
        :class="customClass"
        readonly
        dir="ltr"
        @clear="onClear"
        @click="onClickInput"
    >
      <template #prepend>
        <q-icon
            :name="calendarIcon"
            class="cursor-pointer"
        >
          <q-popup-proxy
              v-model="popupDate"
              cover
              transition-show="scale"
              transition-hide="scale"
          >
            <q-date
                v-bind="qDateAttrs"
                :model-value="calendarDate"
                :calendar="calendar"
                mask="YYYY/MM/DD"
                :range="range"
                :multiple="multiple"
                :disable="disabled"
                :title="title || label"
                :today-btn="todayBtn"
                @update:model-value="onChangeDate"
            >
              <div class="row items-center justify-end">
                <q-btn
                    v-close-popup
                    label="بستن"
                    color="primary"
                    flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template #append>
        <q-btn
            v-if="clearable"
            icon="close"
            flat
            round
            class="cursor-pointer"
            @click.stop="onClear"
        />
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

import jMoment from 'jalali-moment'

defineOptions({
  name: 'FormBuilderDate',
  inheritAttrs: false
})

interface Props {
  modelValue?: string | null

  customClass?: string
  outsideLabel?: string | null

  calendar?: 'persian' | 'gregorian'
  calendarIcon?: string

  title?: string
  label?: string
  placeholder?: string

  todayBtn?: boolean

  disabled?: boolean
  readonly?: boolean

  range?: boolean
  multiple?: boolean

  clearable?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: null,

      customClass: '',
      outsideLabel: null,

      calendar: 'persian',
      calendarIcon: 'event',

      title: '',
      label: '',
      placeholder: '',

      todayBtn: false,

      disabled: false,
      readonly: false,

      range: false,
      multiple: false,

      clearable: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
  (e: 'click'): void
}>()

const inputRef = ref<any>(null)

const attrs = useAttrs()

const popupDate = ref(false)

/**
 * Attributes that should be forwarded to QInput.
 */
const allowedQInputAttrs = new Set([
  'name',
  'loading',

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

  'rules',
  'lazyRules',

  'dense',

  'color',
  'bgColor',
  'labelColor',

  'clearable',

  'hideHint',
  'hideBottomSpace',

  'hint',

  'disable'
])

/**
 * Attributes that should be forwarded to QDate.
 */
const allowedQDateAttrs = new Set([
  'minimal',
  'loading',

  'color',
  'textColor',

  'events',
  'eventColor',

  'navigationMinYearMonth',
  'navigationMaxYearMonth',

  'defaultYearMonth',

  'firstDayOfWeek',

  'emitImmediately'
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

const qDateAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQDateAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

/**
 * Gregorian value -> displayed calendar value.
 */
const displayDate = computed(() => {
  if (!props.modelValue) {
    return ''
  }

  if (props.calendar === 'persian') {
    return miladiToShamsiDate(props.modelValue)
  }

  return props.modelValue
})

/**
 * Value used internally by QDate.
 */
const calendarDate = computed(() => {
  if (!props.modelValue) {
    return null
  }

  if (props.calendar === 'persian') {
    return miladiToShamsiDate(props.modelValue)
  }

  return props.modelValue
})

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

const onClickInput = () => {
  if (isDisabled.value) {
    return
  }

  popupDate.value = true

  emit('click')
}

const onClear = () => {
  emitModelUpdate(null)
}

const onChangeDate = (
    value: string | null
) => {
  if (!value) {
    emitModelUpdate(null)
    return
  }

  let gregorianDate = value

  if (props.calendar === 'persian') {
    gregorianDate = shamsiToMiladiDate(value)
  }

  emitModelUpdate(gregorianDate)
}

const emitModelUpdate = (
    value: string | null
) => {
  emit('update:modelValue', value)
  emit('change', value)
}

/**
 * Jalali -> Gregorian
 */
const shamsiToMiladiDate = (
    date: string
): string => {
  return jMoment(
      date,
      'jYYYY/jMM/jDD'
  ).format('YYYY-MM-DD')
}

/**
 * Gregorian -> Jalali
 */
const miladiToShamsiDate = (
    date: string
): string => {
  return jMoment
      .utc(date, 'YYYY-MM-DD')
      .format('jYYYY/jMM/jDD')
}
</script>

<style scoped lang="scss">
.form-builder-date {
  .outside-label {
    margin-bottom: 4px;
  }
}
</style>

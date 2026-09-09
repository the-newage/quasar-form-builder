<template>
  <div
      class="form-builder-date-time"
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
        :model-value="displayDateTime"
        :disable="isDisabled"
        readonly
        dir="ltr"
        :class="customClass"
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
                :model-value="dateTime.date"
                :calendar="calendar"
                mask="YYYY/MM/DD"
                :range="range"
                :multiple="multiple"
                :disable="isDisabled"
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
        <q-icon
            :name="clockIcon"
            class="cursor-pointer"
        >
          <q-popup-proxy
              v-model="popupTime"
              cover
              transition-show="scale"
              transition-hide="scale"
          >
            <q-time
                v-bind="qTimeAttrs"
                :model-value="dateTime.time"
                mask="HH:mm:00"
                format24h
                :disable="isDisabled"
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
            @click.stop="onClear"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
  useAttrs,
  watch
} from 'vue'

import jMoment from 'jalali-moment'

defineOptions({
  name: 'FormBuilderDateTime',
  inheritAttrs: false
})

interface Props {
  modelValue?: string | null

  customClass?: string
  outsideLabel?: string | null

  calendar?: 'persian' | 'gregorian'
  calendarIcon?: string
  clockIcon?: string

  title?: string
  label?: string
  placeholder?: string

  nowBtn?: boolean
  todayBtn?: boolean

  iso8601?: boolean

  range?: boolean
  multiple?: boolean

  disabled?: boolean
  readonly?: boolean

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
      clockIcon: 'access_time',

      title: '',
      label: '',
      placeholder: '',

      nowBtn: false,
      todayBtn: false,

      iso8601: true,

      range: false,
      multiple: false,

      disabled: false,
      readonly: false,

      clearable: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
  (e: 'click'): void
}>()

const attrs = useAttrs()

const inputRef = ref<any>(null)

const popupDate = ref(false)
const popupTime = ref(false)

const dateTime = reactive({
  date: '',
  time: ''
})

/**
 * Attributes that can be passed directly to QInput.
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

  'hideHint',
  'hideBottomSpace',

  'hint'
])

/**
 * Attributes that can be passed directly to QDate.
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

  'emitImmediately',

  'todayBtn'
])

/**
 * Attributes that can be passed directly to QTime.
 */
const allowedQTimeAttrs = new Set([
  'color',
  'textColor',
  'loading',

  'dark',

  'format24h',

  'withSeconds',

  'nowBtn',

  'hourOptions',
  'minuteOptions',
  'secondOptions',

  'landscape',

  'mask'
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

const qTimeAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQTimeAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

/**
 * Date/time displayed inside QInput.
 *
 * External model value:
 *   Gregorian
 *
 * Display:
 *   Persian when calendar === 'persian'
 */
const displayDateTime = computed(() => {
  if (!props.modelValue) {
    return ''
  }

  const value = props.modelValue.toString()

  const jmomentValue = jMoment.utc(value)

  const date = jmomentValue.format('YYYY-MM-DD')
  const time = jmomentValue.format('HH:mm:00')

  const displayDate =
      props.calendar === 'persian'
          ? miladiToShamsiDate(date)
          : date

  return `${displayDate} ${time}`
})

/**
 * Initialize internal date/time values from modelValue.
 */
const syncFromModelValue = (
    value: string | null | undefined
) => {
  if (!value) {
    dateTime.date = ''
    dateTime.time = ''
    return
  }

  const jmomentValue = jMoment.utc(value.toString())

  const gregorianDate = jmomentValue.format('YYYY-MM-DD')
  const time = jmomentValue.format('HH:mm:00')

  dateTime.date =
      props.calendar === 'persian'
          ? miladiToShamsiDate(gregorianDate)
          : gregorianDate

  dateTime.time = time
}

watch(
    () => props.modelValue,
    (value) => {
      syncFromModelValue(value)
    },
    {
      immediate: true
    }
)

const onClickInput = (
    event: MouseEvent
) => {
  if (isDisabled.value) {
    return
  }

  const input = event.target as HTMLElement

  const inputRect = input.getBoundingClientRect()

  const clickX =
      event.clientX - inputRect.left

  const halfwayPoint =
      inputRect.width / 2

  if (clickX < halfwayPoint) {
    popupDate.value = true
  } else {
    popupTime.value = true
  }

  emit('click')
}

const onClear = () => {
  dateTime.date = ''
  dateTime.time = ''

  emitModelUpdate(null)
}

const onChangeDate = (
    newValue: string | null
) => {
  if (!newValue) {
    return
  }

  let gregorianDate = newValue

  if (props.calendar === 'persian') {
    gregorianDate = shamsiToMiladiDate(
        newValue.toString()
    )
  }

  updateDateTime(
      gregorianDate,
      'date'
  )
}

const onChangeTime = (
    newValue: string | null
) => {
  if (!newValue) {
    return
  }

  updateDateTime(
      newValue.toString(),
      'time'
  )
}

const updateDateTime = (
    newValue: string,
    updateType: 'date' | 'time'
) => {
  const now = jMoment(Date.now())

  const defaultDate =
      now.format('YYYY-MM-DD')

  const defaultTime =
      now.format('HH:mm:00')

  let currentDate = defaultDate
  let currentTime = defaultTime

  if (props.modelValue) {
    const currentMoment =
        jMoment.utc(props.modelValue)

    currentDate =
        currentMoment.format('YYYY-MM-DD')

    currentTime =
        currentMoment.format('HH:mm:00')
  }

  if (updateType === 'date') {
    currentDate = newValue
  }

  if (updateType === 'time') {
    currentTime = newValue
  }

  dateTime.date =
      props.calendar === 'persian'
          ? miladiToShamsiDate(currentDate)
          : currentDate

  dateTime.time =
      currentTime.substring(0, 8)

  const delimiter =
      props.iso8601
          ? 'T'
          : ' '

  const result =
      `${currentDate}${delimiter}${currentTime}`

  emitModelUpdate(result)
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
.form-builder-date-time {
  .outside-label {
    margin-bottom: 4px;
  }
}
</style>

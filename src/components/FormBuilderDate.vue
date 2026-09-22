<template>
  <div
      class="form-builder-date"
  >
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <q-input
        ref="inputRef"
        v-bind="filteredInputAttrs"
        :model-value="displayDate"
        :rules="parsedRules"
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
                v-bind="filteredDateAttrs"
                :model-value="calendarDate"
                :calendar="calendar"
                mask="YYYY/MM/DD"
                :range="range"
                :multiple="multiple"
                :title="pickerTitle"
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
            v-if="isClearable"
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
import { QInput, QIcon, QPopupProxy, QDate, QBtn, ClosePopup } from 'quasar'

import jMoment from 'jalali-moment'
import { useInputRules } from '@/composables/useInputRules'

defineOptions({
  name: 'FormBuilderDate',
  inheritAttrs: false
})

interface Props {
  modelValue?: string | null
  outsideLabel?: string | null
  rules?: any
  calendar?: 'persian' | 'gregorian'
  calendarIcon?: string
  todayBtn?: boolean
  range?: boolean
  multiple?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: null,
      outsideLabel: null,
      rules: () => [],
      calendar: 'persian',
      calendarIcon: 'event',
      todayBtn: false,
      range: false,
      multiple: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
  (e: 'click'): void
}>()

const vClosePopup = ClosePopup

const inputRef = ref<any>(null)

const attrs = useAttrs()

const computedLabel = computed(() => (attrs.label as string) || props.outsideLabel || '')

const { parsedRules } = useInputRules({
  rules: computed(() => props.rules), // اگر کامپوزبلت ری‌اکتیو نیست، بهتره اینطوری پاس بدی
  label: computedLabel
})

const filteredInputAttrs = computed(() => {
  return filterAttrs(attrs, ['type', 'class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'calendar', 'calendarIcon', 'outsideLabel', 'range', 'multiple', 'rules'])
})

const filteredDateAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'calendar', 'calendarIcon', 'outsideLabel', 'range', 'multiple'])
})

const pickerTitle = computed(() => {
  return (attrs.title as string) || computedLabel.value || props.outsideLabel || ''
})

function filterAttrs(obj: Record<string, unknown>, exclude: string[]) {
  const forbidden = new Set(exclude)
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (!forbidden.has(key)) result[key] = val
  }
  return result
}

const isClearable = computed(() => attrs.clearable === true || attrs.clearable === '')

const popupDate = ref(false)

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

const onClickInput = () => {
  if (attrs.disable) {
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

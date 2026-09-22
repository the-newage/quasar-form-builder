<template>
  <div class="form-builder-date-time">
    <div v-if="outsideLabel" class="outside-label">
      {{ outsideLabel }}
    </div>

    <q-input
        ref="inputRef"
        v-bind="qInputAttrs"
        :model-value="displayDateTime"
        readonly
        dir="ltr"
        @click="onClickInput"
    >
      <template #prepend>
        <q-icon :name="calendarIcon" class="cursor-pointer">
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
                :title="pickerTitle"
                @update:model-value="onChangeDate"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template #append>
        <q-icon :name="clockIcon" class="cursor-pointer">
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
                :title="pickerTitle"
                @update:model-value="onChangeTime"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>

        <q-btn
            v-if="isClearable && !!modelValue"
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
import { computed, reactive, ref, useAttrs, watch } from 'vue'
import { ClosePopup } from 'quasar'
import jMoment from 'jalali-moment'
import {pad2, toZuluISOStringFromLocalParts} from "@/utils/dateTime";

defineOptions({
  name: 'FormBuilderDateTime',
  inheritAttrs: false
})

interface Props {
  modelValue?: string | null
  outsideLabel?: string | null
  calendar?: 'persian' | 'gregorian'
  calendarIcon?: string
  clockIcon?: string
  iso8601?: boolean
  zulu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  outsideLabel: null,
  calendar: 'persian',
  calendarIcon: 'event',
  clockIcon: 'access_time',
  iso8601: true,
  zulu: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()
const vClosePopup = ClosePopup
const inputRef = ref<any>(null)

const popupDate = ref(false)
const popupTime = ref(false)

const dateTime = reactive({
  date: '', // همواره فرمت YYYY/MM/DD متناسب با تقویم انتخابی جهت خوانایی QDate
  time: ''
})

const isClearable = computed(() => {
  return attrs.clearable === true || attrs.clearable === ''
})

const pickerTitle = computed(() => {
  return (attrs.title as string) || (attrs.label as string) || props.outsideLabel || ''
})

function filterAttrs(obj: Record<string, unknown>, exclude: string[]) {
  const forbidden = new Set(exclude)
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (!forbidden.has(key)) result[key] = val
  }
  return result
}

const qInputAttrs = computed(() => {
  return filterAttrs(attrs, [
    'type',
    'class',
    'style',
    'id',
    'modelValue',
    'onUpdate:modelValue',
    'calendar',
    'calendarIcon',
    'clockIcon',
    'iso8601',
    'outsideLabel'
  ])
})

const qDateAttrs = computed(() => {
  return filterAttrs(attrs, [
    'type',
    'class',
    'style',
    'id',
    'modelValue',
    'onUpdate:modelValue',
    'calendar',
    'calendarIcon',
    'clockIcon',
    'iso8601',
    'outsideLabel',
    'label'
  ])
})

const qTimeAttrs = computed(() => {
  return filterAttrs(attrs, [
    'type',
    'class',
    'style',
    'id',
    'modelValue',
    'onUpdate:modelValue',
    'calendar',
    'calendarIcon',
    'clockIcon',
    'iso8601',
    'outsideLabel',
    'label'
  ])
})

// نمایش داخل فیلد ورودی QInput
const displayDateTime = computed(() => {
  if (!dateTime.date && !dateTime.time) return ''
  return `${dateTime.date} ${dateTime.time}`.trim()
})

// تجزیه ایمن مدل ورودی به تاریخ میلادی و زمان
const parseModelValue = (value: string | null | undefined) => {
  if (!value) return null
  const str = String(value).trim()

  // اگر Zulu بود، مستقیم با Date پارس می‌کنیم تا timezone درست اعمال شود
  if (str.endsWith('Z')) {
    const dt = new Date(str)
    if (isNaN(dt.getTime())) return null

    // تبدیل به تاریخ/زمان محلی برای نمایش (چون UI محلی است)
    const yyyy = dt.getFullYear()
    const mm = pad2(dt.getMonth() + 1)
    const dd = pad2(dt.getDate())
    const HH = pad2(dt.getHours())
    const MM = pad2(dt.getMinutes())
    const SS = pad2(dt.getSeconds())

    return {
      gregorianDate: `${yyyy}-${mm}-${dd}`,
      time: `${HH}:${MM}:${SS}`
    }
  }

  // حالت‌های قبلی (بدون Z)
  const delimiter = str.includes('T') ? 'T' : ' '
  const parts = str.split(delimiter)

  let datePart = parts[0] ? parts[0].replace(/\//g, '-') : ''
  let timePart = parts[1] ? parts[1].substring(0, 8) : '00:00:00'

  return {
    gregorianDate: datePart,
    time: timePart.length === 5 ? `${timePart}:00` : timePart
  }
}

const syncFromModelValue = (value: string | null | undefined) => {
  const parsed = parseModelValue(value)
  if (!parsed) {
    dateTime.date = ''
    dateTime.time = ''
    return
  }

  dateTime.date = props.calendar === 'persian'
      ? miladiToShamsiDate(parsed.gregorianDate)
      : parsed.gregorianDate.replace(/-/g, '/')

  dateTime.time = parsed.time
}

watch(
    () => props.modelValue,
    (val) => syncFromModelValue(val),
    { immediate: true }
)

// اگر داینامیک calendar عوض شد، فرمت date بروزرسانی شود
watch(
    () => props.calendar,
    () => syncFromModelValue(props.modelValue)
)

const onClickInput = (event: MouseEvent) => {
  if (attrs.disable) return

  const el = event.currentTarget as HTMLElement | null
  if (!el) {
    popupDate.value = true
    emit('click', event)
    return
  }

  const rect = el.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const halfway = rect.width / 2

  if (clickX < halfway) {
    popupDate.value = true
  } else {
    popupTime.value = true
  }

  emit('click', event)
}

const onClear = () => {
  dateTime.date = ''
  dateTime.time = ''
  emitModelUpdate(null)
}

const onChangeDate = (newValue: string | null) => {
  if (!newValue) return

  const rawVal = String(newValue)
  let gregorianDate = ''

  if (props.calendar === 'persian') {
    gregorianDate = shamsiToMiladiDate(rawVal)
    dateTime.date = rawVal // حفظ فرمت jYYYY/jMM/jDD برای نمایشگر QDate
  } else {
    // در حالت گرگوریان خروجی QDate به فرم YYYY/MM/DD است، برای ایزو به دَش تبدیل می‌کنیم
    gregorianDate = rawVal.replace(/\//g, '-')
    dateTime.date = rawVal
  }

  updateDateTime(gregorianDate, 'date')
}

const onChangeTime = (newValue: string | null) => {
  if (!newValue) return
  const formattedTime = String(newValue).substring(0, 8)
  dateTime.time = formattedTime
  updateDateTime(formattedTime, 'time')
}

const updateDateTime = (newValue: string, updateType: 'date' | 'time') => {
  let currentDate = ''
  let currentTime = ''

  const parsed = parseModelValue(props.modelValue)
  if (parsed) {
    currentDate = parsed.gregorianDate
    currentTime = parsed.time
  } else {
    const now = new Date()
    currentDate = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
    currentTime = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:00`
  }

  if (updateType === 'date') currentDate = newValue
  if (updateType === 'time') currentTime = newValue

  // NEW behavior:
  if (props.zulu) {
    const result = toZuluISOStringFromLocalParts(currentDate, currentTime)
    emitModelUpdate(result)
    return
  }

  const delimiter = props.iso8601 ? 'T' : ' '
  const result = `${currentDate}${delimiter}${currentTime}`
  emitModelUpdate(result)
}

const emitModelUpdate = (value: string | null) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const shamsiToMiladiDate = (date: string): string => {
  return jMoment(date, 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
}

const miladiToShamsiDate = (date: string): string => {
  return jMoment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD')
}
</script>

<style scoped lang="scss">
.form-builder-date-time {
  .outside-label {
    margin-bottom: 4px;
  }
}
</style>

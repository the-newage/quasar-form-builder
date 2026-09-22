<template>
  <div class="form-builder-time">
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <q-input
        ref="inputRef"
        v-bind="filteredInputAttrs"
        :model-value="displayTime"
        readonly
        dir="ltr"
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
                v-bind="filteredTimeAttrs"
                :model-value="internalTime"
                mask="HH:mm:00"
                format24h
                :title="pickerTitle"
                :now-btn="nowBtn"
                @update:model-value="onChangeTime"
            >
              <div class="row items-center justify-end">
                <q-btn
                    v-close-popup
                    label="Close"
                    color="primary"
                    flat
                />
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
import { computed, ref, useAttrs, watch } from 'vue'
import { QInput, QTime, QIcon, QPopupProxy, QBtn, ClosePopup } from 'quasar'
import { pad2, toZuluISOStringFromLocalParts } from '@/utils/dateTime'

defineOptions({
  name: 'FormBuilderTime',
  inheritAttrs: false
})

interface Props {
  modelValue?: string | null
  outsideLabel?: string
  clockIcon?: string
  nowBtn?: boolean
  zulu?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: null,
      outsideLabel: '',
      clockIcon: 'access_time',
      nowBtn: false,
      zulu: true
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()
const vClosePopup = ClosePopup
const inputRef = ref<any>(null)
const popupTime = ref(false)
const internalTime = ref('') // همیشه نگه‌دارنده HH:mm:00 به وقت محلی برای نمایش در QTime

const isClearable = computed(() => attrs.clearable === true || attrs.clearable === '')

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

const filteredInputAttrs = computed(() => {
  return filterAttrs(attrs, [
    'type',
    'class',
    'style',
    'id',
    'modelValue',
    'onUpdate:modelValue',
    'clockIcon',
    'outsideLabel',
    'zulu',
    'nowBtn'
  ])
})

const filteredTimeAttrs = computed(() => {
  return filterAttrs(attrs, [
    'type',
    'class',
    'style',
    'id',
    'modelValue',
    'onUpdate:modelValue',
    'clockIcon',
    'outsideLabel',
    'label',
    'zulu'
  ])
})

// استخراج ساعت محلی از ورودی (چه Zulu/ISO باشد، چه ساعت ساده HH:mm:ss)
const parseTimeToLocal = (value: string | null | undefined): string => {
  if (!value) return ''
  const str = String(value).trim()

  // اگر فرمت ایزو با Z یا T باشد
  if (str.endsWith('Z') || str.includes('T')) {
    const dt = new Date(str)
    if (!isNaN(dt.getTime())) {
      return `${pad2(dt.getHours())}:${pad2(dt.getMinutes())}:${pad2(dt.getSeconds())}`
    }
  }

  // اگر صرفا ساعت محلی فرستاده شده باشد
  const parts = str.split(':')
  if (parts.length >= 2) {
    const hh = parts[0].padStart(2, '0')
    const mm = parts[1].padStart(2, '0')
    const ss = parts[2] ? parts[2].substring(0, 2).padStart(2, '0') : '00'
    return `${hh}:${mm}:${ss}`
  }

  return ''
}

const displayTime = computed(() => {
  if (!internalTime.value) return ''
  return internalTime.value.split(':').slice(0, 2).join(':')
})

const syncFromModel = (val: string | null | undefined) => {
  internalTime.value = parseTimeToLocal(val)
}

watch(
    () => props.modelValue,
    (val) => syncFromModel(val),
    { immediate: true }
)

const onClickInput = (event: MouseEvent) => {
  if (attrs.disable) return
  popupTime.value = true
  emit('click', event)
}

const onChangeTime = (newValue: string | null) => {
  if (!newValue) {
    onClear()
    return
  }

  const rawTime = String(newValue).substring(0, 8)
  const fullTime = rawTime.length === 5 ? `${rawTime}:00` : rawTime
  internalTime.value = fullTime

  if (props.zulu) {
    const now = new Date()
    const todayGregorian = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
    const zuluString = toZuluISOStringFromLocalParts(todayGregorian, fullTime)
    emit('update:modelValue', zuluString)
    emit('change', zuluString)
    return
  }

  emit('update:modelValue', fullTime)
  emit('change', fullTime)
}

const onClear = () => {
  popupTime.value = false
  internalTime.value = ''
  emit('update:modelValue', null)
  emit('change', null)
}
</script>

<style scoped lang="scss">
.form-builder-time {
  .outside-label {
    margin-bottom: 4px;
  }
}
</style>

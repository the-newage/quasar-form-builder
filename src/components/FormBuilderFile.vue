<template>
  <div class="form-builder-file" :class="customClass">
    <div v-if="outsideLabel" class="outside-label">{{ outsideLabel }}</div>
    <q-file
        ref="inputRef"
        :id="inputUid"
        v-bind="qFileAttrs"
        :model-value="qFileModel"
        @update:model-value="qFileModel = $event"
        :class="[customClass, 'custom-file-input']"
        @clear="onClear"
        @click="onClick"
    />

    <div v-if="previewItems.length" class="preview-list">
      <label
          v-for="item in previewItems"
          :key="item.key"
          :for="inputUid"
          class="cursor-pointer preview-label"
          @click="downloadFile(item.value)"
      >
        <q-img
            v-if="item.kind === 'photo'"
            :src="item.src"
            placeholder-src="data:application/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
            class="preview-img"
        />

        <q-icon v-else-if="item.kind === 'audio'" size="2rem" name="audiotrack" />
        <q-icon v-else-if="item.kind === 'pdf'" size="100px" name="picture_as_pdf" />
        <q-icon v-else-if="item.kind === 'office/word'" size="100px" name="description" />
        <q-icon v-else-if="item.kind === 'office/excel'" size="100px" name="table_view" />

        <div v-else class="file-name">
          {{ item.name }}
        </div>
      </label>
    </div>

    <div v-if="caption" class="caption text-grey-8">{{ caption }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { uid } from 'quasar'

defineOptions({
  inheritAttrs: false
})

type FileItem = File | string
type FileModelValue = FileItem | FileItem[] | null
type FileValue = File | string | null
type PreviewKind = 'photo' | 'audio' | 'pdf' | 'office/word' | 'office/excel' | false

interface Props {
  caption?: string
  customClass?: string
  modelValue?: FileModelValue
  outsideLabel?: string
}

interface PreviewItem {
  key: string
  value: File | string
  kind: PreviewKind
  src?: string
  name: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FileValue | File[] | null): void
  (e: 'click'): void
}>()

const inputUid = ref(uid())
const inputRef = ref<any>(null)

const allowedQFileAttrs = new Set([
  'accept',
  'multiple',
  'loading',
  'clearable',
  'filled',
  'outlined',
  'borderless',
  'standout',
  'dense',
  'disable',
  'readonly',
  'rules',
  'hint',
  'hideHint',
  'hideBottomSpace',
  'counter',
  'maxFiles',
  'maxFileSize',
  'useChips',
  'label',
  'placeholder',
  'stackLabel',
  'color',
  'bgColor',
  'labelColor',
  'error',
  'errorMessage',
  'name'
])

const attrs = useAttrs()

const qFileAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQFileAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const isFile = (val: unknown): val is File =>
    typeof File !== 'undefined' && val instanceof File

const isUrl = (val: unknown): val is string =>
    typeof val === 'string' && /^https?:\/\//i.test(val)

const normalizeToArray = (
    val: FileModelValue | undefined
): Array<File | string> => {
  if (!val) return []

  if (Array.isArray(val)) {
    return val.filter(
        (item): item is File | string => isFile(item) || isUrl(item)
    )
  }

  return isFile(val) || isUrl(val) ? [val] : []
}

const getFileExtension = (val: File | string | null): PreviewKind => {
  if (!val) return false

  const path = isFile(val) ? val.name : val
  if (typeof path !== 'string') return false

  if (/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(path)) return 'photo'
  if (/\.(mp3|ogg|wav|m4a)$/i.test(path)) return 'audio'
  if (/\.pdf$/i.test(path)) return 'pdf'
  if (/\.(doc|docx)$/i.test(path)) return 'office/word'
  if (/\.(xls|xlsx)$/i.test(path)) return 'office/excel'

  return false
}

const getItemName = (val: File | string) => {
  if (isFile(val)) return val.name
  try {
    return decodeURIComponent(val.split('/').pop() || val)
  } catch {
    return val.split('/').pop() || val
  }
}

const previewItems = computed<PreviewItem[]>(() => {
  return normalizeToArray(props.modelValue).map((item, index) => {
    const kind = getFileExtension(item)

    return {
      key: isFile(item) ? `${item.name}-${item.size}-${index}` : `${item}-${index}`,
      value: item,
      kind,
      src: kind === 'photo'
          ? (isFile(item) ? URL.createObjectURL(item) : item)
          : undefined,
      name: getItemName(item)
    }
  })
})

const qFileModel = computed<File | File[] | null>({
  get: () => {
    if (isFile(props.modelValue)) return props.modelValue
    if (Array.isArray(props.modelValue) && props.modelValue.every(isFile)) return props.modelValue
    return null
  },
  set: (val) => {
    emitModelUpdate(val)
  }
})

const emitModelUpdate = (val: FileValue | File[] | null) => {
  emit('update:modelValue', val)
}

const onFileChange = (val: File | File[] | null) => {
  emitModelUpdate(val)
}

const onClear = () => {
  emitModelUpdate(null)
}

const downloadFile = (item: File | string) => {
  const url = isFile(item) ? URL.createObjectURL(item) : item
  window.open(url, '_blank')
}

const onClick = () => emit('click')
</script>

<style scoped lang="scss">
.form-builder-file {
  position: relative;
  .outside-label {
    font-size: 0.85rem;
    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.6);
  }
  .preview-label {
    display: block;
    margin-top: 8px;
    text-align: center;
    .preview-img {
      max-width: 100%;
      max-height: 200px;
      border-radius: 4px;
    }
    // استایل برای آیکون‌ها
    i[name="picture_as_pdf"],
    i[name="description"],
    i[name="table_view"] {
      color: #333;
      margin-top: 10px;
    }
    i[name="audiotrack"] {
      color: #888;
      margin-top: 10px;
    }
  }
  // کامنت شده: اگر بخوایم فایل اینپوت اصلی رو مخفی کنیم و فقط لیبل رو نشون بدیم
  // :deep(.q-file__input-control) {
  //   display: none;
  // }
  // :deep(.q-file__chip) {
  //   display: none;
  // }
  // :deep(.q-file__placeholder) {
  //    display: none;
  // }
}
</style>

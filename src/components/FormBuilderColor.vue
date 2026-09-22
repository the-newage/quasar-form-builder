<template>
  <div class="form-builder-color">
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <q-input
        ref="inputRef"
        v-bind="filteredInputAttrs"
        :model-value="model"
        :rules="parsedRules"
        :style="colorInputStyle"
        @click="onInputClick"
    >
      <template #append>
        <q-icon
            name="colorize"
            class="cursor-pointer"
        >
          <q-menu
              v-if="!attrs.disable"
              v-model="showing"
          >
            <q-color
                v-bind="filteredColorAttrs"
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
import { QInput, QIcon, QMenu, QColor } from 'quasar'
import { useInputRules } from '@/composables/useInputRules'

defineOptions({
  name: 'FormBuilderColor',
  inheritAttrs: false
})

type ColorValue = string | null

interface Props {
  modelValue?: ColorValue
  outsideLabel?: string
  rules?: any
  palette?: string[]
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: null,
      outsideLabel: '',
      rules: () => [],
      palette: () => []
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

const computedLabel = computed(() => (attrs.label as string) || props.outsideLabel || '')

const { parsedRules } = useInputRules({
  rules: computed(() => props.rules), // اگر کامپوزبلت ری‌اکتیو نیست، بهتره اینطوری پاس بدی
  label: computedLabel
})

const filteredInputAttrs = computed(() => {
  return filterAttrs(attrs, ['type', 'class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'palette', 'outsideLabel', 'rules'])
})

const filteredColorAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'outsideLabel'])
})

function filterAttrs(obj: Record<string, unknown>, exclude: string[]) {
  const forbidden = new Set(exclude)
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (!forbidden.has(key)) result[key] = val
  }
  return result
}

const model = computed<ColorValue>({
  get: () => props.modelValue ?? null,

  set: (value) => {
    emitModelUpdate(value)
  }
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
  if (attrs.disable) {
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

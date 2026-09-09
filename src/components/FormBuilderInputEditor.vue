<template>
  <div
      class="form-builder-editor"
      :class="customClass"
  >
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <p
        v-else
        v-text="label"
    />

    <q-editor
        v-if="!isDisabled"
        ref="inputRef"
        v-bind="qEditorAttrs"
        :model-value="model"
        :class="customClass"
        :content-class="customClass"
        :dense="$q.screen.lt.md"
        :toolbar="toolbar"
        :fonts="fonts"
        @update:model-value="model = $event"
        @click="onClick"
    />

    <!-- eslint-disable-next-line vue/no-v-html -->
    <div
        v-else
        v-html="model"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'FormBuilderInputEditor',
  inheritAttrs: false
})

type EditorValue = string

interface Props {
  modelValue?: EditorValue
  customClass?: string
  outsideLabel?: string
  label?: string
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      modelValue: '',
      customClass: '',
      outsideLabel: '',
      label: '',
      disabled: false,
      readonly: false
    }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: EditorValue): void
  (e: 'change', value: EditorValue): void
  (e: 'click', event: MouseEvent): void
}>()

const attrs = useAttrs()
const $q = useQuasar()

const inputRef = ref<any>(null)

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

const model = computed<EditorValue>({
  get: () => props.modelValue ?? '',

  set: (value) => {
    const normalizedValue = value ?? ''

    emit('update:modelValue', normalizedValue)
    emit('change', normalizedValue)
  }
})

const toolbar = computed(() => [
  [
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      options: ['left', 'center', 'right', 'justify']
    }
  ],

  [
    'bold',
    'italic',
    'strike',
    'underline',
    'subscript',
    'superscript'
  ],

  ['token', 'hr', 'link', 'custom_btn'],

  ['print', 'fullscreen'],

  [
    {
      label: $q.lang.editor.formatting,
      icon: $q.iconSet.editor.formatting,
      list: 'no-icons',
      options: [
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'code'
      ]
    },

    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: [
        'size-1',
        'size-2',
        'size-3',
        'size-4',
        'size-5',
        'size-6',
        'size-7'
      ]
    },

    {
      label: $q.lang.editor.defaultFont,
      icon: $q.iconSet.editor.font,
      fixedIcon: true,
      list: 'no-icons',
      options: [
        'default_font',
        'arial',
        'arial_black',
        'comic_sans',
        'courier_new',
        'impact',
        'lucida_grande',
        'times_new_roman',
        'verdana'
      ]
    },

    'removeFormat'
  ],

  [
    'quote',
    'unordered',
    'ordered',
    'outdent',
    'indent'
  ],

  ['undo', 'redo'],

  ['viewsource']
])

const fonts = {
  IRANSans: 'IRANSans',
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana'
}

const allowedQEditorAttrs = new Set([
  'name',
  'loading',

  'minHeight',
  'maxHeight',
  'height',

  'definitions',

  'definitions',

  'placeholder',

  'readonly',
  'disable',

  'square',
  'flat',

  'contentStyle',

  'paragraphTag',

  'dark',

  'dense',

  'toolbarToggleColor',

  'toolbarTextColor',
  'toolbarColor',

  'toolbarBg',

  'toolbar',
  'fonts',

  'link',
  'fullscreen',

  'disableTab',
  'noParentEvent',

  'options'
])

const qEditorAttrs = computed(() => {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(attrs)) {
    if (allowedQEditorAttrs.has(key)) {
      result[key] = value
    }
  }

  return result
})

const onClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped>
</style>
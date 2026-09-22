<template>
  <div
      class="form-builder-separator"
  >
    <b
        v-if="outsideLabel || label"
        class="separator-label"
    >
      {{ outsideLabel || label }}
    </b>

    <q-separator
        v-if="hasSize"
        v-bind="filteredAttrs"
        class="separator-default-style"
        :class="[
          vertical
              ? 'separator-vertical'
              : 'separator-horizontal'
        ]"
        :style="separatorStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { QSeparator } from 'quasar'

defineOptions({
  name: 'FormBuilderSeparator',
  inheritAttrs: false
})

type SpacingValue = boolean | string

interface Props {
  label?: string
  outsideLabel?: string
  color?: string
  size?: string | number
  vertical?: boolean
  spaced?: SpacingValue
  inset?: SpacingValue
  separatorType?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  outsideLabel: '',
  color: 'dark',
  size: '1px',
  vertical: false,
  spaced: false,
  inset: false,
  separatorType: 'solid'
})

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'label', 'outsideLabel', 'color', 'size', 'vertical', 'spaced', 'inset', 'separatorType'])
})

function filterAttrs(obj: Record<string, unknown>, exclude: string[]) {
  const forbidden = new Set(exclude)
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (!forbidden.has(key)) result[key] = val
  }
  return result
}

const normalizedSize = computed(() => {
  const size = props.size

  if (typeof size === 'number') {
    return `${size}px`
  }

  return size
})

const hasSize = computed(() => {
  const size = normalizedSize.value

  return Boolean(
      size &&
      size !== '0' &&
      size !== '0px'
  )
})

const separatorColor = computed(() => {
  const color = props.color

  if (!color) {
    return 'var(--q-dark)'
  }

  const isCustomColor =
      color.startsWith('#') ||
      color.startsWith('rgb') ||
      color.startsWith('hsl') ||
      color.startsWith('var(')

  if (isCustomColor) {
    return color
  }

  return `var(--q-${color})`
})

const borderStyle = computed(() => {
  return `${normalizedSize.value} ${props.separatorType} ${separatorColor.value}`
})

const separatorStyle = computed(() => {
  if (props.vertical) {
    return {
      borderLeft: borderStyle.value
    }
  }

  return {
    borderTop: borderStyle.value
  }
})
</script>

<style scoped lang="scss">
.form-builder-separator {
  width: 100%;
}

.separator-label {
  display: block;
  margin-bottom: 8px;
}

.separator-default-style {
  background: none;
}

.separator-horizontal {
  min-height: 0 !important;
  height: 0 !important;
}

.separator-vertical {
  min-width: 1px !important;
}
</style>
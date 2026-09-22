<template>
  <div
      class="form-builder-button"
  >
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <q-btn
        ref="inputRef"
        v-bind="filteredAttrs"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  useAttrs
} from 'vue'
import { QBtn } from 'quasar'

defineOptions({
  name: 'FormBuilderButton',
  inheritAttrs: false
})

interface Props {
  outsideLabel?: string
}

const props = withDefaults(
    defineProps<Props>(),
    {
      outsideLabel: ''
    }
)

const emit = defineEmits<{
  (event: 'click', value: Event): void
}>()

const attrs = useAttrs()

const filteredAttrs = computed(() => {
  return filterAttrs(attrs, ['class', 'style', 'id', 'modelValue', 'onUpdate:modelValue', 'type', 'outsideLabel'])
})

function filterAttrs(obj: Record<string, unknown>, exclude: string[]) {
  const forbidden = new Set(exclude)
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (!forbidden.has(key)) result[key] = val
  }
  return result
}

const onClick = (event: Event) => {
  if (attrs.disable) {
    return
  }

  emit('click', event)
}
</script>

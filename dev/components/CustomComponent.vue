<template>
  <div :class="customClass">
    hi {{ name }} from CustomComponent with value: {{ inputValue ?? 'non value' }}
    <q-btn @click="increment" color="primary" icon="add" dense flat />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name?: string
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  name: 'ali',
  customClass: ''
})

const model = defineModel<number | string | null>({ default: null })

const parseToNumber = (raw: number | string | null): number | null => {
  const parsed = Number(raw)
  return Number.isNaN(parsed) ? null : parsed
}

const inputValue = computed<number | null>({
  get: () => parseToNumber(model.value),
  set: (newValue) => { model.value = newValue }
})

const increment = () => {
  inputValue.value = (inputValue.value ?? 0) + 1
}
</script>

<style scoped lang="scss">
.custom-component {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px dashed #bdbdbd;
  border-radius: 6px;
  background: #fafafa;
  gap: 8px;
}
</style>
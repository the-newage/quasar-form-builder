<template>
  <div
      class="form-builder-button"
      :class="customClass"
  >
    <div
        v-if="outsideLabel"
        class="outside-label"
    >
      {{ outsideLabel }}
    </div>

    <q-btn
        ref="inputRef"
        v-bind="qBtnAttrs"
        :disable="isDisabled"
        :class="customClass"
        @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  useAttrs
} from 'vue'

defineOptions({
  name: 'FormBuilderButton',
  inheritAttrs: false
})

interface Props {
  customClass?: string
  outsideLabel?: string
  disabled?: boolean
  readonly?: boolean
}

const props = withDefaults(
    defineProps<Props>(),
    {
      customClass: '',
      outsideLabel: '',
      disabled: false,
      readonly: false
    }
)

const emit = defineEmits<{
  (event: 'click', value: Event): void
}>()

const attrs = useAttrs()

const isDisabled = computed(() => {
  return props.disabled || props.readonly
})

const qBtnAttrs = computed(() => {
  return {
    ...attrs
    // تمام props مربوط به QBtn
    // از طریق v-bind مستقیماً منتقل می‌شوند.
  }
})

const onClick = (event: Event) => {
  if (isDisabled.value) {
    return
  }

  emit('click', event)
}
</script>

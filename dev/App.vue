<template>
  <q-layout view="lHh Lpr lFf" :dir="dir">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Quasar Form Builder Playground</q-toolbar-title>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- <generator-panel /> -->

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-md-3 col-12">
          <q-btn color="blue" class="full-width" @click="getData">
            Get Data
          </q-btn>
        </div>
        <div class="col-md-3 col-12">
          <q-btn color="orange" class="full-width" @click="clearInputValues">
            Clear Inputs
          </q-btn>
        </div>
        <div class="col-md-3 col-12">
          <q-btn color="green" class="full-width" @click="changeScreenDirection">
            Change Direction (LTR/RTL)
          </q-btn>
        </div>
        <div class="col-md-3 col-12">
          <q-btn color="red" class="full-width" @click="loading = !loading">
            Loading: {{ loading ? 'ON' : 'OFF' }}
          </q-btn>
        </div>
        <div class="col-md-3 col-12">
          <q-btn class="full-width" @click="mockDataDatePickers">
            Mock Date Pickers
          </q-btn>
        </div>
        <div class="col-md-3 col-12 flex items-center">
          <q-checkbox v-model="readonly" label="Readonly" />
        </div>
        <div class="col-md-3 col-12 flex items-center">
          <q-checkbox v-model="disable" label="Disable" />
        </div>
      </div>

      <div class="form-builder q-pa-md q-mx-sm">
        ({{ disable }})
        <form-builder
            ref="formBuilderRef"
            v-model:inputs="inputs"
            v-model:formData="formData"
            class="q-col-gutter-md"
            :readonly="readonly"
            :disabled="disable"
            :loading="loading"
            :form-data-mode="'flat'"
            @inputClick="onClick"
            @keydown="onKeyPress"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch, onMounted } from 'vue'
import FormBuilder from '../src/FormBuilder.vue'
import { type FormInputItem } from 'vue-form-builder-core'
import CustomComponent from './components/CustomComponent.vue'
// import GeneratorPanel from './components/GeneratorPanel/GeneratorPanel.vue'

const CustomComponentInput = shallowRef(CustomComponent)

const leftDrawerOpen = ref(false)
const formBuilderRef = ref<any>(null)

const readonly = ref(false)
const disable = ref(false)
const dir = ref<'ltr' | 'rtl'>('ltr')
const loading = ref(false)

const formData = ref<Record<string, any>>({})

const inputs = ref<FormInputItem[]>([
  // ==========================================
  // 1. Text Fields & Editor
  // ==========================================
  {
    name: 'sep_text',
    type: 'separator',
    color: 'primary',
    size: '2px',
    separatorType: 'solid',
    label: 'Text Fields & Editor',
    col: 'col-12 q-my-md'
  },
  {
    name: 'first_name',
    type: 'input',
    label: 'First Name (Standard Input)',
    placeholder: 'e.g. John Doe',
    rules: 'required|min:3|max:20',
    outlined: true,
    col: 'col-md-6 col-12'
  },
  {
    name: 'bio_editor',
    type: 'inputEditor',
    label: 'About Me (Input Editor)',
    placeholder: 'Write a short bio or formatted description...',
    minHeight: '6rem',
    col: 'col-12'
  },

  // ==========================================
  // 2. Date & Time Family
  // ==========================================
  {
    name: 'sep_datetime',
    type: 'separator',
    color: 'teal',
    size: '2px',
    separatorType: 'solid',
    label: 'Date & Time Family',
    col: 'col-12 q-my-md'
  },
  {
    name: 'birth_date',
    type: 'date',
    label: 'Birth Date (Date Picker)',
    calendar: 'gregorian',
    outlined: true,
    col: 'col-md-4 col-12'
  },
  {
    name: 'meeting_time',
    type: 'time',
    label: 'Meeting Time (Time Picker)',
    outlined: true,
    col: 'col-md-4 col-12'
  },
  {
    name: 'event_datetime',
    type: 'datetime',
    label: 'Event Schedule (DateTime Picker)',
    calendar: 'gregorian',
    outlined: true,
    col: 'col-md-4 col-12'
  },

  // ==========================================
  // 3. Selections & Choices
  // ==========================================
  {
    name: 'sep_selects',
    type: 'separator',
    color: 'deep-orange',
    size: '2px',
    separatorType: 'solid',
    label: 'Selections & Choices',
    col: 'col-12 q-my-md'
  },
  {
    name: 'role_select',
    type: 'select',
    label: 'User Role (Select)',
    outlined: true,
    options: [
      { label: 'Administrator', value: 'admin' },
      { label: 'Developer', value: 'dev' },
      { label: 'UI/UX Designer', value: 'designer' }
    ],
    col: 'col-md-6 col-12'
  },
  {
    name: 'toggle_choice',
    type: 'toggleButton',
    label: 'Status (Toggle Button)',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Pending', value: 'pending' },
      { label: 'Inactive', value: 'inactive' }
    ],
    color: 'primary',
    textColor: 'white',
    col: 'col-md-6 col-12'
  },
  {
    name: 'permissions_group',
    type: 'optionGroup',
    label: 'Permissions (OptionGroup - Checkbox)',
    typeOfInput: 'checkbox',
    inline: true,
    color: 'teal',
    value: ['read'],
    options: [
      { label: 'Read', value: 'read' },
      { label: 'Write', value: 'write' },
      { label: 'Delete', value: 'delete' }
    ],
    col: 'col-md-6 col-12'
  },
  {
    name: 'theme_radio',
    type: 'optionGroup',
    label: 'Theme (OptionGroup - Radio)',
    typeOfInput: 'radio',
    inline: true,
    color: 'secondary',
    value: 'light',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' }
    ],
    col: 'col-md-3 col-12'
  },
  {
    name: 'agree_terms',
    type: 'checkbox',
    label: 'I accept terms & conditions',
    color: 'positive',
    value: false,
    col: 'col-md-3 col-12'
  },

  // ==========================================
  // 4. Sliders & Color Picker
  // ==========================================
  {
    name: 'sep_sliders',
    type: 'separator',
    color: 'purple',
    size: '2px',
    separatorType: 'solid',
    label: 'Sliders & Color Picker',
    col: 'col-12 q-my-md'
  },
  {
    name: 'single_slider',
    type: 'slider',
    label: 'Satisfaction Score (Slider)',
    min: 0,
    max: 100,
    step: 5,
    value: 50,
    labelAlways: true,
    color: 'purple',
    col: 'col-md-4 col-12'
  },
  {
    name: 'budget_range',
    type: 'rangeSlider',
    label: 'Budget Range (RangeSlider)',
    min: 0,
    max: 100,
    value: { min: 20, max: 70 },
    labelAlways: true,
    color: 'deep-purple',
    col: 'col-md-4 col-12'
  },
  {
    name: 'brand_color',
    type: 'color',
    label: 'Brand Color (Color Picker)',
    outlined: true,
    value: '#1976D2',
    col: 'col-md-4 col-12'
  },

  // ==========================================
  // 5. File Upload
  // ==========================================
  {
    name: 'sep_file',
    type: 'separator',
    color: 'brown',
    size: '2px',
    separatorType: 'solid',
    label: 'File & Attachment Management',
    col: 'col-12 q-my-md'
  },
  {
    name: 'resume_attachments',
    type: 'file',
    label: 'Upload Attachments / Documents',
    multiple: true,
    clearable: true,
    outlined: true,
    accept: '.pdf,.png,.jpg,.jpeg',
    col: 'col-12'
  },

  // ==========================================
  // 6. Action Buttons
  // ==========================================
  {
    name: 'sep_actions',
    type: 'separator',
    color: 'grey-8',
    size: '1px',
    separatorType: 'dashed',
    col: 'col-12 q-my-md'
  },
  {
    name: 'draft_btn',
    type: 'button',
    label: 'Save Draft',
    color: 'grey-7',
    outline: true,
    col: 'col-md-2 col-6'
  },
  {
    name: 'submit_btn',
    type: 'button',
    label: 'Submit',
    color: 'primary',
    unelevated: true,
    col: 'col-md-2 col-6'
  }
])

watch(readonly, (newValue) => {
  // Can trigger helper methods via ref if needed
})

watch(disable, (newValue) => {
  // Global disable state handler
})

onMounted(() => {
  // Playground mounted lifecycle hook
})

const onClick = (data: any) => {
  console.log('data clicked:', data)
}

const onKeyPress = (data: any) => {
  // console.log('key press:', data)
}

const getData = () => {
  console.log('Form Data Object: ', formData.value)
}

const mockDataDatePickers = () => {
  formData.value = {
    ...formData.value,
    test: '2017-08-02',
    test1: '2012-08-02 21:10',
    test2: '12:25:00'
  }
}

const clearInputValues = () => {
  if (formBuilderRef.value) {
    formBuilderRef.value.clearValues()
  }
}

const changeScreenDirection = () => {
  dir.value = dir.value === 'rtl' ? 'ltr' : 'rtl'
}
</script>

<style lang="scss">
.q-field__inner {
  .q-field__control {
    background-color: white;

    .q-field__append {
      .q-icon {
        color: black;
        font-size: 20px;
        padding: 7px;
      }
    }
  }
}
</style>

<template>
  <q-layout view="lHh Lpr lFf" :dir="dir">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat
               dense
               round
               aria-label="Menu"
               icon="menu"
               @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>Quasar Form Builder Playground</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
<!--      <generator-panel />-->

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-md-3 col-12">
          <q-btn color="blue" class="full-width" @click="getData">
            get data
          </q-btn>
        </div>
        <div class="col-md-3 col-12">
          <q-btn color="orange" class="full-width" @click="clearInputValues">
            clear inputs
          </q-btn>
        </div>
        <div class="col-md-3 col-12">
          <q-btn color="green" class="full-width" @click="changeScreenDirection">
            change screen direction
          </q-btn>
        </div>
        <div class="col-md-3 col-12">
          <q-btn color="red" class="full-width" @click="loading = !loading">
            loading: {{ loading ? 'ON' : 'OFF' }}
          </q-btn>
        </div>
        <div class="col-md-3 col-12">
          <q-btn class="full-width" @click="mockDataDatePickers">
            mock value for date pickers
          </q-btn>
        </div>
        <div class="col-md-3 col-12 flex items-center">
          <q-checkbox v-model="readonly" label="readonly" />
        </div>
        <div class="col-md-3 col-12 flex items-center">
          <q-checkbox v-model="disable" label="disable" />
        </div>
      </div>

      <div class="form-builder q-pa-md q-mx-sm">
        <form-builder ref="formBuilderRef"
                      v-model:inputs="inputs"
                      v-model:formData="formData"
                      class="q-mx-md"
                      :readonly="readonly"
                      :disable="disable"
                      :loading="loading"
                      @inputClick="onClick"
                      @keydown="onKeyPress" />
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
  {
    name: 'inputFile',
    type: 'file',
    capture: 'user',
    accept: '*',
    multiple: true,
    clearable: true,
    label: 'just capture',
    col: 'col-12'
  },
  {
    type: 'select',
    dropdownIcon: 'add',
    class: 'testCustomClass',
    name: 'question_type',
    responseKey: 'data.question_type',
    options: [
      { label: 'konkur', value: 'konkur' },
      { label: 'psychometric', value: 'psychometric' },
      { label: 'descriptive', value: 'descriptive' }
    ],
    col: 'col-12'
  },
  {
    name: 'submit',
    type: 'submit',
    label: 'submit btn',
    col: 'col-12'
  },
  {
    name: 'separator',
    type: 'separator',
    color: 'secondary',
    size: '1px',
    separatorType: 'solid',
    // label: 'this is hidden separator',
    col: 'col-md-12 q-my-md'
  },
  {
    type: 'hidden',
    name: 'hidden_field',
    col: 'col-md-6'
  },
  {
    type: 'rangeSlider',
    name: 'ZoomRate',
    col: 'col-md-6',
    label: 'zoom rate from:',
    min: 0,
    max: 11,
    value: {
      min: 5,
      max: 7
    }
  },
  {
    name: 'separator',
    type: 'separator',
    color: 'secondary',
    size: '3px',
    separatorType: 'solid',
    label: 'toggleButton & optionGroup & checkbox',
    col: 'col-md-12'
  },
  {
    type: 'toggleButton',
    name: 'sample-toggle-button',
    label: 'ToggleButton',
    options: [
      { label: 'tab1', value: '1' },
      { label: 'tab2', value: '2' },
      { label: 'tab3', value: '3' }
    ],
    col: 'col-md-3 col-12',
    size: 'md',
    color: 'red',
    textColor: 'black'
  },
  {
    type: 'optionGroup',
    name: 'id_option_group',
    inline: false,
    dense: true,
    label: 'optionGroup',
    value: [],
    options: [
      { label: 'tab1', value: '1', caption: 'caption' },
      { label: 'tab2', value: '2' },
      { label: 'tab3', value: '3', caption: 'caption' },
      { label: 'tab4', value: '4' }
    ],
    col: 'col-md-3',
    color: 'green',
    typeOfInput: 'checkbox',
    textColor: 'black',
  },
  {
    type: 'optionGroup',
    name: 'radioButton',
    inline: false,
    dense: true,
    label: 'radioButton',
    value: {},
    options: [
      { label: 'tab1', value: '1' },
      { label: 'tab2', value: '2' },
      { label: 'tab3', value: '3' }
    ],
    col: 'col-md-3',
    color: 'blue',
    textColor: 'black',
  },
  { type: 'checkbox', name: 'enable', label: 'فعال', col: 'col-md-3' },
  {
    name: 'separator',
    type: 'separator',
    color: 'secondary',
    size: '3px',
    separatorType: 'solid',
    col: 'col-md-12'
  },
  {
    name: 'separator',
    type: 'separator',
    color: 'accent',
    size: '3px',
    separatorType: 'solid',
    label: 'custom component',
    col: 'col-md-12'
  },
  {
    type: CustomComponentInput,
    props: { name: 'ali' },
    name: 'ali',
    value: 123,
    label: 'شناسه علی',
    col: 'col-md-6'
  },
  {
    type: CustomComponentInput,
    props: { name: 'mostafa' },
    name: 'mostafa',
    value: 456,
    label: 'شناسه مصطفی',
    col: 'col-md-6'
  },
  {
    name: 'separator',
    type: 'separator',
    color: 'negative',
    size: '3px',
    separatorType: 'solid',
    label: 'form-builder inside a form-builder',
    col: 'col-md-12'
  },
  {
    type: 'formBuilder',
    name: 'formBuilderCol',
    col: 'col-md-12',
    gutterSize: 'lg',
    inputs: [
      {
        type: 'input',
        name: 'id1',
        value: null,
        label: 'disabled input',
        col: 'col-md-6',
        disable: true
      },
      {
        type: 'input',
        name: 'id2',
        color: 'positive',
        value: 'readonly input',
        label: 'input in read only mode',
        col: 'col-md-6',
        readonly: true,
        filled: true
      }
    ]
  },
  {
    type: 'date',
    name: 'last_modification_time',
    label: 'required date with label',
    calendar: 'persian',
    col: 'col-md-6'
  }
])

watch(readonly, (newValue) => {
  // اگر نیاز به متد کمکی هست می‌تونی از ref صدا بزنی
})

watch(disable, (newValue) => {
  // مدیریت وضعیت disable عمومی
})

onMounted(() => {
  // تست مقداردهی اولیه یا نمونه عکس
  if (inputs.value[2]) {
    // تنظیمات دلخواه اولیه
  }
})

const onClick = (data: any) => {
  console.log('data clicked:', data)
}

const onKeyPress = (data: any) => {
  console.log('key press:', data)
}

const getData = () => {
  console.log('Form Data Object: ', formData.value)
  if (formBuilderRef.value) {
    console.log('Normalized Form Data:', formBuilderRef.value.getNormalizedFormData(inputs.value))
  }
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

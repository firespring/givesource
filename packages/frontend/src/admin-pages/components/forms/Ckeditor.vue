<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
  <component
    :is="editor"
    v-if="loaded"
    :id="id"
    v-model="localValue"
    :type="type"
    :height="height"
    :has-errors="hasErrors"
  />
  <layout-spinner
    v-else
    :height="height"
  />
</template>

<script>
import ComponentCkeditor4 from './Ckeditor4.vue'
import ComponentCkeditor5 from './Ckeditor5.vue'
import ComponentSpinner from './../layout/Spinner.vue'

export default {
  emits: ['update:modelValue'],
  components: {
    'forms-ckeditor4': ComponentCkeditor4,
    'forms-ckeditor5': ComponentCkeditor5,
    'layout-spinner': ComponentSpinner
  },
  props: {
    modelValue: { type: String, default: '' },
    id: {
      type: String,
      default: ''
    },
    hasErrors: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '200'
    },
    loaded: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'basic'
    }
  },
  data () {
    return {
      localValue: this.modelValue ? this.modelValue : ''
    }
  },
  computed: {
    editor () {
      const vm = this
      return vm.isInternetExplorer() || vm.isMicrosoftEdge() ? 'forms-ckeditor4' : 'forms-ckeditor5'
    }
  },
  watch: {
    localValue: {
      handler (value, oldValue) {
        if (value === oldValue) {
          return
        }
        this.$emit('update:modelValue', value)
      }
    },
    modelValue: {
      handler (value, oldValue) {
        if (value === oldValue) {
          return
        }
        this.localValue = value
      }
    }
  }
}
</script>

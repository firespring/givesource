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
  <ckeditor
    :id="id"
    v-model="localValue"
    :editor="editor"
    tag-name="textarea"
    :class="{'has-errors': hasErrors}"
  />
</template>

<script>
import AdvancedEditor from './../../ckeditor/editors/advanced'
import BasicEditor from './../../ckeditor/editors/basic'
import ComponentSpinner from './../layout/Spinner.vue'
import ModerateEditor from './../../ckeditor/editors/moderate'

export default {
  components: {
    'layout-spinner': ComponentSpinner
  },
  props: {
    value: {},
    id: {
      type: String,
      default: ''
    },
    hasErrors: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'basic'
    }
  },
  data () {
    return {
      localValue: this.value ? this.value : '',
      editors: {
        advanced: AdvancedEditor,
        basic: BasicEditor,
        moderate: ModerateEditor
      }
    }
  },
  computed: {
    editor () {
      const vm = this
      return vm.type && vm.editors.hasOwnProperty(vm.type) ? vm.editors[vm.type] : vm.editors.basic
    }
  },
  watch: {
    localValue: function (value, oldValue) {
      if (value === oldValue) {
        return
      }
      this.$emit('input', value)
    },
    value: function (value, oldValue) {
      if (value === oldValue) {
        return
      }
      this.localValue = value
    }
  }
}
</script>

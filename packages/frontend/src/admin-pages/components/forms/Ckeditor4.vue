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
  <textarea
    :id="id"
    :value="value"
    :class="{'has-error': hasErrors}"
    :height="height"
  />
</template>

<script>
export default {
  emits: ['input'],
  props: {
    value: {
      type: String,
      default: ''
    },
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
    type: {
      type: String,
      default: 'basic'
    }
  },
  data () {
    return {
      toolbars: {
        basic: [
          { name: 'basicstyles', items: ['Bold', 'Italic', '-', 'RemoveFormat'] },
          { name: 'links', items: ['Link', 'Unlink'] }
        ],
        moderate: [
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Blockquote', '-', 'RemoveFormat'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
          { name: 'links', items: ['Link', 'Unlink'] },
          { name: 'tools', items: ['Maximize'] }
        ],
        advanced: [
          { name: 'styles', items: ['Format'] },
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Blockquote', '-', 'RemoveFormat'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
          { name: 'links', items: ['Link', 'Unlink'] },
          { name: 'tools', items: ['Maximize'] }
        ]
      }
    }
  },
  computed: {
    toolbar () {
      const vm = this
      return (vm.type && vm.toolbars.hasOwnProperty(vm.type)) ? vm.toolbars[vm.type] : vm.toolbars.basic
    }
  },
  mounted () {
    const vm = this

    const config = {
      allowedContent: (vm.type === 'advanced'),
      disallowedContent: 'script',
      height: vm.height,
      language: 'en-us',
      toolbar: vm.toolbar
    }

    window.CKEDITOR.replace(vm.id, config)
    window.CKEDITOR.instances[vm.id].setData(vm.value)
    window.CKEDITOR.instances[vm.id].on('change', () => {
      const value = window.CKEDITOR.instances[vm.id].getData()

      if (value !== vm.value) {
        vm.$emit('input', value)
      }
    })
  },
  destroyed () {
    const vm = this

    if (window.CKEDITOR.instances[vm.id]) {
      window.CKEDITOR.instances[vm.id].destroy()
    }
  },
  beforeUpdate () {
    const vm = this

    if (vm.value !== window.CKEDITOR.instances[vm.id].getData()) {
      window.CKEDITOR.instances[vm.id].setData(vm.value)
    }
  }
}
</script>

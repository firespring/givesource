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
  <div
    v-if="hasError"
    id="api-error"
    class="c-alert c-alert--shadow c-alert--bad c-alert--expand u-flex u-justify-center"
  >
    <div class="c-alert__body u-flex u-justify-between">
      <div class="c-alert__text">
        <h3 class="c-alert-title">
          There was an error processing your request.
        </h3>
        <ul>
          <li v-if="localValue.type">
            Type: {{ localValue.type }}
          </li>
          <li v-if="localValue.message">
            Message: {{ localValue.message }}
          </li>
          <li v-if="localValue.request_id">
            ID: {{ localValue.request_id }}
          </li>
        </ul>
      </div>
      <div class="c-alert__close">
        <button
          class="c-btn c-btn--xs c-btn--icon c-btn--reverse c-btn--text"
          @click="close"
        >
          <i
            class="fa fa-close"
            aria-hidden="true"
          />Close
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    modelValue: { type: Object, default: () => ({}) }
  },
  emits: ['update:modelValue'],
  data: function () {
    return {
      localValue: {}
    }
  },
  computed: {
    hasError: function () {
      return this.localValue && Object.keys(this.localValue).length
    }
  },
  watch: {
    localValue: {
      handler (value, oldValue) {
        const vue = this
        if (value === oldValue) {
          return
        }
        vue.$emit('update:modelValue', vue.localValue)
      }
    },
    modelValue: {
      handler (value, oldValue) {
        const vue = this
        if (value === oldValue) {
          return
        }
        vue.localValue = value
      }
    }
  },
  methods: {
    close: function () {
      const vue = this
      vue.localValue = {}
    }
  }
}

</script>

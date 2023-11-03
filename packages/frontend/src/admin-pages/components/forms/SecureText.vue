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
    v-if="displayTextInput"
    class="c-form-control-grid u-items-center"
  >
    <div class="c-form-control-grid__item u-flex-collapse">
      <input
        :id="id"
        ref="input"
        v-model="localValue"
        type="text"
        :name="name"
        :placeholder="placeholder"
        autocomplete="off"
      >
    </div>
    <div
      v-if="original"
      class="c-form-control-grid__item u-flex-collapse"
    >
      <a
        href="#"
        class="c-btn c-btn--xs c-btn--flat c-btn--warning"
        @click.prevent="cancel"
      >Cancel</a>
    </div>
  </div>

  <div
    v-else
    class="c-form-control-grid u-items-center"
  >
    <div class="c-form-control-grid__item u-flex-collapse">
      ***********
    </div>
    <div class="c-form-control-grid__item u-flex-collapse">
      <a
        href="#"
        class="c-btn c-btn--xs c-btn--flat c-btn--warning"
        @click.prevent="edit"
      >Edit</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    secureKey: { type: String, default: '' },
    value: { type: String, default: '' }
  },
  data: function () {
    return {
      localValue: this.value ? this.value : '',
      displayTextInput: true,
      original: null
    }
  },
  watch: {
    value: function (newVal) {
      if (this.localValue !== newVal) {
        this.localValue = newVal
        this.displayTextInput = false
      }
    },
    localValue: function () {
      this.$emit('input', this.localValue)
    }
  },
  created: function () {
    const vue = this

    if (vue.secureKey) {
      vue.$request.get('settings/secure/' + vue.secureKey).then(function (response) {
        if (response.data.errorMessage) {
          return Promise.resolve()
        }
        return Promise.resolve(response.data)
      }).then(function (response) {
        if (response) {
          vue.original = response.value
          vue.localValue = response.value
          vue.displayTextInput = false
        }

        vue.$emit('loaded')
      })

      vue.$parent.on('save', this.save)
    } else {
      vue.$emit('loaded')
    }
  },
  methods: {
    save: function () {
      const vue = this

      if (vue.localValue !== vue.original && vue.secureKey) {
        vue.$request.patch('settings/secure/' + vue.secureKey, {
          value: this.localValue
        }).catch(function (err) {
          console.log(err)
        })
      }
    },
    edit: function () {
      const vue = this

      vue.localValue = ''
      vue.displayTextInput = true
      this.$nextTick(function () {
        $(this.$refs.input).focus()
      })
    },
    cancel: function () {
      const vue = this

      vue.displayTextInput = false
      vue.localValue = vue.original
    }
  }
}
</script>

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
  <label
    :for="id"
    class="u-hidden-visually"
  >Select a nonprofit</label>
  <select
    :id="id"
    ref="select"
    v-model="localValue"
    :name="name"
    class="combobox"
    :data-placeholder="placeholder"
    :class="{'has-error': hasError}"
    :required="isRequired"
  >
    <option value="" />
    <option
      v-for="nonprofit in nonprofits"
      :value="nonprofit.id"
    >
      {{ nonprofit.legalName }}
    </option>
  </select>
</template>

<script>

export default {
  props: {
    modelValue: { type: [String, Number], default: null },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Select a nonprofit'
    },
    nonprofits: {
      type: Array,
      default: function () {
        return []
      }
    },
    hasError: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data: function () {
    return {
      localValue: ''
    }
  },
  computed: {
    selectedValue: function () {
      return this.localValue
    }
  },
  watch: {
    localValue: {
      handler (value, oldValue) {
        const vue = this
        if (value === oldValue) {
          return
        }
        vue.$emit('update:modelValue', vue.selectedValue)
      }
    },
    modelValue: {
      handler (value, oldValue) {
        const vue = this
        if (value === oldValue) {
          return
        }
        vue.localValue = value
        $(vue.$refs.select).val(value)
        $(vue.$refs.select).trigger('chosen:updated')
      }

    },
    nonprofits: {
      handler () {
        const vue = this
        vue.$nextTick(function () {
          $(vue.$refs.select).trigger('chosen:updated')
        })
      }
    }
  },
  mounted: function () {
    const vue = this

    $(vue.$refs.select).chosen({
      allow_single_deselect: true,
      width: '100%'
    }).change(function () {
      vue.localValue = $(this).val()
    })
  }
}
</script>

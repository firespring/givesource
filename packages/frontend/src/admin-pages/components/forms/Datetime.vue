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
  <div class="u-control-icon u-control-icon--date">
    <input
      v-if="isDesktop"
      :id="id"
      ref="datetime"
      v-model="localValue"
      type="text"
      :name="name"
      :placeholder="placeholder"
      :class="{'has-error': hasError}"
      autocomplete="off"
    >
    <input
      v-else
      :id="id"
      v-model="localValue"
      type="date"
      :name="name"
      :class="{'has-error': hasError}"
      autocomplete="off"
    >
  </div>
</template>

<script>
// DatePicker needs imported to init the jquery functionality
import DatePicker from 'jquery-datetimepicker' // eslint-disable-line no-unused-vars
export default {
  emits: ['input'],
  props: {
    value: { type: String, default: '' },
    id: {
      type: String,
      default: 'date'
    },
    name: {
      type: String,
      default: 'date'
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    minDate: {
      type: [String, Boolean],
      default: null
    },
    maxDate: {
      type: [String, Boolean],
      default: null
    },
    hasError: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      localValue: '',
      defaultOptions: {
        timepicker: false,
        format: 'm/d/Y',
        scrollMonth: false,
        closeOnDateSelect: true,
        yearStart: 1900,
        lang: 'en',
        i18n: {
          en: {
            dayOfWeekShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
          }
        }
      }
    }
  },
  computed: {
    datetimeOptions: function () {
      return _.defaultsDeep({}, this.defaultOptions, this.options)
    },
    isDesktop: function () {
      return !/Mobi/.test(navigator.userAgent)
    }
  },
  watch: {
    localValue: function (value, oldValue) {
      const vue = this
      if (value === oldValue) {
        return
      }
      vue.$emit('input', value)
    },
    value: function (value, oldValue) {
      const vue = this
      if (value === oldValue) {
        return
      }
      vue.localValue = value
    }
  },
  mounted: function () {
    const vue = this

    if (vue.isDesktop) {
      const options = _.merge({}, vue.datetimeOptions, {
        onChangeDateTime: function (value, $el) {
          vue.localValue = $el.val()
        },
        onShow: function () {
          if (vue.minDate !== null) {
            this.setOptions({
              minDate: vue.minDate || false,
              formatDate: 'm/d/Y'
            })
          }
          if (vue.maxDate !== null) {
            this.setOptions({
              maxDate: vue.maxDate || false,
              formatDate: 'm/d/Y'
            })
          }
        }
      })
      $(vue.$refs.datetime).datetimepicker(options)
    }
  }
}
</script>

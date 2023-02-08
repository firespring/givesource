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
  <tr>
    <td class="input">
      <div
        class="u-control-icon u-control-icon--dollar"
        :class="{ 'u-control-icon--has-error': error}"
      >
        <input
          v-model.lazy="localAmount"
          v-money="currencyOptions"
          type="text"
          style="width: 10rem;"
          :class="{ 'has-error': error}"
        >
      </div>
      <div
        v-if="error"
        class="c-notes c-notes--below c-notes--bad c-form-control-error"
      >
        A donation amount must be at least $10.00
      </div>
    </td>
    <td>
      <input
        v-model="localDescription"
        type="text"
        maxlength="100"
      >
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'amount',
    'description',
    'index'
  ],
  data: function () {
    return {
      localAmount: this.amount || '',
      localDescription: this.description || '',
      error: null,

      currencyOptions: {
        precision: 2,
        masked: true,
        thousands: ''
      }
    }
  },
  watch: {
    localAmount: function (value, oldValue) {
      const vue = this
      if (value === oldValue) {
        return
      }
      vue.$emit('change', vue.index, { amount: value, description: vue.localDescription })
    },
    localDescription: function (value, oldValue) {
      const vue = this
      if (value === oldValue) {
        return
      }
      vue.$emit('change', vue.index, { amount: vue.localAmount, description: value })
    },
    amount: function (value, oldValue) {
      const vue = this
      if (value === oldValue) {
        return
      }
      vue.formErrors = vue.validate({ amount: value }, vue.getConstraints())
      vue.error = !!(Object.keys(vue.formErrors).length)
      vue.localAmount = vue.amount
      vue.localDescription = vue.description
    },
    description: function (value, oldValue) {
      const vue = this
      if (value === oldValue) {
        return
      }
      vue.localAmount = vue.amount
      vue.localDescription = vue.description
    }
  },
  methods: {
    getConstraints: function () {
      return {
        amount: function (value) {
          if (value !== '0.00') {
            return {
              presence: true,
              numericality: {
                greaterThanOrEqualTo: 10
              }
            }
          } else {
            return {
              presence: false

            }
          }
        }
      }
    }
  }

}
</script>

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
    <td class="organization">
      <strong>{{ nonprofit.legalName }}</strong>
    </td>
    <td class="donation">
      <div
        class="donation-amount"
        :class="{ 'u-control-icon--has-error': formErrors.amount}"
      >
        <label
          :for="`amount-${index}`"
          class="u-hidden-visually"
        >Donation Amount</label>
        <forms-money
          :id="`amount-${index}`"
          v-model="localAmount"
          name="amount"
          :has-error="formErrors.hasOwnProperty('amount')"
        />
      </div>
      <div
        v-if="formErrors.amount"
        class="notes notes--below notes--error"
      >
        A donation amount must be at least $10.00
      </div>
    </td>
    <td class="actions nowrap">
      <a
        href="#"
        class="btn btn--sm btn--icon btn--red"
        @click.prevent="deleteCartItem"
      >
        <i
          class="fas fa-trash-alt"
          aria-hidden="true"
        />Delete
      </a>
    </td>
  </tr>
</template>

<script>
import ComponentMoney from './../../forms/Money.vue'
import { useAppStore } from "../../../store"

export default {
  components: {
    'forms-money': ComponentMoney
  },
  props: {
    amount: { type: Number, default: 0 },
    nonprofit: { type: Object, default: () => ({}) },
    timestamp: { type: Number, default: 0 },
    index: { type: Number, default: 0 }
  },
  emits: ['update-cart-item', 'has-error', 'remove-cart-item'],
  data: function () {
    return {
      localAmount: this.amount,
      formErrors: {}
    }
  },
  beforeMount() {
    this.$store = useAppStore()
  },
  computed: {
    donationAmount: function () {
      return this.formatMoney(this.amount)
    }
  },
  watch: {
    localAmount: function (value, oldValue) {
      const vue = this

      if (value !== oldValue) {
        vue.$emit('update-cart-item', vue.index, vue.localAmount)
      }
    },
    amount: function (value, oldValue) {
      const vue = this

      if (value === oldValue) {
        return
      }
      vue.formErrors = vue.validate({ amount: value }, vue.getConstraints())
      vue.$emit('has-error', (Object.keys(vue.formErrors).length > 0))
      vue.localAmount = value
    }
  },
  methods: {
    getConstraints: function () {
      return {
        amount: {
          presence: true,
          numericality: {
            onlyInteger: true,
            greaterThanOrEqualTo: 1000
          }
        }
      }
    },
    deleteCartItem: function () {
      const vue = this

      vue.$store.commit('removeCartItem', vue.timestamp)
      vue.$emit('remove-cart-item', vue.index)
    }
  }
}
</script>

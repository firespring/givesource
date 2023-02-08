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
      <div class="form-item mt2">
        <div class="form-item__control">
          <input
            v-model="localNote"
            type="text"
            name="note1"
            class="sm"
            :placeholder="placeHolder"
            maxlength="200"
          >
        </div>
      </div>
    </td>
    <td class="donation">
      <div class="donation-amount">
        <forms-money
          v-model="localAmount"
          name="amount"
          :has-error="formErrors.hasOwnProperty('amount')"
          required
        />
      </div>
      <div
        v-if="error"
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
import * as Utils from './../../helpers/utils'
import ComponentMoney from './../forms/Money.vue'

export default {
  components: {
    'forms-money': ComponentMoney
  },
  props: [
    'amount',
    'nonprofit',
    'timestamp',
    'note',
    'index'
  ],
  data () {
    const vm = this

    return {
      localAmount: vm.amount,
      localNote: vm.note,
      error: null,

      formErrors: {}
    }
  },
  computed: {
    donationAmount () {
      return this.formatMoney(this.amount)
    },
    placeHolder () {
      return 'Leave ' + this.nonprofit.legalName + ' a note with your donation'
    }
  },
  watch: {
    localAmount (value, oldValue) {
      const vm = this

      if (value !== oldValue) {
        vm.$emit('updateCartItem', vm.index, vm.localAmount, vm.localNote)
      }
    },
    amount (value, oldValue) {
      const vm = this

      if (value === oldValue) {
        return
      }
      vm.formErrors = vm.validate({ amount: value }, vm.getConstraints())
      vm.error = !!Object.keys(vm.formErrors).length
      vm.$emit('hasError', vm.error)

      vm.localAmount = value
    },
    localNote (value, oldValue) {
      const vm = this

      if (value !== oldValue) {
        vm.$emit('updateCartItem', vm.index, vm.localAmount, vm.localNote)
      }
    },
    note: function (value, oldValue) {
      const vue = this

      if (value === oldValue) {
        return
      }

      vue.localNote = value
    }
  },
  methods: {
    getConstraints () {
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
    deleteCartItem () {
      const vm = this

      vm.$store.commit('removeCartItem', vm.timestamp)
      vm.$emit('removeCartItem', vm.index)
    }
  }
}
</script>

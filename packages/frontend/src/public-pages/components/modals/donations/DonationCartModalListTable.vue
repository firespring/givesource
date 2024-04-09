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
  <table class="table-donations">
    <thead>
      <tr>
        <th class="width-100">
          Nonprofit Name
        </th>
        <th>Amount</th>
        <th />
      </tr>
    </thead>

    <tbody v-if="cartItems.length">
      <donation-cart-modal-list-table-row
        v-for="(cartItem, index) in cartItems"
        :key="cartItem.timestamp"
        :amount="cartItem.amount"
        :timestamp="cartItem.timestamp"
        :nonprofit="cartItem.nonprofit"
        :index="index"
        @remove-cart-item="removeCartItem"
        @update-cart-item="updateCartItem"
        @has-error="hasError"
      />
    </tbody>

    <tbody v-else>
      <tr>
        <td
          colspan="3"
          class="text-c"
        >
          <p>
            <strong>You haven't added any donations yet.</strong>
          </p>
          <p>
            <a
              href="#"
              class="btn btn--accent"
              @click.prevent="findNonprofit"
            >Find a Nonprofit to Help</a>
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ComponentDonationCartModalListTableRow from './DonationCartModalListTableRow.vue'
import { useAppStore } from "../../../store"

export default {
  components: {
    'donation-cart-modal-list-table-row': ComponentDonationCartModalListTableRow
  },
  emits: ['find-nonprofit', 'has-error'],
  data: function () {
    return {
      cartItems: []
    }
  },
  beforeMount() {
    this.$store = useAppStore()
  },
  created: function () {
    const vue = this

    vue.cartItems = vue.$store.state.cartItems
    vue.cartItems.sort(function (a, b) {
      return a.timestamp - b.timestamp
    })
  },
  methods: {
    removeCartItem: function (index) {
      const vue = this
      vue.cartItems.splice(index, 1)
    },
    updateCartItem: function (index, amount) {
      const vue = this

      const item = vue.cartItems[index]
      item.amount = amount

      vue.cartItems[index] = item
      vue.$store.commit('updateCartItem', {
        timestamp: item.timestamp,
        amount: item.amount
      })
    },
    findNonprofit: function () {
      const vue = this
      vue.$emit('find-nonprofit')
    },
    hasError: function (hasError) {
      const vue = this
      vue.$emit('has-error', hasError)
    }
  }
}
</script>

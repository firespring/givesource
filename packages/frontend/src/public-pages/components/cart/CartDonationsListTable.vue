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
      <cart-donations-list-table-row
        v-for="(cartItem, index) in cartItems"
        :key="cartItem.timestamp"
        :amount="cartItem.amount"
        :timestamp="cartItem.timestamp"
        :nonprofit="cartItem.nonprofit"
        :note="cartItem.note"
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
            <router-link
              :to="{ name: 'search-results' }"
              class="btn btn--accent"
            >
              Find a Nonprofit to Help
            </router-link>
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import ComponentCartDonationsListTableRow from './CartDonationsListTableRow.vue'

export default {
  components: {
    'cart-donations-list-table-row': ComponentCartDonationsListTableRow
  },
  computed: {
    cartItems () {
      const vm = this

      return [...vm.$store.state.cartItems].sort((a, b) => {
        return a.timestamp - b.timestamp
      })
    }
  },
  methods: {
    removeCartItem (index) {
      const vm = this
      const item = vm.cartItems[index]
      vm.$store.commit('removeCartItem', item.timestamp)
    },
    updateCartItem (index, amount, note) {
      const vm = this

      const item = vm.cartItems[index]
      vm.$store.commit('updateCartItem', {
        timestamp: item.timestamp,
        amount: amount,
        note: note
      })
    },
    hasError (hasError) {
      this.$emit('has-error', hasError)
    }
  }
}
</script>

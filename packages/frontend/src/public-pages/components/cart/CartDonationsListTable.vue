<!--
  ~ Copyright 2018 Firespring, Inc.
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
            <th class="width-100">Nonprofit Name</th>
            <th>Amount</th>
            <th></th>
        </tr>
        </thead>

        <tbody v-if="cartItems.length">
        <cart-donations-list-table-row v-for="(cartItem, index) in cartItems" :amount="cartItem.amount" :timestamp="cartItem.timestamp" :nonprofit="cartItem.nonprofit" :key="index"
                                       :note="cartItem.note" v-on:removeCartItem="removeCartItem" v-on:updateCartItem="updateCartItem"
                                       v-on:hasError="hasError"></cart-donations-list-table-row>
        </tbody>

        <tbody v-else>
        <tr>
            <td colspan="3" class="text-c">
                <p>
                    <strong>You haven't added any donations yet.</strong>
                </p>
                <p>
                    <router-link :to="{ name: 'search-results' }" class="btn btn--accent">Find a Nonprofit to Help</router-link>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
	module.exports = {
		data: function () {
			return {
				cartItems: [],
			};
		},
		created: function () {
			const vue = this;

			vue.cartItems = vue.$store.state.cartItems;
			vue.cartItems.sort(function (a, b) {
				return a.timestamp - b.timestamp;
			});
		},
		methods: {
			removeCartItem: function (timestamp) {
				const vue = this;
				vue.cartItems = _.reject(vue.cartItems, {timestamp: timestamp});
			},
			updateCartItem: function (timestamp, amount, note) {
				const vue = this;

				const cartItem = _.find(vue.cartItems, {timestamp: timestamp});
				cartItem.amount = amount;
				cartItem.note = note;

				vue.$store.commit('updateCartItem', {
					timestamp: timestamp,
					amount: amount,
					note: note
				});

				vue.bus.$emit('updateCartItems');
				vue.bus.$emit('updateCartItemsCount');
				vue.bus.$emit('updateCartItemsCounter');
			},
			hasError: function (hasError) {
				const vue = this;
				vue.$emit('hasError', hasError);
			}
		},
		components: {
			'cart-donations-list-table-row': require('./CartDonationsListTableRow.vue')
		}
	};
</script>
<!--
  ~ Copyright (C) 2017  Firespring
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
                                       v-on:removeCartItem="removeCartItem" v-on:updateCartItem="updateCartItem"></cart-donations-list-table-row>
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
				vue.cartItems = _.reject(vue.cartItems, { timestamp: timestamp });
			},
			updateCartItem: function (timestamp, amount) {
				const vue = this;

				const cartItem = _.find(vue.cartItems, { timestamp: timestamp });
				cartItem.amount = amount;

				vue.$store.commit('updateCartItem', {
					timestamp: timestamp,
					amount: amount
				});

				vue.bus.$emit('updateCartItems');
				vue.bus.$emit('updateCartItemsCount');
				vue.bus.$emit('updateCartItemsCounter');
			}
		},
        components: {
        	'cart-donations-list-table-row': require('./CartDonationsListTableRow.vue')
        }
	};
</script>
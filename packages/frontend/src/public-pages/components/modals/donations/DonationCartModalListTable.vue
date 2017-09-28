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

        <tbody>
        <donation-cart-modal-list-table-row v-for="(cartItem, index) in cartItems" :amount="cartItem.amount" :timestamp="cartItem.timestamp" :nonprofit="cartItem.nonprofit" :key="index"
                                            v-on:removeCartItem="removeCartItem"></donation-cart-modal-list-table-row>
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
			    vue.cartItems = _.remove(vue.cartItems, { timestamp: timestamp });
            },
        },
        components: {
    		'donation-cart-modal-list-table-row': require('./DonationCartModalListTableRow.vue')
        }
    };
</script>
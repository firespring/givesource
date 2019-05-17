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
            <th class="width-100">Nonprofit Name</th>
            <th>Amount</th>
            <th></th>
        </tr>
        </thead>

        <tbody v-if="cartItems.length">
        <donation-cart-modal-list-table-row v-for="(cartItem, index) in cartItems" :amount="cartItem.amount" :timestamp="cartItem.timestamp" :nonprofit="cartItem.nonprofit"
                                            :key="cartItem.timestamp" :index="index" v-on:removeCartItem="removeCartItem" v-on:updateCartItem="updateCartItem"
                                            v-on:hasError="hasError"></donation-cart-modal-list-table-row>
        </tbody>

        <tbody v-else>
        <tr>
            <td colspan="3" class="text-c">
                <p>
                    <strong>You haven't added any donations yet.</strong>
                </p>
                <p>
                    <a v-on:click.prevent="findNonprofit" href="#" class="btn btn--accent">Find a Nonprofit to Help</a>
                </p>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
	import * as Utils from './../../../helpers/utils';
	import ComponentDonationCartModalListTableRow from './DonationCartModalListTableRow.vue';

	export default {
		data() {
			return {
				cartItems: [],
			};
		},
		created() {
			const vm = this;

			vm.cartItems = vm.$store.state.cartItems;
			vm.cartItems.sort((a, b) => {
				return a.timestamp - b.timestamp;
			});
		},
		methods: {
			removeCartItem(index) {
				this.cartItems.splice(index, 1);
			},
			updateCartItem(index, amount) {
				const vm = this;

				const item = vm.cartItems[index];
				item.amount = amount;

				vm.$set(vm.cartItems, index, item);
				vm.$store.commit('updateCartItem', {
					timestamp: item.timestamp,
					amount: item.amount
				});

				if (!Utils.isInternetExplorer()) {
					vm.bus.$emit('updateCartItems');
				}
			},
			findNonprofit() {
				this.$emit('findNonprofit');
			},
			hasError(hasError) {
				this.$emit('hasError', hasError);
			}
		},
		components: {
			'donation-cart-modal-list-table-row': ComponentDonationCartModalListTableRow
		}
	};
</script>
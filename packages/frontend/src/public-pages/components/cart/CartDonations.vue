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
    <fieldset>
        <legend>Your Current Donations</legend>

        <div class="form-item">
            <cart-donations-list-table v-on:hasError="hasError"></cart-donations-list-table>
        </div>

        <div class="cart-totals" v-if="displayTotal">
            <div class="cart-totals__subtotal">
                Your donation subtotal is <strong>{{ subtotal }}</strong>. (
                <router-link :to="{ name: 'search-results' }">Find another nonprofit to help</router-link>
                )
            </div>
            <div class="cart-totals__transaction-fees">
                <div>
                    <label class="checkbox-solo">
                        <input v-model="localValue" type="checkbox" name="coverDonationFees" id="coverDonationFees">
                        <span>I want to cover the <strong>{{ fees }}</strong> transaction cost so 100% of my donation goes to the organization(s).</span>
                    </label>
                </div>
            </div>
            <div class="cart-totals__total">
                <strong>Your total payment will be {{ total }}.</strong>
            </div>
        </div>

    </fieldset>
</template>

<script>
	import {mapState} from 'vuex';
	import ComponentCartDonationsListTable from './CartDonationsListTable.vue';

	export default {
		data() {
			return {
				localValue: this.value,

				donationFees: 0,
				donationSubtotal: 0,
			};
		},
		computed: {
			...mapState({
				cartItems: state => state.cartItems,
			}),
			donationTotal() {
				const vm = this;

				if (vm.localValue) {
					return this.donationFees + this.donationSubtotal;
				} else {
					return this.donationSubtotal;
				}
			},
			fees() {
				const fees = JSON.parse(JSON.stringify(this.donationFees));
				return this.formatMoney(fees);
			},
			subtotal() {
				const subtotal = JSON.parse(JSON.stringify(this.donationSubtotal));
				return this.formatMoney(subtotal);
			},
			total() {
				const total = JSON.parse(JSON.stringify(this.donationTotal));
				return this.formatMoney(total);
			}
		},
		props: {
			value: {},
			displayTotal: {
				type: Boolean,
				default: false
			}
		},
		created() {
			const vm = this;

			vm.updateDonationsSubtotal();
		},
		watch: {
			cartItems() {
				this.updateDonationsSubtotal();
			},
			localValue(value, oldValue) {
				const vm = this;
				if (value === oldValue) {
					return;
				}
				vm.$emit('input', value);
			},
			value(value, oldValue) {
				const vm = this;
				if (value === oldValue) {
					return;
				}
				vm.localValue = value;
			},
		},
		methods: {
			updateDonationsSubtotal() {
				const vm = this;

				if (vm.cartItems.length) {
					vm.donationFees = vm.calculateFees(vm.cartItems);
					vm.donationSubtotal = 0;
					vm.cartItems.forEach(cartItem => {
						vm.donationSubtotal += cartItem.amount;
					});
				} else {
					vm.donationFees = 0;
					vm.donationSubtotal = 0;
				}
			},
			hasError(hasError) {
				this.$emit('hasError', hasError);
			},
		},
		components: {
			'cart-donations-list-table': ComponentCartDonationsListTable,
		}
	};
</script>
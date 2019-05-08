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
    <div class="donation-overlay" :style="{ 'z-index': zIndex }" :class="{'donation-overlay--has-tiers': displayDonationTiers}">
        <div class="donation-overlay__wrapper" v-if="loaded">
            <div class="donation-modal donation-modal--options" ref="donationModalOptions">

                <header class="donation-modal__header" v-if="displayDonationTiers">
                    <h1 class="donation-modal__title">Pick a Donation Amount</h1>
                </header>

                <header class="donation-modal__header" v-else>
                    <h1 class="donation-modal__title">Enter a Donation Amount</h1>
                </header>


                <div class="donation-modal__content">
                    <div class="donation-options" v-if="displayDonationTiers">
                        <donation-tiers-option-row v-for="donationTier in donationTiers" :donationTier="donationTier" :key="donationTier.uuid" v-on:selectTier="selectTier">
                        </donation-tiers-option-row>
                    </div>

                    <div class="donation-options-custom">
                        <h2 v-if="displayDonationTiers">Or Enter a Custom Amount</h2>
                        <form v-on:submit.prevent="customAmount">
                            <div class="input">
                                <forms-money v-model="formData.customAmount" name="customAmount" id="customAmount" placeholder="Enter Amount"
                                             :hasError="formErrors.hasOwnProperty('customAmount')"></forms-money>
                            </div>
                            <div class="action">
                                <button class="btn"><i class="fas fa-arrow-right" aria-hidden="true"></i></button>
                            </div>
                        </form>
                        <div v-if="formErrors.customAmount" class="notes notes--below notes--error">
                            A custom donation amount must be at least $10.00
                        </div>
                    </div>
                </div>

                <a v-on:click.prevent="close" href="#" class="donation-close" role="button"><i class="fas fa-times-circle" aria-hidden="true"></i></a>
            </div>
        </div>

        <div class="donation-overlay__wrapper" v-else>
            <layout-spinner></layout-spinner>
        </div>

    </div>
</template>

<script>
	import * as Utils from './../../../helpers/utils';
	import ComponentDonationTiersModalOptionRow from './DonationTiersModalOptionRow.vue';
	import ComponentMoney from './../../forms/Money.vue';
	import ComponentSpinner from './../../layout/Spinner.vue';

	export default {
		data() {
			return {
				donationTiers: [],
				nonprofit: null,
				loaded: false,

				// Form Data
				formData: {
					customAmount: '',
				},
				formErrors: {},

				currencyOptions: {
					precision: 2,
					masked: true,
					thousands: '',
				}
			};
		},
		computed: {
			displayDonationTiers() {
				return this.donationTiers.length;
			},
		},
		props: {
			data: {
				type: Object,
				default: {
					nonprofit: null,
				}
			},
			zIndex: {
				type: [Number, String],
				default: 1000
			}
		},
		created() {
			const vm = this;

			vm.addBodyClasses('has-donation-overlay');
			vm.nonprofit = vm.data.nonprofit;
			axios.get(API_URL + 'nonprofits/' + vm.nonprofit.uuid + '/tiers').then(response => {
				response.data.sort((a, b) => {
					return b.amount - a.amount;
				});
				vm.donationTiers = response.data;
				vm.loaded = true;
			});
		},
		watch: {
			formData: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors).length) {
						vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					customAmount: {
						presence: true,
						numericality: {
							greaterThanOrEqualTo: 10,
						}
					},
				};
			},
			close() {
				const vm = this;

				vm.removeModal('donation-tiers');
				vm.removeBodyClasses('has-donation-overlay');
			},
			selectTier(amount) {
				const vm = this;

				vm.$store.commit('addCartItem', {
					amount: amount,
					nonprofit: vm.nonprofit
				});

				$(vm.$refs.donationModalOptions).fadeOut(() => {
					vm.removeModal('donation-tiers');
					vm.removeBodyClasses('has-donation-overlay');
					vm.addModal('donation-cart');
				});
			},
			customAmount() {
				const vm = this;

				const amount = Math.round(parseFloat(vm.formData.customAmount) * 100);
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());

				if (amount && !Object.keys(vm.formErrors).length) {
					vm.$store.commit('addCartItem', {
						amount: amount,
						nonprofit: vm.nonprofit
					});

					if (!Utils.isInternetExplorer()) {
						vm.bus.$emit('updateCartItems');
					}

					$(vm.$refs.donationModalOptions).fadeOut(() => {
						vm.removeModal('donation-tiers');
						vm.removeBodyClasses('has-donation-overlay');
						vm.addModal('donation-cart');
					});
				}
			}
		},
		components: {
			'donation-tiers-option-row': ComponentDonationTiersModalOptionRow,
			'forms-money': ComponentMoney,
			'layout-spinner': ComponentSpinner,
		}
	}
</script>
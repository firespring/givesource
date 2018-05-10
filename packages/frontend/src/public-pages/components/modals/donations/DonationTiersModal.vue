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
                        <form v-on:submit="customAmount">
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

                <a v-on:click="close" href="#" class="donation-close" role="button"><i class="fas fa-times-circle" aria-hidden="true"></i></a>
            </div>
        </div>

        <div class="donation-overlay__wrapper" v-else>
            <layout-spinner></layout-spinner>
        </div>

    </div>
</template>

<script>
    import * as Utils from './../../../helpers/utils';

	module.exports = {
		data: function () {
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
			displayDonationTiers: function () {
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
		created: function () {
			const vue = this;

			vue.addBodyClasses('has-donation-overlay');
			vue.nonprofit = vue.data.nonprofit;
			axios.get(API_URL + 'nonprofits/' + vue.nonprofit.uuid + '/tiers').then(function (response) {
				response.data.sort(function (a, b) {
					return b.amount - a.amount;
				});
				vue.donationTiers = response.data;
				vue.loaded = true;
			});
		},
		watch: {
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors).length) {
						vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints: function () {
				return {
					customAmount: {
						presence: true,
						numericality: {
							greaterThanOrEqualTo: 10,
						}
					},
				};
			},
			close: function (event) {
				event.preventDefault();
				const vue = this;

				vue.removeModal('donation-tiers');
				vue.removeBodyClasses('has-donation-overlay');
			},
			selectTier: function (amount) {
				const vue = this;

				vue.$store.commit('addCartItem', {
					amount: amount,
					nonprofit: vue.nonprofit
				});

				$(vue.$refs.donationModalOptions).fadeOut(function () {
					vue.removeModal('donation-tiers');
					vue.removeBodyClasses('has-donation-overlay');
					vue.addModal('donation-cart');
				});
			},
			customAmount: function (event) {
				event.preventDefault();
				const vue = this;

				const amount = Math.round(parseFloat(vue.formData.customAmount) * 100);
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());

				if (amount && !Object.keys(vue.formErrors).length) {
					vue.$store.commit('addCartItem', {
						amount: amount,
						nonprofit: vue.nonprofit
					});

					if (!Utils.isInternetExplorer()) {
						vue.bus.$emit('updateCartItems');
                    }

					$(vue.$refs.donationModalOptions).fadeOut(function () {
						vue.removeModal('donation-tiers');
						vue.removeBodyClasses('has-donation-overlay');
						vue.addModal('donation-cart');
					});
				}
			}
		},
		components: {
			'donation-tiers-option-row': require('./DonationTiersModalOptionRow.vue'),
			'forms-money': require('./../../forms/Money.vue'),
			'layout-spinner': require('./../../layout/Spinner.vue'),
		}
	}
</script>
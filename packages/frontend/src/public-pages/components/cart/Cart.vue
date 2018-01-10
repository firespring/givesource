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
    <div>
        <layout-hero>
            <h1 slot="title">Your Donations</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <form v-on:submit="submit">
                    <cart-donations v-model="formData.isFeeCovered" :displayTotal="!isCartEmpty"></cart-donations>

                    <fieldset v-if="!isCartEmpty">
                        <legend>Your Contact & Billing Info</legend>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="donorNameFirst">Your Name</label>
                            </div>
                            <div class="form-item__control">
                                <div class="grid">
                                    <div class="grid-item">
                                        <input v-model="donor.firstName" type="text" name="donorNameFirst" id="donorNameFirst" placeholder="First Name"
                                               :class="{'has-error': formErrors.donor.firstName}">
                                    </div>
                                    <div class="grid-item">
                                        <input v-model="donor.lastName" type="text" name="donorNameLast" id="donorNameLast" placeholder="Last Name"
                                               :class="{'has-error': formErrors.donor.lastName}">
                                    </div>
                                </div>
                                <div v-if="formErrors.donor.firstName || formErrors.donor.lastName" class="notes notes--below notes--error">
                                    Enter your first name and last name
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="donorEmail">Your Email</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="donor.email" type="email" name="donorEmail" id="donorEmail" :class="{'has-error': formErrors.donor.email}">
                                <div v-if="formErrors.donor.email" class="notes notes--below notes--error">
                                    {{ formErrors.donor.email }}
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--address form-item--required">
                            <div class="form-item__label">
                                <label for="billingAddress1">Your Billing Address</label>
                            </div>
                            <div class="form-item__control">

                                <div class="address1">
                                    <input v-model="donor.address1" type="text" name="billingAddress1" id="billingAddress1" placeholder="Address Line 1"
                                           :class="{'has-error': formErrors.donor.address1}">
                                    <div v-if="formErrors.donor.address1" class="notes notes--below notes--error">
                                        {{ formErrors.donor.address1 }}
                                    </div>
                                </div>

                                <div class="address2">
                                    <input v-model="donor.address2" type="text" name="billingAddress2" id="billingAddress2" placeholder="Address Line 2"
                                           :class="{'has-error': formErrors.donor.address2}">
                                    <div v-if="formErrors.donor.address2" class="notes notes--below notes--error">
                                        {{ formErrors.donor.address2 }}
                                    </div>
                                </div>

                                <div class="city-state-zip">
                                    <div class="city-state-zip__city">
                                        <input v-model="donor.city" type="text" name="billingCity" id="billingCity" placeholder="City"
                                               :class="{'has-error': formErrors.donor.city}">
                                    </div>
                                    <div class="city-state-zip__state select-wrap">
                                        <forms-address-state v-model="donor.state" name="billingState" id="billingState" placeholder="State"></forms-address-state>
                                    </div>
                                    <div class="city-state-zip__zip">
                                        <input v-model="donor.zip" type="text" name="billingZip" id="billingZip" placeholder="ZIP" :class="{'has-error': formErrors.donor.zip}">
                                    </div>
                                </div>
                                <div v-if="formErrors.donor.city || formErrors.donor.state || formErrors.donor.zip" class="notes notes--below notes--error">
                                    Enter your city, state and zip code
                                </div>

                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="billingPhone">Your Billing Phone</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="donor.phone" type="tel" name="billingPhone" id="billingPhone" :class="{'has-error': formErrors.donor.phone}">
                                <div v-if="formErrors.donor.phone" class="notes notes--below notes--error">
                                    {{ formErrors.donor.phone }}
                                </div>
                            </div>
                        </div>

                        <hr>

                        <div class="form-item">
                            <div class="form-item__label">
                                Do you want your donation to be anonymous?
                            </div>
                            <div class="form-item__control">
                                <label class="checkbox-solo">
                                    <input v-model="formData.isAnonymous" type="checkbox" name="coverDonationFees" id="coverDonationFees-1">
                                    <span>Yes, make my donation anonymous</span>
                                </label>
                                <div class="notes notes--below">
                                    The nonprofit(s) you donate to won't receive your contact info but it will still be sent to Give To Our City for tax purposes.
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset v-if="!isCartEmpty">
                        <legend>Your Payment Info</legend>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="cc_num">Credit Card #</label>
                            </div>
                            <div class="form-item__control">
                                <forms-payment-cc-number v-model="paymentDetails.ccNumber" name="cc_num" id="cc_num"
                                                         :hasError="formErrors.paymentDetails.ccNumber"></forms-payment-cc-number>
                                <div v-if="formErrors.paymentDetails.ccNumber" class="notes notes--below notes--error">
                                    {{ formErrors.paymentDetails.ccNumber }}
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="cc_name">Name on Card</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="paymentDetails.ccName" type="text" name="cc_name" id="cc_name" :class="{'has-error': formErrors.paymentDetails.ccName}">
                                <div v-if="formErrors.paymentDetails.ccName" class="notes notes--below notes--error">
                                    {{ formErrors.paymentDetails.ccName }}
                                </div>
                            </div>
                        </div>

                        <div class="form-item">
                            <div class="grid">

                                <div class="grid-item grid-item--collapse">

                                    <div class="form-item form-item--required">
                                        <div class="form-item__label">
                                            <label for="cc_exp_month">Expiration Date</label>
                                        </div>
                                        <div class="form-item__control" style="display: flex;">
                                            <div class="select-wrap" style="margin: 0 .5rem 0 0;">
                                                <forms-payment-cc-month v-model="paymentDetails.ccExpMonth" id="cc_exp_month" name="cc_exp_month"></forms-payment-cc-month>
                                            </div>

                                            <div class="select-wrap">
                                                <forms-payment-cc-year v-model="paymentDetails.ccExpYear" id="cc_exp_year" name="cc_exp_year" :years="10"></forms-payment-cc-year>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="grid-item">

                                    <div class="form-item form-item--required">
                                        <div class="form-item__label">
                                            <label for="cc_csc">Security Code</label>
                                        </div>
                                        <div class="form-item__control">
                                            <forms-payment-cc-security-code v-model="paymentDetails.ccCvv" name="cc_csc" id="cc_csc"
                                                                            :hasError="formErrors.paymentDetails.ccCvv"></forms-payment-cc-security-code>
                                            <div v-if="formErrors.paymentDetails.ccCvv" class="notes notes--below notes--error">
                                                {{ formErrors.paymentDetails.ccCvv }}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </fieldset>

                    <div class="form-actions flex justify-center items-center" v-if="!isCartEmpty">
                        <forms-submit :processing="processing" color="green" size="lg">Complete Your Donation</forms-submit>
                    </div>

                </form>

            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	import * as Utils from './../../helpers/utils';

	module.exports = {
		data: function () {
			return {
				isCartEmpty: true,
				processing: false,

				settings: [],
				donations: [],

				// Form Data
				formData: {
					isFeeCovered: false,
					isAnonymous: false,
				},

				// Donor
				donor: {
					address1: '',
					address2: '',
					city: '',
					email: '',
					firstName: '',
					lastName: '',
					phone: '',
					state: '',
					zip: '',
				},

				// Payment Details
				paymentDetails: {
					ccNumber: '',
					ccExpMonth: '',
					ccExpYear: '',
					ccName: '',
					ccCvv: '',
				},

				// Errors
				formErrors: {
					donor: {},
					formData: {},
					paymentDetails: {},
				}
			};
		},
		created: function () {
			const vue = this;

			vue.isCartEmpty = !vue.$store.state.cartItems.length;
			vue.bus.$on('updateCartItemsCount', function () {
				vue.isCartEmpty = !vue.$store.state.cartItems.length;
			});
		},
		beforeDestroy: function () {
			const vue = this;

			vue.bus.$off('updateCartItemsCount');
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Your Donations');
		},
		watch: {
			donor: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors.donor).length) {
						vue.formErrors.donor = vue.validate(vue.donor, vue.getDonorConstraints());
					}
				},
				deep: true
			},
			formData: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors.formData).length) {
						vue.formErrors.formData = vue.validate(vue.formData, vue.getFormDataConstraints());
					}
				},
				deep: true
			},
			paymentDetails: {
				handler: function () {
					const vue = this;
					if (Object.keys(vue.formErrors.paymentDetails).length) {
						vue.formErrors.paymentDetails = vue.validate(vue.paymentDetails, vue.getPaymentDetailsConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getDonorConstraints: function () {
				return {
					address1: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your address'
						},
					},
					address2: {
						presence: false,
					},
					city: {
						presence: true,
					},
					email: {
						label: '',
						presence: {
							allowEmpty: false,
                            message: 'Enter your email'
                        },
						email: {
							message: 'The email entered is not valid'
                        },
					},
					firstName: {
						presence: true,
					},
					lastName: {
						presence: true,
					},
					phone: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your phone number'
						},
					},
					state: {
						presence: true,
					},
					zip: {
						presence: true,
					},
				};
			},
			getFormDataConstraints: function () {
				return {
					isFeeCovered: {
						presence: false,
					},
					isAnonymous: {
						presence: false,
					}
				};
			},
			getPaymentDetailsConstraints: function () {
				return {
					ccNumber: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your credit card number'
						},
						ccNumber: {
							message: 'The credit card number entered is not valid'
						},
					},
					ccExpMonth: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your card\'s expiration month'
						},
					},
					ccExpYear: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your card\'s expiration year'
						},
					},
					ccName: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter the name on your card'
						},
					},
					ccCvv: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your card\'s security code'
						},
						ccCvv: {
							message: 'The security code entered is not valid'
						},
					},
				};
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.processing = true;
				vue.formErrors.donor = vue.validate(vue.donor, vue.getDonorConstraints());
				vue.formErrors.formData = vue.validate(vue.formData, vue.getFormDataConstraints());
				vue.formErrors.paymentDetails = vue.validate(vue.paymentDetails, vue.getPaymentDetailsConstraints());

				if (Object.keys(vue.formErrors.donor).length || Object.keys(vue.formErrors.formData).length || Object.keys(vue.formErrors.paymentDetails).length) {
					console.log(vue.formErrors);
					vue.processing = false;
				} else {
					vue.processDonations();
				}
			},
			processDonations: function () {
				const vue = this;

				vue.getPaymentToken().then(function (response) {
					const payment = response.data;
					payment.is_test_mode = !_.find(vue.settings, {key: 'PAYMENT_SPRING_LIVE_MODE'}).value;
					return axios.post(API_URL + 'donations/process', {
						donor: vue.donor,
						donations: vue.getDonations(),
						payment: payment,
					});
				}).then(function (response) {
					vue.processing = false;
					if (response.data && response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$store.commit('clearCartItems');
						vue.bus.$emit('updateCartItems');
						vue.bus.$emit('updateCartItemsCount');
						vue.bus.$emit('updateCartItemsCounter');

						vue.$router.push({name: 'cart-response'});
					}
				}).catch(function (err) {
					console.log(err);
					vue.processing = false;
				});
			},
			getDonations: function () {
				const vue = this;

				vue.donations = [];
				const cartItems = vue.$store.getters.cartItems;
				cartItems.forEach(function (cartItem) {
					const fees = vue.calculateFees([cartItem], 30, 0.029);
					const total = vue.formData.isFeeCovered ? (cartItem.amount + fees) : cartItem.amount;
					vue.donations.push({
						fees: fees,
						isAnonymous: vue.formData.isAnonymous,
						isFeeCovered: vue.formData.isFeeCovered,
						isOfflineDonation: false,
						nonprofitUuid: cartItem.nonprofit.uuid,
						subtotal: cartItem.amount,
						total: total
					});
				});

				return vue.donations;
			},
			getApiKey: function () {
				const vue = this;

				const keys = [
					'PAYMENT_SPRING_PUBLIC_API_KEY',
					'PAYMENT_SPRING_TEST_PUBLIC_API_KEY',
					'PAYMENT_SPRING_LIVE_MODE'
				];
				return axios.get(API_URL + 'settings' + Utils.generateQueryString({
					keys: keys
				})).then(function (response) {
					vue.settings = response.data;

					const paymentMode = _.find(vue.settings, {key: 'PAYMENT_SPRING_LIVE_MODE'});
					const publicApiKey = _.find(vue.settings, {key: 'PAYMENT_SPRING_PUBLIC_API_KEY'});
					const testPublicApiKey = _.find(vue.settings, {key: 'PAYMENT_SPRING_TEST_PUBLIC_API_KEY'});

					if (paymentMode && paymentMode.value === true && publicApiKey.value) {
						return Promise.resolve(publicApiKey.value);
					}

					if (paymentMode && paymentMode.value === false && testPublicApiKey.value) {
						return Promise.resolve(testPublicApiKey.value);
					}

					return Promise.reject(new Error('There was an error processing your payment.'));
				});
			},
			getPaymentToken: function () {
				const vue = this;

				const params = {
					card_number: vue.paymentDetails.ccNumber.replace(/\s/g, ''),
					card_exp_month: vue.paymentDetails.ccExpMonth,
					card_exp_year: vue.paymentDetails.ccExpYear.toString(),
					card_owner_name: vue.paymentDetails.ccName,
					csc: vue.paymentDetails.ccCvv,
					token_type: 'credit_card',
					zip: vue.donor.zip
				};
				return vue.getApiKey().then(function (publicKey) {
					params['username'] = publicKey;
					return axios.post('https://api.paymentspring.com/api/v1/tokens', params, {
						auth: {
							username: publicKey,
							password: ''
						}
					});
				});
			}
		},
		components: {
			'cart-donations': require('./CartDonations.vue'),
			'forms-address-state': require('../forms/AddressState.vue'),
			'forms-payment-cc-month': require('../forms/PaymentCCMonth.vue'),
			'forms-payment-cc-number': require('../forms/PaymentCCNumber.vue'),
			'forms-payment-cc-security-code': require('../forms/PaymentCCSecurityCode.vue'),
			'forms-payment-cc-year': require('../forms/PaymentCCYear.vue'),
			'forms-submit': require('../forms/Submit.vue'),
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('./../layout/Hero.vue'),
			'layout-sponsors': require('./../layout/Sponsors.vue'),
		}
	};
</script>
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
    <div>
        <layout-header></layout-header>

        <layout-hero>
            <h1 slot="title">Your Donations</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">
                <api-error v-model="apiError"></api-error>

                <form v-on:submit.prevent="submit">
                    <cart-donations v-model="formData.isFeeCovered" :displayTotal="!isCartEmpty" v-on:hasError="donationHasErrors"></cart-donations>

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
                                Do you want your gift(s) to be anonymous?
                            </div>
                            <div class="form-item__control">
                                <label class="checkbox-solo">
                                    <input v-model="formData.isAnonymous" type="checkbox" name="coverDonationFees" id="coverDonationFees-1">
                                    <span>Yes, make my gift(s) anonymous</span>
                                </label>
                                <div class="notes notes--below">
                                    Your name and contact information will not be shared with the designated nonprofits.
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
                                                         :hasError="formErrors.paymentDetails.hasOwnProperty('ccNumber')"></forms-payment-cc-number>
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
                                <input v-model="paymentDetails.ccName" type="text" name="cc_name" id="cc_name"
                                       :class="{'has-error': formErrors.paymentDetails.hasOwnProperty('ccName')}">
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
                                                                            :hasError="formErrors.paymentDetails.hasOwnProperty('ccCvv')"></forms-payment-cc-security-code>
                                            <div v-if="formErrors.paymentDetails.ccCvv" class="notes notes--below notes--error">
                                                {{ formErrors.paymentDetails.ccCvv }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </fieldset>

                    <div v-html="text" style="margin: 0 0 1.5rem;"></div>

                    <div class="form-actions flex justify-center items-center" v-if="!isCartEmpty">
                        <forms-submit :processing="processing" color="accent" size="lg">Complete Your Donation</forms-submit>
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
	import * as Settings from './../../helpers/settings';
	import * as Utils from './../../helpers/utils';
	import ComponentAddressState from './../forms/AddressState.vue';
	import ComponentCartDonations from './CartDonations.vue';
	import ComponentFooter from './../layout/Footer.vue';
	import ComponentHeader from './../layout/Header.vue';
	import ComponentHero from './../layout/Hero.vue';
	import ComponentPaymentCCMonth from './../forms/PaymentCCMonth.vue';
	import ComponentPaymentCCNumber from './../forms/PaymentCCNumber.vue';
	import ComponentPaymentCCSecurityCode from './../forms/PaymentCCSecurityCode.vue';
	import ComponentPaymentCCYear from './../forms/PaymentCCYear.vue';
	import ComponentSponsors from './../layout/Sponsors.vue';
	import ComponentSubmit from './../forms/Submit.vue';

	export default {
		data() {
			return {
				processing: false,
				donationError: false,

				settings: [],
				donations: [],
				contents: [],

				// Form Data
				formData: {
					isFeeCovered: true,
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
				},
				apiError: {},
			};
		},
		computed: {
			text() {
				const text = _.find(this.contents, {key: 'CART_CHECKOUT_TEXT'});
				return text ? text.value : null;
			},
			eventTitle() {
				return Settings.eventTitle();
			},
			isCartEmpty() {
				return this.$store.state.cartItems.length === 0;
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'CART_CHECKOUT_TEXT',
				})).then(response => {
					vm.contents = response.data;
				}).catch(err => {
					vm.apiError = err.response.data.errors;
				});
			});
		},
		beforeRouteUpdate(to, from, next) {
			const vm = this;

			axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: 'CART_CHECKOUT_TEXT',
			})).then(response => {
				vm.contents = response.data;
				next();
			}).catch(err => {
				vm.apiError = err.response.data.errors;
				next();
			});
		},
		beforeMount() {
			const vm = this;

			vm.setBodyClasses('page');
			vm.setPageTitle(vm.eventTitle + ' - Your Donations');
		},
		watch: {
			donor: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors.donor).length) {
						vm.formErrors.donor = vm.validate(vm.donor, vm.getDonorConstraints());
					}
				},
				deep: true
			},
			formData: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors.formData).length) {
						vm.formErrors.formData = vm.validate(vm.formData, vm.getFormDataConstraints());
					}
				},
				deep: true
			},
			paymentDetails: {
				handler() {
					const vm = this;
					if (Object.keys(vm.formErrors.paymentDetails).length) {
						vm.formErrors.paymentDetails = vm.validate(vm.paymentDetails, vm.getPaymentDetailsConstraints());
					}
				},
				deep: true
			}
		},
		methods: {
			getDonorConstraints() {
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
			getFormDataConstraints() {
				return {
					isFeeCovered: {
						presence: false,
					},
					isAnonymous: {
						presence: false,
					}
				};
			},
			getPaymentDetailsConstraints() {
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
			submit() {
				const vm = this;

				vm.processing = true;
				vm.formErrors.donor = vm.validate(vm.donor, vm.getDonorConstraints());
				vm.formErrors.formData = vm.validate(vm.formData, vm.getFormDataConstraints());
				vm.formErrors.paymentDetails = vm.validate(vm.paymentDetails, vm.getPaymentDetailsConstraints());

				if (vm.donationError) {
					$('table.table-donations')[0].scrollIntoView(true);
					vm.processing = false;
				} else if (Object.keys(vm.formErrors.donor).length || Object.keys(vm.formErrors.formData).length || Object.keys(vm.formErrors.paymentDetails).length) {
					vm.scrollToError();
					vm.processing = false;
				} else {
					vm.processDonations();
				}
			},
			processDonations() {
				const vm = this;

				vm.getPaymentToken().then(response => {
					const payment = response.data;
					const mode = _.find(vm.settings, {key: 'PAYMENT_SPRING_LIVE_MODE'}).value;
					payment.is_test_mode = mode === "0";
					return axios.post(API_URL + 'donations/process', {
						donor: vm.donor,
						donations: vm.getDonations(),
						payment: payment,
					});
				}).then(response => {
					vm.processing = false;

					if (response.data && response.data.errorMessage) {
						console.log(response.data);
						vm.apiError = {'message': response.data.errorMessage, 'type': response.data.errorType};
					} else {
						vm.$store.commit('clearCartItems');
						vm.$router.push({name: 'cart-response'});
					}
				}).catch(err => {
					vm.apiError = err.response.data.errors;
					vm.processing = false;
				});
			},
			getDonations() {
				const vm = this;

				vm.donations = [];
				const cartItems = vm.$store.getters.cartItems;
				cartItems.forEach(cartItem => {
					const fees = vm.calculateFees([cartItem]);
					const total = vm.formData.isFeeCovered ? (cartItem.amount + fees) : cartItem.amount;
					vm.donations.push({
						fees: fees,
						isAnonymous: vm.formData.isAnonymous,
						isFeeCovered: vm.formData.isFeeCovered,
						isOfflineDonation: false,
						nonprofitId: cartItem.nonprofit.id,
						subtotal: cartItem.amount,
						total: total,
						note: cartItem.note
					});
				});

				return vm.donations;
			},
			getApiKey() {
				const vm = this;

				const keys = [
					'PAYMENT_SPRING_PUBLIC_API_KEY',
					'PAYMENT_SPRING_TEST_PUBLIC_API_KEY',
					'PAYMENT_SPRING_LIVE_MODE'
				];
				return axios.get(API_URL + 'settings' + Utils.generateQueryString({
					keys: keys
				})).then(response => {
					vm.settings = response.data;

					const paymentMode = _.find(vm.settings, {key: 'PAYMENT_SPRING_LIVE_MODE'});
					const publicApiKey = _.find(vm.settings, {key: 'PAYMENT_SPRING_PUBLIC_API_KEY'});
					const testPublicApiKey = _.find(vm.settings, {key: 'PAYMENT_SPRING_TEST_PUBLIC_API_KEY'});

					if (paymentMode && paymentMode.value === "1" && publicApiKey.value) {
						return Promise.resolve(publicApiKey.value);
					}

					if (paymentMode && paymentMode.value === "0" && testPublicApiKey.value) {
						return Promise.resolve(testPublicApiKey.value);
					}

					return Promise.reject(new Error('There was an error processing your payment.'));
				}).catch(err => {
					vm.apiError = err.response.data.errors;
				});
			},
			getPaymentToken() {
				const vm = this;

				const params = {
					card_number: vm.paymentDetails.ccNumber.replace(/\s/g, ''),
					card_exp_month: vm.paymentDetails.ccExpMonth,
					card_exp_year: vm.paymentDetails.ccExpYear.toString(),
					card_owner_name: vm.paymentDetails.ccName,
					csc: vm.paymentDetails.ccCvv,
					token_type: 'credit_card',
					zip: vm.donor.zip
				};
				return vm.getApiKey().then(publicKey => {
					params['public_api_key'] = publicKey;
					return axios.get('https://api.paymentspring.com/api/v1/tokens/jsonp' + Utils.generateQueryString(params));
				});
			},
			donationHasErrors(hasError) {
				this.donationError = hasError;
			}
		},
		components: {
			'cart-donations': ComponentCartDonations,
			'forms-address-state': ComponentAddressState,
			'forms-payment-cc-month': ComponentPaymentCCMonth,
			'forms-payment-cc-number': ComponentPaymentCCNumber,
			'forms-payment-cc-security-code': ComponentPaymentCCSecurityCode,
			'forms-payment-cc-year': ComponentPaymentCCYear,
			'forms-submit': ComponentSubmit,
			'layout-footer': ComponentFooter,
			'layout-header': ComponentHeader,
			'layout-hero': ComponentHero,
			'layout-sponsors': ComponentSponsors,
		}
	};
</script>
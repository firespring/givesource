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
    <div class="o-app">
        <navigation></navigation>
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content o-app_main-content--md">
                <div class="o-app-main-content">

                    <div class="o-page-header">
                        <div class="o-page-header__text">
                            <nav class="o-page-header-nav c-breadcrumb">
                                <span><router-link :to="{ name: 'donations-list' }">Donations</router-link></span>
                            </nav>
                            <h1 class="o-page-header-title">Add Offline Donations</h1>
                        </div>
                    </div>

                    <api-error v-model="apiError"></api-error>

                    <form v-on:submit.prevent="submit">
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--headless">
                            <layout-spinner v-if="!loaded" height="496px"></layout-spinner>
                            <div class="c-page-section__main" v-else>

                                <div class="c-form-item c-form-item--select c-form-item--combobox c-form-item--required"
                                     :class="{ 'c-form-item--has-error': formErrors.nonprofitUuid }">
                                    <div class="c-form-item__label">
                                        <label for="nonprofitUuid" class="c-form-item-label-text">Related Nonprofit</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-select-nonprofit v-model="formData.nonprofitUuid" id="nonprofitUuid" name="nonprofitUuid" :nonprofits="nonprofits"
                                                                :hasError="formErrors.hasOwnProperty('nonprofitUuid')"></forms-select-nonprofit>
                                        <div v-if="formErrors.nonprofitUuid" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.nonprofitUuid }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--number c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.subtotal }">
                                    <div class="c-form-item__label">
                                        <label for="donationAmount" class="c-form-item-label-text">Donation Amount</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--dollar">
                                            <input v-model="formData.subtotal" type="text" name="donationAmount" id="donationAmount" style="width: 10rem;"
                                                   :class="{ 'has-error': formErrors.subtotal }" v-money="currencyOptions">
                                        </div>
                                        <div v-if="formErrors.subtotal" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.subtotal }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--radio">
                                    <div class="c-form-item__label">
                                        <div class="c-form-item-label-text" id="radioSubOptionInline">Donation Type</div>
                                    </div>

                                    <div class="c-form-item__control">
                                        <ul class="c-input-list c-input-list--radio c-input-list--inline has-sub-options--show" aria-labelledby="radioSubOptionInline">
                                            <li class="has-sub-options">
                                                <input v-model="formData.type" type="radio" name="donationType" id="donationType-1" value="SINGLE">
                                                <label for="donationType-1">Single Donor</label>
                                            </li>
                                            <li class="has-sub-options has-sub-options--show">
                                                <input v-model="formData.type" type="radio" name="donationType" id="donationType-2" value="BULK">
                                                <label for="donationType-2">Bulk Donation</label>
                                            </li>
                                        </ul>

                                        <div class="sub-options-inline-wrapper sub-options-inline-wrapper--show">
                                            <div id="donationType-1-sub-options" class="sub-options-inline" :class="{'sub-options-inline--show': formData.type === 'SINGLE'}">
                                                <div class="c-form-item c-form-item--text c-form-item--required"
                                                     :class="{ 'c-form-item--has-error': formErrors.firstName || formErrors.lastName }">
                                                    <div class="c-form-item__label">
                                                        <label for="donorNameFirst" class="c-form-item-label-text">Donor Name</label>
                                                    </div>
                                                    <div class="c-form-item__control">
                                                        <div class="c-form-control-grid">
                                                            <div class="c-form-control-grid__item">
                                                                <div class="has-floating-label js-floating-label" v-floating-label>
                                                                    <input v-model="formData.firstName" type="text" name="donorNameFirst" id="donorNameFirst"
                                                                           :class="{ 'has-error': formErrors.firstName }">
                                                                    <label for="donorNameFirst">First Name</label>
                                                                </div>
                                                                <div v-if="formErrors.firstName" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                                    {{ formErrors.firstName }}
                                                                </div>
                                                            </div>
                                                            <div class="c-form-control-grid__item">
                                                                <div class="has-floating-label js-floating-label" v-floating-label>
                                                                    <input v-model="formData.lastName" type="text" name="donorNameLast" id="donorNameLast"
                                                                           :class="{ 'has-error': formErrors.lastName }">
                                                                    <label for="donorNameLast">Last Name</label>
                                                                </div>
                                                                <div v-if="formErrors.lastName" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                                    {{ formErrors.lastName }}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="c-form-item c-form-item--email" :class="{ 'c-form-item--has-error': formErrors.email }">
                                                    <div class="c-form-item__label">
                                                        <label for="donorEmail" class="c-form-item-label-text">Donor Email</label>
                                                    </div>
                                                    <div class="c-form-item__control">
                                                        <div class="u-control-icon u-control-icon--email">
                                                            <input v-model="formData.email" type="email" name="donorEmail" id="donorEmail"
                                                                   :class="{ 'has-error': formErrors.email }">
                                                        </div>
                                                        <div v-if="formErrors.email" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                            {{ formErrors.email }}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="c-form-item c-form-item--control-group c-form-item--control-group--address">
                                                    <div class="c-form-item__label">
                                                        <div class="c-form-item-label-text">Address</div>
                                                    </div>

                                                    <div class="c-form-item__control u-margin-top-thick">
                                                        <div class="c-form-control-grid">
                                                            <div class="c-form-control-grid__item">
                                                                <div class="has-floating-label js-floating-label" v-floating-label>
                                                                    <input v-model="formData.address1" type="text" name="address1" id="address1"
                                                                           :class="{ 'has-error': formErrors.address1 }">
                                                                    <label for="address1">Address Line 1</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="formErrors.address1" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                                            {{ formErrors.address1 }}
                                                        </div>

                                                        <div class="c-form-control-grid">
                                                            <div class="c-form-control-grid__item">
                                                                <div class="has-floating-label js-floating-label" v-floating-label>
                                                                    <input v-model="formData.address2" type="text" name="address2" id="address2"
                                                                           :class="{ 'has-error': formErrors.address2 }">
                                                                    <label for="address2">Address Line 2</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="formErrors.address2" class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                                            {{ formErrors.address2 }}
                                                        </div>

                                                        <div class="c-form-control-grid">
                                                            <div class="c-form-control-grid__item">
                                                                <div class="has-floating-label js-floating-label" v-floating-label>
                                                                    <input v-model="formData.city" type="text" name="city" id="city" :class="{ 'has-error': formErrors.city }">
                                                                    <label for="city">City</label>
                                                                </div>
                                                            </div>
                                                            <div class="c-form-control-grid__item u-flex-collapse" id="addressGroupDefaultCountryOptions-US">
                                                                <state-select v-model="formData.state" name="state" id="state" placeholder="State"
                                                                              :class="{ 'has-error': formErrors.state }"></state-select>
                                                            </div>
                                                            <div class="c-form-control-grid__item" style="flex: 1 0 11rem; max-width: 11rem;">
                                                                <div class="has-floating-label js-floating-label" v-floating-label>
                                                                    <input v-model="formData.zip" type="text" name="zip" id="zip" :class="{ 'has-error': formErrors.zip }">
                                                                    <label for="zip">ZIP Code</label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div v-if="formErrors.city || formErrors.state || formErrors.zip"
                                                             class="c-notes c-notes--below c-notes--bad c-form-control-error u-margin-bottom-thick">
                                                            <span v-if="formErrors.city">{{ formErrors.city }}. </span><span v-if="formErrors.state">{{ formErrors.state }}. </span><span
                                                                v-if="formErrors.zip">{{ formErrors.zip }}.</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div id="donationType-2-sub-options" class="sub-options-inline" :class="{'sub-options-inline--show': formData.type === 'BULK'}">
                                                <div class="c-form-item c-form-item--number c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.count}">
                                                    <div class="c-form-item__label">
                                                        <label for="donationNum" class="c-form-item-label-text"># of Donations</label>
                                                    </div>
                                                    <div class="c-form-item__control">
                                                        <input v-model="formData.count" type="number" name="donationNum" id="donationNum"
                                                               :class="{ 'has-error': formErrors.count }">
                                                    </div>
                                                    <div v-if="formErrors.count" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                                        {{ formErrors.count }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button v-on:click.prevent="save('close')" type="submit" class="c-btn">Save & Finish</button>
                            <button v-on:click.prevent="save('add')" type="submit" class="c-btn">Save & Add Another</button>
                            <router-link :to="{ name: 'donations-list' }" class="c-btn c-btn--text c-btn--neutral">Cancel</router-link>
                        </footer>

                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import ComponentSelectNonprofit from './../../forms/SelectNonprofit.vue';
	import ComponentSpinner from './../../layout/Spinner.vue';
	import ComponentSelectState from './../../forms/SelectState.vue';

	export default {

		data() {
			return {
				nonprofits: [],
				loaded: false,

				currencyOptions: {
					precision: 2,
					masked: true,
					thousands: '',
				},

				// Form Data
				formData: {
					address1: '',
					address2: '',
					city: '',
					count: '',
					email: '',
					firstName: '',
					lastName: '',
					nonprofitUuid: '',
					state: '',
					subtotal: 0,
					type: 'SINGLE',
					zip: ''
				},

				// Errors
				formErrors: {},
				apiError: {}
			};
		},

		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.$request.get('nonprofits/search', {
					status: 'ACTIVE'
				}).then(response => {
					vm.nonprofits = response.data;
					vm.loaded = true;
				});
			});
		},

		beforeRouteUpdate(to, from, next) {
			const vm = this;

			vm.$request.get('nonprofits/search', {
				status: 'ACTIVE'
			}).then(response => {
				vm.nonprofits = response.data;
				vm.loaded = true;
				next();
			}).catch(() => {
				next();
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
				const vm = this;

				const constraints = {
					nonprofitUuid: {
						label: 'Related nonprofit',
						presence: true,
					},
					subtotal: {
						label: 'Donation amount',
						presence: true,
						numericality: {
							greaterThan: 0,
						}
					},
				};

				if (vm.formData.type === 'BULK') {
					constraints['count'] = {
						label: 'Number of donations',
						presence: true,
						numericality: {
							greaterThan: 0,
						}
					};
				}

				if (vm.formData.type === 'SINGLE') {
					constraints['address1'] = {
						label: 'Address line 1',
						presence: false,
					};

					constraints['address2'] = {
						label: 'Address line 2',
						presence: false,
					};

					constraints['city'] = {
						presence: false,
					};

					constraints['email'] = {
						label: 'Donor email address',
						presence: false,
						email: true,
					};

					constraints['firstName'] = {
						label: 'Donor first name',
						presence: true,
					};

					constraints['lastName'] = {
						label: 'Donor last name',
						presence: true,
					};

					constraints['state'] = {
						label: 'Address line 2',
						presence: false,
					};

					constraints['zip'] = {
						label: 'Zip code',
						presence: false,
					};
				}

				return constraints;
			},

			submit() {
				// do nothing
			},

			save(action) {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
				} else {
					vm.addDonation(action);
				}
			},

			addDonation(action) {
				const vm = this;

				const donation = {
					isAnonymous: false,
					isFeeCovered: false,
					isOfflineDonation: true,
					subtotal: vm.getSubtotal(),
					total: vm.getSubtotal(),
					type: vm.formData.type,
				};

				let nonprofit = {};
				let promise = Promise.resolve();
				promise = promise.then(() => {
					return vm.$request.get('nonprofits/' + vm.formData.nonprofitUuid);
				}).then(response => {
					nonprofit = response.data;
					donation['nonprofitLegalName'] = nonprofit.legalName;
					donation['nonprofitAddress1'] = nonprofit.address1;
					donation['nonprofitAddress2'] = nonprofit.address2;
					donation['nonprofitAddress3'] = nonprofit.address3;
					donation['nonprofitCity'] = nonprofit.city;
					donation['nonprofitState'] = nonprofit.state;
					donation['nonprofitZip'] = nonprofit.zip;
				});

				if (vm.formData.type === 'BULK') {
					promise = promise.then(() => {
						donation['count'] = parseInt(vm.formData.count);
						return vm.$request.post('nonprofits/' + nonprofit.uuid + '/donations', donation);
					});
				}

				if (vm.formData.type === 'SINGLE') {
					promise = promise.then(() => {
						const donor = {
							firstName: vm.formData.firstName,
							lastName: vm.formData.lastName,
						};

						if (vm.formData.email) {
							donor.email = vm.formData.email;
						}

						if (vm.formData.address1) {
							donor.address1 = vm.formData.address1;
						}

						if (vm.formData.address2) {
							donor.address2 = vm.formData.address2;
						}

						if (vm.formData.city) {
							donor.city = vm.formData.city;
						}

						if (vm.formData.state) {
							donor.state = vm.formData.state;
						}

						if (vm.formData.zip) {
							donor.zip = vm.formData.zip;
						}

						return vm.$request.post('donors', donor);

					}).then(response => {
						donation['donorAddress1'] = response.data.address1;
						donation['donorAddress2'] = response.data.address2;
						donation['donorCity'] = response.data.city;
						donation['donorFirstName'] = response.data.firstName;
						donation['donorLastName'] = response.data.lastName;
						donation['donorEmail'] = response.data.email;
						donation['donorState'] = response.data.state;
						donation['donorZip'] = response.data.zip;
						return vm.$request.post('nonprofits/' + nonprofit.uuid + '/donations', donation);
					});
				}

				promise.then(response => {
					vm.clearModals();

					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.c-alert');
					} else {
						if (action === 'add') {
							vm.formData = {
								count: '',
								email: '',
								firstName: '',
								lastName: '',
								nonprofitUuid: '',
								subtotal: 0,
								type: vm.formData.type,
							};
						} else {
							vm.$router.push({name: 'donations-list'});
						}
					}
				}).catch(err => {
					vm.clearModals();
					vm.apiError = err.response.data.errors;
				});
			},

			getSubtotal() {
				return this.formData.subtotal * 100;
			}
		},

		components: {
			'forms-select-nonprofit': ComponentSelectNonprofit,
			'layout-spinner': ComponentSpinner,
			'state-select': ComponentSelectState,
		}
	};
</script>
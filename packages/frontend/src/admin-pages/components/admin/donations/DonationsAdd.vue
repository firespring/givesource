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

                    <form v-on:submit="submit">
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
                                            <li class="has-sub-options has-sub-options--show">
                                                <input v-model="formData.type" type="radio" name="donationType" id="donationType-1" value="BULK">
                                                <label for="donationType-1">Bulk Donation</label>
                                            </li>
                                            <li class="has-sub-options">
                                                <input v-model="formData.type" type="radio" name="donationType" id="donationType-2" value="SINGLE">
                                                <label for="donationType-2">Single Donor</label>
                                            </li>
                                        </ul>

                                        <div class="sub-options-inline-wrapper sub-options-inline-wrapper--show">
                                            <div id="donationType-1-sub-options" class="sub-options-inline" :class="{'sub-options-inline--show': formData.type === 'BULK'}">
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

                                            <div id="donationType-2-sub-options" class="sub-options-inline" :class="{'sub-options-inline--show': formData.type === 'SINGLE'}">
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

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button v-on:click="save('close')" type="submit" class="c-btn">Save & Finish</button>
                            <button v-on:click="save('add')" type="submit" class="c-btn">Save & Add Another</button>
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

	export default {
		data: function () {
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
					count: '',
					email: '',
					firstName: '',
					lastName: '',
					nonprofitUuid: '',
					subtotal: 0,
					type: 'BULK',
				},

				// Errors
				formErrors: {},
				apiError: {}
			};
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				vue.$request.get('nonprofits/search', {
					status: 'ACTIVE'
				}).then(function (response) {
					vue.nonprofits = response.data;
					vue.loaded = true;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			vue.$request.get('nonprofits/search', {
				status: 'ACTIVE'
			}).then(function (response) {
				vue.nonprofits = response.data;
				vue.loaded = true;
				next();
			}).catch(function () {
				next();
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
				const vue = this;

				const constraints = {
					subtotal: {
						label: 'Donation amount',
						presence: true,
						numericality: {
							greaterThan: 0,
						}
					},
					nonprofitUuid: {
						label: 'Related nonprofit',
						presence: true,
					}
				};

				if (vue.formData.type === 'BULK') {
					constraints['count'] = {
						label: 'Number of donations',
						presence: true,
						numericality: {
							greaterThan: 0,
						}
					};
				}

				if (vue.formData.type === 'SINGLE') {
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
				}

				return constraints;
			},
			submit: function (event) {
				event.preventDefault();
			},
			save: function (action) {
				const vue = this;

				vue.addModal('spinner');

				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.clearModals();
				} else {
					vue.addDonation(action);
				}
			},
			addDonation: function (action) {
				const vue = this;

				const donation = {
					isAnonymous: false,
					isFeeCovered: false,
					isOfflineDonation: true,
					subtotal: vue.getSubtotal(),
					total: vue.getSubtotal(),
					type: vue.formData.type,
				};

				let nonprofit = {};
				let promise = Promise.resolve();
				promise = promise.then(function () {
					return vue.$request.get('nonprofits/' + vue.formData.nonprofitUuid);
				}).then(function (response) {
					nonprofit = response.data;
					donation['nonprofitLegalName'] = nonprofit.legalName;
					donation['nonprofitAddress1'] = nonprofit.address1;
					donation['nonprofitAddress2'] = nonprofit.address2;
					donation['nonprofitAddress3'] = nonprofit.address3;
					donation['nonprofitCity'] = nonprofit.city;
					donation['nonprofitState'] = nonprofit.state;
					donation['nonprofitZip'] = nonprofit.zip;
				});

				if (vue.formData.type === 'BULK') {
					promise = promise.then(function () {
						donation['count'] = parseInt(vue.formData.count);
						return vue.$request.post('nonprofits/' + nonprofit.uuid + '/donations', donation);
					});
				}

				if (vue.formData.type === 'SINGLE') {
					promise = promise.then(function () {
						const donor = {
							firstName: vue.formData.firstName,
							lastName: vue.formData.lastName,
						};

						if (vue.formData.email) {
							donor.email = vue.formData.email;
						}

						return vue.$request.post('donors', donor);
					}).then(function (response) {
						donation['donorFirstName'] = response.data.firstName;
						donation['donorLastName'] = response.data.lastName;
						donation['donorEmail'] = response.data.email;
						return vue.$request.post('nonprofits/' + nonprofit.uuid + '/donations', donation);
					});
				}

				promise.then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						if (action === 'add') {
							vue.formData = {
								count: '',
								email: '',
								firstName: '',
								lastName: '',
								nonprofitUuid: '',
								subtotal: 0,
								type: vue.formData.type,
							};
						} else {
							vue.$router.push({name: 'donations-list'});
						}
					}
				}).catch(function (err) {
					vue.clearModals();
					vue.apiError = err.response.data.errors;
				});
			},
			getSubtotal: function () {
				return this.formData.subtotal * 100;
			}
		},
		components: {
			'forms-select-nonprofit': ComponentSelectNonprofit,
			'layout-spinner': ComponentSpinner,
		}
	};
</script>
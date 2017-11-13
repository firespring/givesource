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

                                <div class="c-form-item c-form-item--text c-form-item--required" :class="{ 'c-form-item--has-error': formErrors.firstName || formErrors.lastName }">
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
                                            <input v-model="formData.email" type="email" name="donorEmail" id="donorEmail" :class="{ 'has-error': formErrors.email }">
                                        </div>
                                        <div v-if="formErrors.email" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.email }}
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
	const numeral = require('numeral');

	module.exports = {
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
					subtotal: 0,
					email: '',
					firstName: '',
					lastName: '',
					nonprofitUuid: '',
				},

				// Errors
				formErrors: {}
			};
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				axios.get(API_URL + 'nonprofits').then(function (response) {
					vm.nonprofits = response.data;
					vm.loaded = true;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'nonprofits').then(function (response) {
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
				return {
					subtotal: {
						label: 'Donation amount',
						presence: true,
						numericality: {
							onlyInteger: true,
							greaterThan: 0,
						}
					},
					email: {
						label: 'Donor email address',
						presence: false,
						email: true,
					},
					firstName: {
						label: 'Donor first name',
						presence: true,
					},
					lastName: {
						label: 'Donor last name',
						presence: true,
					},
					nonprofitUuid: {
						label: 'Related nonprofit',
						presence: true,
					},
				};
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

				const donor = {
					firstName: vue.formData.firstName,
					lastName: vue.formData.lastName,
				};
				if (vue.formData.email) {
					donor.email = vue.formData.email;
				}
				axios.post(API_URL + 'donors', donor).then(function (response) {
					if (response.data.errorMessage) {
						return Promise.reject(response.data);
					}
					const donation = {
						donorUuid: response.data.uuid,
						fees: 0,
						isAnonymous: false,
						isFeeCovered: false,
						isOfflineDonation: true,
						nonprofitUuid: vue.formData.nonprofitUuid,
						subtotal: vue.getSubtotal(),
						total: vue.getSubtotal()
					};
					return axios.post(API_URL + 'donations', donation);
				}).then(function (response) {
					vue.clearModals();
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						if (action === 'add') {
							vue.formData = {
								subtotal: 0,
								email: '',
								firstName: '',
								lastName: '',
								nonprofitUuid: ''
							};
						} else {
							vue.$router.push({name: 'donations-list'});
						}
					}
				}).catch(function (err) {
					vue.clearModals();
					console.log(err);
				});
			},
			getSubtotal: function () {
				return this.formData.subtotal * 100;
			}
		},
		components: {
			'forms-select-nonprofit': require('./../../forms/SelectNonprofit.vue'),
			'layout-spinner': require('./../../layout/Spinner.vue')
		}
	};
</script>
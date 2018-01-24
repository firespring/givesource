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
        <layout-hero :presentedBy="true">
            <h1 slot="title">Register for {{ eventTitle }}</h1>
        </layout-hero>

        <main class="main">
            <div v-if="canRegister" class="wrapper wrapper--sm">

                <div v-html="text" style="margin: 0 0 1.5rem;"></div>

                <form v-on:submit="submit">
                    <fieldset>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="legalName">Organization Legal Name</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.legalName" type="text" name="legalName" id="legalName" maxlength="200" :class="{'has-error': formErrors.legalName}">
                                <div v-if="formErrors.legalName" class="notes notes--below notes--error">
                                    {{ formErrors.legalName }}
                                </div>
                            </div>
                        </div>


                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="taxId">Tax ID</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.taxId" type="text" name="taxId" id="taxId" maxlength="200" :class="{'has-error': formErrors.taxId}">
                                <div v-if="formErrors.taxId" class="notes notes--below notes--error">
                                    {{ formErrors.taxId }}
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="firstName">Contact Name</label>
                            </div>
                            <div class="form-item__control">
                                <div class="grid">
                                    <div class="grid-item">
                                        <input v-model="formData.firstName" type="text" name="firstName" id="firstName" maxlength="200" placeholder="First Name"
                                               :class="{'has-error': formErrors.firstName}">
                                    </div>
                                    <div class="grid-item">
                                        <input v-model="formData.lastName" type="text" name="lastName" id="lastName" maxlength="200" placeholder="First Last"
                                               :class="{'has-error': formErrors.lastName}">
                                    </div>
                                </div>
                                <div v-if="formErrors.firstName || formErrors.lastName" class="notes notes--below notes--error">
                                    Enter your first name and last name
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="contactEmail">Contact Email</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.email" type="text" name="email" id="contactEmail" maxlength="200" :class="{'has-error': formErrors.email}">
                                <div v-if="formErrors.email" class="notes notes--below notes--error">
                                    {{ formErrors.email }}
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--address form-item--required">
                            <div class="form-item__label">
                                <label for="address1">Organization Address</label>
                            </div>

                            <div class="form-item__control">


                                <div class="address1">
                                    <input v-model="formData.address1" type="text" name="address1" id="address1" placeholder="Address Line 1"
                                           :class="{'has-error': formErrors.address1}">
                                    <div v-if="formErrors.address1" class="notes notes--below notes--error">
                                        {{ formErrors.address1 }}
                                    </div>
                                </div>


                                <div class="address2">
                                    <input v-model="formData.address2" type="text" name="address2" id="address2" placeholder="Address Line 2">
                                </div>


                                <div class="address3">
                                    <input v-model="formData.address3" type="text" name="address3" id="address3" placeholder="Address Line 3">
                                </div>


                                <div class="city-state-zip">

                                    <div class="city-state-zip__city">
                                        <input v-model="formData.city" type="text" name="city" id="city" maxlength="200" placeholder="City" :class="{'has-error': formErrors.city}">
                                    </div>

                                    <div class="city-state-zip__state select-wrap">
                                        <forms-address-state v-model="formData.state" name="state" id="state" placeholder="State"></forms-address-state>
                                    </div>

                                    <div class="city-state-zip__zip">
                                        <input v-model="formData.zip" type="text" name="zip" id="zip" maxlength="200" placeholder="ZIP" :class="{'has-error': formErrors.zip}">
                                    </div>

                                </div>

                            </div>

                            <div v-if="formErrors.city || formErrors.state || formErrors.zip" class="notes notes--below notes--error">
                                Enter your organization's city, state and zip code
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="phone">Organization Phone Number</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.phone" type="tel" name="phone" id="phone" :class="{'has-error': formErrors.phone}">
                                <div v-if="formErrors.phone" class="notes notes--below notes--error">
                                    {{ formErrors.phone }}
                                </div>

                            </div>
                        </div>

                        <div class="form-item">
                            <div class="form-item__label">
                                Organization Categories (Check up to 3)
                            </div>
                            <div class="form-item__control">
                                <div v-if="formErrors.categories" class="notes notes--above notes--error">
                                    {{ formErrors.categories }}
                                </div>
                                <forms-nonprofit-category v-model="formData.categories"></forms-nonprofit-category>
                            </div>
                        </div>
                    </fieldset>

                    <div class="form-actions flex justify-center items-center">
                        <forms-submit :processing="processing" color="accent">Register Now</forms-submit>
                    </div>
                </form>
            </div>

            <div v-if="!canRegister && isBeforeRegistrationStart" class="wrapper wrapper--sm">
                Registration for {{ eventTitle }} will open on {{ registrationStartDate }}.
                Thank you for your interest in making {{ eventTitle }} a big success!
            </div>

            <div v-if="!canRegister && isAfterRegistrationEnd" class="wrapper wrapper--sm">
                Registration for {{ eventTitle }} is now closed.
                Thank you for your help making {{ eventTitle }} a big success!
            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	import * as Utils from './../../helpers/utils';
	import * as Settings from './../../helpers/settings';

	const moment = require('moment-timezone');

	module.exports = {
		data: function () {
			return {
				contents: [],
				processing: false,

				formData: {
					legalName: '',
					taxId: '',
					address1: '',
					address2: '',
					address3: '',
					city: '',
					state: '',
					zip: '',
					phone: '',
					categories: [],
					firstName: '',
					lastName: '',
					email: '',
				},

				formErrors: {},
			}
		},
		computed: {
			text: function () {
				const text = _.find(this.contents, {key: 'REGISTER_FORM_TEXT'});
				return text ? text.value : null;
			},
			eventTitle: function () {
				return Settings.eventTitle();
			},
			registrationStartDate: function () {
				var vue = this;
				return moment(new Date(vue.$store.getters.setting('DATE_REGISTRATIONS_START'))).tz(vue.$store.getters.setting('EVENT_TIMEZONE')).format('MMMM DDDo YYYY');
			},
			canRegister: function () {
				const vue = this;
				return Settings.isRegistrationActive(vue.settings);
			},
			isAfterRegistrationEnd: function () {
				const vue = this;
				return Settings.isAfterRegistrationEnd(vue.settings);
			},
			isBeforeRegistrationStart: function () {
				const vue = this;
				return Settings.isBeforeRegistrationStart(vue.settings);
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'REGISTER_FORM_TEXT'
				})).then(function (response) {
					vue.contents = response.data;
				});
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: 'REGISTER_FORM_TEXT'
			})).then(function (response) {
				vue.contents = response.data;
				next();
			}).catch(function (err) {
				console.log(err);
				next();
			});
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle(vue.eventTitle + ' - Register');
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
					legalName: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your organization\'s legal name'
						},
					},
					taxId: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your organization\'s tax ID number'
						},
					},
					address1: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your organization\'s address'
						},
					},
					address2: {
						label: 'Address line 2',
						presence: false,
					},
					address3: {
						label: 'Address line 3',
						presence: false,
					},
					categories: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter at least one category for your organization'
						},
						length: {
							minimum: 1,
							maximum: 3,
							tooLong: 'Enter up to three categories for your organization'
						}
					},
					city: {
						presence: true,
					},
					state: {
						presence: true,
					},
					zip: {
						label: 'Zip',
						presence: true,
					},
					phone: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your organization\'s phone number'
						},
					},
					firstName: {
						presence: true,
					},
					lastName: {
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
				}
			},
			submit: function (event) {
				event.preventDefault();
				const vue = this;

				vue.processing = true;
				vue.formErrors = vue.validate(vue.formData, vue.getConstraints());
				if (Object.keys(vue.formErrors).length) {
					vue.processing = false;
				} else {
					vue.registerNonprofit();
				}
			},
			registerNonprofit: function () {
				const vue = this;

				axios.post(API_URL + 'nonprofits/register', {
					nonprofit: {
						legalName: vue.formData.legalName,
						taxId: vue.formData.taxId,
						address1: vue.formData.address1,
						address2: vue.formData.address2,
						address3: vue.formData.address3,
						city: vue.formData.city,
						state: vue.formData.state,
						zip: vue.formData.zip,
						phone: vue.formData.phone,
						category1: vue.formData.categories.length >= 1 ? vue.formData.categories[0] : null,
						category2: vue.formData.categories.length >= 2 ? vue.formData.categories[1] : null,
						category3: vue.formData.categories.length >= 3 ? vue.formData.categories[2] : null,

					},
					user: {
						firstName: vue.formData.firstName,
						lastName: vue.formData.lastName,
						email: vue.formData.email
					}
				}).then(function (response) {
					vue.processing = false;
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'register-response'});
					}
				}).catch(function (err) {
					vue.processing = false;
					console.log(err);
				});
			},
		},
		components: {
			'forms-address-state': require('./../forms/AddressState.vue'),
			'forms-nonprofit-category': require('./../forms/NonprofitCategory.vue'),
			'forms-submit': require('./../forms/Submit.vue'),
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('./../layout/Hero.vue'),
			'layout-sponsors': require('./../layout/Sponsors.vue'),
		}
	};
</script>
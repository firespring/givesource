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

        <layout-hero :presentedBy="true">
            <h1 slot="title">Register for {{ eventTitle }}</h1>
        </layout-hero>

        <main class="main">
            <api-error v-model="apiError"></api-error>
            <div v-if="canRegister" class="wrapper wrapper--sm">

                <div v-html="text" style="margin: 0 0 1.5rem;"></div>

                <form v-on:submit.prevent="submit">
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
                                        <input v-model="formData.lastName" type="text" name="lastName" id="lastName" maxlength="200" placeholder="Last Name"
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

            <div v-if="!canRegister && isBeforeRegistrations" class="wrapper wrapper--sm">
                Registration for {{ eventTitle }} will open on {{ registrationStartDate }}.
                Thank you for your interest in making {{ eventTitle }} a big success!
            </div>

            <div v-if="!canRegister && isAfterRegistrations" class="wrapper wrapper--sm">
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
	import ComponentAddressState from './../forms/AddressState.vue';
	import ComponentFooter from './../layout/Footer.vue';
	import ComponentHeader from './../layout/Header.vue';
	import ComponentHero from './../layout/Hero.vue';
	import ComponentNonprofitCategory from './../forms/NonprofitCategory.vue';
	import ComponentSponsors from './../layout/Sponsors.vue';
	import ComponentSubmit from './../forms/Submit.vue';

	export default {
		data() {
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
				apiError: {},
			}
		},
		computed: {
			text() {
				const text = _.find(this.contents, {key: 'REGISTER_FORM_TEXT'});
				return text ? text.value : null;
			},
			eventTitle() {
				return Settings.eventTitle();
			},
			registrationStartDate() {
				return Settings.registrationStartDate().format('MMMM DDDo YYYY');
			},
			canRegister() {
				return Settings.isDuringRegistrations();
			},
			isAfterRegistrations() {
				return Settings.isAfterRegistrations();
			},
			isBeforeRegistrations() {
				return Settings.isBeforeRegistrations();
			}
		},
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'REGISTER_FORM_TEXT'
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
				keys: 'REGISTER_FORM_TEXT'
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
			vm.setPageTitle(vm.eventTitle + ' - Register');
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
			submit() {
				const vm = this;

				vm.processing = true;
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.processing = false;
				} else {
					vm.registerNonprofit();
				}
			},
			registerNonprofit() {
				const vm = this;

				axios.post(API_URL + 'nonprofits/register', {
					nonprofit: {
						legalName: vm.formData.legalName,
						taxId: vm.formData.taxId,
						address1: vm.formData.address1,
						address2: vm.formData.address2,
						address3: vm.formData.address3,
						city: vm.formData.city,
						state: vm.formData.state,
						zip: vm.formData.zip,
						phone: vm.formData.phone,
						category1: vm.formData.categories.length >= 1 ? vm.formData.categories[0] : null,
						category2: vm.formData.categories.length >= 2 ? vm.formData.categories[1] : null,
						category3: vm.formData.categories.length >= 3 ? vm.formData.categories[2] : null,

					},
					user: {
						firstName: vm.formData.firstName,
						lastName: vm.formData.lastName,
						email: vm.formData.email
					}
				}).then(response => {
					vm.processing = false;
					if (response.data.errorMessage) {
						vm.apiError = vm.formatErrorMessageResponse(response);
						vm.scrollToError('.alert');
					} else {
						vm.$router.push({name: 'register-response'});
					}
				}).catch(err => {
					vm.processing = false;
					vm.apiError = err.response.data.errors;
					vm.scrollToError('.alert');
				});
			},
		},
		components: {
			'forms-address-state': ComponentAddressState,
			'forms-nonprofit-category': ComponentNonprofitCategory,
			'forms-submit': ComponentSubmit,
			'layout-footer': ComponentFooter,
			'layout-header': ComponentHeader,
			'layout-hero': ComponentHero,
			'layout-sponsors': ComponentSponsors,
		}
	};
</script>
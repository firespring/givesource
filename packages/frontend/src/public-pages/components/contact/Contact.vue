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
            <h1 slot="title">Contact Us</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">
            <api-error v-model="apiError"></api-error>

                <div v-html="text" style="margin: 0 0 1.5rem;"></div>

                <form v-on:submit="submit">
                    <fieldset>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="nameFirst">Your Name</label>
                            </div>
                            <div class="form-item__control">
                                <div class="grid">
                                    <div class="grid-item">
                                        <input v-model="formData.firstName" type="text" name="nameFirst" id="nameFirst" placeholder="First Name"
                                               :class="{'has-error': formErrors.firstName}">
                                    </div>
                                    <div class="grid-item">
                                        <input v-model="formData.lastName" type="text" name="nameLast" id="nameLast" placeholder="Last Name"
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
                                <label for="email">Your Email</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.email" type="email" name="email" id="email" :class="{'has-error': formErrors.email}">
                                <div v-if="formErrors.email" class="notes notes--below notes--error">
                                    {{ formErrors.email }}
                                </div>
                            </div>
                        </div>

                        <div class="form-item">
                            <div class="form-item__label">
                                <label for="phone">Phone Number</label>
                            </div>
                            <div class="form-item__control">
                                <input v-model="formData.phone" type="tel" name="phone" id="phone" :class="{'has-error': formErrors.phone}">
                                <div v-if="formErrors.phone" class="notes notes--below notes--error">
                                    {{ formErrors.phone }}
                                </div>
                            </div>
                        </div>

                        <div class="form-item form-item--required">
                            <div class="form-item__label">
                                <label for="questions">Your Questions</label>
                            </div>
                            <div class="form-item__control">
                                <textarea v-model="formData.message" name="questions" id="questions" :class="{'has-error': formErrors.message}"></textarea>
                                <div v-if="formErrors.message" class="notes notes--below notes--error">
                                    {{ formErrors.message }}
                                </div>
                            </div>
                        </div>

                    </fieldset>

                    <div class="form-actions flex justify-center items-center">
                        <forms-submit :processing="processing" color="accent">Send Your Questions</forms-submit>
                    </div>
                </form>

                <div class="notes text-c" style="margin-top: 1rem;" v-if="contactPhone">
                    (You can also call our support line at {{ contactPhone }}.)
                </div>

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

	module.exports = {
		data: function () {
			return {
				contents: [],
				processing: false,

				formData: {
					email: '',
					firstName: '',
					lastName: '',
					phone: '',
					message: '',
				},

				formErrors: {},
                apiError: {},
            }
		},
		computed: {
			contactPhone: function () {
				return this.$store.getters.setting('CONTACT_PHONE') || null;
			},
			text: function () {
				const text = _.find(this.contents, {key: 'CONTACT_FORM_TEXT'});
				return text ? text.value : null;
			},
			eventTitle: function () {
				return Settings.eventTitle();
			}
		},
		beforeRouteEnter: function (to, from, next) {
			next(function (vue) {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'CONTACT_FORM_TEXT'
				})).then(function (response) {
					vue.contents = response.data;
				}).catch(function (err) {
                    vue.apiError = err.response.data.errors;
                    next();
                });
			});
		},
		beforeRouteUpdate: function (to, from, next) {
			const vue = this;

			axios.get(API_URL + 'contents' + Utils.generateQueryString({
				keys: 'CONTACT_FORM_TEXT'
			})).then(function (response) {
				vue.contents = response.data;
				next();
			}).catch(function (err) {
                vue.apiError = err.response.data.errors;
				next();
			});
		},
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle(vue.eventTitle + ' - Contact Us');
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
					email: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your email',
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
						presence: false
					},
					message: {
						label: '',
						presence: {
							allowEmpty: false,
							message: 'Enter your questions'
						},
					}
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
					vue.sendMessage();
				}
			},
			sendMessage: function () {
				const vue = this;

				axios.post(API_URL + 'messages', {
					name: vue.formData.firstName + ' ' + vue.formData.lastName,
					email: vue.formData.email,
					phone: vue.formData.phone,
					message: vue.formData.message,
					type: 'CONTACT',
				}).then(function (response) {
					vue.processing = false;
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vue.$router.push({name: 'contact-response'});
					}
				}).catch(function (err) {
                    vue.apiError = err.response.data.errors;
					vue.processing = false;
				});
			}
		},
		components: {
			'forms-submit': require('./../forms/Submit.vue'),
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
			'layout-sponsors': require('../layout/Sponsors.vue'),
		}
	};
</script>
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
            <h1 slot="title">Contact Us</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">
                <api-error v-model="apiError"></api-error>

                <div v-html="text" style="margin: 0 0 1.5rem;"></div>

                <form v-on:submit.prevent="submit">
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
	import ComponentFooter from './../layout/Footer.vue';
	import ComponentHeader from './../layout/Header.vue';
	import ComponentHero from './../layout/Hero.vue';
	import ComponentSponsors from './../layout/Sponsors.vue';
	import ComponentSubmit from './../forms/Submit.vue';

	export default {
		data() {
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
			contactPhone() {
				return this.$store.getters.setting('CONTACT_PHONE') || null;
			},
			text() {
				const text = _.find(this.contents, {key: 'CONTACT_FORM_TEXT'});
				return text ? text.value : null;
			},
			eventTitle() {
				return Settings.eventTitle();
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				axios.get(API_URL + 'contents' + Utils.generateQueryString({
					keys: 'CONTACT_FORM_TEXT'
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
				keys: 'CONTACT_FORM_TEXT'
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
			vm.setPageTitle(vm.eventTitle + ' - Contact Us');
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
			submit() {
				const vm = this;

				vm.processing = true;
				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());

				if (Object.keys(vm.formErrors).length) {
					vm.scrollToError();
					vm.processing = false;
				} else {
					vm.sendMessage();
				}
			},
			sendMessage() {
				const vm = this;

				axios.post(API_URL + 'messages', {
					name: vm.formData.firstName + ' ' + vm.formData.lastName,
					email: vm.formData.email,
					phone: vm.formData.phone,
					message: vm.formData.message,
					type: 'CONTACT',
				}).then(response => {
					vm.processing = false;
					if (response.data.errorMessage) {
						console.log(response.data);
					} else {
						vm.$router.push({name: 'contact-response'});
					}
				}).catch(err => {
					vm.apiError = err.response.data.errors;
					vm.processing = false;
				});
			}
		},
		components: {
			'forms-submit': ComponentSubmit,
			'layout-footer': ComponentFooter,
			'layout-header': ComponentHeader,
			'layout-hero': ComponentHero,
			'layout-sponsors': ComponentSponsors,
		}
	};
</script>
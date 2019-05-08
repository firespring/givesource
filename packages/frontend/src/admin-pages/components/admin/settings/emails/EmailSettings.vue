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
            <div class="o-app_main-content o-app_main-content--md">

                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">Emails</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <!-- BEGIN form -->
                    <form v-on:submit.prevent="submit">

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Donation Notifications</h2>
                                    <div class="c-notes c-notes--below">
                                        The donation notification email is sent to nonprofits.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="donationNotificationTextBefore" class="c-form-item-label-text">Text Before Donation Details</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_DONATION_NOTIFICATION_BEFORE" :loaded="loaded" id="donationNotificationTextBefore">
                                        </forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear above the donation details.
                                        </div>
                                        <div v-if="formErrors.EMAILS_DONATION_NOTIFICATION_BEFORE" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_DONATION_NOTIFICATION_BEFORE }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="donationNotificationTextAfter" class="c-form-item-label-text">Text After Donation Details</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_DONATION_NOTIFICATION_AFTER" :loaded="loaded" id="donationNotificationTextAfter"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear below donation details.
                                        </div>
                                        <div v-if="formErrors.EMAILS_DONATION_NOTIFICATION_AFTER" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_DONATION_NOTIFICATION_AFTER }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Donation Receipt</h2>
                                    <div class="c-notes c-notes--below">
                                        The donation receipt email is sent to donors.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="donationReceiptTextBefore" class="c-form-item-label-text">Text Before Donations List</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_DONATION_RECEIPT_BEFORE_LIST" :loaded="loaded" id="donationReceiptTextBefore"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear above the list of donations that the receipt is for.
                                        </div>
                                        <div v-if="formErrors.EMAILS_DONATION_RECEIPT_BEFORE_LIST" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_DONATION_RECEIPT_BEFORE_LIST }}
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="donationReceiptTextAfter" class="c-form-item-label-text">Text After Donations List</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_DONATION_RECEIPT_AFTER_LIST" :loaded="loaded" id="donationReceiptTextAfter"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear below the list of donations that the receipt is for.
                                        </div>
                                        <div v-if="formErrors.EMAILS_DONATION_RECEIPT_AFTER_LIST" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_DONATION_RECEIPT_AFTER_LIST }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">User Registration - Pending</h2>
                                    <div class="c-notes c-notes--below">
                                        The user registration pending email is sent to nonprofits when they register for an account.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="userRegistrationPending" class="c-form-item-label-text">Message</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_USER_REGISTRATION_PENDING" :loaded="loaded" id="userRegistrationPending"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will replace the default message.
                                        </div>
                                        <div v-if="formErrors.EMAILS_USER_REGISTRATION_PENDING" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_USER_REGISTRATION_PENDING }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">User Registration - Activated</h2>
                                    <div class="c-notes c-notes--below">
                                        The user registration activated email is sent to nonprofits when they have been approved.
                                    </div>
                                </div>
                            </header>

                            <div class="c-page-section__main">
                                <div class="c-form-item c-form-item--textarea">
                                    <div class="c-form-item__label">
                                        <label for="userRegistrationActivated" class="c-form-item-label-text">Additional Message</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-ckeditor v-model="formData.EMAILS_USER_REGISTRATION_ACTIVATED" :loaded="loaded" id="userRegistrationActivated"></forms-ckeditor>
                                        <div class="c-notes c-notes--below">
                                            This text will appear after the button to verify the user's account.
                                        </div>
                                        <div v-if="formErrors.EMAILS_USER_REGISTRATION_ACTIVATED" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                                            {{ formErrors.EMAILS_USER_REGISTRATION_ACTIVATED }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{ name: 'settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>
                    </form>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
	import ComponentCKEditor from './../../../forms/Ckeditor.vue';
	import Request from './../../../../helpers/request';

	export default {
		data() {
			return {
				settings: [],
				loaded: false,

				// Form Data
				formData: {
					EMAILS_DONATION_NOTIFICATION_BEFORE: '',
					EMAILS_DONATION_NOTIFICATION_AFTER: '',
					EMAILS_DONATION_RECEIPT_AFTER_LIST: '',
					EMAILS_DONATION_RECEIPT_BEFORE_LIST: '',
					EMAILS_USER_REGISTRATION_ACTIVATED: '',
					EMAILS_USER_REGISTRATION_PENDING: '',
				},

				// Errors
				formErrors: {}
			};
		},
		beforeRouteEnter(to, from, next) {
			const fetchData = () => {
				const request = new Request();
				let settings = null;
				let promise = Promise.resolve();

				promise = promise.then(() => {
					return request.get('settings', {
						keys: [
							'EMAILS_DONATION_NOTIFICATION_BEFORE',
							'EMAILS_DONATION_NOTIFICATION_AFTER',
							'EMAILS_DONATION_RECEIPT_AFTER_LIST',
							'EMAILS_DONATION_RECEIPT_BEFORE_LIST',
							'EMAILS_USER_REGISTRATION_ACTIVATED',
							'EMAILS_USER_REGISTRATION_PENDING',
						]
					}).then(response => {
						settings = response.data;
					});
				});

				promise = promise.then(() => {
					return {
						settings: settings
					};
				});

				return promise;
			};

			fetchData().then(data => {
				next(vm => {
					vm.settings = data.settings;
					vm.loaded = true;
				});
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
			},
			settings: {
				handler() {
					const vm = this;
					if (vm.settings.length) {
						Object.keys(vm.formData).forEach(key => {
							const setting = _.find(vm.settings, {key: key});
							if (setting) {
								vm.formData[key] = setting.value;
							}
						});
					}
				},
				deep: true
			}
		},
		methods: {
			getConstraints() {
				return {
					EMAILS_DONATION_NOTIFICATION_BEFORE: {
						label: 'Text before donation details',
						presence: false
					},
					EMAILS_DONATION_NOTIFICATION_AFTER: {
						label: 'Text after donation details',
						presence: false
					},
					EMAILS_DONATION_RECEIPT_AFTER_LIST: {
						label: 'Text after donations list',
						presence: false
					},
					EMAILS_DONATION_RECEIPT_BEFORE_LIST: {
						label: 'Text before donations list',
						presence: false
					},
					EMAILS_USER_REGISTRATION_ACTIVATED: {
						label: 'Registration activated additional text',
						presence: false
					},
					EMAILS_USER_REGISTRATION_PENDING: {
						label: 'Registration pending additional text',
						presence: false
					},
				};
			},
			submit() {
				const vm = this;

				vm.addModal('spinner');

				vm.formErrors = vm.validate(vm.formData, vm.getConstraints());
				if (Object.keys(vm.formErrors).length) {
					vm.clearModals();
					vm.scrollToError();
				} else {
					vm.updateSettings();
				}
			},
			updateSettings() {
				const vm = this;

				vm.getSettingsToUpdate().then(settings => {
					let promise = Promise.resolve();
					const toUpdate = _.reject(settings, {value: ''});
					const toDelete = _.filter(settings, {value: ''});

					if (toUpdate.length) {
						promise = promise.then(() => {
							return vm.$request.patch('settings', {
								settings: toUpdate
							});
						});
					}

					if (toDelete.length) {
						promise = promise.then(() => {
							return vm.$request.delete('settings', {
								settings: toDelete
							});
						})
					}

					return promise;

				}).then(() => {
					vm.clearModals();
					vm.$router.push({name: 'settings-list'});
				}).catch(err => {
					vm.clearModals();
					console.log(err);
				});

			},
			getSettingsToUpdate() {
				const vm = this;
				return new Promise((resolve, reject) => {
					const settings = [];
					Object.keys(vm.formData).forEach(key => {
						settings.push({
							key: key,
							value: vm.formData[key]
						});
					});
					resolve(settings);
				});
			}
		},
		components: {
			'forms-ckeditor': ComponentCKEditor,
		}
	};
</script>